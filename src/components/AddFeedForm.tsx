import { useState } from 'react';
import { RSSFeed } from '../types';
import { storageService } from '../services/storage';
import { rssService } from '../services/rss';

import { Plus, X, Star } from 'lucide-react';

interface AddFeedFormProps {
  onFeedAdded: () => void;
}

export function AddFeedForm({ onFeedAdded }: AddFeedFormProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedFeeds, setSelectedFeeds] = useState<Set<string>>(new Set());
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const suggestedFeeds = [
    // English Sources
    { name: 'Times of India - News', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', category: 'News', language: 'English' },
    { name: 'Times of India - World', url: 'http://timesofindia.indiatimes.com/rssfeeds/296589292.cms', category: 'World', language: 'English' },
    { name: 'Times of India - Business', url: 'http://timesofindia.indiatimes.com/rssfeeds/1898055.cms', category: 'Business', language: 'English' },
    { name: 'Times of India - Cricket', url: 'http://timesofindia.indiatimes.com/rssfeeds/54829575.cms', category: 'Cricket', language: 'English' },
    { name: 'Times of India - Sports', url: 'http://timesofindia.indiatimes.com/rssfeeds/4719148.cms', category: 'Sports', language: 'English' },
    { name: 'Times of India - Science', url: 'http://timesofindia.indiatimes.com/rssfeeds/-2128672765.cms', category: 'Science', language: 'English' },
    { name: 'Times of India - Tech', url: 'http://timesofindia.indiatimes.com/rssfeeds/66949542.cms', category: 'Tech', language: 'English' },
    { name: 'Times of India - Auto', url: 'https://timesofindia.indiatimes.com/rssfeeds/74317216.cms', category: 'Auto', language: 'English' },
    { name: 'Times of India - Entertainment', url: 'http://timesofindia.indiatimes.com/rssfeeds/1081479906.cms', category: 'Entertainment', language: 'English' },
    { name: 'Times of India - Recent', url: 'http://timesofindia.indiatimes.com/rssfeedmostrecent.cms', category: 'Recent', language: 'English' },
    
    // Tamil Sources
    { name: 'OneIndia Tamil - News', url: 'https://tamil.oneindia.com/rss/feeds/oneindia-tamil-fb.xml', category: 'News', language: 'Tamil' },
    { name: 'OneIndia Tamil - Recent', url: 'https://tamil.oneindia.com/rss/feeds/tamil-news-fb.xml', category: 'Recent', language: 'Tamil' },
    { name: 'OneIndia Tamil - Spiritual', url: 'https://tamil.oneindia.com/rss/feeds/tamil-spirtuality-fb.xml', category: 'Spiritual', language: 'Tamil' },
    { name: 'OneIndia Tamil - Health', url: 'https://tamil.oneindia.com/rss/feeds/tamil-health-fb.xml', category: 'Health', language: 'Tamil' },
    { name: 'OneIndia Tamil - Tech', url: 'https://tamil.oneindia.com/rss/feeds/tamil-technology-fb.xml', category: 'Tech', language: 'Tamil' },
    { name: 'OneIndia Tamil - Auto', url: 'https://tamil.oneindia.com/rss/feeds/tamil-automobiles-fb.xml', category: 'Auto', language: 'Tamil' },
    { name: 'OneIndia Tamil - Weather', url: 'https://tamil.oneindia.com/rss/feeds/tamil-weather-fb.xml', category: 'Weather', language: 'Tamil' }
  ];

  const getFilteredFeeds = () => {
    return suggestedFeeds.filter(feed => {
      const matchesLanguage = filterLanguage === 'all' || feed.language === filterLanguage;
      const matchesCategory = filterCategory === 'all' || feed.category === filterCategory;
      return matchesLanguage && matchesCategory;
    });
  };

  const getAvailableCategories = () => {
    const categories = [...new Set(suggestedFeeds.map(feed => feed.category))];
    return categories.sort();
  };

  const getAvailableLanguages = () => {
    const languages = [...new Set(suggestedFeeds.map(feed => feed.language))];
    return languages.sort();
  };

  const handleFeedToggle = (feedUrl: string) => {
    const newSelected = new Set(selectedFeeds);
    if (newSelected.has(feedUrl)) {
      newSelected.delete(feedUrl);
    } else {
      newSelected.add(feedUrl);
    }
    setSelectedFeeds(newSelected);
  };

  const selectAllFeeds = () => {
    const filteredFeeds = getFilteredFeeds();
    const allUrls = filteredFeeds.map(feed => feed.url);
    setSelectedFeeds(new Set(allUrls));
  };

  const clearAllFeeds = () => {
    setSelectedFeeds(new Set());
  };

  const addSelectedFeeds = async () => {
    if (selectedFeeds.size === 0) return;

    setLoading(true);
    setError(null);

    try {
      const feedsToAdd = suggestedFeeds.filter(feed => selectedFeeds.has(feed.url));
      let addedCount = 0;
      let skippedCount = 0;
      let failedCount = 0;

      for (const feed of feedsToAdd) {
        try {
          // Check if feed already exists
          if (storageService.feedExists(feed.url)) {
            console.log(`Skipping duplicate feed: ${feed.name}`);
            skippedCount++;
            continue;
          }

          // Validate the RSS feed before adding
          await rssService.fetchFeed(feed.url);
          const newFeed: RSSFeed = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: feed.name,
            url: feed.url,
            addedAt: new Date(),
            category: feed.category,
            language: feed.language
          };

          storageService.addFeed(newFeed);
          addedCount++;
        } catch (err) {
          console.warn(`Failed to add feed: ${feed.name}`, err);
          failedCount++;
        }
      }

      // Show success/info message
      if (addedCount > 0) {
        let message = `Successfully added ${addedCount} feed${addedCount > 1 ? 's' : ''}`;
        if (skippedCount > 0) {
          message += `, skipped ${skippedCount} duplicate${skippedCount > 1 ? 's' : ''}`;
        }
        if (failedCount > 0) {
          message += `, failed to add ${failedCount}`;
        }
        console.log(message);
      } else if (skippedCount > 0) {
        setError(`All selected feeds are already added (${skippedCount} duplicates skipped)`);
      } else {
        setError('Failed to add any feeds. Please try again.');
      }

      onFeedAdded();
      setSelectedFeeds(new Set());
      setShowSuggestions(false);
    } catch (err) {
      setError('Failed to add some feeds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!rssService.validateRSSUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    // Check for duplicate feed names
    const existingFeeds = storageService.getFeeds();
    const duplicateName = existingFeeds.find(feed => 
      feed.name.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (duplicateName) {
      setError(`A feed with the name "${name.trim()}" already exists. Please choose a different name.`);
      return;
    }

    // Check for duplicate URLs
    const duplicateUrl = existingFeeds.find(feed => feed.url === url.trim());
    if (duplicateUrl) {
      setError(`This RSS feed is already added as "${duplicateUrl.name}". Please add a different feed.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Test the RSS feed first
      console.log('Testing RSS feed:', url);
      const feedData = await rssService.fetchFeed(url);
      console.log('RSS feed test successful:', feedData);
      
      const newFeed: RSSFeed = {
        id: Date.now().toString(),
        name: name.trim(),
        url: url.trim(),
        addedAt: new Date()
      };

      storageService.addFeed(newFeed);
      setName('');
      setUrl('');
      onFeedAdded();
    } catch (err) {
      console.error('Failed to add RSS feed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add RSS feed';
      setError(`${errorMessage}. Please check if the URL is a valid RSS/Atom feed.`);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <div className="add-feed-container">
      <div className="add-feed-tabs">
        <button
          type="button"
          className={`tab-btn ${showSuggestions ? 'active' : ''}`}
          onClick={() => setShowSuggestions(true)}
        >
          <Star size={16} />
          Suggested Feeds
        </button>
        <button
          type="button"
          className={`tab-btn ${!showSuggestions ? 'active' : ''}`}
          onClick={() => setShowSuggestions(false)}
        >
          <Plus size={16} />
          Manual Entry
        </button>
      </div>

      {showSuggestions ? (
        <div className="suggested-feeds-section">
          <h3>Popular Feeds</h3>
          <p className="suggested-subtitle">
            Curated news categories • Ready to add with one click
          </p>

          {error && (
            <div className="error">
              <span>{error}</span>
              <button type="button" onClick={clearError} style={{ marginLeft: '8px' }}>
                <X size={16} />
              </button>
            </div>
          )}

          <div className="suggested-filters">
            <div className="filter-group">
              <label htmlFor="language-filter">Language</label>
              <select
                id="language-filter"
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
              <label htmlFor="category-filter">Category</label>
              <select
                id="category-filter"
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

          {selectedFeeds.size > 0 && (
            <div className="selected-feeds-summary">
              <span className="selection-count">
                {selectedFeeds.size} feeds selected
              </span>
              <button
                type="button"
                onClick={addSelectedFeeds}
                disabled={loading}
                className="btn-primary add-selected-btn"
              >
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Add Selected
                  </>
                )}
              </button>
            </div>
          )}

          <div className="language-sections">
            {getAvailableLanguages()
              .filter(language => filterLanguage === 'all' || filterLanguage === language)
              .map(language => {
                const languageFeeds = getFilteredFeeds().filter(feed => feed.language === language);
                if (languageFeeds.length === 0) return null;
                
                const languageCategories = [...new Set(languageFeeds.map(feed => feed.category))].sort();
                const hasAllCategoriesSelected = languageCategories.every(category => 
                  languageFeeds.filter(feed => feed.category === category).every(feed => selectedFeeds.has(feed.url))
                );

                return (
                  <div key={language} className="language-section">
                    <div className="language-header">
                      <h4 className="language-title">
                        {language}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const languageUrls = languageFeeds.map(feed => feed.url);
                          if (hasAllCategoriesSelected) {
                            // Deselect all from this language
                            const newSelected = new Set(selectedFeeds);
                            languageUrls.forEach(url => newSelected.delete(url));
                            setSelectedFeeds(newSelected);
                          } else {
                            // Select all from this language
                            setSelectedFeeds(new Set([...selectedFeeds, ...languageUrls]));
                          }
                        }}
                        className="language-select-btn"
                      >
                        {hasAllCategoriesSelected ? 'Clear' : 'Select All'}
                      </button>
                    </div>
                    
                    <div className="categories-grid">
                      {languageCategories.map(category => {
                        const categoryFeeds = languageFeeds.filter(feed => feed.category === category);
                        const isSelected = categoryFeeds.every(feed => selectedFeeds.has(feed.url));
                        
                        return (
                          <div
                            key={`${language}-${category}`}
                            className={`category-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              const categoryUrls = categoryFeeds.map(feed => feed.url);
                              const newSelected = new Set(selectedFeeds);
                              
                              if (isSelected) {
                                categoryUrls.forEach(url => newSelected.delete(url));
                              } else {
                                categoryUrls.forEach(url => newSelected.add(url));
                              }
                              setSelectedFeeds(newSelected);
                            }}
                          >
                            <div className="category-checkbox">
                              {isSelected && <span className="checkmark">✓</span>}
                            </div>
                            <span className="category-name">{category}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <form className="add-feed-form" onSubmit={handleSubmit}>
          <h3>Add RSS Feed Manually</h3>
          
          {error && (
            <div className="error">
              <span>{error}</span>
              <button type="button" onClick={clearError} style={{ marginLeft: '8px' }}>
                <X size={16} />
              </button>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="feed-name">Feed Name</label>
            <input
              id="feed-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Tech News, My Blog"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="feed-url">RSS URL</label>
            <input
              id="feed-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/rss"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            <Plus size={16} />
            {loading ? 'Adding...' : 'Add Feed'}
          </button>
        </form>
      )}
    </div>
  );
}
