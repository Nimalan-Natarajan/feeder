import { RSSFeed } from '../types';
import { ArticleItem } from './ArticleItem';
import { useRSSFeed } from '../hooks/useRSSFeed';
import { Trash2, RefreshCw, Globe } from 'lucide-react';

interface FeedViewProps {
  feed: RSSFeed;
  onRemoveFeed: (feedId: string) => void;
  onBookmarkChange: () => void;
}

export function FeedView({ feed, onRemoveFeed, onBookmarkChange }: FeedViewProps) {
  const { articles, loading, error, feedInfo, refetch } = useRSSFeed(feed);

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
    <div className="feed-item">
      <div className="feed-header">
        <div>
          <h2 className="feed-title">{feedInfo?.title || feed.name}</h2>
          {feedInfo?.description && (
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              {feedInfo.description}
            </p>
          )}
        </div>
        <div className="feed-actions">
          {feedInfo?.link && (
            <button
              onClick={() => window.open(feedInfo.link, '_blank')}
              className="btn-secondary"
              title="Visit website"
            >
              <Globe size={16} />
            </button>
          )}
          <button
            onClick={refetch}
            className="btn-secondary"
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          </button>
          <button onClick={handleRemoveFeed} className="btn-secondary" title="Remove feed">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="empty-state">
          <h3>No articles found</h3>
          <p>This feed doesn't have any articles yet.</p>
        </div>
      ) : (
        <div className="articles-list">
          {articles.map((article) => (
            <ArticleItem
              key={article.guid || article.link}
              article={article}
              feedName={feed.name}
              onBookmarkToggle={onBookmarkChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
