import { useState, useEffect } from 'react';
import { RSSFeed, BookmarkedArticle } from './types';
import { storageService } from './services/storage';
import { AddFeedForm } from './components/AddFeedForm';
import { FeedView } from './components/FeedView';
import { BookmarksView } from './components/BookmarksView';
import { SettingsPanel } from './components/SettingsPanel';
import { Rss, Bookmark, Plus, ChevronUp, Filter } from 'lucide-react';

type TabType = 'feeds' | 'bookmarks' | 'add-feed';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('feeds');
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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

  // Get available categories and languages from feeds
  const getAvailableCategories = (): string[] => {
    const categories = Array.from(new Set(feeds.map(feed => feed.category).filter(Boolean))) as string[];
    return categories.sort();
  };

  const getAvailableLanguages = (): string[] => {
    const languages = Array.from(new Set(feeds.map(feed => feed.language).filter(Boolean))) as string[];
    return languages.sort();
  };

  // Filter feeds based on selected filters
  const getFilteredFeeds = () => {
    return feeds.filter(feed => {
      const matchesCategory = filterCategory === 'all' || feed.category === filterCategory;
      const matchesLanguage = filterLanguage === 'all' || feed.language === filterLanguage;
      return matchesCategory && matchesLanguage;
    });
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

        const filteredFeeds = getFilteredFeeds();

        return (
          <div className="feeds-container">
            {feeds.length > 1 && (
              <div className="feeds-header">
                <div className="feeds-info">
                  <h2>Your Feeds ({filteredFeeds.length})</h2>
                </div>
                <button
                  className="filter-toggle-btn"
                  onClick={() => setShowFilters(!showFilters)}
                  title="Filter feeds"
                >
                  <Filter size={16} />
                  Filters
                </button>
              </div>
            )}

            {showFilters && feeds.length > 1 && (
              <div className="feeds-filters">
                <div className="filter-group">
                  <label htmlFor="feeds-language-filter">Language</label>
                  <select
                    id="feeds-language-filter"
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Languages</option>
                    {getAvailableLanguages().map(language => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="feeds-category-filter">Category</label>
                  <select
                    id="feeds-category-filter"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Categories</option>
                    {getAvailableCategories().map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {filteredFeeds.length === 0 ? (
              <div className="no-feeds-message">
                <p>No feeds found for the selected filters.</p>
                <p>Try changing the language or category filters.</p>
              </div>
            ) : (
              <div className="feeds-list">
                {filteredFeeds.map((feed) => (
                  <FeedView
                    key={feed.id}
                    feed={feed}
                    onRemoveFeed={handleRemoveFeed}
                    onBookmarkChange={handleBookmarkChange}
                  />
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="app-title">
              <h1>
                <Rss size={24} style={{ marginRight: '8px', display: 'inline' }} />
                Feeder
              </h1>
              <span className="made-by">crafted by Nimalan</span>
            </div>
            <nav className="tabs">
              <button
                className={`tab-button ${activeTab === 'feeds' ? 'active' : ''}`}
                onClick={() => setActiveTab('feeds')}
              >
                <Rss size={16} />
                Feeds ({feeds.length})
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
