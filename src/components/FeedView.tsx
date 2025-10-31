import { useState } from 'react';
import { RSSFeed } from '../types';
import { ArticleItem } from './ArticleItem';
import { useRSSFeed } from '../hooks/useRSSFeed';
import { Trash2, RefreshCw, Globe, ChevronDown, ChevronUp } from 'lucide-react';

interface FeedViewProps {
  feed: RSSFeed;
  onRemoveFeed: (feedId: string) => void;
  onBookmarkChange: () => void;
}

export function FeedView({ feed, onRemoveFeed, onBookmarkChange }: FeedViewProps) {
  const { articles, loading, error, feedInfo, refetch } = useRSSFeed(feed);
  const [showAll, setShowAll] = useState(false);
  
  const ARTICLES_PREVIEW_COUNT = 5;
  const displayedArticles = showAll ? articles : articles.slice(0, ARTICLES_PREVIEW_COUNT);
  const hasMoreArticles = articles.length > ARTICLES_PREVIEW_COUNT;

  const handleRemoveFeed = () => {
    if (confirm(`Are you sure you want to remove "${feed.name}"?`)) {
      onRemoveFeed(feed.id);
    }
  };

  if (loading && articles.length === 0) {
    return (
      <div className="feed-item">
        <div className="loading">Loading articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-item">
        <div className="feed-header">
          <h2 className="feed-title">{feed.name}</h2>
          <div className="feed-actions">
            <button onClick={refetch} className="btn-secondary" title="Retry">
              <RefreshCw size={16} />
            </button>
            <button onClick={handleRemoveFeed} className="btn-secondary" title="Remove feed">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <div className="error">
          Failed to load feed: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header-card">
        <div className="feed-info">
          <h2 className="feed-title">{feed.name}</h2>
          <span className="feed-source">{new URL(feed.url).hostname}</span>
        </div>
        <div className="feed-actions">
          {feedInfo?.link && (
            <button
              onClick={() => window.open(feedInfo.link, '_blank')}
              className="action-btn"
              title="Visit website"
            >
              <Globe size={18} />
            </button>
          )}
          <button
            onClick={refetch}
            className="action-btn"
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          </button>
          <button onClick={handleRemoveFeed} className="action-btn danger" title="Remove feed">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="empty-state">
          <h3>No articles found</h3>
          <p>This feed doesn't have any articles yet.</p>
        </div>
      ) : (
        <>
          <div className="articles-grid">
            {displayedArticles.map((article) => (
              <ArticleItem
                key={article.guid || article.link}
                article={article}
                feedName={feed.name}
                onBookmarkToggle={onBookmarkChange}
              />
            ))}
          </div>
          
          {hasMoreArticles && (
            <div className="show-more-section">
              <button 
                className="show-more-btn"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? (
                  <>
                    <ChevronUp size={16} />
                    Show Less Articles
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    Show All {articles.length} Articles
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
