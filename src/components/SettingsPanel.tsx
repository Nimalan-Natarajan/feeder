import { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Monitor } from 'lucide-react';

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

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto theme - use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    applyTheme(settings.theme);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-secondary"
        title="Settings"
        style={{ position: 'fixed', bottom: '20px', right: '20px', borderRadius: '50%', width: '56px', height: '56px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      >
        <Settings size={20} />
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', maxWidth: '400px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0 }}>Settings</h2>
          <button onClick={() => setIsOpen(false)} className="btn-secondary">×</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Theme</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'dark', label: 'Dark', icon: Moon },
              { value: 'auto', label: 'Auto', icon: Monitor }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => updateSettings({ theme: value as any })}
                className={`btn-secondary ${settings.theme === value ? 'active' : ''}`}
                style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
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

        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px', color: '#64748b' }}>
          <p style={{ margin: 0, marginBottom: '8px' }}><strong>Privacy Notice:</strong></p>
          <p style={{ margin: 0 }}>All your data is stored locally in your browser. Nothing is sent to external servers except for fetching RSS feeds.</p>
        </div>
      </div>
    </div>
  );
}
