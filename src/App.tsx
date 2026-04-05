import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppProvider, useApp } from '@/store';
import { Navigation } from '@/components/Navigation';
import { CartDrawer } from '@/components/CartDrawer';
import { Toaster } from '@/components/ui/sonner';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductPage } from '@/pages/ProductPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderSuccessPage } from '@/pages/OrderSuccessPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { OrdersPage } from '@/pages/OrdersPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LanguageProvider, useLanguage } from '@/i18n';

function AppContent() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-cheetah-black text-white">
      <Navigation />
      <CartDrawer />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:category" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={
            state.isAuthenticated ? <CheckoutPage /> : <Navigate to="/login" />
          } />
          <Route path="/order-success" element={
            state.isAuthenticated ? <OrderSuccessPage /> : <Navigate to="/login" />
          } />
          <Route path="/orders" element={
            state.isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />
          } />
          <Route path="/profile" element={
            state.isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />
          } />
          <Route path="/admin" element={
            state.isAdmin ? <AdminDashboard /> : <Navigate to="/login" />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <div className="grain-overlay" />
    </div>
  );
}

function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-cheetah-dark border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading font-black text-2xl text-gradient-gold mb-4">CHEETAH</h3>
            <p className="text-white/60 text-sm">
              {t('Bold fragrances crafted for predators who move fast and leave a trail.')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t('Shop')}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/shop/men" className="hover:text-gold transition-colors">{t('Men')}</Link></li>
              <li><Link to="/shop/women" className="hover:text-gold transition-colors">{t('Women')}</Link></li>
              <li><Link to="/shop/unisex" className="hover:text-gold transition-colors">{language === 'ar' ? 'للجنسين' : 'Unisex'}</Link></li>
              <li><Link to="/shop/luxury" className="hover:text-gold transition-colors">{t('Luxury')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t('Help')}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-gold transition-colors">{t('Shipping')}</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">{t('Returns')}</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">{t('Care')}</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">{t('Contact')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t('Contact')}</h4>
            <p className="text-white/60 text-sm mb-2">
              support@cheetahperfumes.com
            </p>
            <p className="text-white/60 text-sm">
              +20 100 000 0000
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <AppProvider>
          <AppContent />
          <Toaster theme="dark" position="top-right" />
        </AppProvider>
      </LanguageProvider>
    </Router>
  );
}
