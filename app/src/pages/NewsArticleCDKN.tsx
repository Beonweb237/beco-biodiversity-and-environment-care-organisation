import NewsArticlePage from '../components/NewsArticlePage';
import { newsConfigs } from '../lib/newsData';

export default function NewsArticleCDKN() {
  return <NewsArticlePage config={newsConfigs[3]} />;
}
