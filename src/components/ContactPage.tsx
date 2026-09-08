import React, { useState } from 'react';
import { MapPin, Phone, Clock, Send, Mail, CheckCircle2 } from 'lucide-react';

interface ContactPageProps {
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      onShowToast('Zəhmət olmasa ad və əlaqə nömrənizi daxil edin', 'warning');
      return;
    }
    setSubmitted(true);
    onShowToast('Mesajınız uğurla göndərildi! Qısa zamanda sizinlə əlaqə saxlayacağıq.', 'success');
  };

  return (
    <div className="px-6 sm:px-12 lg:px-16 pt-6 pb-16 max-w-5xl mx-auto space-y-10">
      {/* Contact Form Card */}
      <div className="bg-white border border-[#e8e3e1] rounded-3xl p-8 sm:p-12 shadow-[0_15px_40px_rgba(30,20,20,0.06)]">
        <div className="max-w-xl mb-8">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#111]">
            Əlaqə
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base mt-2 leading-relaxed">
            Sualınız, xüsusi sifariş tələbiniz və ya masa rezervasiyası üçün bizimlə əlaqə saxlayın.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-xl text-emerald-900">Müraciətiniz qəbul edildi!</h3>
            <p className="text-sm text-emerald-700 max-w-md mx-auto">
              Hörmətli {formData.name}, menecerimiz qısa müddət ərzində qeyd etdiyiniz nömrə ilə əlaqə saxlayacaq.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
              }}
              className="mt-3 px-6 py-2.5 rounded-full bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors"
            >
              Yeni mesaj göndər
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-bold text-neutral-700 mb-1.5">
                Adınız və Soyadınız *
              </label>
              <input
                id="contact-name"
                type="text"
                required
                placeholder="Məs: Rəşad Əliyev"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-[#e8e3e1] rounded-xl p-3.5 text-sm outline-none focus:border-[#111] transition-all bg-[#fafafa] focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-bold text-neutral-700 mb-1.5">
                E-poçt ünvanınız
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="Məs: reshad@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-[#e8e3e1] rounded-xl p-3.5 text-sm outline-none focus:border-[#111] transition-all bg-[#fafafa] focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="contact-phone" className="block text-xs font-bold text-neutral-700 mb-1.5">
                Telefon nömrəniz *
              </label>
              <input
                id="contact-phone"
                type="tel"
                required
                placeholder="+994 50 123 45 67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-[#e8e3e1] rounded-xl p-3.5 text-sm outline-none focus:border-[#111] transition-all bg-[#fafafa] focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-xs font-bold text-neutral-700 mb-1.5">
                Mövzu və ya Məqsəd
              </label>
              <input
                id="contact-subject"
                type="text"
                placeholder="Masa rezervasiyası, Korporativ sifariş və s."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full border border-[#e8e3e1] rounded-xl p-3.5 text-sm outline-none focus:border-[#111] transition-all bg-[#fafafa] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="contact-message" className="block text-xs font-bold text-neutral-700 mb-1.5">
                Mesajınız və ya Qeydləriniz
              </label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="Qonaq sayı, tarix və ya xüsusi istəklərinizi qeyd edin..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-[#e8e3e1] rounded-xl p-3.5 text-sm outline-none focus:border-[#111] transition-all bg-[#fafafa] focus:bg-white resize-y"
              ></textarea>
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                id="btn-submit-contact"
                type="submit"
                className="px-8 py-4 rounded-full bg-[#111] hover:bg-black text-white font-bold text-sm shadow-md shadow-black/15 transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.01] active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Mesajı Göndər</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e8e3e1] rounded-2xl p-6 flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-[#111] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <strong className="block text-sm font-bold text-[#111]">Ünvanımız</strong>
            <p className="text-xs text-neutral-500 mt-1">
              Nizami küçəsi 45, Səbail rayonu, Bakı şəhəri
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e8e3e1] rounded-2xl p-6 flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-[#111] flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <strong className="block text-sm font-bold text-[#111]">Əlaqə Nömrələri</strong>
            <p className="text-xs text-neutral-500 mt-1">
              +994 (12) 490 00 00 <br />
              +994 (50) 123 45 67
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e8e3e1] rounded-2xl p-6 flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-[#111] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <strong className="block text-sm font-bold text-[#111]">İş Saatları</strong>
            <p className="text-xs text-neutral-500 mt-1">
              Bazar ertəsi - Bazar: <br />
              10:00 - 23:30 (Hər gün)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
