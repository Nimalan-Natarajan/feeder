import { BookmarkedArticle } from '../types';
import { storageService } from '../services/storage';
import { Bookmark, ExternalLink, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface BookmarksViewProps {
  bookmarks: BookmarkedArticle[];
  onBookmarkChange: () => void;
}

export function BookmarksView({ bookmarks, onBookmarkChange }: BookmarksViewProps) {
  const handleRemoveBookmark = (articleLink: string) => {
    storageService.removeBookmark(articleLink);
    onBookmarkChange();
  };

  const handleArticleClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (date: Date) => {
    try {
      return format(date, 'MMM d, yyyy • h:mm a');
    } catch {
      return 'Unknown date';
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className="empty-state">
        <Bookmark size={48} color="#64748b" />
        <h3>No bookmarks yet</h3>
        <p>Articles you bookmark will appear here for easy access.</p>
      </div>
    );
  }

  return (
    <div className="feeds-list">
      <div className="feed-item">
        <div className="feed-header">
          <h2 className="feed-title">Bookmarked Articles ({bookmarks.length})</h2>
        </div>
        <div className="articles-list">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.link}
              className="article-item"
              onClick={() => handleArticleClick(bookmark.link)}
            >
              <div className="article-header">
                <div className="article-content">
                  <h3 className="article-title">{bookmark.title}</h3>
                  <div className="article-meta">
                    <span className="article-date">
                      <Clock size={14} />
                      {formatDate(bookmark.bookmarkedAt)}
                    </span>
                    <span className="article-source">{bookmark.feedName}</span>
                  </div>
                  {bookmark.description && (
                    <p className="article-description">{bookmark.description}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <button
                    className="bookmark-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBookmark(bookmark.link);
                    }}
                    title="Remove bookmark"
                  >
                    <Trash2 size={16} />
                  </button>
                  <ExternalLink size={16} color="#64748b" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
