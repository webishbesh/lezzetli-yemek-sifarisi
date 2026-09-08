import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (foodId: string, delta: number) => void;
  onRemoveItem: (foodId: string) => void;
  onClearCart: () => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onNavigateToMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onShowToast,
  onNavigateToMenu
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoSuccess, setPromoSuccess] = useState<string>('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const deliveryFee = subtotal >= 50 || subtotal === 0 ? 0 : 3.5;
  const discountAmount = subtotal * appliedDiscount;
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'LEZZETLI5' || code === 'LEZZETLI') {
      setAppliedDiscount(0.05);
      setPromoSuccess('5% xüsusi endirim tətbiq edildi!');
      onShowToast('5% endirim kodu tətbiq edildi', 'success');
    } else if (code === 'BAKU10' || code === 'BAKU') {
      setAppliedDiscount(0.10);
      setPromoSuccess('10% xüsusi promo tətbiq edildi!');
      onShowToast('10% endirim tətbiq edildi', 'success');
    } else {
      onShowToast('Etibarsız promo kod. "LEZZETLI5" kodunu yoxlayın.', 'warning');
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      onShowToast('Sifarişiniz uğurla qəbul edildi! Dadlı yeməyiniz tezliklə qapınızda olacaq.', 'success');
    }, 1200);
  };

  const handleFinish = () => {
    setCheckoutComplete(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#111]" />
            <h2 className="font-bold text-lg text-[#111]">Səbətiniz</h2>
            <span className="text-xs bg-neutral-100 text-[#111] font-bold px-2 py-0.5 rounded-full">
              {items.reduce((sum, item) => sum + item.quantity, 0)} məhsul
            </span>
          </div>
          <button
            id="btn-close-cart"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
            aria-label="Səbəti bağla"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {checkoutComplete ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#111]">
              Sifarişiniz Təsdiqləndi!
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
              Sifarişiniz mətbəxə ötürüldü və 30-35 dəqiqə ərzində çatdırılacaq. Sifariş nömrəsi: <span className="font-bold text-[#111]">#LZ-{Math.floor(1000 + Math.random() * 9000)}</span>
            </p>
            <div className="bg-neutral-50 p-4 rounded-2xl w-full text-xs text-neutral-600 space-y-1 text-left border border-neutral-200">
              <div className="flex justify-between">
                <span>Ödənilən məbləğ:</span>
                <span className="font-bold text-[#111]">{total.toFixed(2)} ₼</span>
              </div>
              <div className="flex justify-between">
                <span>Qazanılan xal:</span>
                <span className="font-bold text-emerald-600">+{Math.round(total)} xal</span>
              </div>
            </div>
            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-full bg-[#111] hover:bg-black text-white font-bold text-sm shadow-md transition-all mt-4 cursor-pointer"
            >
              Əla, Bağla
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-3xl">
              🛒
            </div>
            <h3 className="font-bold text-lg text-[#111]">Səbətiniz boşdur</h3>
            <p className="text-xs text-neutral-500 max-w-xs">
              Menyudan ləzzətli yeməklər seçərək səbətinizə əlavə edin.
            </p>
            <button
              onClick={() => {
                onClose();
                onNavigateToMenu();
              }}
              className="px-6 py-3 rounded-full bg-[#111] text-white text-xs font-bold hover:bg-black transition-colors"
            >
              Menyuya Keçid
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
            {items.map((item) => (
              <div
                key={item.food.id}
                className="flex items-center gap-3.5 bg-neutral-50 p-3 rounded-2xl border border-neutral-100"
              >
                <img
                  src={item.food.image}
                  alt={item.food.name}
                  className="w-16 h-16 rounded-xl object-cover border border-neutral-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-[#111] truncate">{item.food.name}</h4>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {item.food.price.toFixed(2)} ₼
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-neutral-200 bg-white rounded-lg overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.food.id, -1)}
                        className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-[#111]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.food.id, 1)}
                        className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.food.id)}
                      className="text-neutral-400 hover:text-neutral-900 p-1 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm text-[#111]">
                    {(item.food.price * item.quantity).toFixed(2)} ₼
                  </span>
                </div>
              </div>
            ))}

            {/* Promo Code box */}
            <form onSubmit={handleApplyPromo} className="pt-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Promo kod (Məs: LEZZETLI5)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-neutral-200 rounded-xl outline-none focus:border-[#111] uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Tətbiq et
                </button>
              </div>
              {promoSuccess && (
                <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {promoSuccess}
                </p>
              )}
            </form>
          </div>
        )}

        {/* Footer Summary */}
        {!checkoutComplete && items.length > 0 && (
          <div className="p-5 border-t border-neutral-100 bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Məhsulların cəmi:</span>
                <span className="font-semibold text-neutral-800">{subtotal.toFixed(2)} ₼</span>
              </div>
              <div className="flex justify-between">
                <span>Çatdırılma:</span>
                <span className="font-semibold text-neutral-800">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">Pulsuz (50+ ₼)</span>
                  ) : (
                    `${deliveryFee.toFixed(2)} ₼`
                  )}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Endirim ({(appliedDiscount * 100).toFixed(0)}%):</span>
                  <span>-{discountAmount.toFixed(2)} ₼</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#111] pt-2 border-t border-neutral-100">
                <span>Yekun Məbləğ:</span>
                <span className="text-lg font-extrabold text-[#111]">{total.toFixed(2)} ₼</span>
              </div>
            </div>

            <button
              id="btn-checkout"
              disabled={isCheckingOut}
              onClick={handleCheckout}
              className="w-full py-4 rounded-full bg-[#111] hover:bg-black disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-black/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCheckingOut ? (
                <span>Sifariş hazırlanır...</span>
              ) : (
                <>
                  <span>Sifarişi Təsdiqlə ({total.toFixed(2)} ₼)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
