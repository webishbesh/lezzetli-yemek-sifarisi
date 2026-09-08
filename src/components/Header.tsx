import React, { useState } from 'react';
import { PageId } from '../types';
import { ShoppingBag, User, Menu, X, Shield, Globe, Search, Heart } from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onSearchClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'AZ' | 'EN' | 'RU'>('AZ');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Ana Səhifə' },
    { id: 'menu', label: 'Menyu' },
    { id: 'favorites', label: 'Sevimlilər' },
    { id: 'about', label: 'Haqqımızda' },
    { id: 'contact', label: 'Əlaqə' }
  ];

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileSearchOpen(false);
    onNavigate('menu');
  };

  return (
    <header className="h-[74px] sm:h-[88px] px-4 sm:px-10 flex items-center justify-between border-b border-[#eee9e7] bg-white/90 sticky top-0 z-30 backdrop-blur-md transition-all">
      {/* Brand Logo: Matbaxh */}
      <button
        id="site-logo"
        onClick={() => handleNav('home')}
        className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#111] hover:opacity-90 transition-opacity flex items-center gap-0.5"
      >
        <span className="text-[#111] font-serif font-black">M</span>atbaxh
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 lg:gap-10 ml-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`nav-link-${item.id}`}
            onClick={() => handleNav(item.id)}
            className={`text-[15px] lg:text-base font-semibold transition-colors relative py-1 ${
              currentPage === item.id
                ? 'text-[#111] font-bold'
                : 'text-[#555] hover:text-[#111]'
            }`}
          >
            {item.label}
            {currentPage === item.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111] rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Header Icons: Globe (Language), Search (Araşdırma), Hamburger Menu */}
        <div className="flex sm:hidden items-center gap-1 relative">
          {/* 1. Language / Globe */}
          <div className="relative">
            <button
              id="mob-btn-lang"
              onClick={() => {
                setLanguageOpen(!languageOpen);
                setMobileSearchOpen(false);
              }}
              className="p-2 rounded-full text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
              aria-label="Dili dəyiş"
            >
              <Globe className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Language dropdown */}
            {languageOpen && (
              <div className="absolute right-0 top-11 bg-white border border-[#e8e3e1] rounded-2xl shadow-xl py-1.5 px-1 min-w-[90px] z-50 animate-in fade-in zoom-in-95">
                {(['AZ', 'EN', 'RU'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLang(lang);
                      setLanguageOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      selectedLang === lang
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {lang === 'AZ' ? '🇦🇿 AZ' : lang === 'EN' ? '🇬🇧 EN' : '🇷🇺 RU'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Search / Araşdırma */}
          <button
            id="mob-btn-search"
            onClick={onSearchClick}
            className="p-2 rounded-full text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200 transition-colors cursor-pointer"
            aria-label="Axtarış"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* 3. Mobile Hamburger Toggle */}
          <button
            id="btn-mobile-menu"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMobileSearchOpen(false);
              setLanguageOpen(false);
            }}
            className="p-2 rounded-full text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
            aria-label="Menyunu aç"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 stroke-[2]" />}
          </button>
        </div>

        {/* Desktop Search Trigger */}
        <button
          id="btn-desktop-search"
          onClick={onSearchClick}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#e8e3e1] text-xs font-semibold text-neutral-700 hover:text-[#111] hover:border-[#111] bg-white transition-all shadow-xs cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-neutral-700" />
          <span>Axtarış</span>
        </button>

        {/* Desktop Admin Quick trigger */}
        <button
          id="btn-admin-manage"
          onClick={onOpenAdmin}
          title="Şəkilləri idarə et (Admin)"
          className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-[#e8e3e1] text-[#444] hover:text-[#111] hover:border-[#111] bg-white transition-all shadow-xs"
        >
          <Shield className="w-3.5 h-3.5 text-[#111]" />
          <span>Admin</span>
        </button>

        {/* Desktop Cart Button */}
        <button
          id="btn-open-cart"
          onClick={onOpenCart}
          className="hidden sm:flex relative p-2.5 sm:p-3 rounded-full hover:bg-neutral-100 transition-colors text-xl text-[#111]"
          aria-label="Səbət"
        >
          <ShoppingBag className="w-6 h-6 text-[#111]" />
          {cartCount > 0 && (
            <span
              id="cart-badge-count"
              className="absolute -top-1 -right-1 bg-[#111] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-scale-up"
            >
              {cartCount}
            </span>
          )}
        </button>

        {/* Desktop Profile / Şəxsi Kabinet Button */}
        <button
          id="btn-header-profile"
          onClick={() => handleNav('profile')}
          className="hidden sm:flex px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all items-center gap-2 bg-[#111] hover:bg-black text-white shadow-md shadow-black/15 active:scale-95 cursor-pointer"
        >
          <User className="w-4 h-4" />
          <span>Profilim</span>
        </button>
      </div>

      {/* Mobile Search Overlay Bar */}
      {mobileSearchOpen && (
        <div className="absolute top-[74px] left-0 right-0 bg-white border-b border-[#eee9e7] px-4 py-3 shadow-md md:hidden z-40 animate-in slide-in-from-top-1">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Yemək və ya kateqoriya axtarın..."
                className="w-full bg-[#f6f4f2] text-sm pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#107c41]/30 border border-neutral-200"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-[#111] text-white px-3 py-2 rounded-xl text-xs font-bold"
            >
              Axtar
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-[74px] left-0 right-0 bg-white border-b border-[#eee9e7] shadow-xl p-6 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200 z-40">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleNav(item.id)}
              className={`text-left text-lg font-semibold py-2 px-3 rounded-xl transition-colors ${
                currentPage === item.id
                  ? 'bg-neutral-900 text-white font-bold'
                  : 'text-[#222] hover:bg-neutral-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

