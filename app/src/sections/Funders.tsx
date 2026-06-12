import { useScrollReveal } from '../hooks/useScrollReveal';

const funders = [
  { name: 'Rufford Foundation', abbr: 'RUFFORD' },
  { name: '1Wild Foundation', abbr: '1WILD' },
  { name: 'MBZ Species Conservation Fund', abbr: 'MBZ' },
  { name: 'IDEA WILD', abbr: 'IDEA WILD' },
  { name: 'British Ecological Society', abbr: 'BES' },
];

export default function Funders() {
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.1 });

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12" data-reveal>
          <p className="section-label">NOS FINANCEURS ET PARTENAIRES</p>
          <h2 className="font-playfair italic text-[28px] text-beco-dark mt-3">
            Ils nous font confiance
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12">
          {funders.map((funder, i) => (
            <div
              key={i}
              data-reveal
              className="group flex items-center justify-center"
            >
              <span className="font-raleway font-bold text-[22px] sm:text-[26px] tracking-[0.15em] text-beco-dark/40 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:text-beco-primary transition-all duration-300 cursor-default">
                {funder.abbr}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
