import NewsArticlePage from '../components/NewsArticlePage';
import { newsConfigs } from '../lib/newsData';

export default function NewsArticleMonitoring() {
  return <NewsArticlePage config={newsConfigs[5]} />;
}
