import React from 'react';
import { PageId } from '../types';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onShowToast }) => {
  return (
    <footer className="mt-8 border-t border-[#d9d4d2] px-6 sm:px-12 lg:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#5b5b5b]">
      <div>
        © 2026 <strong className="text-[#111] font-bold">Matbaxh</strong>. Bütün hüquqlar qorunur.
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 font-medium">
        <button
          onClick={() => onNavigate('home')}
          className="hover:text-black transition-colors"
        >
          Ana Səhifə
        </button>
        <button
          onClick={() => onNavigate('menu')}
          className="hover:text-black transition-colors"
        >
          Menyu
        </button>
        <button
          onClick={() => onNavigate('about')}
          className="hover:text-black transition-colors"
        >
          Haqqımızda
        </button>
        <button
          onClick={() => onNavigate('contact')}
          className="hover:text-black transition-colors"
        >
          Əlaqə
        </button>
        <button
          onClick={() => onShowToast('Şərtlər və Qaydalar sənədi')}
          className="hover:text-black transition-colors"
        >
          Şərtlər və Qaydalar
        </button>
        <button
          onClick={() => onShowToast('Məxfilik Siyasəti sənədi')}
          className="hover:text-black transition-colors"
        >
          Məxfilik Siyasəti
        </button>
      </div>

      <div className="flex items-center gap-4 text-lg text-[#222]">
        <button
          onClick={() => onShowToast('Instagram səhifəmiz: @matbaxh_az')}
          className="hover:text-black transition-colors p-1"
          aria-label="Instagram"
        >
          ◎
        </button>
        <button
          onClick={() => onShowToast('Facebook səhifəmiz: Matbaxh')}
          className="hover:text-black transition-colors p-1 font-bold"
          aria-label="Facebook"
        >
          f
        </button>
        <button
          onClick={() => onShowToast('Telegram kanalımız: @matbaxh')}
          className="hover:text-black transition-colors p-1"
          aria-label="Telegram"
        >
          ◉
        </button>
      </div>
    </footer>
  );
};
