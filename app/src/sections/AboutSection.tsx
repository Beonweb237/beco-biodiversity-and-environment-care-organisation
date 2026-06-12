import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function AboutSection() {
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.2 });

  return (
    <section ref={ref} className="bg-white py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Texte */}
        <div data-reveal>
          <p className="section-label">À PROPOS DE BECO</p>
          <h2 className="section-title mt-4">
            Une organisation dédiée à la conservation de la biodiversité africaine
          </h2>
          <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-5">
            BECO est une organisation non gouvernementale apolitique et sans but
            lucratif basée à Yaoundé, Cameroun. Nous œuvrons pour la conservation
            de la biodiversité, la protection de l'environnement et le
            développement durable à travers la recherche scientifique, l'éducation
            et l'engagement communautaire.
          </p>
          <Link to="/about" className="btn-outline mt-7">
            En savoir plus &rarr;
          </Link>
        </div>

        {/* Image */}
        <div data-reveal className="overflow-hidden rounded-lg">
          <img
            src="/assets/about-home.jpg"
            alt="Équipe BECO sur le terrain"
            className="w-full aspect-[4/3] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
