import { useState, useEffect } from 'react';
import { RSSFeed, BookmarkedArticle } from './types';
import { storageService } from './services/storage';
import { AddFeedForm } from './components/AddFeedForm';
import { FeedView } from './components/FeedView';
import { BookmarksView } from './components/BookmarksView';
import { SettingsPanel } from './components/SettingsPanel';
import { SearchView } from './components/SearchView';
import { Rss, Bookmark, Plus, ChevronUp, Search } from 'lucide-react';

type TabType = 'feeds' | 'bookmarks' | 'add-feed' | 'search';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('feeds');
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    setFeeds(storageService.getFeeds());
    setBookmarks(storageService.getBookmarks());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFeedAdded = () => {
    setFeeds(storageService.getFeeds());
    setActiveTab('feeds');
  };

  const handleRemoveFeed = (feedId: string) => {
    storageService.removeFeed(feedId);
    setFeeds(storageService.getFeeds());
  };

  const handleBookmarkChange = () => {
    setBookmarks(storageService.getBookmarks());
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'add-feed':
        return <AddFeedForm onFeedAdded={handleFeedAdded} />;
      
      case 'bookmarks':
        return (
          <BookmarksView
            bookmarks={bookmarks}
            onBookmarkChange={handleBookmarkChange}
          />
        );

      case 'search':
        return (
          <SearchView
            feeds={feeds}
            onBookmarkChange={handleBookmarkChange}
          />
        );
      
      case 'feeds':
      default:
        if (feeds.length === 0) {
          return (
            <div className="empty-state">
              <Rss size={48} color="#64748b" />
              <h3>No RSS feeds yet</h3>
              <p>Add your first RSS feed to start reading articles.</p>
              <button
                className="btn-primary"
                onClick={() => setActiveTab('add-feed')}
                style={{ marginTop: '16px' }}
              >
                <Plus size={16} />
                Add RSS Feed
              </button>
            </div>
          );
        }

        return (
          <div className="feeds-list">
            {feeds.map((feed) => (
              <FeedView
                key={feed.id}
                feed={feed}
                onRemoveFeed={handleRemoveFeed}
                onBookmarkChange={handleBookmarkChange}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1>
              <Rss size={24} style={{ marginRight: '8px', display: 'inline' }} />
              RSS Feeder
            </h1>
            <nav className="tabs">
              <button
                className={`tab-button ${activeTab === 'feeds' ? 'active' : ''}`}
                onClick={() => setActiveTab('feeds')}
              >
                <Rss size={16} />
                Feeds ({feeds.length})
              </button>
              <button
                className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
                onClick={() => setActiveTab('search')}
              >
                <Search size={16} />
                Search
              </button>
              <button
                className={`tab-button ${activeTab === 'bookmarks' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookmarks')}
              >
                <Bookmark size={16} />
                Bookmarks ({bookmarks.length})
              </button>
              <button
                className={`tab-button ${activeTab === 'add-feed' ? 'active' : ''}`}
                onClick={() => setActiveTab('add-feed')}
              >
                <Plus size={16} />
                Add Feed
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {renderContent()}
        </div>
      </main>

      <SettingsPanel />
      
      {showBackToTop && (
        <button 
          className="back-to-top"
          onClick={scrollToTop}
          title="Back to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
}

export default App;
