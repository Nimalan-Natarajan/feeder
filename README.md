# RSS Feeder

A modern, responsive Progressive Web App (PWA) for reading RSS feeds. Works seamlessly on both desktop and mobile devices.

## Features

- 📱 **Mobile-First Design**: Responsive interface that works great on all devices
- 🔖 **Bookmark Articles**: Save articles for later reading
- 💾 **Local Storage**: All data stored locally - no server required
- 🌐 **PWA Support**: Install as an app on your device
- 🔄 **Auto-Refresh**: Refresh feeds to get the latest articles
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Usage

1. **Add RSS Feeds**: Click "Add Feed" and enter the RSS URL
2. **Browse Articles**: View articles from all your subscribed feeds
3. **Bookmark Articles**: Click the bookmark icon to save articles
4. **Read Later**: Access your bookmarked articles anytime

## Deployment

Since this is a client-side only application, you can deploy it to any static hosting service for free:

- **Netlify**: Drop the `dist` folder after building
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Push to a GitHub repository and enable Pages
- **Surge.sh**: Deploy with `surge dist/`

## Free Hosting Options

- [Netlify](https://netlify.com) - Drag and drop deployment
- [Vercel](https://vercel.com) - Git-based deployment
- [GitHub Pages](https://pages.github.com) - Free hosting for GitHub repos
- [Surge.sh](https://surge.sh) - Simple static web publishing

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **PWA Plugin** - Progressive Web App capabilities
- **Lucide React** - Modern icons
- **Date-fns** - Date formatting

## Browser Support

Works in all modern browsers with PWA support:
- Chrome/Edge 67+
- Firefox 63+
- Safari 11.1+

## Privacy

This app respects your privacy:
- All data stored locally in your browser
- No tracking or analytics
- No data sent to external servers (except RSS feed fetching)
- Works offline after initial load

## License

MIT License - feel free to use and modify as needed!
