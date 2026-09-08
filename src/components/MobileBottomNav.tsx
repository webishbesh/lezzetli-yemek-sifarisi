import React from 'react';
import { Home, Utensils, FileText, Heart, User } from 'lucide-react';
import { PageId } from '../types';

interface MobileBottomNavProps {
  currentPage: PageId;
  activeProfileTab?: string;
  onNavigate: (page: PageId, profileTab?: string) => void;
  ordersCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  ordersCount = 0,
}) => {
  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobil naviqasiya"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e8e3e1] py-2 px-1 flex items-center justify-around sm:hidden shadow-[0_-6px_20px_rgba(0,0,0,0.06)]"
    >
      {/* 1. Ana Səhifə */}
      <button
        id="mob-nav-home"
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
          currentPage === 'home'
            ? 'text-[#111] font-bold scale-105'
            : 'text-neutral-500 hover:text-neutral-900 font-medium'
        }`}
      >
        <div className="relative">
          <Home className={`w-5 h-5 ${currentPage === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        </div>
        <span className="text-[10px] mt-1 leading-none tracking-tight">Ana Səhifə</span>
      </button>

      {/* 2. Menyu */}
      <button
        id="mob-nav-menu"
        onClick={() => onNavigate('menu')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
          currentPage === 'menu'
            ? 'text-[#111] font-bold scale-105'
            : 'text-neutral-500 hover:text-neutral-900 font-medium'
        }`}
      >
        <div className="relative">
          <Utensils className={`w-5 h-5 ${currentPage === 'menu' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        </div>
        <span className="text-[10px] mt-1 leading-none tracking-tight">Menyu</span>
      </button>

      {/* 3. Sifarişlərim */}
      <button
        id="mob-nav-orders"
        onClick={() => onNavigate('orders')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
          currentPage === 'orders'
            ? 'text-[#111] font-bold scale-105'
            : 'text-neutral-500 hover:text-neutral-900 font-medium'
        }`}
      >
        <div className="relative">
          <FileText className={`w-5 h-5 ${currentPage === 'orders' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          {ordersCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-[#111] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {ordersCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-1 leading-none tracking-tight">Sifarişlərim</span>
      </button>

      {/* 4. Sevimlilər */}
      <button
        id="mob-nav-favorites"
        onClick={() => onNavigate('favorites')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
          currentPage === 'favorites'
            ? 'text-[#111] font-bold scale-105'
            : 'text-neutral-500 hover:text-neutral-900 font-medium'
        }`}
      >
        <div className="relative">
          <Heart className={`w-5 h-5 ${currentPage === 'favorites' ? 'stroke-[2.5] fill-[#111] text-[#111]' : 'stroke-[1.8]'}`} />
        </div>
        <span className="text-[10px] mt-1 leading-none tracking-tight">Sevimlilər</span>
      </button>

      {/* 5. Profil */}
      <button
        id="mob-nav-profile"
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
          currentPage === 'profile'
            ? 'text-[#111] font-bold scale-105'
            : 'text-neutral-500 hover:text-neutral-900 font-medium'
        }`}
      >
        <div className="relative">
          <User className={`w-5 h-5 ${currentPage === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        </div>
        <span className="text-[10px] mt-1 leading-none tracking-tight">Profil</span>
      </button>
    </nav>
  );
};
