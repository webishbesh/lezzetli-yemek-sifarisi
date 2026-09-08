import React, { useEffect, useState } from 'react';
import { Order, PageId, UserProfile } from '../types';
import { User, Package, LogOut, Save, MapPin, Phone, Mail, Chrome, CheckCircle2, ShieldCheck } from 'lucide-react';

const nameCharacters = /[^A-Za-zƏəĞğÇçŞşÖöÜüİı\s]/g;

const cleanName = (value: string) => value.replace(nameCharacters, '').replace(/\s{2,}/g, ' ');

const formatAzerbaijaniPhone = (value: string) => {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('994')) digits = `0${digits.slice(3)}`;
  if (digits && !digits.startsWith('0')) digits = `0${digits}`;
  digits = digits.slice(0, 10);

  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)]
    .filter(Boolean)
    .join('-');
};

interface ProfilePageProps {
  onNavigate: (page: PageId) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onOpenAdminPanel?: () => void;
  profile: UserProfile | null;
  orders: Order[];
  onRegister: (profile: UserProfile) => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigate,
  onShowToast,
  onOpenAdminPanel,
  profile,
  orders,
  onRegister,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders'>('overview');
  const [registrationMethod, setRegistrationMethod] = useState<'phone' | 'google' | 'gmail'>('phone');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [registrationPhone, setRegistrationPhone] = useState('');
  const [registrationFirstName, setRegistrationFirstName] = useState('');
  const [registrationLastName, setRegistrationLastName] = useState('');
  const [registrationAddress, setRegistrationAddress] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const [isCodeRequested, setIsCodeRequested] = useState(false);

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    address: profile?.address || '',
    notes: profile?.notes || '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName,
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
        notes: profile.notes,
      });
    }
  }, [profile]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({
      ...formData,
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      email: formData.email.trim(),
      notes: formData.notes.trim(),
    });
    onShowToast('Profil məlumatları uğurla yadda saxlanıldı', 'success');
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const email = registrationEmail.trim().toLowerCase();
    const firstName = cleanName(registrationFirstName).trim();
    const lastName = cleanName(registrationLastName).trim();
    const formattedPhone = formatAzerbaijaniPhone(registrationPhone);

    if (registrationMethod === 'phone' && (!firstName || !lastName || !formattedPhone)) {
      onShowToast('Ad, soyad və telefon nömrəsini doldurun', 'warning');
      return;
    }
    if (registrationMethod === 'phone' && !/^[A-Za-zƏəĞğÇçŞşÖöÜüİı\s]{4,}$/.test(firstName)) {
      onShowToast('Ad ən azı 4 hərfdən ibarət olmalıdır', 'warning');
      return;
    }
    if (registrationMethod === 'phone' && !/^[A-Za-zƏəĞğÇçŞşÖöÜüİı\s]{4,}$/.test(lastName)) {
      onShowToast('Soyad ən azı 4 hərfdən ibarət olmalıdır', 'warning');
      return;
    }
    if (registrationMethod === 'phone' && !/^0\d{2}-\d{3}-\d{2}-\d{2}$/.test(formattedPhone)) {
      onShowToast('Telefon nömrəsini 050-123-45-67 formatında yazın', 'warning');
      return;
    }
    if (registrationMethod !== 'phone' && !email) {
      onShowToast('Gmail ünvanınızı daxil edin', 'warning');
      return;
    }

    if (email === 'webish.besh@gmail.com') {
      setIsCodeRequested(true);
      onShowToast('Admin təsdiq kodunu daxil edin', 'info');
      return;
    }

    const fullName = registrationMethod === 'phone'
      ? `${firstName} ${lastName}`
      : email.split('@')[0];
    onRegister({
      fullName,
      phone: registrationMethod === 'phone' ? formattedPhone : '',
      email,
      address: registrationAddress.trim(),
      notes: '',
    });
  };

  const handleAdminCode = () => {
    if (registrationCode !== 'mat1234') {
      onShowToast('Kod düzgün deyil', 'warning');
      return;
    }
    setRegistrationCode('');
    setIsCodeRequested(false);
    onShowToast('Admin paneli açıldı', 'success');
    onOpenAdminPanel?.();
  };

  if (!profile) {
    return (
      <div className="px-4 sm:px-12 lg:px-16 pt-12 sm:pt-16 pb-16">
        <section className="max-w-2xl bg-white border border-[#e8e3e1] rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
          <div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#111]">Adınızı yazaraq qeydiyyatdan keçin</h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">Zəhmət olmasa aşağıdakı məlumatları doldurun.</p>
          </div>
          <form onSubmit={handleRegistration} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={registrationFirstName} onChange={(e) => setRegistrationFirstName(cleanName(e.target.value))} placeholder="Ad" minLength={4} required className="border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-black" />
              <input value={registrationLastName} onChange={(e) => setRegistrationLastName(cleanName(e.target.value))} placeholder="Soyad" minLength={4} required className="border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-black" />
              <input value={registrationPhone} onChange={(e) => setRegistrationPhone(formatAzerbaijaniPhone(e.target.value))} placeholder="Telefon nömrəsi" type="tel" inputMode="numeric" maxLength={13} pattern="0[0-9]{2}-[0-9]{3}-[0-9]{2}-[0-9]{2}" required className="sm:col-span-2 border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-black" />
            </div>
            <input value={registrationAddress} onChange={(e) => setRegistrationAddress(e.target.value)} placeholder="Ünvan (istəyə bağlı)" className="w-full border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-black" />
            <button type="submit" className="w-full py-3 rounded-xl bg-[#111] text-white font-bold text-sm cursor-pointer">Qeydiyyatdan keç</button>
          </form>
          {isCodeRequested && (
            <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 space-y-3">
              <p className="text-sm font-bold text-amber-900"><ShieldCheck className="inline w-4 h-4 mr-1" />Admin kodunu yazın</p>
              <input value={registrationCode} onChange={(e) => setRegistrationCode(e.target.value)} placeholder="Kod" type="password" className="w-full border border-amber-200 rounded-xl p-3 text-sm outline-none" />
              <button type="button" onClick={handleAdminCode} className="w-full py-3 rounded-xl bg-neutral-900 text-white font-bold text-sm cursor-pointer">Kodu təsdiqlə</button>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-12 lg:px-16 pt-5 sm:pt-7 pb-16 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="border-b border-[#e8e3e1] pb-5">
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#111]">
          Şəxsi Kabinet
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Sifarişlərinizi izləyin və profil parametrlərinizi tənzimləyin
        </p>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto no-scrollbar pb-1">
          <button
            id="tab-btn-overview"
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#111] text-white shadow-xs font-bold'
                : 'bg-white border border-[#e8e3e1] text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Ümumi məlumat</span>
          </button>

          <button
            id="tab-btn-orders"
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#111] text-white shadow-xs font-bold'
                : 'bg-white border border-[#e8e3e1] text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Sifarişlərim</span>
          </button>

          <button
            id="tab-btn-logout"
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-all ml-auto cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Çıxış et</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Ümumi Məlumat */}
      {activeTab === 'overview' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white border border-[#e8e3e1] rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-lg shadow-sm">
              {formData.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#111]">{formData.fullName}</h3>
              <p className="text-xs text-neutral-500">{formData.phone}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Ad və Soyad</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Telefon nömrəsi</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">E-poçt ünvanı</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Çatdırılma Ünvanı</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Kuryer üçün qeydlər</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              id="btn-save-profile"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#111] hover:bg-black text-white font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Dəyişiklikləri Yadda Saxla</span>
            </button>
          </form>
          </div>

          {!profile && <section className="bg-white border border-[#e8e3e1] rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#111]">Qeydiyyatdan keç</h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">Sifarişlərinizi daha rahat idarə etmək üçün məlumatlarınızı əlavə edin.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button type="button" onClick={() => setRegistrationMethod('google')} className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer ${registrationMethod === 'google' ? 'border-[#111] bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}>
                <Chrome className="w-4 h-4" /> Google ilə qeydiyyat
              </button>
              <button type="button" onClick={() => setRegistrationMethod('phone')} className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer ${registrationMethod === 'phone' ? 'border-[#111] bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}>
                <Phone className="w-4 h-4" /> Nömrə ilə qeydiyyat
              </button>
              <button type="button" onClick={() => setRegistrationMethod('gmail')} className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer ${registrationMethod === 'gmail' ? 'border-[#111] bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}>
                <Mail className="w-4 h-4" /> Gmail ilə qeydiyyat
              </button>
            </div>

            <form onSubmit={handleRegistration} className="space-y-4">
              {registrationMethod === 'phone' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={registrationFirstName} onChange={(e) => setRegistrationFirstName(cleanName(e.target.value))} placeholder="Ad" minLength={4} className="w-full border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-black" required />
                  <input value={registrationLastName} onChange={(e) => setRegistrationLastName(cleanName(e.target.value))} placeholder="Soyad" minLength={4} className="w-full border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-black" required />
                  <input value={registrationPhone} onChange={(e) => setRegistrationPhone(formatAzerbaijaniPhone(e.target.value))} placeholder="Telefon nömrəsi" type="tel" inputMode="numeric" maxLength={13} pattern="0[0-9]{2}-[0-9]{3}-[0-9]{2}-[0-9]{2}" className="w-full border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-black sm:col-span-2" required />
                </div>
              ) : (
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input value={registrationEmail} onChange={(e) => setRegistrationEmail(e.target.value)} placeholder="Gmail ünvanınızı yazın" type="email" className="w-full border border-neutral-200 rounded-xl py-3 pl-10 pr-3 text-sm outline-none focus:border-black" required />
                </div>
              )}

              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input value={registrationAddress} onChange={(e) => setRegistrationAddress(e.target.value)} placeholder="Çatdırılma ünvanı (sonra da əlavə edə bilərsiniz)" className="w-full border border-neutral-200 rounded-xl py-3 pl-10 pr-3 text-sm outline-none focus:border-black" />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-[#111] hover:bg-black text-white font-bold text-sm cursor-pointer">
                {registrationMethod === 'phone' ? 'Nömrə ilə qeydiyyatdan keç' : 'Gmail ilə qeydiyyatdan keç'}
              </button>
            </form>

            {isCodeRequested && (
              <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900"><ShieldCheck className="w-4 h-4" /> Admin kodu</div>
                <input value={registrationCode} onChange={(e) => setRegistrationCode(e.target.value)} placeholder="Kodu yazın" type="password" className="w-full border border-amber-200 rounded-xl p-3 text-sm outline-none focus:border-black" />
                <button type="button" onClick={handleAdminCode} className="w-full py-3 rounded-xl bg-neutral-900 text-white font-bold text-sm cursor-pointer">Kodu təsdiqlə</button>
              </div>
            )}
          </section>}
        </div>
      )}

      {/* Tab 2: Sifarişlərim */}
      {activeTab === 'orders' && (
        <div className="max-w-3xl space-y-4">
          {orders.length > 0 ? orders.map((order) => (
            <div key={order.id} className="bg-white border border-[#e8e3e1] rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-3">
                <div>
                  <span className="text-xs font-bold text-[#111]">Sifariş #{order.id}</span>
                  <p className="text-[11px] text-neutral-400">{new Date(order.date).toLocaleString('az-AZ')}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{order.status}</span>
                </span>
              </div>
              <div className="text-xs text-neutral-700 space-y-1">
                <p className="font-semibold">{order.items.map((item) => `${item.name} x ${item.quantity}`).join(', ')}</p>
                <p className="text-neutral-500">Çatdırılma: {order.address || 'Ünvan qeyd edilməyib'}</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#111]">
                <span>Ümumi Məbləğ:</span>
                <span>{order.total.toFixed(2)} ₼</span>
              </div>
            </div>
          )) : (
            <div className="bg-white border border-[#e8e3e1] rounded-2xl p-8 text-center text-sm text-neutral-500">
              Hələ heç bir sifarişiniz yoxdur.
            </div>
          )}

          <div className="text-center py-4">
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-bold text-[#111] hover:underline cursor-pointer"
            >
              Cari Səbət və Sifariş detallarına baxmaq →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
