// Curated RSS feeds for Indian users
export interface SuggestedFeed {
  name: string;
  url: string;
  description: string;
  category: string;
  language: 'en' | 'ta';
  region: string;
}

export const SUGGESTED_FEEDS: SuggestedFeed[] = [
  // Global Tech Feeds (Working)
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    description: "Global startup and technology news",
    category: "tech",
    language: "en",
    region: "global"
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    description: "Technology, science, art, and culture",
    category: "tech",
    language: "en",
    region: "global"
  },
  {
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    description: "Technology news and in-depth analysis",
    category: "tech",
    language: "en",
    region: "global"
  },
  {
    name: "Wired",
    url: "https://www.wired.com/feed/rss",
    description: "Technology, business, science, and design",
    category: "tech",
    language: "en",
    region: "global"
  },

  // Global Business Feeds (Working)
  {
    name: "Reuters Business",
    url: "https://feeds.reuters.com/reuters/businessNews",
    description: "Global business and financial news",
    category: "business",
    language: "en",
    region: "global"
  },
  {
    name: "Bloomberg Technology",
    url: "https://feeds.bloomberg.com/technology/news.rss",
    description: "Technology business news from Bloomberg",
    category: "business",
    language: "en",
    region: "global"
  },
  {
    name: "Financial Times",
    url: "https://www.ft.com/rss/home/us",
    description: "Global financial and business news",
    category: "business",
    language: "en",
    region: "global"
  },

  // Global News Feeds (Working)
  {
    name: "BBC News",
    url: "https://feeds.bbci.co.uk/news/rss.xml",
    description: "World news from BBC",
    category: "news",
    language: "en",
    region: "global"
  },
  {
    name: "CNN Top Stories",
    url: "http://rss.cnn.com/rss/edition.rss",
    description: "Breaking news and top stories",
    category: "news",
    language: "en",
    region: "global"
  },
  {
    name: "Reuters World News",
    url: "https://feeds.reuters.com/Reuters/worldNews",
    description: "Global news and current affairs",
    category: "news",
    language: "en",
    region: "global"
  },
  {
    name: "Associated Press",
    url: "https://feeds.apnews.com/ApNews/TopNews",
    description: "Breaking news from AP",
    category: "news",
    language: "en",
    region: "global"
  },

  // Indian English Sources (Alternative URLs)
  {
    name: "Indian Express",
    url: "https://indianexpress.com/feed/",
    description: "Indian news and current affairs",
    category: "news",
    language: "en",
    region: "india"
  },
  {
    name: "Scroll.in",
    url: "https://scroll.in/feed",
    description: "Indian news, politics, and culture",
    category: "news",
    language: "en",
    region: "india"
  },
  {
    name: "The Wire",
    url: "https://thewire.in/feed/",
    description: "Independent journalism from India",
    category: "news",
    language: "en",
    region: "india"
  },
  {
    name: "Medianama",
    url: "https://www.medianama.com/feed/",
    description: "Indian digital and internet policy news",
    category: "tech",
    language: "en",
    region: "india"
  },

  // Tech Blogs (Working)
  {
    name: "Hacker News",
    url: "https://hnrss.org/frontpage",
    description: "Tech news aggregated by the community",
    category: "tech",
    language: "en",
    region: "global"
  },
  {
    name: "Engadget",
    url: "https://www.engadget.com/rss.xml",
    description: "Consumer technology news and reviews",
    category: "tech",
    language: "en",
    region: "global"
  },
  {
    name: "Mashable Tech",
    url: "https://feeds.mashable.com/Mashable",
    description: "Digital culture and technology news",
    category: "tech",
    language: "en",
    region: "global"
  },

  // Additional reliable sources
  {
    name: "NPR News",
    url: "https://feeds.npr.org/1001/rss.xml",
    description: "National Public Radio news",
    category: "news",
    language: "en",
    region: "global"
  },
  {
    name: "Reddit World News",
    url: "https://www.reddit.com/r/worldnews/.rss",
    description: "World news from Reddit community",
    category: "news",
    language: "en",
    region: "global"
  }
];

export const FEED_CATEGORIES = [
  { id: 'tech', name: 'Technology', icon: '💻', color: '#007AFF' },
  { id: 'business', name: 'Business', icon: '💼', color: '#34C759' },
  { id: 'news', name: 'News', icon: '📰', color: '#FF3B30' }
];

export const LANGUAGES = [
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
];
