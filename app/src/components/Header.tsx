import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.projects'), path: '/projects' },
    { label: t('nav.news'), path: '/news' },
    { label: t('nav.involved'), path: '/involved' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isHome = location.pathname === '/';
  const showBg = scrolled || !isHome;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-[104px] transition-all duration-400 ${showBg
        ? 'bg-white/95 backdrop-blur-sm shadow-sm'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">

        {/* Logo — agrandi pour que le nom de l'organisation y reste lisible */}
        <Link to="/" className="flex items-center shrink-0" aria-label="BECO — Accueil">
          <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5">
            <img
              src="/assets/logo-icon.png?v=20260801a"
              alt="BECO — Biodiversity and Environmental Care Organisation"
              className="h-full w-full rounded-full object-contain"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = '/assets/logo-icon.svg';
              }}
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">

          {/* Lien Accueil */}
          {navLinks.slice(0, 1).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-raleway font-bold text-[13px] uppercase tracking-[0.1em] transition-colors duration-300 ${location.pathname === link.path
                ? showBg ? 'text-beco-primary' : 'text-white'
                : showBg ? 'text-beco-dark/70 hover:text-beco-primary' : 'text-white/70 hover:text-white'
                }`}
            >
              {link.label}
            </Link>
          ))}

          {/* BECO — mène à « À propos », qui contient l'équipe */}
          <Link
            to="/about"
            className={`font-raleway font-bold text-[13px] uppercase tracking-[0.1em] transition-colors duration-300 ${location.pathname === '/about'
              ? showBg ? 'text-beco-primary' : 'text-white'
              : showBg ? 'text-beco-dark/70 hover:text-beco-primary' : 'text-white/70 hover:text-white'
              }`}
          >
            BECO
          </Link>

          {/* Reste des liens */}
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-raleway font-bold text-[13px] uppercase tracking-[0.1em] transition-colors duration-300 ${location.pathname === link.path
                ? showBg ? 'text-beco-primary' : 'text-white'
                : showBg ? 'text-beco-dark/70 hover:text-beco-primary' : 'text-white/70 hover:text-white'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search + Language + CTA + Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Search */}
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full transition-colors duration-300 ${showBg
                ? 'text-beco-dark/60 hover:text-beco-primary hover:bg-beco-olive-light'
                : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>
            {searchOpen && (
              <div className="absolute end-0 top-full mt-2 w-[280px] bg-white rounded-xl shadow-lg border border-gray-100 p-3">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="flex-1 bg-beco-off-white rounded-lg px-4 py-2.5 font-raleway text-[13px] text-beco-dark outline-none focus:ring-2 focus:ring-beco-primary/30 placeholder:text-beco-dark/40"
                  />
                  <button
                    type="submit"
                    className="bg-beco-primary text-white rounded-lg px-4 py-2.5 font-raleway font-semibold text-xs uppercase tracking-wider hover:bg-beco-primary-light transition-colors duration-300"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>

          <LanguageSwitcher showBg={showBg} />

          <Link
            to="/involved"
            className="hidden sm:inline-flex items-center justify-center bg-beco-primary text-white rounded-full px-6 py-2.5 font-raleway font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:bg-beco-primary-light"
          >
            {t('common.donate')}
          </Link>

          <button
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className={`w-6 h-6 ${showBg ? 'text-beco-dark' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${showBg ? 'text-beco-dark' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-[104px] inset-x-0 bg-white shadow-lg py-6 px-6 max-h-[70vh] overflow-auto">
          <nav className="flex flex-col gap-4">
            {/* Accueil */}
            <Link
              to="/"
              className={`font-raleway font-medium text-sm uppercase tracking-[0.1em] py-2 ${location.pathname === '/' ? 'text-beco-primary' : 'text-beco-dark/70'
                }`}
            >
              {t('nav.home')}
            </Link>

            {/* BECO — mène à « À propos », qui contient l'équipe */}
            <Link
              to="/about"
              className={`font-raleway font-medium text-sm uppercase tracking-[0.1em] py-2 ${location.pathname === '/about' ? 'text-beco-primary' : 'text-beco-dark/70'
                }`}
            >
              BECO
            </Link>

            {/* Reste des liens */}
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-raleway font-medium text-sm uppercase tracking-[0.1em] py-2 ${location.pathname === link.path ? 'text-beco-primary' : 'text-beco-dark/70'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-beco-olive-light pt-4 mt-1">
              <p className="font-raleway font-semibold text-[10px] uppercase tracking-[0.16em] text-beco-dark/40 mb-2.5">
                Langue
              </p>
              <LanguageSwitcher showBg variant="inline" />
            </div>
            <Link to="/involved" className="btn-primary mt-2 text-center">
              {t('common.donate')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
