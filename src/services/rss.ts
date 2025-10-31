import { FeedData } from '../types';

// Multiple RSS parsing options
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';
const ALLORIGINS_API = 'https://api.allorigins.win/get';

export const rssService = {
  async fetchFeed(url: string): Promise<FeedData> {
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
