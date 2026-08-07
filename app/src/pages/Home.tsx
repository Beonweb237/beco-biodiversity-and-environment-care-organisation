import HeroCarousel from '../sections/HeroCarousel';
import AboutSection from '../sections/AboutSection';
import FocusAreas from '../sections/FocusAreas';
import ImpactNumbers from '../sections/ImpactNumbers';
import Funders from '../sections/Funders';
import FeaturedProjects from '../sections/FeaturedProjects';
import NewsletterCTA from '../sections/NewsletterCTA';
import SEOHead from '../components/SEOHead';

export default function Home() {
  return (
    <>
      <SEOHead
        title="Accueil"
        description="BECO — Organisation de conservation de la biodiversité et de protection de l'environnement au Cameroun et en Afrique."
        path="/"
      />
      <HeroCarousel />
      <AboutSection />
      <FocusAreas />
      <ImpactNumbers />
      <Funders />
      <FeaturedProjects />
      <NewsletterCTA />
    </>
  );
}
