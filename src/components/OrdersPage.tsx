import React, { useState } from 'react';
import { CartItem, Order, UserProfile } from '../types';
import { Trash2, Minus, Plus, CheckCircle2, ArrowUpRight, ArrowRight, ShoppingBag, X } from 'lucide-react';

interface OrdersPageProps {
  cart: CartItem[];
  onUpdateQuantity: (foodId: string, delta: number) => void;
  onRemoveItem: (foodId: string) => void;
  onClearCart: () => void;
  onNavigateToMenu: () => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onSaveCustomerInfo: (profile: UserProfile) => void;
  onOrderCreated: (order: Order) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigateToMenu,
  onShowToast,
  onSaveCustomerInfo,
  onOrderCreated,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+994 ');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? (subtotal >= 40 ? 0.0 : 4.0) : 0.0;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      onShowToast('Səbətiniz boşdur, zəhmət olmasa menyudan yemək seçin', 'warning');
      return;
    }

    if (!firstName.trim()) {
      onShowToast('Zəhmət olmasa adınızı qeyd edin', 'warning');
      return;
    }

    if (phone.trim().length < 9) {
      onShowToast('Zəhmət olmasa əlaqə nömrənizi qeyd edin', 'warning');
      return;
    }

    setIsSubmitting(true);

    const customerProfile: UserProfile = {
      fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
      phone: phone.trim(),
      email: '',
      address: address.trim(),
      notes: '',
    };

    const order: Order = {
      id: `AZ-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: cart.map((item) => ({
        name: item.food.name,
        quantity: item.quantity,
        price: item.food.price,
      })),
      total,
      status: 'Gözləmədə',
      address: address.trim(),
    };

    // Prepare WhatsApp Message
    const orderItemsText = cart
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.food.name} x${item.quantity} = ${(item.food.price * item.quantity).toFixed(2)} AZN`
      )
      .join('\n');

    const whatsappMessage = `*Yeni Sifariş - Ləzzətli Restoran*\n\n` +
      `👤 *Müştəri:* ${firstName} ${lastName}\n` +
      `📞 *Əlaqə:* ${phone}\n` +
      `📍 *Ünvan:* ${address || 'WhatsApp vasitəsilə göndəriləcək'}\n\n` +
      `🛍️ *Sifarişlər:*\n${orderItemsText}\n\n` +
      `💵 *Yekun Məbləğ:* ${subtotal.toFixed(2)} AZN\n` +
      `🚚 *Çatdırılma:* ${deliveryFee === 0 ? 'Pulsuz' : deliveryFee.toFixed(2) + ' AZN'}\n` +
      `⭐ *Ödəniləcək:* ${total.toFixed(2)} AZN`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsCheckoutModalOpen(false);
      setIsOrderSubmitted(true);
      onSaveCustomerInfo(customerProfile);
      onOrderCreated(order);
      onShowToast('Sifarişiniz uğurla qeydə alındı!', 'success');

      // WhatsApp link trigger
      const encodedMsg = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/994508930777?text=${encodedMsg}`;
      
      try {
        window.open(whatsappUrl, '_blank');
      } catch (err) {
        console.log('Popup blocked, url:', whatsappUrl);
      }

      onClearCart();
    }, 600);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-5 sm:py-8 space-y-5 pb-24 sm:pb-12">
      {/* Title & Items Count Pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111] tracking-tight">
            Sifarişiniz
          </h1>
          <span className="px-3 py-1 rounded-full bg-[#111] text-white text-xs font-bold tracking-wide shadow-xs">
            {totalItemsCount} məhsul
          </span>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs text-neutral-500 hover:text-red-500 transition-colors cursor-pointer underline"
          >
            Təmizlə
          </button>
        )}
      </div>

      {isOrderSubmitted ? (
        <div className="bg-white text-[#111] rounded-3xl p-8 text-center space-y-4 border-2 border-[#111] shadow-xl">
          <div className="w-16 h-16 bg-neutral-100 text-[#111] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-bold">Sifarişiniz Qəbul Olundu!</h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Təşəkkür edirik! Sifarişinizin detalları operatorumuza ötürüldü. Tezliklə sizinlə əlaqə saxlanılacaq.
          </p>
          <div className="pt-3">
            <button
              type="button"
              onClick={() => {
                setIsOrderSubmitted(false);
                onNavigateToMenu();
              }}
              className="px-6 py-3 rounded-full bg-[#111] text-white font-bold text-xs sm:text-sm hover:bg-black transition-colors cursor-pointer shadow-md"
            >
              Menyuya Qayıt
            </button>
          </div>
        </div>
      ) : cart.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center space-y-4 border-2 border-[#111] shadow-xs">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-[#111]">Sifariş səbətiniz boşdur</h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xs mx-auto">
            Menyumuza nəzər yetirin və bəyəndiyiniz dadlı təamları səbətə əlavə edin.
          </p>
          <button
            type="button"
            onClick={onNavigateToMenu}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111] text-white font-bold text-xs sm:text-sm hover:bg-black transition-all cursor-pointer shadow-sm"
          >
            <span>Menyuya Keçid Edin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Order Item Cards with White Background and Black Border */}
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.food.id}
                className="bg-white text-[#111] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 border-2 border-[#111] shadow-xs transition-all hover:shadow-md"
              >
                {/* Image on Left with circular border */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={item.food.image}
                      alt={item.food.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#111] shadow-xs"
                    />
                  </div>

                  {/* Title & Price & Stepper */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-bold text-xs sm:text-sm text-[#111] line-clamp-1">
                      {item.food.name}
                    </h3>
                    <p className="font-extrabold text-xs sm:text-sm text-[#111]">
                      {(item.food.price * item.quantity).toFixed(2)} ₼
                    </p>

                    {/* Quantity Stepper Pill [-] 1 [+] */}
                    <div className="inline-flex items-center bg-white border border-[#111] rounded-full px-2 py-0.5 mt-0.5">
                      <button
                        type="button"
                        aria-label="Azalt"
                        onClick={() => onUpdateQuantity(item.food.id, -1)}
                        className="w-5 h-5 flex items-center justify-center text-[#111] hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-bold text-xs text-[#111]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Artır"
                        onClick={() => onUpdateQuantity(item.food.id, 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#111] hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Trash Delete Button */}
                <button
                  type="button"
                  aria-label="Sil"
                  onClick={() => onRemoveItem(item.food.id)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-500 flex items-center justify-center transition-colors shrink-0 cursor-pointer border border-neutral-200 hover:border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Fixed Trigger Bar for Checkout (Always available without pushing the page) */}
          <div className="bg-white text-[#111] rounded-2xl p-4 sm:p-5 border-2 border-[#111] shadow-md flex items-center justify-between gap-3 mt-4">
            <div>
              <span className="text-[11px] text-neutral-500 font-medium block">Cəmi Məbləğ</span>
              <span className="text-base sm:text-lg font-black text-[#111]">
                {total.toFixed(2)} ₼
              </span>
            </div>

            <button
              id="btn-open-checkout-modal"
              type="button"
              onClick={() => setIsCheckoutModalOpen(true)}
              className="py-3 px-5 sm:px-6 rounded-full bg-[#111] hover:bg-black text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span>Sifarişinizi Təsdiqləyin</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Checkout Bottom-Sheet Modal (Opens upward when 'Sifarişinizi Təsdiqləyin' is clicked) */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          {/* Backdrop click to close */}
          <div
            className="fixed inset-0"
            onClick={() => setIsCheckoutModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-t-3xl border-t-2 border-x-2 border-[#111] shadow-2xl p-5 sm:p-6 z-10 max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ease-out animate-in slide-in-from-bottom space-y-4">
            {/* Grab Bar & Header */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-1.5 bg-neutral-300 rounded-full mb-3" />
              <div className="w-full flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#111] text-white flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm sm:text-base text-[#111]">
                      Sifarişinizi Təsdiqləyin
                    </h2>
                    <p className="text-[11px] text-neutral-500">Məlumatları dolduraraq sifarişi tamamlayın</p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Bağla"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmitOrder} className="space-y-3.5 pt-1">
              {/* Row 1: Ad & Soyad */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700">
                    Ad *
                  </label>
                  <input
                    id="order-input-firstname"
                    type="text"
                    required
                    placeholder="Adınız"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border-2 border-neutral-300 text-[#111] text-xs sm:text-sm placeholder:text-neutral-400 outline-none focus:border-[#111] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700">
                    Soyad
                  </label>
                  <input
                    id="order-input-lastname"
                    type="text"
                    placeholder="Soyadınız"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border-2 border-neutral-300 text-[#111] text-xs sm:text-sm placeholder:text-neutral-400 outline-none focus:border-[#111] transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Nömrə */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700">
                  Nömrə *
                </label>
                <input
                  id="order-input-phone"
                  type="tel"
                  required
                  placeholder="+994 50 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border-2 border-neutral-300 text-[#111] text-xs sm:text-sm placeholder:text-neutral-400 outline-none focus:border-[#111] transition-colors"
                />
              </div>

              {/* Row 3: Ünvan */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-neutral-700">
                    Ünvan
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    (WhatsApp ilə də göndərə bilərsiniz)
                  </span>
                </div>
                <textarea
                  id="order-input-address"
                  rows={2}
                  placeholder="Çatdırılma ünvanınızı qeyd edin..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border-2 border-neutral-300 text-[#111] text-xs sm:text-sm placeholder:text-neutral-400 outline-none focus:border-[#111] transition-colors resize-none"
                />
              </div>

              {/* Pricing breakdown */}
              <div className="border-t border-neutral-200 pt-3 space-y-1.5 text-xs sm:text-sm bg-neutral-50 p-3 rounded-xl border">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Yekun Məbləğ:</span>
                  <span className="font-semibold text-[#111]">{subtotal.toFixed(2)} ₼</span>
                </div>
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Çatdırılma Ödənişi:</span>
                  <span className="font-semibold text-[#111]">
                    {deliveryFee === 0 ? 'Pulsuz (40₼+)' : `${deliveryFee.toFixed(2)} ₼`}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex items-center justify-between text-sm sm:text-base font-extrabold text-[#111]">
                  <span>Ödəniləcək məbləğ:</span>
                  <span className="text-base sm:text-lg">{total.toFixed(2)} ₼</span>
                </div>
              </div>

              {/* Complete Order Button */}
              <div className="pt-2">
                <button
                  id="btn-complete-order"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#111] hover:bg-black text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>{isSubmitting ? 'Sifariş göndərilir...' : 'Sifarişi Tamamla'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
