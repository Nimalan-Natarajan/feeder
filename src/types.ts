export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  addedAt: Date;
  category?: string;
  language?: string;
}

export interface FeedCategory {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface Article {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  description: string;
  guid: string;
}

export interface FeedData {
  status: string;
  feed: {
    title: string;
    link: string;
    description: string;
  };
  items: Article[];
}

export interface BookmarkedArticle extends Article {
  feedName: string;
  bookmarkedAt: Date;
}
