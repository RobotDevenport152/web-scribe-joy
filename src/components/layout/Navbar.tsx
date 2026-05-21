import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Globe, Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { language, setLanguage, mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { currency, setCurrency } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/#about', label: t('nav.about') },
    { to: '/#fiber', label: t('nav.whyAlpaca') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/#certifications', label: t('nav.certifications') },
  ];

  const bgClass = scrolled || !isHome
    ? 'bg-pa-green/95 backdrop-blur-md'
    : 'bg-transparent';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-lg tracking-[0.3em] uppercase text-pa-ivory">
          PACIFIC ALPACA
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs tracking-[0.15em] uppercase font-body text-pa-ivory/80 hover:text-pa-gold-lt transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'NZD' | 'CNY' | 'USD')}
            className="bg-transparent text-xs font-body border border-pa-ivory/20 rounded-none px-2 py-1 text-pa-ivory/80"
          >
            <option value="CNY" className="bg-pa-green">CNY</option>
            <option value="NZD" className="bg-pa-green">NZD</option>
            <option value="USD" className="bg-pa-green">USD</option>
          </select>

          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="flex items-center gap-1 text-xs font-body text-pa-ivory/80 hover:text-pa-gold-lt transition-colors"
          >
            <Globe className="w-4 h-4" />
            {language === 'zh' ? 'EN' : '中文'}
          </button>

          <button onClick={toggleCart} className="relative text-pa-ivory/80 hover:text-pa-gold-lt transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pa-gold text-pa-ivory text-xs rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button
            className="md:hidden text-pa-ivory/80"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-pa-green/98 backdrop-blur-md border-t border-pa-gold/20">
          <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm tracking-[0.15em] uppercase font-body py-2 text-pa-ivory/80 hover:text-pa-gold-lt transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
