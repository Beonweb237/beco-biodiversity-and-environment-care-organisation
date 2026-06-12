import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', path: '/' },
  { label: 'À propos', path: '/about' },
  { label: 'Projets', path: '/projects' },
  { label: 'Actualités', path: '/news' },
  { label: 'Équipe', path: '/team' },
  { label: 'S\'impliquer', path: '/involved' },
  { label: 'Contact', path: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';
  const showBg = scrolled || !isHome;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[88px] transition-all duration-400 ${
        showBg
          ? 'bg-white/95 backdrop-blur-sm shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Leaf className={`w-6 h-6 ${showBg ? 'text-beco-primary' : 'text-white'}`} />
          <span
            className={`font-playfair font-bold italic text-xl ${
              showBg ? 'text-beco-primary' : 'text-white'
            }`}
          >
            BECO
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-raleway font-medium text-[13px] uppercase tracking-[0.1em] transition-colors duration-300 ${
                location.pathname === link.path
                  ? showBg
                    ? 'text-beco-primary'
                    : 'text-white'
                  : showBg
                  ? 'text-beco-dark/70 hover:text-beco-primary'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            to="/involved"
            className="hidden sm:inline-flex items-center justify-center bg-beco-primary text-white rounded-full px-6 py-2.5 font-raleway font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:bg-beco-primary-light"
          >
            Faire un don
          </Link>
          <button
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
        <div className="lg:hidden absolute top-[88px] left-0 right-0 bg-white shadow-lg py-6 px-6">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-raleway font-medium text-sm uppercase tracking-[0.1em] py-2 ${
                  location.pathname === link.path
                    ? 'text-beco-primary'
                    : 'text-beco-dark/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/involved"
              className="btn-primary mt-2 text-center"
            >
              Faire un don
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
