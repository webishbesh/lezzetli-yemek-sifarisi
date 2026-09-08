import React from 'react';
import { PageId, FoodItem } from '../types';
import { FoodCard } from './FoodCard';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';

interface FavoritesPageProps {
  onNavigate: (page: PageId) => void;
  foods: FoodItem[];
  favorites: string[];
  onAddToCart: (food: FoodItem) => void;
  onToggleFavorite: (food: FoodItem) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onNavigate,
  foods = [],
  favorites = [],
  onAddToCart,
  onToggleFavorite,
}) => {
  const favoriteFoods = foods.filter((f) => favorites.includes(f.id));

  return (
    <div className="px-4 sm:px-12 lg:px-16 pt-5 sm:pt-7 pb-16 space-y-6 sm:space-y-8">
      {/* Header: Sevimlilər Bölməsi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8e3e1] pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#111] fill-[#111]" />
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#111]">
              Sevimlilər Bölməsi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Bəyəndiyiniz və ürək simvolu ilə seçdiyiniz təamlar
          </p>
        </div>

        <button
          id="btn-goto-menu-favs"
          onClick={() => onNavigate('menu')}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111] text-white font-bold text-xs hover:bg-black active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <span>Menyuya Keçid</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content: Favorite Food Cards Grid with generous vertical gap */}
      <div className="w-full pt-2">
        {favoriteFoods.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-12 sm:gap-x-6 sm:gap-y-16 lg:gap-x-7 lg:gap-y-16">
            {favoriteFoods.map((food, idx) => (
              <FoodCard
                key={`fav-${food.id}`}
                food={food}
                onAddToCart={onAddToCart}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#e8e3e1] shadow-sm max-w-lg mx-auto p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <Heart className="w-8 h-8 stroke-neutral-400 fill-transparent" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg text-[#111]">Seçilmiş yemək yoxdur</h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-xs mx-auto">
                Yemək kartlarının sağ küncündəki ürək simvoluna toxunaraq sevdiyiniz yeməkləri bura əlavə edə bilərsiniz.
              </p>
            </div>
            <button
              onClick={() => onNavigate('menu')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111] text-white font-bold text-xs sm:text-sm hover:bg-black transition-all cursor-pointer shadow-md mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Menyudan Seçin</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
