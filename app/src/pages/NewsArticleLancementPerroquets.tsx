import NewsArticlePage from '../components/NewsArticlePage';
import { newsConfigs } from '../lib/newsData';

export default function NewsArticleLancementPerroquets() {
  return <NewsArticlePage config={newsConfigs[0]} />;
}
