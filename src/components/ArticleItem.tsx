import { useState, useEffect } from 'react';
import { Article } from '../types';
import { storageService } from '../services/storage';
import { Bookmark, ExternalLink, Clock, Share2, MessageCircle, Send, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';

interface ArticleItemProps {
  article: Article;
  feedName: string;
  onBookmarkToggle?: () => void;
}

export function ArticleItem({ article, feedName, onBookmarkToggle }: ArticleItemProps) {
  const isBookmarked = storageService.isBookmarked(article.link);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showShareMenu) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showShareMenu]);

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

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const shareToWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Check out this article: ${article.title}\n${article.link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShowShareMenu(false);
  };

  const shareToTelegram = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://t.me/share/url?url=${encodeURIComponent(article.link)}&text=${encodeURIComponent(article.title)}`;
    window.open(url, '_blank');
    setShowShareMenu(false);
  };

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(article.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = article.link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowShareMenu(false);
  };

  const shareNative = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description || '',
          url: article.link,
        });
        setShowShareMenu(false);
      } catch (err) {
        // User cancelled or error occurred
      }
    }
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
        <div className="article-actions">
          <div className="share-container">
            <button
              className="action-btn"
              onClick={handleShareClick}
              title="Share article"
            >
              <Share2 size={16} />
            </button>
            
            {showShareMenu && (
              <div className="share-menu">
                {'share' in navigator && (
                  <button onClick={shareNative} className="share-option">
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                )}
                <button onClick={shareToWhatsApp} className="share-option whatsapp">
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </button>
                <button onClick={shareToTelegram} className="share-option telegram">
                  <Send size={16} />
                  <span>Telegram</span>
                </button>
                <button onClick={copyToClipboard} className="share-option copy">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            )}
          </div>
          
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
