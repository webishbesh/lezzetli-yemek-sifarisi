/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FoodItem, CartItem, Order, PageId, ToastMessage, UserProfile } from './types';
import { INITIAL_FOODS } from './data/foods';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { MenuPage } from './components/MenuPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { ProfilePage } from './components/ProfilePage';
import { FavoritesPage } from './components/FavoritesPage';
import { OrdersPage } from './components/OrdersPage';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AdminModals } from './components/AdminModals';
import { ToastContainer } from './components/Toast';
import { SearchModal } from './components/SearchModal';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [profileTab, setProfileTab] = useState<string>('overview');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('lezzetliUserProfile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [foods, setFoods] = useState<FoodItem[]>(() => {
    try {
      const savedImages = JSON.parse(localStorage.getItem('lezzetliFoodImages') || '{}');
      return INITIAL_FOODS.map((food, idx) => {
        if (savedImages[food.id] || savedImages[idx]) {
          return { ...food, image: savedImages[food.id] || savedImages[idx] };
        }
        return food;
      });
    } catch {
      return INITIAL_FOODS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('lezzetliOrders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lezzetliFavorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-1), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleFavorite = (food: FoodItem) => {
    setFavorites((prev) => {
      const isFav = prev.includes(food.id);
      let updated: string[];
      if (isFav) {
        updated = prev.filter((id) => id !== food.id);
        showToast(`"${food.name}" seçilmişlərdən çıxarıldı`, 'info');
      } else {
        updated = [...prev, food.id];
        showToast(`"${food.name}" seçilmişlərə əlavə edildi`, 'success');
      }
      try {
        localStorage.setItem('lezzetliFavorites', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save favorites', e);
      }
      return updated;
    });
  };

  const handleNavigate = (page: PageId, tab?: string) => {
    if (tab) {
      setProfileTab(tab);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem('lezzetliUserProfile', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save user profile', e);
    }
    showToast('Profiliniz uğurla yaradıldı', 'success');
  };

  const handleSaveCustomerInfo = (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem('lezzetliUserProfile', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save customer info', e);
    }
  };

  const handleOrderCreated = (order: Order) => {
    setOrders((prev) => {
      const updated = [order, ...prev];
      try {
        localStorage.setItem('lezzetliOrders', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save order history', e);
      }
      return updated;
    });
  };

  const handleLogout = () => {
    setUserProfile(null);
    setCart([]);
    setCurrentPage('home');
    setProfileTab('overview');
    localStorage.removeItem('lezzetliUserProfile');
    showToast('Hesabdan çıxış edildi', 'info');
  };

  const handleAddToCart = (food: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { food, quantity: 1 }];
    });
    showToast(`"${food.name}" səbətə əlavə edildi`, 'success');
  };

  const handleUpdateCartQuantity = (foodId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.food.id === foodId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (foodId: string) => {
    setCart((prev) => prev.filter((item) => item.food.id !== foodId));
    showToast('Məhsul səbətdən silindi', 'info');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleUpdateFoodImage = (foodId: string, newImageUrl: string) => {
    setFoods((prev) => {
      const updated = prev.map((f) => (f.id === foodId ? { ...f, image: newImageUrl } : f));
      try {
        const savedImages = JSON.parse(localStorage.getItem('lezzetliFoodImages') || '{}');
        savedImages[foodId] = newImageUrl;
        localStorage.setItem('lezzetliFoodImages', JSON.stringify(savedImages));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });
  };

  const handleResetImages = () => {
    try {
      localStorage.removeItem('lezzetliFoodImages');
      setFoods(INITIAL_FOODS);
      showToast('Bütün şəkillər ilkin vəziyyətinə qaytarıldı', 'info');
      setIsUploadModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f4] text-[#111] font-sans flex flex-col justify-between selection:bg-[#df101a] selection:text-white">
      {/* Site Shell Outer Container matching authentic look */}
      <div className="w-full max-w-[1340px] mx-auto sm:my-5 sm:rounded-3xl bg-[#fbfaf9] sm:border border-[#eee9e7] overflow-hidden sm:shadow-[0_18px_60px_rgba(20,10,10,0.05)] flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <Header
            currentPage={currentPage}
            onNavigate={handleNavigate}
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAdmin={() => setIsAuthModalOpen(true)}
            onSearchClick={() => setIsSearchModalOpen(true)}
          />

          {/* Main Content Area */}
          <main className="min-h-[650px] transition-opacity duration-200">
            {currentPage === 'home' && (
              <HomePage
                foods={foods}
                onNavigate={handleNavigate}
                onAddToCart={handleAddToCart}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            )}

            {currentPage === 'menu' && (
              <MenuPage
                foods={foods}
                onAddToCart={handleAddToCart}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {currentPage === 'contact' && (
              <ContactPage
                onShowToast={showToast}
              />
            )}

            {currentPage === 'profile' && (
              <ProfilePage
                onNavigate={handleNavigate}
                onShowToast={showToast}
                onOpenAdminPanel={() => setIsUploadModalOpen(true)}
                profile={userProfile}
                orders={orders}
                onRegister={handleRegister}
                onLogout={handleLogout}
              />
            )}

            {currentPage === 'favorites' && (
              <FavoritesPage
                foods={foods}
                favorites={favorites}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {currentPage === 'orders' && (
              <OrdersPage
                cart={cart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveFromCart}
                onClearCart={handleClearCart}
                onNavigateToMenu={() => handleNavigate('menu')}
                onShowToast={showToast}
                onSaveCustomerInfo={handleSaveCustomerInfo}
                onOrderCreated={handleOrderCreated}
              />
            )}
          </main>
        </div>

        {/* Footer */}
        <div className="pb-16 sm:pb-0">
          <Footer onNavigate={handleNavigate} onShowToast={showToast} />
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav
        currentPage={currentPage}
        activeProfileTab={profileTab}
        onNavigate={handleNavigate}
        ordersCount={totalCartCount}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onShowToast={showToast}
        onNavigateToMenu={() => handleNavigate('menu')}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        foods={foods}
        onAddToCart={handleAddToCart}
        onNavigateToMenu={() => handleNavigate('menu')}
      />

      {/* Admin Modals */}
      <AdminModals
        isAuthOpen={isAuthModalOpen}
        onCloseAuth={() => setIsAuthModalOpen(false)}
        isUploadOpen={isUploadModalOpen}
        onCloseUpload={() => setIsUploadModalOpen(false)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        foods={foods}
        onUpdateFoodImage={handleUpdateFoodImage}
        onResetImages={handleResetImages}
        onShowToast={showToast}
      />

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
