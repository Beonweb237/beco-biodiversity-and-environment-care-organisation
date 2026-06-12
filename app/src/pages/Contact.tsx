import PageHeader from '../components/PageHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { MapPin, Mail, Phone, Globe, Facebook, Instagram, Linkedin } from 'lucide-react';

const contactItems = [
  { icon: MapPin, label: 'ADRESSE', value: 'Yaoundé, Région du Centre, Cameroun', href: null },
  { icon: Mail, label: 'EMAIL', value: 'beco@afrotropical.org', href: 'mailto:beco@afrotropical.org' },
  { icon: Phone, label: 'TÉLÉPHONE', value: '+237 6 57 90 27 84', href: 'tel:+237657902784' },
  { icon: Globe, label: 'SITE WEB', value: 'www.beco-afrotropical.org', href: 'https://www.beco-afrotropical.org' },
];

const socials = [
  { name: 'Facebook', icon: Facebook },
  { name: 'Instagram', icon: Instagram },
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'X', icon: null },
];

export default function Contact() {
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.2 });
  const mapRef = useScrollReveal<HTMLElement>({});

  return (
    <>
      <PageHeader title="Contactez-nous" image="/assets/contact-header.jpg" />

      <section ref={ref} className="bg-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-[7fr_5fr] gap-16">
          {/* Form */}
          <div data-reveal>
            <p className="section-label">ENVOYEZ-NOUS UN MESSAGE</p>
            <h2 className="font-playfair italic text-[28px] text-beco-dark leading-[1.3] mt-3">
              Nous sommes à votre écoute
            </h2>
            <p className="font-raleway text-[14px] text-beco-dark/70 leading-[1.7] mt-3">
              Vous avez une question, un projet de collaboration ou souhaitez en savoir plus
              sur nos activités ? N'hésitez pas à nous contacter. Notre équipe vous répondra
              dans les plus brefs délais.
            </p>
            <form className="mt-8 flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input type="text" placeholder="Votre nom" className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors" />
                <input type="text" placeholder="Votre prénom" className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors" />
              </div>
              <input type="email" placeholder="Votre adresse email" className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors" />
              <input type="text" placeholder="Sujet" className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors" />
              <select className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors bg-white">
                <option value="">Type de demande</option>
                <option value="info">Information générale</option>
                <option value="partnership">Partenariat</option>
                <option value="research">Projet de recherche</option>
                <option value="volunteer">Bénévolat</option>
                <option value="donation">Don</option>
                <option value="other">Autre</option>
              </select>
              <textarea placeholder="Votre message..." rows={6} className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors resize-none" />
              <button type="submit" className="btn-primary self-start">
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Info */}
          <div data-reveal>
            <div className="bg-beco-off-white rounded-xl p-10">
              <h3 className="font-raleway font-semibold text-[16px] text-beco-dark mb-6">
                Informations de contact
              </h3>
              <div className="space-y-6">
                {contactItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <item.icon className="w-5 h-5 text-beco-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-raleway font-medium text-[12px] uppercase tracking-[0.1em] text-beco-dark/50">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-raleway text-[14px] text-beco-dark hover:text-beco-primary transition-colors duration-300"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-raleway text-[14px] text-beco-dark">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-black/10 mt-7 pt-7">
                <h4 className="font-raleway font-semibold text-[14px] text-beco-dark">
                  Réseaux sociaux
                </h4>
                <div className="flex flex-wrap gap-3 mt-4">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href="#"
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-beco-primary rounded-lg font-raleway text-[13px] text-beco-primary hover:bg-beco-primary hover:text-white transition-all duration-300"
                    >
                      {s.icon && <s.icon className="w-4 h-4" />}
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-t border-black/10 mt-7 pt-7">
                <h4 className="font-raleway font-semibold text-[14px] text-beco-dark">
                  Horaires
                </h4>
                <p className="font-raleway text-[13px] text-beco-dark/65 mt-2">
                  Lundi - Vendredi : 8h00 - 17h00
                </p>
                <p className="font-raleway text-[13px] text-beco-dark/65 mt-1">
                  Samedi : 9h00 - 12h00
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section ref={mapRef} className="h-[400px] bg-beco-off-white" data-reveal>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.1989200681!2d11.40480705!3d3.830 Waters!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7a309a7977%3A0x7f54bad35e693c51!2sYaound%C3%A9%2C%20Cameroun!5e0!3m2!1sfr!2s!4v1700000000000!5m2!1sfr!2s"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localisation BECO - Yaoundé"
        />
      </section>
    </>
  );
}
