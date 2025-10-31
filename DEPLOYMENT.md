# Deployment Guide

This RSS Feeder app is a static web application that can be deployed to various free hosting platforms. Here are step-by-step instructions for different platforms:

## 1. Netlify (Recommended - Easiest)

### Option A: Drag & Drop
1. Build your app: `npm run build`
2. Go to [Netlify](https://netlify.com)
3. Drag the `dist` folder to the deploy area
4. Your app will be live instantly!

### Option B: Git Integration
1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com) and sign up
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build command: `npm run build`
6. Set publish directory: `dist`
7. Deploy!

## 2. Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign up
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite settings
6. Deploy!

## 3. GitHub Pages

1. Push your code to GitHub
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add to package.json scripts:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
4. Run: `npm run deploy`
5. Enable Pages in your repo settings

## 4. Surge.sh

1. Install Surge globally: `npm install -g surge`
2. Build your app: `npm run build`
3. Deploy: `surge dist/`
4. Follow the prompts to choose a domain

## 5. Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Set public directory to `dist`
5. Build: `npm run build`
6. Deploy: `firebase deploy`

## Environment Variables

The app doesn't require any environment variables, but you can add them if needed:

- Create `.env` file in project root
- Add variables with `VITE_` prefix
- Access with `import.meta.env.VITE_VARIABLE_NAME`

## Custom Domain

Most platforms support custom domains:
- Netlify: Domain management in dashboard
- Vercel: Add domain in project settings
- GitHub Pages: CNAME file in repository
- Surge: `surge dist/ your-domain.com`

## SSL/HTTPS

All recommended platforms provide free SSL certificates automatically.

## Performance Tips

1. The app is already optimized with:
   - Code splitting
   - Tree shaking
   - Minification
   - PWA caching

2. For better performance:
   - Enable gzip compression (usually automatic)
   - Use CDN (usually automatic on these platforms)
   - Consider adding analytics if needed

## Monitoring

- Most platforms provide analytics
- Add error tracking with services like Sentry if needed
- Monitor Core Web Vitals with Google PageSpeed Insights

## Cost

All mentioned platforms offer generous free tiers:
- Netlify: 100GB bandwidth/month
- Vercel: 100GB bandwidth/month  
- GitHub Pages: 1GB storage, 100GB bandwidth/month
- Surge: Unlimited projects
- Firebase: 1GB storage, 10GB bandwidth/month

Perfect for personal RSS reader usage!
