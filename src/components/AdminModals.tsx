import React, { useState } from 'react';
import { FoodItem } from '../types';
import { X, ShieldCheck, Upload, Image as ImageIcon, CheckCircle2, RotateCcw } from 'lucide-react';

interface AdminModalsProps {
  isAuthOpen: boolean;
  onCloseAuth: () => void;
  isUploadOpen: boolean;
  onCloseUpload: () => void;
  onOpenUpload: () => void;
  foods: FoodItem[];
  onUpdateFoodImage: (foodId: string, newImageUrl: string) => void;
  onResetImages: () => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const AdminModals: React.FC<AdminModalsProps> = ({
  isAuthOpen,
  onCloseAuth,
  isUploadOpen,
  onCloseUpload,
  onOpenUpload,
  foods,
  onUpdateFoodImage,
  onResetImages,
  onShowToast
}) => {
  // Auth state
  const [adminEmail, setAdminEmail] = useState('webish.besh@gmail.com');
  const [authStep, setAuthStep] = useState<'email' | 'code'>('email');
  const [adminCode, setAdminCode] = useState('');

  // Upload state
  const [selectedFoodId, setSelectedFoodId] = useState<string>(foods[0]?.id || 'food-0');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');

  const currentFood = foods.find((f) => f.id === selectedFoodId) || foods[0];

  const handleRequestCode = () => {
    const email = adminEmail.trim().toLowerCase();
    if (!email) {
      onShowToast('Zəhmət olmasa email daxil edin', 'warning');
      return;
    }
    if (email !== 'webish.besh@gmail.com' && !email.includes('@')) {
      onShowToast('Bu e-poçt üçün admin girişi yoxdur', 'warning');
      return;
    }
    setAuthStep('code');
    onShowToast('Təsdiq kodu: 123 (Demo üçün)', 'info');
  };

  const handleVerifyCode = () => {
    if (adminCode === '123' || adminCode === '1234') {
      onCloseAuth();
      setAuthStep('email');
      setAdminCode('');
      onOpenUpload();
      onShowToast('Admin girişi uğurla təsdiqləndi', 'success');
    } else {
      onShowToast('Kod düzgün deyil! Demo kod: 123', 'warning');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImage = () => {
    const finalImage = previewImage || imageUrlInput;
    if (!finalImage) {
      onShowToast('Əvvəlcə şəkil faylı seçin və ya URL daxil edin', 'warning');
      return;
    }
    onUpdateFoodImage(selectedFoodId, finalImage);
    setPreviewImage('');
    setImageUrlInput('');
    onCloseUpload();
    onShowToast(`"${currentFood?.name}" şəkli uğurla yeniləndi!`, 'success');
  };

  return (
    <>
      {/* 1. Admin Authentication Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-neutral-100">
            <button
              onClick={onCloseAuth}
              className="absolute right-4 top-4 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
              aria-label="Bağla"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-[#111] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h2 className="font-display text-2xl font-bold text-[#111] mb-1.5">
              Şəkilləri idarə et
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6">
              Yemək şəkillərini və vizualları dəyişmək üçün admin hesabına daxil olun.
            </p>

            {authStep === 'email' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Google / Gmail ünvanınız
                  </label>
                  <input
                    id="admin-email-input"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Gmail ünvanınızı yazın"
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-[#111]"
                  />
                </div>

                <button
                  id="btn-admin-request-code"
                  type="button"
                  onClick={handleRequestCode}
                  className="w-full py-3.5 rounded-xl bg-white border border-neutral-300 hover:border-neutral-400 font-bold text-sm text-neutral-800 flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span className="text-blue-500 font-black text-lg">G</span>
                  <span>Gmail ilə davam et</span>
                </button>

                <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200/60 p-3 rounded-xl">
                  💡 <strong>Demo girişi:</strong> Təyin olunmuş admin ünvanı (<code>webish.besh@gmail.com</code>). "Gmail ilə davam et" düyməsinə klikləyin.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Təsdiq kodu (SMS / Email)
                  </label>
                  <input
                    id="admin-code-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="3 rəqəmli kod (123)"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm font-mono text-center tracking-widest text-lg outline-none focus:border-[#111]"
                  />
                </div>

                <button
                  id="btn-admin-verify-code"
                  type="button"
                  onClick={handleVerifyCode}
                  className="w-full py-3.5 rounded-xl bg-[#111] hover:bg-black text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Təsdiqlə və Daxil Ol
                </button>

                <button
                  type="button"
                  onClick={() => setAuthStep('email')}
                  className="w-full text-center text-xs text-neutral-500 hover:text-neutral-800 font-semibold"
                >
                  ← E-poçtu dəyiş
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Upload / Image Customization Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={onCloseUpload}
              className="absolute right-4 top-4 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
              aria-label="Bağla"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-[#111] flex items-center justify-center mb-4">
              <ImageIcon className="w-6 h-6" />
            </div>

            <h2 className="font-display text-2xl font-bold text-[#111] mb-1.5">
              Yemək Şəklini Dəyiş
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6">
              İstənilən yeməyi seçin və şəffaf fonlu PNG, WebP və ya JPG şəkli yükləyin. Bütün kartlarda dərhal yenilənəcək.
            </p>

            <div className="space-y-4">
              {/* Select Dish */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Dəyişdiriləcək Yemək
                </label>
                <select
                  id="select-admin-dish"
                  value={selectedFoodId}
                  onChange={(e) => {
                    setSelectedFoodId(e.target.value);
                    setPreviewImage('');
                  }}
                  className="w-full border border-neutral-200 rounded-xl p-3 text-sm font-semibold outline-none focus:border-[#111] bg-neutral-50"
                >
                  {foods.map((food) => (
                    <option key={food.id} value={food.id}>
                      {food.name} — {food.price.toFixed(2)} ₼ ({food.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Preview */}
              <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                <img
                  src={previewImage || imageUrlInput || currentFood?.image}
                  alt={currentFood?.name}
                  className="w-20 h-20 rounded-xl object-cover border border-neutral-300 shadow-inner bg-white shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-neutral-500 block">Seçilmiş:</span>
                  <h4 className="font-bold text-sm text-[#111]">{currentFood?.name}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">{currentFood?.description}</p>
                </div>
              </div>

              {/* Upload File */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Fayldan Yüklə (PNG, WebP, JPG)
                </label>
                <input
                  id="admin-file-upload"
                  type="file"
                  accept="image/png,image/webp,image/jpeg"
                  onChange={handleFileChange}
                  className="w-full border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-600 bg-white file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-neutral-900 file:text-white hover:file:bg-black cursor-pointer"
                />
              </div>

              {/* Or Paste URL */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Və ya Birbaşa Şəkil Linki (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrlInput}
                  onChange={(e) => {
                    setImageUrlInput(e.target.value);
                    setPreviewImage('');
                  }}
                  className="w-full border border-neutral-200 rounded-xl p-3 text-xs outline-none focus:border-[#111]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  id="btn-save-dish-image"
                  type="button"
                  onClick={handleSaveImage}
                  className="flex-1 py-3.5 rounded-xl bg-[#111] hover:bg-black text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Şəkli Yenilə</span>
                </button>
                <button
                  type="button"
                  onClick={onResetImages}
                  className="py-3.5 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-xs font-bold text-neutral-700 transition-colors flex items-center justify-center gap-1.5"
                  title="Bütün şəkilləri ilkin vəziyyətinə qaytar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Defolta qaytar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
