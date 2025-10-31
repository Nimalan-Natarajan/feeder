import { useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { Settings, Moon, Sun, Monitor, Download, Upload, RotateCcw } from 'lucide-react';

interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  refreshInterval: number; // minutes
  articlesPerFeed: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'auto',
  refreshInterval: 30,
  articlesPerFeed: 20
};

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('app-settings');
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('app-settings', JSON.stringify(updated));
    
    // Apply theme immediately
    if (newSettings.theme) {
      applyTheme(newSettings.theme);
    }
  };

  const handleResetData = () => {
    const feeds = storageService.getFeeds();
    const bookmarks = storageService.getBookmarks();
    const categories = storageService.getCategories();
    
    const confirmMessage = `Are you sure you want to reset all data?\n\nThis will permanently delete:\n• ${feeds.length} RSS feeds\n• ${bookmarks.length} bookmarked articles\n• ${categories.length} categories\n• App settings\n\nThis action cannot be undone.\n\nTip: Use "Export Data" first to create a backup!`;
    
    if (confirm(confirmMessage)) {
      // Clear all data using storage service
      storageService.resetAllData();
      localStorage.removeItem('app-settings');
      
      // Reset settings to default
      setSettings(DEFAULT_SETTINGS);
      applyTheme(DEFAULT_SETTINGS.theme);
      
      // Show success message and reload
      alert('All data has been successfully reset!');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    try {
      const dataJson = storageService.exportData();
      const blob = new Blob([dataJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rss-feeder-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export data. Please try again.');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const success = storageService.importData(content);
            if (success) {
              alert('Data imported successfully! The page will reload to apply changes.');
              window.location.reload();
            } else {
              alert('Failed to import data. Please check the file format.');
            }
          } catch (error) {
            alert('Failed to read the file. Please try again.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    // Remove any existing theme
    root.removeAttribute('data-theme');
    
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      // Auto theme - use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
      }
    }
  };

  useEffect(() => {
    applyTheme(settings.theme);
    
    // Listen for system theme changes when in auto mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (settings.theme === 'auto') {
        applyTheme('auto');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [settings.theme]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="settings-fab"
        title="Settings"
      >
        <Settings size={20} />
      </button>
    );
  }

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
        </div>

        <div className="setting-group">
          <label className="setting-label">Theme</label>
          <div className="theme-buttons">
            {[
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'dark', label: 'Dark', icon: Moon },
              { value: 'auto', label: 'Auto', icon: Monitor }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => updateSettings({ theme: value as any })}
                className={`theme-btn ${settings.theme === value ? 'active' : ''}`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Auto-refresh interval: {settings.refreshInterval} minutes
          </label>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={settings.refreshInterval}
            onChange={(e) => updateSettings({ refreshInterval: parseInt(e.target.value) })}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            <span>5 min</span>
            <span>2 hours</span>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Articles per feed: {settings.articlesPerFeed}
          </label>
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={settings.articlesPerFeed}
            onChange={(e) => updateSettings({ articlesPerFeed: parseInt(e.target.value) })}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            <span>10</span>
            <span>50</span>
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">Data Management</label>
          
          <div className="data-stats">
            <div className="stat-item">
              <span className="stat-value">{storageService.getFeeds().length}</span>
              <span className="stat-label">RSS Feeds</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{storageService.getBookmarks().length}</span>
              <span className="stat-label">Bookmarks</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{storageService.getCategories().length}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
          
          <div className="data-management-buttons">
            <button
              onClick={handleExportData}
              className="data-btn export-btn"
              title="Export all your data as a backup file"
            >
              <Download size={16} />
              Export Data
            </button>
            
            <button
              onClick={handleImportData}
              className="data-btn import-btn"
              title="Import data from a backup file"
            >
              <Upload size={16} />
              Import Data
            </button>
          </div>
          
          <button
            onClick={handleResetData}
            className="reset-btn"
            title="Clear all feeds, bookmarks, and categories"
          >
            <RotateCcw size={16} />
            Reset All Data
          </button>
          
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '8px 0 0 0' }}>
            Export creates a backup file. Import restores from backup. Reset permanently deletes everything.
          </p>
        </div>

        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px', color: '#64748b' }}>
          <p style={{ margin: 0, marginBottom: '8px' }}><strong>Privacy Notice:</strong></p>
          <p style={{ margin: 0 }}>All your data is stored locally in your browser. Nothing is sent to external servers except for fetching RSS feeds.</p>
        </div>
      </div>
    </div>
  );
}
