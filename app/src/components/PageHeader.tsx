import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  image: string;
}

export default function PageHeader({ title, image }: PageHeaderProps) {
  const breadcrumbs = [
    { label: 'Accueil', path: '/' },
    { label: title, path: '#' },
  ];

  return (
    <section className="relative w-full h-[50vh] min-h-[320px] overflow-hidden">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#1A1A1A]/55" />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
        <h1 className="font-playfair font-bold italic text-[36px] sm:text-[48px] text-white leading-[1.15]">
          {title}
        </h1>
        <nav className="flex items-center gap-2 mt-3">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-white/40">/</span>
              )}
              {i === 0 ? (
                <Link
                  to={crumb.path}
                  className="font-raleway text-[13px] text-white/60 hover:text-white transition-colors duration-300"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-raleway text-[13px] text-white/60">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
