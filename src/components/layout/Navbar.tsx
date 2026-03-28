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
    ? 'bg-espresso/95 backdrop-blur-md'
    : 'bg-transparent';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-lg tracking-[0.3em] uppercase" style={{ color: 'hsl(40 33% 96%)' }}>
          PACIFIC ALPACAS
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs tracking-[0.15em] uppercase font-body transition-colors duration-200"
              style={{ color: 'hsl(40 33% 96% / 0.8)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'hsl(43 85% 38%)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'hsl(40 33% 96% / 0.8)'; }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'NZD' | 'CNY' | 'USD')}
            className="bg-transparent text-xs font-body border border-cream/20 rounded px-2 py-1"
            style={{ color: 'hsl(40 33% 96% / 0.8)' }}
          >
            <option value="CNY" className="bg-espresso">CNY</option>
            <option value="NZD" className="bg-espresso">NZD</option>
            <option value="USD" className="bg-espresso">USD</option>
          </select>

          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="flex items-center gap-1 text-xs font-body"
            style={{ color: 'hsl(40 33% 96% / 0.8)' }}
          >
            <Globe className="w-4 h-4" />
            {language === 'zh' ? 'EN' : '中文'}
          </button>

          <button
            onClick={toggleCart}
            className="relative"
            style={{ color: 'hsl(40 33% 96% / 0.8)' }}
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-xs rounded-full flex items-center justify-center" style={{ color: 'hsl(40 33% 96%)' }}>
                {totalItems}
              </span>
            )}
          </button>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'hsl(40 33% 96% / 0.8)' }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-espresso/98 backdrop-blur-md border-t" style={{ borderColor: 'hsl(43 85% 38% / 0.2)' }}>
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm tracking-[0.15em] uppercase font-body py-2"
                style={{ color: 'hsl(40 33% 96% / 0.8)' }}
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
