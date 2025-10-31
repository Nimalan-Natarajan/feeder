import { FeedData } from '../types';

// Multiple RSS parsing options
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';
const ALLORIGINS_API = 'https://api.allorigins.win/get';

export const rssService = {
  async fetchFeed(url: string): Promise<FeedData> {
    // Handle search-based virtual feeds
    if (url.startsWith('search://query/')) {
      return this.fetchSearchFeed(url);
    }
    
    const errors: string[] = [];
    
    // Try RSS2JSON API first
    try {
      const response = await fetch(`${RSS2JSON_API}?rss_url=${encodeURIComponent(url)}&count=20`);
      
      if (!response.ok) {
        throw new Error(`RSS2JSON API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        console.log('Successfully fetched from RSS2JSON:', data);
        return data;
      } else {
        throw new Error(data.message || 'No items found in feed');
      }
    } catch (error) {
      console.warn('RSS2JSON failed:', error);
      errors.push(error instanceof Error ? error.message : 'RSS2JSON failed');
    }

    // Try CORS proxy as fallback
    try {
      console.log('Trying CORS proxy for:', url);
      const proxyResponse = await fetch(`${ALLORIGINS_API}?url=${encodeURIComponent(url)}`);
      
      if (!proxyResponse.ok) {
        throw new Error(`CORS proxy error: ${proxyResponse.status}`);
      }

      const proxyData = await proxyResponse.json();
      if (!proxyData.contents) {
        throw new Error('No content received from CORS proxy');
      }

      console.log('Got content from CORS proxy, parsing XML...');
      return this.parseRSSXML(proxyData.contents, url);
    } catch (error) {
      console.warn('CORS proxy failed:', error);
      errors.push(error instanceof Error ? error.message : 'CORS proxy failed');
    }

    // If all methods fail, throw error
    throw new Error(`Failed to fetch RSS feed. Tried multiple methods: ${errors.join(', ')}`);
  },

  parseRSSXML(xmlString: string, feedUrl: string): FeedData {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      // Check for XML parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML format');
      }

      // Try RSS 2.0 format
      let channel = xmlDoc.querySelector('rss channel') || xmlDoc.querySelector('channel');
      let items = xmlDoc.querySelectorAll('rss channel item, channel item');
      let isAtom = false;

      // If not RSS, try Atom format
      if (!channel || items.length === 0) {
        channel = xmlDoc.querySelector('feed');
        items = xmlDoc.querySelectorAll('entry');
        isAtom = true;
      }

      if (!channel) {
        throw new Error('No valid RSS or Atom feed structure found');
      }

      const feedTitle = channel.querySelector('title')?.textContent?.trim() || 'Unknown Feed';
      const feedDescription = channel.querySelector('description, subtitle')?.textContent?.trim() || '';
      const feedLink = channel.querySelector('link')?.textContent?.trim() || 
                     channel.querySelector('link')?.getAttribute('href') || 
                     feedUrl;

      const articles = Array.from(items).slice(0, 20).map((item, index) => {
        const title = item.querySelector('title')?.textContent?.trim() || 'Untitled Article';
        
        let link = '';
        if (isAtom) {
          link = item.querySelector('link')?.getAttribute('href') || '';
        } else {
          link = item.querySelector('link')?.textContent?.trim() || '';
        }
        if (!link) link = `${feedUrl}#article-${index}`;

        const description = item.querySelector('description, summary')?.textContent?.trim() || 
                          item.querySelector('content')?.textContent?.trim() || '';
        
        const pubDate = item.querySelector('pubDate, published, updated')?.textContent?.trim() || 
                       new Date().toISOString();
        
        const guid = item.querySelector('guid, id')?.textContent?.trim() || link;

        // Clean up description (remove HTML tags and limit length)
        const cleanDescription = description
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&[^;]+;/g, ' ') // Remove HTML entities
          .trim()
          .substring(0, 300);

        return {
          title,
          link,
          description: cleanDescription,
          content: description,
          pubDate,
          guid
        };
      });

      if (articles.length === 0) {
        throw new Error('No articles found in the feed');
      }

      console.log(`Successfully parsed ${articles.length} articles from RSS/Atom feed`);

      return {
        status: 'ok',
        feed: {
          title: feedTitle,
          link: feedLink,
          description: feedDescription
        },
        items: articles
      };
    } catch (error) {
      console.error('XML parsing failed:', error);
      throw new Error(`Failed to parse RSS/Atom feed: ${error instanceof Error ? error.message : 'Unknown parsing error'}`);
    }
  },

  async fetchSearchFeed(searchUrl: string): Promise<FeedData> {
    try {
      // Parse search URL: search://query/QUERY?lang=LANG&category=CATEGORY&country=COUNTRY
      const urlObj = new URL(searchUrl);
      const query = decodeURIComponent(urlObj.pathname.replace('/query/', ''));
      const params = new URLSearchParams(urlObj.search);
      const language = params.get('lang') || 'en';
      const category = params.get('category') || 'general';
      const country = params.get('country') || 'us';
      
      // Check if we have cached search results
      const cacheKey = `search-cache-${query}-${language}-${category}-${country}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          if (Date.now() - cachedData.timestamp < 3600000) { // 1 hour cache
            return cachedData.data;
          }
        } catch (e) {
          // Ignore cache errors
        }
      }
      
      // Build RSS search URLs
      const searchUrls = this.buildSearchRSSUrls(query, language, category, country);
      const allArticles: any[] = [];
      
      // Fetch from multiple RSS sources (avoid recursive calls)
      for (const rssUrl of searchUrls) {
        try {
          // Use direct RSS fetch methods to avoid recursion
          const response = await this.fetchRSSDirectly(rssUrl);
          if (response.items) {
            // Filter articles that match our search query
            const relevantArticles = response.items.filter(article => 
              article.title.toLowerCase().includes(query.toLowerCase()) ||
              (article.description && article.description.toLowerCase().includes(query.toLowerCase()))
            );
            allArticles.push(...relevantArticles);
          }
        } catch (err) {
          console.warn(`Failed to fetch from ${rssUrl}:`, err);
          // Continue with other sources
        }
      }
      
      // Remove duplicates and sort by date
      const uniqueArticles = allArticles
        .filter((article, index, self) => 
          self.findIndex(a => a.title === article.title) === index
        )
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
        .slice(0, 20); // Limit to 20 most recent articles
      
      const result = {
        status: 'ok',
        feed: {
          title: `${query} - Search Results`,
          link: '#',
          description: `Search results for "${query}"`
        },
        items: uniqueArticles
      };
      
      // Cache the results
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data: result
        }));
      } catch (e) {
        // Ignore cache storage errors
      }
      
      return result;
    } catch (error) {
      console.error('Search feed failed:', error);
      
      // Return demo results as fallback
      return {
        status: 'ok',
        feed: {
          title: `${searchUrl.includes('query/') ? decodeURIComponent(searchUrl.split('query/')[1].split('?')[0]) : 'Search'} - Demo Results`,
          link: '#',
          description: 'Demo search results (RSS feeds unavailable)'
        },
        items: this.generateDemoResults(searchUrl)
      };
    }
  },

  async fetchRSSDirectly(url: string): Promise<FeedData> {
    // This method avoids the search:// URL check to prevent recursion
    const errors: string[] = [];
    
    // Skip problematic URLs that are known to fail
    if (url.includes('news.google.com/rss/search') || 
        url.includes('allorigins.win') || 
        url.includes('cors-anywhere')) {
      throw new Error('Skipping problematic RSS URL');
    }
    
    // Try RSS2JSON API first (but silently fail for known issues)
    try {
      const response = await fetch(`${RSS2JSON_API}?rss_url=${encodeURIComponent(url)}&count=20`);
      
      if (!response.ok) {
        // Don't throw immediately for 422 errors, just note them
        if (response.status === 422) {
          errors.push('RSS2JSON rate limited or rejected URL');
        } else {
          throw new Error(`RSS2JSON API error: ${response.status}`);
        }
      } else {
        const data = await response.json();
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          console.log(`Successfully fetched ${data.items.length} items from RSS2JSON for ${url}`);
          return data;
        } else {
          errors.push(data.message || 'No items found in RSS2JSON response');
        }
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'RSS2JSON failed');
    }

    // Try CORS proxy as fallback (with timeout)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const proxyResponse = await fetch(`${ALLORIGINS_API}?url=${encodeURIComponent(url)}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!proxyResponse.ok) {
        throw new Error(`CORS proxy error: ${proxyResponse.status}`);
      }

      const proxyData = await proxyResponse.json();
      if (!proxyData.contents) {
        throw new Error('No content received from CORS proxy');
      }

      console.log(`Successfully fetched content via CORS proxy for ${url}`);
      return this.parseRSSXML(proxyData.contents, url);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        errors.push('CORS proxy timeout');
      } else {
        errors.push(error instanceof Error ? error.message : 'CORS proxy failed');
      }
    }

    // If all methods fail, throw error with details
    console.warn(`Failed to fetch ${url}:`, errors.join(', '));
    throw new Error(`Failed to fetch RSS feed from ${url}. Tried multiple methods: ${errors.join(', ')}`);
  },

  generateDemoResults(searchUrl: string): any[] {
    const query = searchUrl.includes('query/') ? decodeURIComponent(searchUrl.split('query/')[1].split('?')[0]) : 'News';
    
    return [
      {
        title: `${query} - Latest Breaking News`,
        description: `Recent developments about ${query}. This is a demo result showing how search would work.`,
        link: '#demo',
        pubDate: new Date().toISOString(),
        guid: `demo-${query}-1`
      },
      {
        title: `${query} Analysis and Insights`,
        description: `In-depth analysis of ${query} trends and market implications.`,
        link: '#demo',
        pubDate: new Date(Date.now() - 3600000).toISOString(),
        guid: `demo-${query}-2`
      }
    ];
  },

  buildSearchRSSUrls(_query: string, _language: string, category: string, country: string): string[] {
    const urls: string[] = [];
    
    // Use reliable RSS feeds instead of Google News search (which has CORS issues)
    // Focus on working RSS feeds that are likely to contain relevant content
    
    if (category === 'technology') {
      // Tech RSS feeds that work reliably
      urls.push('https://feeds.feedburner.com/oreilly/radar');
      urls.push('https://techcrunch.com/feed/');
      urls.push('https://www.theverge.com/rss/index.xml');
      if (country === 'in') {
        urls.push('https://www.medianama.com/feed/');
      }
    } else if (category === 'business') {
      urls.push('https://feeds.reuters.com/reuters/businessNews');
      urls.push('https://feeds.feedburner.com/businessinsider');
      if (country === 'in') {
        urls.push('https://economictimes.indiatimes.com/rssfeedstopstories.cms');
        urls.push('https://www.business-standard.com/rss/home_page_top_stories.rss');
      }
    } else if (category === 'sports') {
      urls.push('https://www.espn.com/espn/rss/news');
      urls.push('https://feeds.skysports.com/feeds/11095');
      if (country === 'in') {
        urls.push('https://sports.ndtv.com/rss/latest');
        urls.push('https://www.cricbuzz.com/rss-feed/cricket-news');
      }
    } else if (category === 'general') {
      urls.push('https://feeds.bbci.co.uk/news/rss.xml');
      urls.push('https://rss.cnn.com/rss/edition.rss');
      if (country === 'in') {
        urls.push('https://timesofindia.indiatimes.com/rssfeedstopstories.cms');
        urls.push('https://www.thehindu.com/feeder/default.rss');
      }
    } else if (category === 'entertainment') {
      urls.push('https://feeds.feedburner.com/variety/headlines');
      if (country === 'in') {
        urls.push('https://www.bollywoodhungama.com/rss/news.xml');
      }
    } else if (category === 'health') {
      urls.push('https://feeds.feedburner.com/webmd/health-news');
      urls.push('https://www.medicalnewstoday.com/feeds/news.xml');
    } else if (category === 'science') {
      urls.push('https://feeds.feedburner.com/sciencedaily');
      urls.push('https://www.nature.com/nature.rss');
    }
    
    // Add some general international sources for broader coverage
    urls.push('https://feeds.reuters.com/Reuters/worldNews');
    
    return urls.filter(url => url); // Remove any undefined URLs
  },

  validateRSSUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      // More flexible URL validation - many feeds don't have obvious indicators in the URL
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  },

};
