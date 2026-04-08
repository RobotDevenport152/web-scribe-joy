import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Globe, Menu, X, User, ChevronDown, LogOut, Package, Settings, LayoutDashboard, Sprout } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { language, setLanguage, mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { currency, setCurrency } = useCartStore();
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGrower, setIsGrower] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isHome = location.pathname === '/';
  const lang = language;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); setIsGrower(false); return; }
    supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }).then(({ data }) => setIsAdmin(!!data));
    supabase.rpc('has_role', { _user_id: user.id, _role: 'grower' }).then(({ data }) => setIsGrower(!!data));
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/shop', label: lang === 'zh' ? '产品展示' : 'Shop' },
    { to: '/compare', label: lang === 'zh' ? '系列对比' : 'Compare' },
    { to: '/traceability', label: lang === 'zh' ? '溯源查询' : 'Traceability' },
    { to: '/growers-info', label: lang === 'zh' ? '养殖户' : 'Growers' },
    { to: '/contact', label: lang === 'zh' ? '联系我们' : 'Contact' },
  ];

  const bgClass = scrolled || !isHome
    ? 'bg-pa-green/95 backdrop-blur-md shadow-md'
    : 'bg-transparent';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-lg tracking-[0.3em] uppercase text-pa-ivory">
          PACIFIC ALPACAS
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-xs tracking-[0.15em] uppercase font-body transition-colors duration-200 ${
                location.pathname === link.to
                  ? 'text-pa-gold-lt'
                  : 'text-pa-ivory/80 hover:text-pa-gold-lt'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Currency */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'NZD' | 'CNY' | 'USD')}
            className="bg-transparent text-xs font-body border border-pa-ivory/20 rounded px-2 py-1 text-pa-ivory/80 cursor-pointer"
          >
            <option value="CNY" className="bg-pa-green">CNY</option>
            <option value="NZD" className="bg-pa-green">NZD</option>
            <option value="USD" className="bg-pa-green">USD</option>
          </select>

          {/* Language */}
          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="flex items-center gap-1 text-xs font-body text-pa-ivory/80 hover:text-pa-gold-lt transition-colors"
          >
            <Globe className="w-4 h-4" />
            {language === 'zh' ? 'EN' : '中文'}
          </button>

          {/* Cart */}
          <button onClick={toggleCart} className="relative text-pa-ivory/80 hover:text-pa-gold-lt transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pa-gold text-pa-ivory text-[10px] rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>

          {/* User dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1 text-pa-ivory/80 hover:text-pa-gold-lt transition-colors"
            >
              <User className="w-5 h-5" />
              <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-pa-green/98 backdrop-blur-md border border-pa-gold/20 rounded-lg shadow-xl py-2 z-50">
                {!loading && !user ? (
                  <>
                    <div className="px-4 py-2 text-xs text-pa-ivory/50 font-body uppercase tracking-wider border-b border-pa-gold/10 mb-1">
                      {lang === 'zh' ? '账户' : 'Account'}
                    </div>
                    <Link to="/login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-pa-ivory/80 hover:bg-pa-gold/10 hover:text-pa-gold-lt transition-colors">
                      <User className="w-4 h-4" />{lang === 'zh' ? '登录' : 'Sign In'}
                    </Link>
                    <Link to="/register" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-pa-ivory/80 hover:bg-pa-gold/10 hover:text-pa-gold-lt transition-colors">
                      <User className="w-4 h-4" />{lang === 'zh' ? '注册' : 'Register'}
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 text-xs text-pa-ivory/50 truncate border-b border-pa-gold/10 mb-1">
                      {user?.email}
                    </div>
                    <Link to="/my-orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-pa-ivory/80 hover:bg-pa-gold/10 hover:text-pa-gold-lt transition-colors">
                      <Package className="w-4 h-4" />{lang === 'zh' ? '我的订单' : 'My Orders'}
                    </Link>
                    {isGrower && (
                      <Link to="/grower/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-pa-ivory/80 hover:bg-pa-gold/10 hover:text-pa-gold-lt transition-colors">
                        <Sprout className="w-4 h-4" />{lang === 'zh' ? '养殖户控制台' : 'Grower Dashboard'}
                      </Link>
                    )}
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-pa-ivory/80 hover:bg-pa-gold/10 hover:text-pa-gold-lt transition-colors">
                        <LayoutDashboard className="w-4 h-4" />{lang === 'zh' ? '管理后台' : 'Admin Panel'}
                      </Link>
                    )}
                    <div className="border-t border-pa-gold/10 mt-1 pt-1">
                      <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-body text-pa-ivory/60 hover:bg-pa-gold/10 hover:text-destructive transition-colors">
                        <LogOut className="w-4 h-4" />{lang === 'zh' ? '退出登录' : 'Sign Out'}
                      </button>
                    </div>
                  </>
                )}

                {/* Always-visible links */}
                <div className="border-t border-pa-gold/10 mt-1 pt-1">
                  <Link to="/returns" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-pa-ivory/80 hover:bg-pa-gold/10 hover:text-pa-gold-lt transition-colors">
                    <Package className="w-4 h-4" />{lang === 'zh' ? '退换货政策' : 'Returns'}
                  </Link>
                  <Link to="/wholesale" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-pa-ivory/80 hover:bg-pa-gold/10 hover:text-pa-gold-lt transition-colors">
                    <Settings className="w-4 h-4" />{lang === 'zh' ? '批发合作' : 'Wholesale'}
                  </Link>
                  <Link to="/china" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-pa-ivory/80 hover:bg-pa-gold/10 hover:text-pa-gold-lt transition-colors">
                    <Globe className="w-4 h-4" />{lang === 'zh' ? '中国官网' : 'China Site'}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
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
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm tracking-[0.15em] uppercase font-body py-3 text-pa-ivory/80 hover:text-pa-gold-lt transition-colors border-b border-pa-gold/10"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-1">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-body py-3 text-pa-ivory/80 hover:text-pa-gold-lt border-b border-pa-gold/10">
                    {lang === 'zh' ? '登录' : 'Sign In'}
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-sm font-body py-3 text-pa-ivory/80 hover:text-pa-gold-lt border-b border-pa-gold/10">
                    {lang === 'zh' ? '注册' : 'Register'}
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className="text-sm font-body py-3 text-pa-ivory/80 hover:text-pa-gold-lt border-b border-pa-gold/10">
                    {lang === 'zh' ? '我的订单' : 'My Orders'}
                  </Link>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm font-body py-3 text-pa-ivory/80 hover:text-pa-gold-lt border-b border-pa-gold/10">{lang === 'zh' ? '管理后台' : 'Admin'}</Link>}
                  {isGrower && <Link to="/grower/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm font-body py-3 text-pa-ivory/80 hover:text-pa-gold-lt border-b border-pa-gold/10">{lang === 'zh' ? '养殖户控制台' : 'Grower Dashboard'}</Link>}
                  <button onClick={handleSignOut} className="text-left text-sm font-body py-3 text-pa-ivory/60 hover:text-destructive">
                    {lang === 'zh' ? '退出登录' : 'Sign Out'}
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
