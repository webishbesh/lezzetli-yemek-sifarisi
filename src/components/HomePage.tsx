import React, { useRef } from 'react';
import { FoodItem, PageId } from '../types';
import { FoodCard } from './FoodCard';
import { ChevronLeft, ChevronRight, Zap, Flame, Award, Heart, Truck, Clock, ShieldCheck, Mail, Star, Instagram, Music2, Chrome } from 'lucide-react';

interface HomePageProps {
  foods: FoodItem[];
  onNavigate: (page: PageId) => void;
  onAddToCart: (food: FoodItem) => void;
  favorites?: string[];
  onToggleFavorite?: (food: FoodItem) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  foods,
  onNavigate,
  onAddToCart,
  favorites = [],
  onToggleFavorite,
  onShowToast
}) => {
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const popularScrollRef = useRef<HTMLDivElement>(null);

  const scrollRow = (ref: React.RefObject<HTMLDivElement | null>, direction: number) => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.75;
      ref.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    if (emailInput && emailInput.value) {
      onShowToast(`Təşəkkürlər! ${emailInput.value} ünvanı bülletenə abunə edildi.`, 'success');
      form.reset();
    }
  };

  const featuredDishes = foods.slice(0, 6);
  const popularList = foods.filter((f) => f.isPopular);
  const popularDishes = popularList.length >= 6 
    ? popularList.slice(0, 6) 
    : [...popularList, ...foods.filter((f) => !f.isPopular)].slice(0, 6);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative mx-3 mt-3 overflow-hidden rounded-3xl border border-[#e8e3e1] bg-white shadow-lg shadow-black/10 sm:mx-12 sm:mt-8 lg:mx-16">
        {/* Hero Left Content */}
        <div className="z-10 max-w-2xl space-y-6 px-5 py-7 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs sm:text-sm font-bold tracking-wide">
            <span>🍃</span>
            <span>Təzə dad, hər gün</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-[62px] font-bold text-[#111] leading-[1.05] tracking-tight">
            Bu sadəcə <br />
            <span className="text-[#111] underline decoration-neutral-300 decoration-4 underline-offset-8">yemək deyil</span>, <br />
            bu bir təcrübədir.
          </h1>

          <p className="text-[#686868] text-base sm:text-lg leading-relaxed max-w-lg">
            İtalyan və dünya mətbəxinin ən zərif təamları, peşəkar aşpazlarımızın xüsusi reseptləri ilə hər gün təzə şəkildə qapınıza çatdırılır.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              id="hero-btn-menu"
              onClick={() => onNavigate('menu')}
              className="px-8 py-4 rounded-full bg-[#111] hover:bg-black text-white font-bold text-base shadow-lg shadow-black/20 transition-all hover:scale-[1.02] active:scale-95 text-center cursor-pointer"
            >
              Menyunu Göstər
            </button>
            <button
              id="hero-btn-reserve"
              onClick={() => onNavigate('contact')}
              className="px-7 py-4 rounded-full bg-white hover:bg-neutral-50 text-[#111] font-bold text-base border border-[#e8e3e1] shadow-xs transition-all hover:border-neutral-400 active:scale-95 text-center cursor-pointer"
            >
              Masa Rezerv Et
            </button>
          </div>

          {/* Social Proof / Raters */}
          <div className="pt-4 flex items-center gap-4">
            <div className="flex -space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-stone-900 to-stone-700 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                RƏ
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                A
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-stone-700 to-stone-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                S
              </div>
              <div className="w-10 h-10 rounded-full bg-[#111] border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                45+
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-[#111] text-xs ml-1">5.0 (450+ Rəy)</span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">Bakının ən sevilən ləzzət məkanı</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes Showcase */}
      <section className="px-4 sm:px-12 lg:px-16 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111]">
              Populyar Yeməklər
            </h2>
            <p className="text-sm text-neutral-500 mt-1">Müştərilərimizin ən çox bəyəndiyi təamlar</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-prev-featured"
              onClick={() => scrollRow(featuredScrollRef, -1)}
              aria-label="Əvvəlki yeməklər"
              className="w-10 h-10 rounded-full bg-[#171717] hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="btn-next-featured"
              onClick={() => scrollRow(featuredScrollRef, 1)}
              aria-label="Növbəti yeməklər"
              className="w-10 h-10 rounded-full bg-[#111] hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Swipeable Row on Mobile: reduced width for sleek compact proportion */}
        <div
          ref={featuredScrollRef}
          className="flex gap-2.5 sm:gap-4 overflow-x-auto pt-3 sm:pt-5 pb-5 sm:pb-7 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {featuredDishes.map((food, idx) => (
            <div
              key={food.id}
              className="w-[48vw] max-w-[175px] sm:w-[215px] flex-shrink-0 snap-start"
            >
              <FoodCard
                food={food}
                onAddToCart={onAddToCart}
                isFavorite={favorites.includes(food.id)}
                onToggleFavorite={onToggleFavorite}
                index={idx}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Popular Category Showcase - Compact 2-column grid (yan-bayan, alt-alta) on mobile */}
      <section className="px-4 sm:px-12 lg:px-16 space-y-3 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-3xl font-bold text-[#111]">
              Populyar Yemək Kateqoriyası
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 sm:mt-1">Hər zövqə uyğun seçilmiş dadlar</p>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs sm:text-sm font-bold text-[#111] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Hamısına Bax</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2-column grid on mobile, responsive on desktop with ample vertical row gap */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-12 sm:gap-x-6 sm:gap-y-16 lg:gap-x-7 lg:gap-y-16 pt-2 sm:pt-6 pb-6 sm:pb-8">
          {popularDishes.map((food, idx) => (
            <FoodCard
              key={`pop-${food.id}`}
              food={food}
              onAddToCart={onAddToCart}
              isFavorite={favorites.includes(food.id)}
              onToggleFavorite={onToggleFavorite}
              index={idx + 10}
            />
          ))}
        </div>
      </section>

      {/* Testimonial & Why Us Section */}
      <section className="px-4 sm:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Testimonials */}
        <div className="lg:col-span-5 flex flex-col">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111] mb-5">
            Müştərilər Nə Deyir?
          </h2>
          <div className="bg-white border border-[#e8e3e1] rounded-3xl p-7 shadow-[0_10px_30px_rgba(30,20,20,0.06)] flex-1 flex flex-col justify-between space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#2d211e] to-[#6b5852] text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                RƏ
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#111]">Rəşad Əliyev</h4>
                <div className="flex items-center gap-1.5 text-amber-500 text-sm mt-0.5">
                  <span>★★★★★</span>
                  <span className="font-bold text-xs text-neutral-600">5.0</span>
                </div>
              </div>
            </div>
            <p className="text-[#333] text-base leading-relaxed italic">
              "Yeməklər həddindən artıq dadlı və təzə idi, xidmət səviyyəsi əladır! Xüsusilə pendirli ravioli və truffelli fettuccine-ni hər kəsə tövsiyə edirəm. Çatdırılma da cəmi 25 dəqiqə çəkdi."
            </p>
            <div className="text-xs text-neutral-400 font-medium">Daimi müştəri • Bakı</div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="lg:col-span-7 flex flex-col">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111] mb-5">
            Niyə Biz?
          </h2>
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 flex-1">
            <div className="bg-white border border-[#e8e3e1] rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-xs hover:border-neutral-400 transition-colors">
              <div className="w-11 h-11 rounded-full bg-neutral-100 text-[#111] flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-[15px] text-[#111] mb-1.5">
                Təzə və Keyfiyyətli Məhsullar
              </h3>
              <p className="text-xs text-[#686868] leading-relaxed">
                Hər gün yerli və orqanik fermalardan seçilmiş inqrediyentlər.
              </p>
            </div>

            <div className="bg-white border border-[#e8e3e1] rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-xs hover:border-neutral-400 transition-colors">
              <div className="w-11 h-11 rounded-full bg-neutral-100 text-[#111] flex items-center justify-center mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-[15px] text-[#111] mb-1.5">
                Peşəkar Aşpazlar
              </h3>
              <p className="text-xs text-[#686868] leading-relaxed">
                Beynəlxalq təcrübəli ustalarımızın hazırladığı xüsusi reseptlər.
              </p>
            </div>

            <div className="bg-white border border-[#e8e3e1] rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-xs hover:border-neutral-400 transition-colors">
              <div className="w-11 h-11 rounded-full bg-neutral-100 text-[#111] flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-[15px] text-[#111] mb-1.5">
                Sürətli Çatdırılma
              </h3>
              <p className="text-xs text-[#686868] leading-relaxed">
                Sifarişiniz termokontaynerlərdə isti və təravətli çatdırılır.
              </p>
            </div>

            <div className="bg-white border border-[#e8e3e1] rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-xs hover:border-neutral-400 transition-colors">
              <div className="w-11 h-11 rounded-full bg-neutral-100 text-[#111] flex items-center justify-center mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-[15px] text-[#111] mb-1.5">
                Müştəri Məmnuniyyəti
              </h3>
              <p className="text-xs text-[#686868] leading-relaxed">
                100% keyfiyyət zəmanəti və 24/7 diqqətli müştəri dəstəyi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Banner */}
      <section className="px-4 sm:px-12 lg:px-16">
        <div className="bg-[#111] text-white rounded-3xl p-8 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl shadow-black/20">
          <div className="space-y-2 text-center lg:text-left max-w-lg">
            <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
              Xüsusi endirimlər və yeniliklər üçün abunə olun!
            </h2>
            <p className="text-neutral-300 text-sm">
              Hər həftə yeni menyu və fərdiləşdirilmiş endirim kodları birbaşa e-poçtunuzda.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row bg-white rounded-full p-1.5 w-full lg:w-auto max-w-md shadow-inner"
          >
            <div className="flex items-center px-4 flex-1">
              <Mail className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
              <input
                id="newsletter-email-input"
                name="email"
                type="email"
                placeholder="E-poçt ünvanınız"
                required
                className="w-full text-sm text-[#111] outline-none py-2 bg-transparent"
              />
            </div>
            <button
              id="newsletter-btn-submit"
              type="submit"
              className="bg-[#171717] hover:bg-black text-white font-bold text-sm px-7 py-3 rounded-full transition-all cursor-pointer shadow-sm shrink-0"
            >
              Abunə Ol
            </button>
          </form>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="px-4 sm:px-12 lg:px-16">
        <div className="bg-white border border-[#e8e3e1] rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-neutral-200 shadow-[0_10px_30px_rgba(30,20,20,0.05)]">
          <div className="flex items-center gap-4 px-3 sm:px-6 pt-2 md:pt-0">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-[#111] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <strong className="block text-base font-bold text-[#111]">Pulsuz çatdırılma</strong>
              <span className="text-xs sm:text-sm text-neutral-500">50 ₼ və üzəri sifarişlərə</span>
            </div>
          </div>

          <div className="flex items-center gap-4 px-3 sm:px-6 pt-4 md:pt-0">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-[#111] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <strong className="block text-base font-bold text-[#111]">Tez çatdırılma</strong>
              <span className="text-xs sm:text-sm text-neutral-500">30–40 dəqiqə ərzində</span>
            </div>
          </div>

          <div className="flex items-center gap-4 px-3 sm:px-6 pt-4 md:pt-0">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-[#111] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <strong className="block text-base font-bold text-[#111]">Təhlükəsiz ödəniş</strong>
              <span className="text-xs sm:text-sm text-neutral-500">Kart və ya nağd, 100% qorunur</span>
            </div>
          </div>

          <div className="col-span-full mt-2 border-t border-neutral-200 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onShowToast('Instagram səhifəmiz: @matbaxh_az')}
                className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold text-[#111] transition-colors hover:bg-neutral-100"
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram-da bizi izləyin</span>
              </button>
              <button
                type="button"
                onClick={() => onShowToast('TikTok səhifəmiz: @matbaxh')}
                className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold text-[#111] transition-colors hover:bg-neutral-100"
              >
                <Music2 className="w-5 h-5" />
                <span>TikTok-da bizi izləyin</span>
              </button>
              <button
                type="button"
                onClick={() => onShowToast('Rəyiniz üçün təşəkkür edirik!')}
                className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold text-[#111] transition-colors hover:bg-neutral-100"
              >
                <Chrome className="w-5 h-5" />
                <span>Google-da bizə rəy verin</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
