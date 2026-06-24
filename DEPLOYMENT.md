# Vercel Hosting Guide

## 🚀 Frontend Deployment (Netlify/Vercel)

### 1. Create `.env.production`:
```
VITE_API_URL=https://your-backend-url.vercel.app
VITE_GOOGLE_CLIENT_ID=927060133228-pfokfshmct5s3nkufc4r7krqm50oknb4.apps.googleusercontent.com
```

### 2. Vercel Settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `frontend`

### 3. Environment Variables (Vercel Dashboard):
Add these in Project Settings → Environment Variables:
- `VITE_API_URL` - Your deployed backend URL
- `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth client ID

## 🔧 Backend Deployment (Railway/Render/Render)

MongoDB Atlas is already configured. You'll need to deploy the backend separately.

### Recommended: Railway.app
1. Create account at railway.app
2. Connect GitHub repository
3. Add environment variables:
   - `MONGO_URI` - Already set in your `.env`
   - `JWT_SECRET` - Already set
   - `GOOGLE_CLIENT_ID` - Already set
   - `PORT` - Let Railway set this automatically

## 📋 Quick Commands

```bash
# Test production build locally
cd frontend && npm run build && npm run preview

# Deploy frontend only (Vercel)
# Push to GitHub and connect to Vercel

# Deploy backend only (Railway)
# Push to GitHub and connect to Railway
```

## 🔗 After Deployment

Update `VITE_API_URL` in Vercel to point to your deployed backend URL.