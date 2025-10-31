import { RSSFeed, BookmarkedArticle } from '../types';

const FEEDS_STORAGE_KEY = 'rss-feeds';
const BOOKMARKS_STORAGE_KEY = 'bookmarked-articles';

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
    feeds.push(feed);
    this.saveFeeds(feeds);
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
  }
};
