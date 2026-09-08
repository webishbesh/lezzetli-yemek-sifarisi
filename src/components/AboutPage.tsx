import React from 'react';
import { PageId } from '../types';
import { Sparkles, ChefHat, Heart, ShieldCheck, Truck, Trophy, Users, Star } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onShowToast }) => {
  return (
    <div className="px-6 sm:px-12 lg:px-16 pt-6 pb-16 space-y-16">
      {/* About Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-[#111] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bizim hekayəmiz</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#111] leading-tight">
            Haqqımızda
          </h1>
          <p className="text-[#303030] text-base sm:text-lg leading-relaxed">
            Matbaxh olaraq biz inanırıq ki, yaxşı yemək yalnız mədəni deyil, ruhu da doyurur. Məqsədimiz, hər gün təzə, keyfiyyətli və ləzzətli yeməkləri ən yüksək gigiyenik standartlarla sizin və ailənizin süfrəsinə çatdırmaqdır.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              id="about-btn-menu"
              onClick={() => onNavigate('menu')}
              className="px-8 py-3.5 rounded-full bg-[#111] hover:bg-black text-white font-bold text-sm shadow-md shadow-black/15 transition-all cursor-pointer"
            >
              Menyumuza Baxın
            </button>
            <button
              id="about-btn-toast"
              onClick={() => onShowToast('Matbaxh ailəsinə xoş gəlmisiniz!', 'success')}
              className="px-7 py-3.5 rounded-full bg-white hover:bg-neutral-50 text-[#111] font-bold text-sm border border-[#e8e3e1] transition-all cursor-pointer"
            >
              Daha ətraflı
            </button>
          </div>
        </div>

        {/* Kitchen Image with Floating Info Cards */}
        <div className="lg:col-span-7 relative">
          <div className="rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-neutral-200">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
              alt="Matbaxh mətbəx komandası"
              className="w-full h-[360px] sm:h-[420px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Overlay Features Banner */}
          <div className="mt-4 sm:-mt-12 sm:mx-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#e8e3e1] shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-5 relative z-10">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-[#111] flex items-center justify-center font-bold text-sm mb-2">
                ⌁
              </div>
              <h3 className="font-bold text-sm text-[#111]">Təzə və Keyfiyyətli</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Yeməklərimizdə yalnız təbii və orqanik məhsullar istifadə olunur.
              </p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-[#111] flex items-center justify-center font-bold text-sm mb-2">
                ♨
              </div>
              <h3 className="font-bold text-sm text-[#111]">Peşəkar Aşpazlar</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Təcrübəli aşpazlarımız sizə unudulmaz dad təcrübəsi bəxş edir.
              </p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-[#111] flex items-center justify-center font-bold text-sm mb-2">
                ♡
              </div>
              <h3 className="font-bold text-sm text-[#111]">Müştəri Məmnuniyyəti</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Hər bir qonağımızın təbəssümü bizim ən böyük mükafatımızdır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="space-y-8 pt-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111]">
            Niyə Biz?
          </h2>
          <p className="text-sm text-neutral-500">
            Biz sadəcə yemək hazırlamırıq, süfrənizə sevgi və keyfiyyət qatırıq.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-[#e8e3e1] rounded-2xl p-7 text-center shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-[#111] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#111] mb-2">Təbii və Sağlam</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Heç bir süni qatqı və ya kimyəvi qoruyucu istifadə etmirik.
            </p>
          </div>

          <div className="bg-white border border-[#e8e3e1] rounded-2xl p-7 text-center shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-[#111] flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#111] mb-2">Sürətli Çatdırılma</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Xüsusi istilik qoruyucu qablaşdırmada 30 dəqiqə ərzində çatdırılma.
            </p>
          </div>

          <div className="bg-white border border-[#e8e3e1] rounded-2xl p-7 text-center shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-[#111] flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#111] mb-2">Yüksək Keyfiyyət</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              İtalyan unundan hazırlanmış xəmir və orijinal parmezan pendiri.
            </p>
          </div>

          <div className="bg-white border border-[#e8e3e1] rounded-2xl p-7 text-center shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-[#111] flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#111] mb-2">Güvənilir Marka</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Paytaxtın minlərlə ailəsi artıq 5 ildir bizi seçir.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-white border border-[#e8e3e1] rounded-3xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100 shadow-[0_10px_30px_rgba(30,20,20,0.05)] text-center">
          <div className="p-3">
            <strong className="block text-3xl sm:text-4xl font-black text-[#111]">500+</strong>
            <span className="text-xs sm:text-sm text-neutral-600 font-semibold mt-1 block">Menyu Seçimi</span>
          </div>

          <div className="p-3">
            <strong className="block text-3xl sm:text-4xl font-black text-[#111]">10K+</strong>
            <span className="text-xs sm:text-sm text-neutral-600 font-semibold mt-1 block">Məmnun Müştəri</span>
          </div>

          <div className="p-3">
            <strong className="block text-3xl sm:text-4xl font-black text-[#111]">50K+</strong>
            <span className="text-xs sm:text-sm text-neutral-600 font-semibold mt-1 block">Çatdırılan Sifariş</span>
          </div>

          <div className="p-3">
            <strong className="block text-3xl sm:text-4xl font-black text-[#111]">4.9</strong>
            <span className="text-xs sm:text-sm text-neutral-600 font-semibold mt-1 block">Orta Reytinq (★)</span>
          </div>
        </div>
      </section>
    </div>
  );
};
