import React, { useState, useMemo } from 'react';
import { FoodItem } from '../types';
import { FoodCard } from './FoodCard';
import { CATEGORIES, CATEGORY_GROUPS } from '../data/foods';
import { normalizeAzText } from './SearchModal';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown, 
  X, 
  Check,
  ArrowLeft
} from 'lucide-react';

interface MenuPageProps {
  foods: FoodItem[];
  onAddToCart: (food: FoodItem) => void;
  favorites?: string[];
  onToggleFavorite?: (food: FoodItem) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  foods,
  onAddToCart,
  favorites = [],
  onToggleFavorite,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [visibleLimit, setVisibleLimit] = useState<number>(12);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [modalExpandedGroupId, setModalExpandedGroupId] = useState<string | null>(null);

  // Filter and sort items
  const filteredFoods = useMemo(() => {
    let list = [...foods];

    // A typed query searches the complete menu, regardless of the active category.
    if (!searchQuery.trim()) {
      if (selectedSubCategory) {
        list = list.filter((f) => f.subCategory === selectedSubCategory);
      } else if (selectedCategory !== 'all') {
        list = list.filter((f) => f.category === selectedCategory);
      }
    }

    // Search query filter: only match starting letters (case-insensitive, Azerbaijani characters)
    if (searchQuery.trim()) {
      const q = normalizeAzText(searchQuery);
      list = list.filter((f) => {
        const normName = normalizeAzText(f.name);
        if (normName.startsWith(q)) return true;
        const words = normName.split(/\s+/);
        return words.some((word) => word.startsWith(q));
      });
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Popularity default
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return list;
  }, [foods, selectedCategory, selectedSubCategory, searchQuery, sortBy]);

  const displayedFoods = filteredFoods.slice(0, visibleLimit);

  const handleShowMore = () => {
    setVisibleLimit(filteredFoods.length);
  };

  // Active category group object
  const currentCategoryGroup = useMemo(() => {
    return CATEGORY_GROUPS.find((g) => g.id === selectedCategory);
  }, [selectedCategory]);

  const getFoodCategoryLabel = (food: FoodItem) => {
    const group = CATEGORY_GROUPS.find((item) => item.id === food.category);
    const subCategory = group?.subCategories.find((item) => item.id === food.subCategory);
    return subCategory ? `${group?.name} / ${subCategory.name}` : group?.name || 'Menyu';
  };

  return (
    <div className="px-4 sm:px-12 lg:px-16 pt-4 sm:pt-6 pb-16 space-y-6 sm:space-y-8">
      {/* Menu Controls: search appears after a category is selected. */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-3">
          {/* Search Input */}
          {selectedCategory !== 'all' && (
            <div className="relative min-w-[180px] sm:min-w-[220px] sm:flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="menu-search-input"
                type="text"
                placeholder="Bütün menyuda yemək axtarın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#e8e3e1] bg-white text-xs sm:text-sm outline-none focus:border-[#111] transition-all shadow-xs"
              />
            </div>
          )}

          {/* Sort Select & Filter Button */}
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-2.5">
            <div className="relative">
              <select
                id="menu-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none pl-4 pr-8 h-10 rounded-full border border-[#e8e3e1] bg-white text-xs sm:text-sm font-semibold text-[#111] outline-none focus:border-[#111] cursor-pointer shadow-xs transition-colors"
              >
                <option value="popular">Ən çox satılanlar</option>
                <option value="price-asc">Qiymət: Artan</option>
                <option value="price-desc">Qiymət: Azalan</option>
                <option value="rating">Reytinqə görə</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filter Button */}
            <button
              id="btn-mobile-filter"
              type="button"
              onClick={() => {
                setModalExpandedGroupId(selectedCategory === 'all' ? null : selectedCategory);
                setIsFilterModalOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 px-4 h-10 rounded-full bg-white border border-[#e8e3e1] text-[#111] font-semibold text-xs sm:text-sm shadow-xs hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Filter className="w-3.5 h-3.5 text-[#111]" />
              <span>Seçin</span>
            </button>
          </div>
        </div>

      {/* Main Category Cards (Mobile & Tablet) */}
      {selectedCategory === 'all' && (
      <div className="block lg:hidden">
        <div className="mx-auto w-full max-w-2xl px-1 sm:px-0">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {CATEGORIES.filter((cat) => cat.id !== 'all').map((cat, index) => {
            const isActive = selectedCategory === cat.id;
            const categoryGroup = CATEGORY_GROUPS.find((group) => group.id === cat.id);
            const categoryImage = categoryGroup?.subCategories[0]?.image;

            return (
              <button
                key={`mob-top-${cat.id}`}
                id={`cat-btn-top-${cat.id}`}
                type="button"
                aria-label={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedSubCategory(categoryGroup?.subCategories[0]?.id || null);
                  setVisibleLimit(12);
                  setExpandedGroupId(cat.id);
                }}
                style={categoryImage ? { backgroundImage: `url(${categoryImage})` } : undefined}
                className={`group relative min-h-[150px] w-full overflow-hidden rounded-2xl border border-white/20 bg-neutral-800 bg-cover bg-center text-left text-white shadow-md shadow-black/10 transition-all cursor-pointer active:scale-[0.98] sm:min-h-[158px] ${
                  isActive ? 'ring-2 ring-neutral-900 ring-offset-2' : 'hover:-translate-y-0.5 hover:shadow-lg'
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 transition-colors group-hover:from-black/90" />
                <span className="absolute inset-x-3 bottom-3 z-10 text-left text-[13px] font-bold leading-tight drop-shadow-md sm:text-sm">
                  {cat.name}
                </span>
                <span className="absolute bottom-3 left-3 z-10 -translate-y-7 text-[11px] font-semibold tracking-widest text-white/80">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            );
          })}
          </div>
        </div>
      </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Left Sidebar: Categories */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-3">
          <div className="flex items-center justify-between px-1 pb-1">
            <h3 className="font-semibold text-xs text-neutral-500 tracking-wider uppercase">
              Kateqoriyalar
            </h3>
            {(selectedCategory !== 'all' || selectedSubCategory) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubCategory(null);
                  setVisibleLimit(12);
                }}
                className="text-xs text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Sıfırla
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1">
            {/* All Menu Option */}
            <button
              id="cat-btn-desk-all"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubCategory(null);
                setVisibleLimit(12);
              }}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                selectedCategory === 'all' && !selectedSubCategory
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-[#4f7d5a] hover:bg-[#f1f7f2] bg-white border border-neutral-100'
              }`}
            >
              <span>Bütün Menyu</span>
              <ChevronRight className={`w-3.5 h-3.5 ${selectedCategory === 'all' && !selectedSubCategory ? 'text-white' : 'text-neutral-400'}`} />
            </button>

            {/* 4 Main Category Groups with Subcategories */}
            {CATEGORY_GROUPS.map((group) => {
              const isGroupActive = selectedCategory === group.id;
              const isExpanded = expandedGroupId === group.id || isGroupActive;

              return (
                <div key={`desk-grp-${group.id}`} className="rounded-xl border border-neutral-100 overflow-hidden bg-white">
                  <div
                    onClick={() => {
                      setExpandedGroupId(expandedGroupId === group.id ? null : group.id);
                      setSelectedCategory(group.id);
                      setSelectedSubCategory(group.subCategories[0]?.id || null);
                      setVisibleLimit(12);
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm transition-all cursor-pointer ${
                      isGroupActive && !selectedSubCategory
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'text-[#4f7d5a] hover:bg-[#f1f7f2]'
                    }`}
                  >
                    <span>{group.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>

                  {isExpanded && (
                    <div className="bg-neutral-50/60 px-2 py-1.5 space-y-0.5 border-t border-neutral-100">
                      {group.subCategories.map((sub) => {
                        const isSubActive = selectedSubCategory === sub.id;
                        return (
                          <button
                            key={`desk-sub-${sub.id}`}
                            onClick={() => {
                              setSelectedCategory(group.id);
                              if (selectedSubCategory === sub.id) {
                                setSelectedSubCategory(null);
                              } else {
                                setSelectedSubCategory(sub.id);
                              }
                              setVisibleLimit(12);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                              isSubActive
                                ? 'bg-neutral-900 text-white font-medium'
                                : 'text-neutral-600 hover:bg-white hover:text-neutral-900'
                            }`}
                          >
                            <span className="truncate">{sub.name}</span>
                            <ChevronRight className={`w-3 h-3 shrink-0 ${isSubActive ? 'text-white' : 'text-neutral-300'}`} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Food Items & Subcategory Showcase Main Column */}
        <main className="lg:col-span-9 p-0 space-y-6">
          {/* Subcategory Pill Bar / Cards when a category is selected */}
          {currentCategoryGroup && (
            <div className="-mx-2 bg-white border border-neutral-100 rounded-2xl p-4 sm:mx-0 sm:p-5 space-y-2.5">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  aria-label="Kateqoriyalara qayıt"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSubCategory(null);
                    setSearchQuery('');
                    setVisibleLimit(12);
                  }}
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-neutral-900 sm:text-xl">
                    {currentCategoryGroup.name}
                  </h2>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {currentCategoryGroup.description}
                  </p>
                </div>
              </div>

              {/* Subcategories Horizontal Scrollable Pill / List */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar pt-1 pb-1 scroll-smooth">
                {currentCategoryGroup.subCategories.map((sub) => {
                  const isSubActive = selectedSubCategory === sub.id;
                  return (
                    <button
                      key={`sub-pill-${sub.id}`}
                      id={`sub-pill-${sub.id}`}
                      onClick={() => {
                        // Toggle subcategory if already selected or select it
                        if (selectedSubCategory === sub.id) {
                          setSelectedSubCategory(null);
                        } else {
                          setSelectedSubCategory(sub.id);
                        }
                        setVisibleLimit(12);
                      }}
                      className={`px-5 py-2 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                        isSubActive
                          ? 'bg-neutral-900 text-white font-bold border-neutral-900 shadow-sm ring-2 ring-black/10'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 border-transparent font-medium'
                      }`}
                    >
                      <span>{sub.name}</span>
                    </button>
                  );
                })}
                </div>
              </div>
          )}

          {/* Food cards appear only after a category is selected. */}
          {selectedCategory === 'all' ? null : displayedFoods.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-14 sm:gap-x-6 sm:gap-y-18 lg:gap-x-7 lg:gap-y-20 pt-2 pb-6">
              {searchQuery.trim() && (
                <p className="col-span-2 text-xs font-semibold text-neutral-500 md:col-span-3">
                  Bütün menyu üzrə {filteredFoods.length} nəticə tapıldı
                </p>
              )}
              {displayedFoods.map((food, index) => (
                <div key={food.id} className="min-w-0">
                  {searchQuery.trim() && (
                    <p className="mb-1 truncate px-1 text-[9px] font-semibold text-neutral-400" title={getFoodCategoryLabel(food)}>
                      {getFoodCategoryLabel(food)}
                    </p>
                  )}
                  <FoodCard
                    food={food}
                    onAddToCart={onAddToCart}
                    isFavorite={favorites.includes(food.id)}
                    onToggleFavorite={onToggleFavorite}
                    index={index}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#e8e3e1] shadow-xs p-6 space-y-3">
              <p className="text-neutral-500 font-medium text-sm">Bu kateqoriyada və ya axtarışa uyğun yemək tapılmadı</p>
              <button
                id="btn-reset-filter"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubCategory(null);
                  setSearchQuery('');
                  setVisibleLimit(12);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111] text-white font-bold text-xs hover:bg-black transition-all cursor-pointer shadow-xs"
              >
                <span>Bütün Menyunu Göstər</span>
              </button>
            </div>
          )}

          {/* Show More Button */}
          {selectedCategory !== 'all' && filteredFoods.length > visibleLimit && (
            <div className="flex justify-center pt-8 pb-4">
              <button
                id="btn-load-more"
                onClick={handleShowMore}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#111] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Daha Çoxunu Görün</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal - Optional when clicking Filtr button */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6">
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#111]" />
                <h3 className="font-bold text-base text-[#111]">Filtrləmə</h3>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:text-black flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-2">
                  Kateqoriyalar
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedSubCategory(null);
                      setModalExpandedGroupId(null);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#111] text-white border-[#111]'
                        : 'bg-neutral-50 border-neutral-200 text-[#4f7d5a] hover:bg-[#f1f7f2]'
                    }`}
                  >
                    <span>Bütün Menyu</span>
                    {selectedCategory === 'all' && <Check className="w-4 h-4 text-white" />}
                  </button>

                  {CATEGORY_GROUPS.map((grp) => {
                    const isOpen = modalExpandedGroupId === grp.id;
                    const isGroupActive = selectedCategory === grp.id;
                    return (
                      <div
                        key={`modal-grp-${grp.id}`}
                        className="overflow-hidden border-b border-neutral-200 last:border-b-0 transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            // Single open accordion: toggle clicked, close previous
                            setModalExpandedGroupId((prev) => (prev === grp.id ? null : grp.id));
                          }}
                          className={`w-full flex items-center justify-between p-3 text-xs font-semibold cursor-pointer transition-colors ${
                            isGroupActive && !selectedSubCategory
                              ? 'bg-neutral-100 text-neutral-900'
                              : 'bg-neutral-50/80 text-[#4f7d5a] hover:bg-[#f1f7f2]'
                          }`}
                        >
                            <span className="font-medium text-sm">{grp.name}</span>
                          <div className="flex items-center gap-2">
                            {isGroupActive && !selectedSubCategory && (
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black text-white">
                                Seçilib
                              </span>
                            )}
                            <ChevronDown
                              className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                                isOpen ? 'rotate-180 text-black' : ''
                              }`}
                            />
                          </div>
                        </button>

                        {/* Subcategories revealed when accordion is expanded */}
                        {isOpen && (
                          <div className="py-1.5 bg-white grid grid-cols-2 gap-x-4 gap-y-1 border-t border-neutral-100 animate-in fade-in slide-in-from-top-1 duration-150">
                            {grp.subCategories.map((sub) => {
                              const isSubSelected = selectedSubCategory === sub.id;
                              return (
                                <button
                                  key={`modal-sub-${sub.id}`}
                                  onClick={() => {
                                    setSelectedCategory(grp.id);
                                    setSelectedSubCategory(sub.id);
                                    setExpandedGroupId(grp.id);
                                  }}
                                  className={`p-2 text-xs font-medium text-left truncate transition-colors cursor-pointer ${
                                    isSubSelected
                                      ? 'bg-neutral-900 text-white rounded-md font-bold'
                                      : 'text-neutral-600 hover:bg-neutral-50'
                                  }`}
                                >
                                  {sub.name}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubCategory(null);
                  setModalExpandedGroupId(null);
                  setIsFilterModalOpen(false);
                }}
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-neutral-600 hover:text-black cursor-pointer"
              >
                Sıfırla
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFilterModalOpen(false);
                  setTimeout(() => {
                    if (selectedCategory) {
                      const catBtn = document.getElementById(`cat-btn-top-${selectedCategory}`);
                      catBtn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                    if (selectedSubCategory) {
                      const subBtn = document.getElementById(`sub-pill-${selectedSubCategory}`);
                      subBtn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                  }, 120);
                }}
                className="flex-1 py-2.5 rounded-full bg-[#111] text-white font-bold text-xs hover:bg-black transition-all cursor-pointer shadow-sm text-center"
              >
                Tətbiq Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
