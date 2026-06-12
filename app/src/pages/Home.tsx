import HeroCarousel from '../sections/HeroCarousel';
import AboutSection from '../sections/AboutSection';
import FocusAreas from '../sections/FocusAreas';
import ImpactNumbers from '../sections/ImpactNumbers';
import Funders from '../sections/Funders';
import FeaturedProjects from '../sections/FeaturedProjects';
import NewsletterCTA from '../sections/NewsletterCTA';

export default function Home() {
  return (
    <>
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
