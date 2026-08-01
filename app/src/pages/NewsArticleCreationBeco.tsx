import NewsArticlePage from '../components/NewsArticlePage';
import { newsConfigs } from '../lib/newsData';

export default function NewsArticleCreationBeco() {
  return <NewsArticlePage config={newsConfigs[4]} />;
}
