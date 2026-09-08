import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { FoodItem } from '../types';
import { CATEGORY_GROUPS } from '../data/categories';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  foods: FoodItem[];
  onAddToCart: (food: FoodItem) => void;
  onNavigateToMenu?: () => void;
}

// Normalize Azerbaijani string for accurate prefix comparison
export const normalizeAzText = (text: string): string => {
  return text
    .trim()
    .toLocaleLowerCase('az-AZ')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ə/g, 'ə')
    .replace(/Ğ/g, 'ğ')
    .replace(/Ç/g, 'ç')
    .replace(/Ş/g, 'ş')
    .replace(/Ö/g, 'ö')
    .replace(/Ü/g, 'ü');
};

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  foods,
  onAddToCart,
  onNavigateToMenu,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter foods strictly by starting letter(s)
  const results = useMemo(() => {
    const q = normalizeAzText(query);
    if (!q) return [];

    return foods.filter((food) => {
      const normName = normalizeAzText(food.name);
      // Food name starts with the typed query, or a word in the name starts with the query
      if (normName.startsWith(q)) return true;
      const words = normName.split(/\s+/);
      return words.some((word) => word.startsWith(q));
    });
  }, [foods, query]);

  const getCategoryLabel = (food: FoodItem) => {
    const group = CATEGORY_GROUPS.find((item) => item.id === food.category);
    const subCategory = group?.subCategories.find((item) => item.id === food.subCategory);
    return subCategory ? `${group?.name} / ${subCategory.name}` : group?.name || 'Menyu';
  };

  if (!isOpen) return null;

  return (
    <div
      id="search-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 sm:pt-16 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-[#eee9e7] animate-in zoom-in-95 duration-200">
        {/* Search Header Bar */}
        <div className="p-3.5 sm:p-5 border-b border-neutral-100 flex items-center gap-3 bg-[#fdfdfd]">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-700">
            <Search className="w-5 h-5" />
          </div>

          <div className="relative flex-1">
            <input
              ref={inputRef}
              id="global-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Yemək adının ilk hərflərini yazın..."
              className="w-full bg-transparent text-base sm:text-lg font-medium text-[#111] placeholder:text-neutral-400 outline-none pr-8"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Təmizlə"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            id="btn-close-search-modal"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Bağla"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3">
          {/* If query is empty: Quick suggestions */}
          {!query.trim() && (
            <div className="py-6 px-2 text-center">
              <p className="text-xs sm:text-sm font-semibold text-neutral-500 mb-3">
                Yeməyin ilk hərflərini daxil edərək axtara bilərsiniz
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
                {['Pizza', 'Kabab', 'Şaurma', 'Dönər', 'Piti', 'Suplar', 'Qutab', 'Çay'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                      inputRef.current?.focus();
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-black transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results list */}
          {query.trim() && results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Tapılan yeməklər
                </span>
                {onNavigateToMenu && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToMenu();
                    }}
                    className="text-xs font-semibold text-[#111] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Bütün Menyuda Bax</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {results.map((food) => (
                  <div
                    key={`search-res-${food.id}`}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl border border-neutral-100 bg-[#fdfdfd] hover:bg-white hover:border-neutral-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 bg-neutral-100"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-[#111] truncate">
                          {food.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500 line-clamp-1">
                          {food.description}
                        </p>
                        <p className="text-[10px] font-semibold text-neutral-400 line-clamp-1">
                          {getCategoryLabel(food)}
                        </p>
                        <span className="text-xs font-bold text-[#111] mt-0.5 inline-block">
                          {food.price.toFixed(2)} ₼
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onAddToCart(food)}
                      className="p-2.5 rounded-full bg-[#111] hover:bg-black text-white transition-transform active:scale-90 cursor-pointer shrink-0 shadow-xs"
                      title="Səbətə əlavə et"
                      aria-label="Səbətə at"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {query.trim() && results.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#111] mb-1">
                "{query}" ilə başlayan yemək tapılmadı
              </h4>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Zəhmət olmasa adı düzgün daxil etdiyinizdən əmin olun və ya başqa hərflə yoxlayın.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
