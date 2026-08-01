import NewsArticlePage from '../components/NewsArticlePage';
import { newsConfigs } from '../lib/newsData';

export default function NewsArticleSubventionBES() {
  return <NewsArticlePage config={newsConfigs[1]} />;
}
