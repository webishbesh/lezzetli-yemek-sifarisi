import React from 'react';
import { FoodItem } from '../types';
import { ShoppingCart, Star, Heart } from 'lucide-react';

interface FoodCardProps {
  food: FoodItem;
  onAddToCart: (food: FoodItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (food: FoodItem) => void;
  index?: number;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onAddToCart,
  isFavorite = false,
  onToggleFavorite,
  index = 0,
}) => {
  return (
    <article
      id={`food-card-${food.id}`}
      data-food-index={index}
      className="group bg-gradient-to-b from-white to-[#fbfbfb] border border-[#e5e0dc] rounded-2xl relative pt-14 sm:pt-18 pb-2.5 sm:pb-3 px-2.5 sm:px-3 flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 mt-10 sm:mt-15 min-h-[160px] sm:min-h-[200px]"
    >
      {/* Floating Dish Image - enlarged circle frame */}
      <div className="absolute -top-10 sm:-top-15 left-1/2 -translate-x-1/2 w-[105px] h-[105px] sm:w-[148px] sm:h-[148px] z-10 pointer-events-none transition-transform duration-300 group-hover:scale-105">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.16)] sm:shadow-[0_12px_24px_rgba(0,0,0,0.2)] border-[3px] sm:border-[4px] border-white bg-white"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
          }}
        />
      </div>

      {/* Floating Add to Cart Button with ShoppingCart (trolley) Icon */}
      <button
        id={`btn-add-food-${food.id}`}
        onClick={() => onAddToCart(food)}
        aria-label={`${food.name} səbətə əlavə et`}
        className="absolute -top-7 sm:-top-10 left-[calc(50%+30px)] sm:left-[calc(50%+44px)] z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111] hover:bg-black text-white flex items-center justify-center shadow-[0_3px_10px_rgba(0,0,0,0.22)] border-2 border-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
      >
        <ShoppingCart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
      </button>

      {/* Top Meta info: Rating */}
      <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-semibold text-neutral-500 mb-0.5 min-h-[16px]">
        {food.rating ? (
          <span className="flex items-center gap-0.5 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
            <span>{food.rating.toFixed(1)}</span>
          </span>
        ) : <span />}
      </div>

      {/* Food Details - Full Title */}
      <div className="mt-0.5 flex-1 flex flex-col justify-between">
        <div>
          <h4
            className={`font-bold text-[#111] leading-snug group-hover:text-black transition-colors ${
              food.name.length > 26 ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'
            }`}
          >
            {food.name}
          </h4>
        </div>

        {/* Bottom Bar: Price in left corner, Heart in right corner */}
        <div className="mt-2 pt-1.5 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-extrabold text-[#111] tracking-tight">
            {food.price.toFixed(2)} ₼
          </span>

          {/* Heart Favorite Icon in right corner */}
          <button
            type="button"
            id={`btn-fav-${food.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(food);
            }}
            aria-label={isFavorite ? 'Seçilmişlərdən çıxar' : 'Seçilmişlərə əlavə et'}
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-transform hover:scale-120 active:scale-90 cursor-pointer -mr-0.5 ${
              isFavorite ? 'text-black' : 'text-neutral-400'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-all sm:w-4 sm:h-4 ${
                isFavorite ? 'fill-black text-black stroke-black' : 'fill-transparent text-neutral-400 stroke-current'
              }`}
            />
          </button>
        </div>
      </div>
    </article>
  );
};
