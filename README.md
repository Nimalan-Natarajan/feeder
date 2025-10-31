# 📡 Feeder
*crafted by Nimalan*

A beautiful, modern Progressive Web App (PWA) for reading RSS feeds with an Apple-inspired glassmorphism design. Experience news reading like never before with intelligent categorization and stunning visual effects.

🚀 **[Try Live Demo](https://feeder-dev.netlify.app/)** | 📱 **Mobile Optimized** | 🌓 **Dark Mode Ready**

## ✨ Features

### 🎨 **Design & Experience**
- 🌟 **Glassmorphism UI**: Beautiful glass-like effects with backdrop blur
- 🌓 **Dark/Light Mode**: Seamless theme switching with perfect contrast
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop
- 🍎 **Apple-Inspired**: Clean, modern interface following Apple design principles
- ✨ **Smooth Animations**: Fluid transitions and hover effects

### 📰 **Smart Feed Management**
- 🏷️ **Category-Based Selection**: Choose feeds by categories instead of individual URLs
- 🌍 **Multi-Language Support**: Organized by English and Tamil content
- � **Duplicate Prevention**: Smart detection prevents adding the same feed twice
- 🔍 **Advanced Filtering**: Filter feeds by language and category
- 📊 **Feed Statistics**: View feed counts and organization at a glance

### 🎯 **Curated Content**
- 📋 **17+ Suggested Feeds**: Handpicked quality RSS sources
- 🇮🇳 **Indian Focus**: Times of India, OneIndia Tamil, and more
- 📚 **Multiple Categories**: News, Technology, Sports, Business, Entertainment, etc.
- 🎨 **Clean Interface**: No clutter, just pure content focus

### 💾 **Storage & Sync**
- 🔒 **Local Storage**: All data stored securely in your browser
- 🔖 **Bookmark System**: Save articles for later reading
- 💫 **No Account Required**: Start using immediately
- 🚀 **Offline Support**: Works without internet after initial load

### 🛠️ **Developer Features**
- 🌐 **PWA Ready**: Install as native app on any device
- ⚡ **Vite Powered**: Lightning-fast development and builds
- 📱 **Service Worker**: Background sync and caching
- 🎯 **TypeScript**: Full type safety throughout

## 🚀 Quick Start

### Development Setup
```bash
# Clone the repository
git clone https://github.com/Nimalan-Natarajan/feeder.git
cd feeder

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview
```

## 📖 How to Use

### 🎯 **Getting Started**
1. **Choose Your Language**: Select English or Tamil content sections
2. **Pick Categories**: Click on categories like News, Tech, Sports to select multiple feeds at once
3. **Smart Selection**: Each category represents multiple quality RSS sources
4. **One-Click Add**: Select categories and add all feeds with one click

### 🔍 **Managing Feeds**
- **Filter by Language**: Use dropdown to show only English or Tamil feeds
- **Filter by Category**: Filter by News, Technology, Sports, etc.
- **Remove Feeds**: Click the trash icon to remove unwanted feeds
- **Refresh Content**: Use the refresh button to get latest articles

### 🔖 **Reading Experience**
- **Article Preview**: See 5 articles per feed by default
- **Expand Articles**: Click "Show All" to see complete feed content
- **Bookmark Articles**: Save interesting articles for later
- **Visit Source**: Direct links to original articles and websites

## 🌐 Deployment

### 🎯 **Netlify (Recommended)**
```bash
# Build the project
npm run build

# Method 1: Direct folder deployment
# Drag the 'dist' folder to netlify.com

# Method 2: Git integration
# Connect your GitHub repo for auto-deployment
```

### 🚀 **Other Hosting Options**
- **[Netlify](https://netlify.com)** - Drag & drop deployment + auto-deploy from Git
- **[Vercel](https://vercel.com)** - Git-based deployment with instant previews
- **[GitHub Pages](https://pages.github.com)** - Free hosting for GitHub repositories
- **[Surge.sh](https://surge.sh)** - Simple command-line deployment
- **[Firebase Hosting](https://firebase.google.com/products/hosting)** - Google's static hosting

### 📋 **Build Configuration**
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: `18+`
- **SPA Routing**: Includes `_redirects` file for proper routing

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Full type safety and IntelliSense
- **Vite** - Lightning-fast build tool and dev server
- **CSS3** - Custom properties, flexbox, grid, glassmorphism effects

### **Features**
- **PWA Plugin** - Service worker, offline support, app installation
- **Lucide React** - Beautiful, consistent icon library
- **Date-fns** - Lightweight date formatting and manipulation
- **RSS2JSON Proxy** - CORS-friendly RSS feed parsing

### **Architecture**
- **Component-Based** - Modular, reusable React components
- **Custom Hooks** - `useRSSFeed` for feed management
- **Local Storage** - Client-side data persistence
- **Service Architecture** - Separate services for storage, RSS, and utilities

## 📱 Browser Support

**Full Support:**
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

**PWA Features:**
- Chrome/Edge 67+
- Firefox 63+
- Safari 11.1+

**Mobile Browsers:**
- Chrome Mobile
- Safari iOS
- Samsung Internet
- Firefox Mobile

## 🔐 Privacy & Security

**Privacy First:**
- 🔒 All data stored locally in your browser
- 🚫 No user tracking or analytics
- 🛡️ No cookies or session storage
- 🌐 Only fetches RSS feeds from sources you choose

**Security Features:**
- ✅ CORS-compliant RSS fetching
- 🔍 URL validation for RSS feeds
- 🚫 No external scripts or trackers
- 🛡️ Content Security Policy ready

## 📊 Curated Feed Sources

### **English Content**
- **Times of India**: News, World, Business, Sports, Cricket, Science, Technology, Auto, Entertainment
- **Quality Sources**: Handpicked for reliability and content quality

### **Tamil Content**
- **OneIndia Tamil**: News, Technology, Health, Spiritual, Automobiles, Weather
- **Regional Focus**: Local news and culturally relevant content

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

MIT License - feel free to use, modify, and distribute!

---

**Made with ❤️ by Nimalan** | [GitHub](https://github.com/Nimalan-Natarajan) | [Live Demo](https://feeder-dev.netlify.app/)
