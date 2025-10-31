import { useState, useEffect, useMemo } from 'react';
import { RSSFeed, Article } from '../types';
import { ArticleItem } from './ArticleItem';
import { Search, Filter, Calendar } from 'lucide-react';

interface SearchViewProps {
  feeds: RSSFeed[];
  onBookmarkChange: () => void;
}

type FilterType = 'all' | 'today' | 'week' | 'month';

export function SearchView({ feeds, onBookmarkChange }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeed, setSelectedFeed] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<FilterType>('all');


  // Custom hook to fetch all articles from all feeds
  const useAllFeeds = (feeds: RSSFeed[]) => {
    const [articles, setArticles] = useState<(Article & { feedName: string; feedId: string })[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const fetchAllArticles = async () => {
        if (feeds.length === 0) return;
        
        setIsLoading(true);
        const allArticlesPromises = feeds.map(async (feed) => {
          try {
            const { rssService } = await import('../services/rss');
            const feedData = await rssService.fetchFeed(feed.url);
            return feedData.items.map((article: Article) => ({
              ...article,
              feedName: feed.name,
              feedId: feed.id
            }));
          } catch (error) {
            console.error(`Failed to fetch articles from ${feed.name}:`, error);
            return [];
          }
        });

        try {
          const results = await Promise.all(allArticlesPromises);
          const flatArticles = results.flat();
          // Sort by publication date (newest first)
          flatArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
          setArticles(flatArticles);
        } catch (error) {
          console.error('Error fetching articles:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAllArticles();
    }, [feeds]);

    return { articles, loading: isLoading };
  };

  const { articles, loading: articlesLoading } = useAllFeeds(feeds);

  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description?.toLowerCase().includes(query) ||
        article.feedName.toLowerCase().includes(query)
      );
    }

    // Filter by selected feed
    if (selectedFeed !== 'all') {
      filtered = filtered.filter(article => article.feedId === selectedFeed);
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      switch (dateFilter) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(article => {
        const articleDate = new Date(article.pubDate);
        return articleDate >= cutoffDate;
      });
    }

    return filtered;
  }, [articles, searchQuery, selectedFeed, dateFilter]);

  if (articlesLoading) {
    return (
      <div className="search-view">
        <div className="search-header">
          <h2>Search Articles</h2>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-view">
      <div className="search-header">
        <h2>Search Articles</h2>
        <p className="search-subtitle">Search across all your RSS feeds</p>
      </div>

      <div className="search-controls">
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search articles, titles, or feed names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="search-filters">
          <div className="filter-group">
            <Filter size={16} />
            <select
              value={selectedFeed}
              onChange={(e) => setSelectedFeed(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Feeds</option>
              {feeds.map(feed => (
                <option key={feed.id} value={feed.id}>{feed.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <Calendar size={16} />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as FilterType)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      <div className="search-results">
        {searchQuery && (
          <div className="search-results-header">
            <p>{filteredArticles.length} results found</p>
          </div>
        )}

        {filteredArticles.length === 0 ? (
          <div className="empty-search-state">
            <Search size={48} color="#64748b" />
            <h3>
              {searchQuery 
                ? `No articles found for "${searchQuery}"` 
                : 'Start typing to search articles'
              }
            </h3>
            <p>
              {searchQuery 
                ? 'Try adjusting your search terms or filters'
                : 'Search across all your RSS feeds instantly'
              }
            </p>
          </div>
        ) : (
          <div className="articles-grid">
            {filteredArticles.map((article) => (
              <ArticleItem
                key={`${article.feedId}-${article.guid || article.link}`}
                article={article}
                feedName={article.feedName}
                onBookmarkToggle={onBookmarkChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
