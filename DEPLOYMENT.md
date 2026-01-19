# Deployment Guide

This guide will help you deploy your Expense Tracker application online. Choose the option that best fits your needs.

## Quick Deploy Options

### 🚀 Option 1: Railway (Recommended - Easiest)

Railway is the easiest option for full-stack deployment:

1. **Sign up** at [railway.app](https://railway.app) (free tier available)

2. **Create new project** and connect your GitHub repository

3. **Configure settings:**
   - **Build Command:** `npm run install-all && npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** Leave empty (root)

4. **Add environment variables:**
   - `NODE_ENV=production`
   - `PORT` (Railway sets this automatically)

5. **Deploy!** Railway will automatically deploy your app

6. **Get your URL** - Railway provides a URL like `your-app.railway.app`

### 🌐 Option 2: Render (Free Tier Available)

1. **Sign up** at [render.com](https://render.com)

2. **Create new Web Service** and connect your repository

3. **Configure:**
   - **Environment:** Node
   - **Build Command:** `npm run install-all && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid)

4. **Add environment variables:**
   - `NODE_ENV=production`

5. **Deploy** - Render will build and deploy automatically

### 🎯 Option 3: Heroku (Classic Option)

1. **Install Heroku CLI:**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create app:**
   ```bash
   heroku create your-expense-tracker
   ```

4. **Set config:**
   ```bash
   heroku config:set NODE_ENV=production
   ```

5. **Deploy:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

6. **Open app:**
   ```bash
   heroku open
   ```

### 📦 Option 4: Split Deployment (Frontend + Backend Separately)

This gives you more control but requires managing two deployments:

#### Backend (Railway/Render)

1. Deploy backend to Railway or Render using the same steps above
2. Note your backend URL (e.g., `https://your-backend.railway.app`)

#### Frontend (Vercel/Netlify)

**For Vercel:**
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. **Framework Preset:** Create React App
4. **Root Directory:** `client`
5. **Build Command:** `npm run build`
6. **Output Directory:** `build`
7. **Environment Variables:**
   - `REACT_APP_API_URL=https://your-backend.railway.app/api`

**For Netlify:**
1. Sign up at [netlify.com](https://netlify.com)
2. Import your GitHub repository
3. **Base directory:** `client`
4. **Build command:** `npm run build`
5. **Publish directory:** `client/build`
6. **Environment Variables:**
   - `REACT_APP_API_URL=https://your-backend.railway.app/api`

## Post-Deployment Steps

1. **Test your deployment:**
   - Visit your app URL
   - Try adding an expense
   - Check if Excel upload works
   - Test CSV export

2. **Set up custom domain (optional):**
   - Most platforms allow custom domains
   - Follow platform-specific instructions

3. **Monitor your app:**
   - Check logs regularly
   - Monitor database size (SQLite has limits)
   - Consider upgrading if you need more resources

## Important Notes

### Database Persistence

- **SQLite files** are stored in the `data/` directory
- On platforms like Railway/Render, the filesystem is **ephemeral**
- For production, consider:
  - Using a persistent volume (Railway Pro, Render)
  - Migrating to PostgreSQL (recommended for production)
  - Using external storage (AWS S3, etc.)

### Environment Variables

Make sure to set these in your deployment platform:

- `NODE_ENV=production` (required)
- `PORT` (usually set automatically)
- `REACT_APP_API_URL` (only if splitting frontend/backend)

### File Uploads

The `uploads/` directory is used temporarily for Excel file processing. Files are deleted after processing. For production, consider using cloud storage.

## Troubleshooting

### Build Fails

- Check Node.js version (should be 14+)
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors

### API Not Working

- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings in `server/index.js`
- Ensure backend is running and accessible

### Database Issues

- SQLite database is created automatically
- Check file permissions
- Ensure `data/` directory exists

## Need Help?

- Check platform-specific documentation
- Review error logs in your deployment platform
- Ensure all environment variables are set correctly

## Recommended for Small Business

For a small business, I recommend **Railway** or **Render** because:
- ✅ Free tier available
- ✅ Easy deployment
- ✅ Automatic HTTPS
- ✅ Good performance
- ✅ Simple setup

Start with the free tier and upgrade when needed!
