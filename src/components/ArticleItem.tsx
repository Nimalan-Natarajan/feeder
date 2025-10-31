import { Article } from '../types';
import { storageService } from '../services/storage';
import { Bookmark, ExternalLink, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ArticleItemProps {
  article: Article;
  feedName: string;
  onBookmarkToggle?: () => void;
}

export function ArticleItem({ article, feedName, onBookmarkToggle }: ArticleItemProps) {
  const isBookmarked = storageService.isBookmarked(article.link);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isBookmarked) {
      storageService.removeBookmark(article.link);
    } else {
      storageService.addBookmark({
        ...article,
        feedName,
        bookmarkedAt: new Date()
      });
    }
    
    onBookmarkToggle?.();
  };

  const handleArticleClick = () => {
    window.open(article.link, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <div className="article-item" onClick={handleArticleClick}>
      <div className="article-header">
        <div className="article-content">
          <h3 className="article-title">{article.title}</h3>
          <div className="article-meta">
            <span className="article-date">
              <Clock size={14} />
              {formatDate(article.pubDate)}
            </span>
            <span className="article-source">{feedName}</span>
          </div>
          {article.description && (
            <p className="article-description">{article.description}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <button
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmarkClick}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <ExternalLink size={16} color="#64748b" />
        </div>
      </div>
    </div>
  );
}
