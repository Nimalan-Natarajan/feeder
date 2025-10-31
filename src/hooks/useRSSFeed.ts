import { useState, useEffect } from 'react';
import { Article, RSSFeed, FeedData } from '../types';
import { rssService } from '../services/rss';

export function useRSSFeed(feed: RSSFeed) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedInfo, setFeedInfo] = useState<FeedData['feed'] | null>(null);

  const fetchFeed = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await rssService.fetchFeed(feed.url);
      setArticles(data.items);
      setFeedInfo(data.feed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [feed.url]);

  return {
    articles,
    loading,
    error,
    feedInfo,
    refetch: fetchFeed
  };
}
