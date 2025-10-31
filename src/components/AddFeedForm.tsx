import { useState } from 'react';
import { RSSFeed } from '../types';
import { storageService } from '../services/storage';
import { rssService } from '../services/rss';
import { Plus, X } from 'lucide-react';

interface AddFeedFormProps {
  onFeedAdded: () => void;
}

export function AddFeedForm({ onFeedAdded }: AddFeedFormProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <form className="add-feed-form" onSubmit={handleSubmit}>
      <h2>Add RSS Feed</h2>
      
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
  );
}
