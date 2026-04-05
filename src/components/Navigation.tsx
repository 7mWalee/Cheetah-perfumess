import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, LogOut, Package } from 'lucide-react';
import { useApp } from '@/store';
import { useLanguage } from '@/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navigation() {
  const { state, dispatch, getCartCount } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: searchQuery });
      navigate('/shop');
      setIsSearchOpen(false);
    }
  };

  const cartCount = getCartCount();

  const navLinks = [
    { label: t('Shop'), href: '/shop' },
    { label: t('Men'), href: '/shop/men' },
    { label: t('Women'), href: '/shop/women' },
    { label: t('Luxury'), href: '/shop/luxury' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-cheetah-black/80 backdrop-blur-xl border-b border-gold/15 shadow-[0_10px_40px_rgba(0,0,0,0.35)]' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20 gap-4">
            <Link to="/" className="flex items-center gap-2 premium-panel px-2 py-1">
              <span className="font-heading font-black text-2xl tracking-[0.18em] text-gradient-gold">
                CHEETAH
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-medium transition-all hover:text-gold hover:-translate-y-0.5 ${
                    location.pathname === link.href ? 'text-gold' : 'text-white/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="px-3 py-1.5 rounded-full border border-white/15 text-xs font-semibold text-white/90 hover:text-gold hover:border-gold/40 transition-all"
              >
                {language === 'ar' ? 'EN' : 'AR'}
              </button>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-white/80 hover:text-gold transition-colors"
                aria-label={t('Search')}
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: true })}
                className="p-2 text-white/80 hover:text-gold transition-colors relative"
                aria-label={t('Your Cart')}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-burnt-orange text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {state.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 text-white/80 hover:text-gold transition-colors">
                      <User className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-cheetah-dark border-white/10">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-white">
                        {state.user?.firstName} {state.user?.lastName}
                      </p>
                      <p className="text-xs text-white/60">{state.user?.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={() => navigate('/profile')}
                      className="text-white/80 hover:text-gold focus:text-gold cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t('Profile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/orders')}
                      className="text-white/80 hover:text-gold focus:text-gold cursor-pointer"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      {t('Orders')}
                    </DropdownMenuItem>
                    {state.isAdmin && (
                      <DropdownMenuItem 
                        onClick={() => navigate('/admin')}
                        className="text-white/80 hover:text-gold focus:text-gold cursor-pointer"
                      >
                        <User className="w-4 h-4 mr-2" />
                        {t('Admin Dashboard')}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={() => {
                        dispatch({ type: 'LOGOUT' });
                        navigate('/');
                      }}
                      className="text-white/80 hover:text-red-400 focus:text-red-400 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('Logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-white/80 hover:text-gold transition-colors"
                  aria-label={t('Login')}
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white/80 hover:text-gold transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-cheetah-black/98 flex items-start justify-center pt-32">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/60 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <form onSubmit={handleSearch} className="w-full max-w-2xl px-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search fragrances...')}
              className="w-full bg-transparent border-b-2 border-white/20 focus:border-gold text-3xl font-heading text-white placeholder:text-white/30 py-4 outline-none"
              autoFocus
            />
            <p className="text-white/40 text-sm mt-4">
              {t('Press Enter to search')}
            </p>
          </form>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-cheetah-black pt-20">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-heading font-bold text-white hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!state.isAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-heading font-bold text-white hover:text-gold transition-colors"
                >
                  {t('Login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary"
                >
                  {t('Sign Up')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
