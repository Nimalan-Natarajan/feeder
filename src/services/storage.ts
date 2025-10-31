import { RSSFeed, BookmarkedArticle, FeedCategory } from '../types';

const FEEDS_STORAGE_KEY = 'rss-feeds';
const BOOKMARKS_STORAGE_KEY = 'bookmarked-articles';
const CATEGORIES_STORAGE_KEY = 'feed-categories';

export const storageService = {
  // RSS Feeds
  getFeeds(): RSSFeed[] {
    try {
      const feeds = localStorage.getItem(FEEDS_STORAGE_KEY);
      return feeds ? JSON.parse(feeds).map((feed: any) => ({
        ...feed,
        addedAt: new Date(feed.addedAt)
      })) : [];
    } catch {
      return [];
    }
  },

  saveFeeds(feeds: RSSFeed[]): void {
    localStorage.setItem(FEEDS_STORAGE_KEY, JSON.stringify(feeds));
  },

  addFeed(feed: RSSFeed): void {
    const feeds = this.getFeeds();
    // Check if feed with same URL already exists
    if (!feeds.find(f => f.url === feed.url)) {
      feeds.push(feed);
      this.saveFeeds(feeds);
    }
  },

  feedExists(url: string): boolean {
    return this.getFeeds().some(feed => feed.url === url);
  },

  removeFeed(feedId: string): void {
    const feeds = this.getFeeds().filter(feed => feed.id !== feedId);
    this.saveFeeds(feeds);
  },

  // Bookmarks
  getBookmarks(): BookmarkedArticle[] {
    try {
      const bookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return bookmarks ? JSON.parse(bookmarks).map((bookmark: any) => ({
        ...bookmark,
        bookmarkedAt: new Date(bookmark.bookmarkedAt)
      })) : [];
    } catch {
      return [];
    }
  },

  saveBookmarks(bookmarks: BookmarkedArticle[]): void {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  },

  addBookmark(article: BookmarkedArticle): void {
    const bookmarks = this.getBookmarks();
    // Check if already bookmarked
    if (!bookmarks.find(b => b.link === article.link)) {
      bookmarks.push(article);
      this.saveBookmarks(bookmarks);
    }
  },

  removeBookmark(articleLink: string): void {
    const bookmarks = this.getBookmarks().filter(bookmark => bookmark.link !== articleLink);
    this.saveBookmarks(bookmarks);
  },

  isBookmarked(articleLink: string): boolean {
    return this.getBookmarks().some(bookmark => bookmark.link === articleLink);
  },

  // Categories
  getCategories(): FeedCategory[] {
    try {
      const categories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      return categories ? JSON.parse(categories).map((category: any) => ({
        ...category,
        createdAt: new Date(category.createdAt)
      })) : [];
    } catch {
      return [];
    }
  },

  saveCategories(categories: FeedCategory[]): void {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  },

  addCategory(category: FeedCategory): void {
    const categories = this.getCategories();
    categories.push(category);
    this.saveCategories(categories);
  },

  removeCategory(categoryId: string): void {
    const categories = this.getCategories().filter(cat => cat.id !== categoryId);
    this.saveCategories(categories);
    
    // Remove category from feeds
    const feeds = this.getFeeds();
    const updatedFeeds = feeds.map(feed => 
      feed.category === categoryId ? { ...feed, category: undefined } : feed
    );
    this.saveFeeds(updatedFeeds);
  },

  updateFeedCategory(feedId: string, categoryId?: string): void {
    const feeds = this.getFeeds();
    const updatedFeeds = feeds.map(feed => 
      feed.id === feedId ? { ...feed, category: categoryId } : feed
    );
    this.saveFeeds(updatedFeeds);
  },

  // Reset all data
  resetAllData(): void {
    localStorage.removeItem(FEEDS_STORAGE_KEY);
    localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
    localStorage.removeItem(CATEGORIES_STORAGE_KEY);
  },

  // Export data for backup
  exportData(): string {
    const data = {
      feeds: this.getFeeds(),
      bookmarks: this.getBookmarks(),
      categories: this.getCategories(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  // Import data from backup
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.feeds && Array.isArray(data.feeds)) {
        this.saveFeeds(data.feeds.map((feed: any) => ({
          ...feed,
          addedAt: new Date(feed.addedAt)
        })));
      }
      
      if (data.bookmarks && Array.isArray(data.bookmarks)) {
        this.saveBookmarks(data.bookmarks.map((bookmark: any) => ({
          ...bookmark,
          bookmarkedAt: new Date(bookmark.bookmarkedAt)
        })));
      }
      
      if (data.categories && Array.isArray(data.categories)) {
        this.saveCategories(data.categories.map((category: any) => ({
          ...category,
          createdAt: new Date(category.createdAt)
        })));
      }
      
      return true;
    } catch {
      return false;
    }
  }
};
