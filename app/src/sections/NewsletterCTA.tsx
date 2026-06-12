import { useScrollReveal } from '../hooks/useScrollReveal';

export default function NewsletterCTA() {
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.2 });

  return (
    <section ref={ref} className="relative h-[400px] overflow-hidden">
      <img
        src="/assets/newsletter-bg.jpg"
        alt="Forêt tropicale"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/70 to-[#1A1A1A]/85" />

      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6">
        <div data-reveal>
          <h2 className="font-playfair italic text-[28px] sm:text-[32px] text-white">
            Restez informé de nos actions
          </h2>
        </div>
        <div data-reveal>
          <p className="font-raleway text-[15px] text-white/80 leading-[1.7] max-w-[560px] mt-4">
            Inscrivez-vous à notre newsletter pour recevoir nos actualités,
            rapports d'activités et opportunités de collaboration.
          </p>
        </div>
        <div data-reveal className="mt-7 w-full max-w-[480px]">
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-5 py-3.5 rounded-full border border-white/30 bg-white/10 text-white placeholder:text-white/50 font-raleway text-[14px] outline-none focus:border-white/50 transition-colors"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              S'inscrire
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
