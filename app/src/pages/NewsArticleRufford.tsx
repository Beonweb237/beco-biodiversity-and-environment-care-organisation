import NewsArticlePage from '../components/NewsArticlePage';
import { newsConfigs } from '../lib/newsData';

export default function NewsArticleRufford() {
  return <NewsArticlePage config={newsConfigs[2]} />;
}
