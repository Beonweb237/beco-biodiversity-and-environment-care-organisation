import { Link } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';

const quickLinks1 = [
  { label: 'ACCUEIL', path: '/' },
  { label: 'À PROPOS', path: '/about' },
  { label: 'PROJETS', path: '/projects' },
  { label: 'ACTUALITÉS', path: '/news' },
];

const quickLinks2 = [
  { label: 'ÉQUIPE', path: '/team' },
  { label: 'S\'IMPLIQUER', path: '/involved' },
  { label: 'CONTACT', path: '/contact' },
  { label: 'MENTIONS LÉGALES', path: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-beco-primary text-white">
      <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Colonne 1 - Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-beco-secondary" />
              <span className="font-playfair font-bold italic text-xl text-white">
                BECO
              </span>
            </div>
            <p className="font-raleway text-[13px] text-white/70 leading-[1.7]">
              Biodiversity and Environment Care Organisation — Conservation de la
              biodiversité et protection de l'environnement au Cameroun et en
              Afrique.
            </p>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div>
            <nav className="flex flex-col gap-3">
              {quickLinks1.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="font-raleway font-medium text-[11px] uppercase tracking-[0.12em] text-white/60 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Colonne 3 - Liens rapides suite */}
          <div>
            <nav className="flex flex-col gap-3">
              {quickLinks2.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="font-raleway font-medium text-[11px] uppercase tracking-[0.12em] text-white/60 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Colonne 4 - Contact */}
          <div>
            <p className="font-raleway text-[13px] text-white/70 leading-[1.7] mb-2">
              Yaoundé, Région du Centre, Cameroun
            </p>
            <a
              href="mailto:beco@afrotropical.org"
              className="block font-raleway text-[13px] text-white/70 hover:text-white transition-colors duration-300 mb-1"
            >
              beco@afrotropical.org
            </a>
            <a
              href="tel:+237657902784"
              className="block font-raleway text-[13px] text-white/70 hover:text-white transition-colors duration-300"
            >
              +237 6 57 90 27 84
            </a>
          </div>

          {/* Colonne 5 - Newsletter */}
          <div>
            <h4 className="font-playfair italic text-base text-white mb-4">
              Newsletter
            </h4>
            <div className="flex items-center border-b border-white/30 pb-2">
              <input
                type="email"
                placeholder="Votre email"
                className="bg-transparent text-white placeholder:text-white/50 font-raleway text-[13px] flex-1 outline-none"
              />
              <button className="flex items-center gap-1 font-raleway font-medium text-[12px] uppercase text-white hover:text-beco-secondary transition-colors duration-300">
                S'inscrire
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barre inférieure */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-6 text-center">
          <p className="font-raleway text-[12px] text-white/40">
            &copy; 2026 BECO. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
