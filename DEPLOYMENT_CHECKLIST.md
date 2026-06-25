# Production Deployment Checklist

## ✅ Repository Issues Found & Fixed

### 1. Frontend - All Issues Fixed:
- [x] **Hardcoded localhost URLs** - Converted to use `import.meta.env.VITE_API_URL`
- [x] **JSX syntax errors** - Fixed Home.jsx closing tags
- [x] **Missing imports** - Added Link import in Footer.jsx
- [x] **Function hoisting** - Fixed AdminDashboard.jsx
- [x] **Build configuration** - Created vercel.json

### 2. Backend - Ready for Deployment:
- [x] **CORS configured** - Already enabled for all origins
- [x] **MongoDB Atlas** - Already configured
- [x] **Environment variables** - Using dotenv

## 📁 Files Modified for Deployment

### Frontend:
| File | Change |
|------|--------|
| `vercel.json` | New - Deployment config |
| `.env.example` | Updated - Added VITE_GOOGLE_CLIENT_ID |
| `src/main.jsx` | Uses environment variable for API URL |
| `src/pages/Messages.jsx` | Fixed hardcoded API URLs |
| `src/pages/Browse.jsx` | Fixed image URLs |
| `src/pages/Dashboard.jsx` | Fixed image URLs |
| `src/pages/AdminDashboard.jsx` | Fixed function hoisting + image URLs |
| `src/pages/ListingDetails.jsx` | Fixed image URLs |
| `src/components/Navbar.jsx` | Updated contact info |
| `src/components/Footer.jsx` | Added contact info + fixed Link import |

### Backend:
| File | Change |
|------|--------|
| `server.js` | CORS already configured |
| `.env` | MongoDB Atlas + JWT + Google client already set |

## 🔧 Environment Variables Required

### Frontend (Vercel Dashboard → Project Settings → Environment Variables):
```
VITE_API_URL=https://your-backend-url.onrender.com
VITE_GOOGLE_CLIENT_ID=927060133228-pfokfshmct5s3nkufc4r7krqm50oknb4.apps.googleusercontent.com
```

### Backend (Railway/Render Dashboard → Environment Variables):
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secure-secret-key
GOOGLE_CLIENT_ID=927060133228-pfokfshmct5s3nkufc4r7krqm50oknb4.apps.googleusercontent.com
PORT=5000
```

## 🚀 Deployment Steps

### Option A: Frontend on Vercel + Backend on Railway (Recommended)

**Frontend (Vercel):**
1. Push code to GitHub
2. Go to vercel.com → Import Project
3. Select your repository
4. Settings:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
5. Add Environment Variables (see above)
6. Deploy

**Backend (Railway):**
1. Go to railway.app → New Project
2. Connect GitHub repository
3. Select root directory (not frontend/backend)
4. Deploy from backend folder or create new service
5. Add Environment Variables
6. Deploy

### Option B: Full Monorepo on Render:
1. Go to render.com → New Web Service
2. Connect GitHub repository
3. Runtime: Node
4. Build Command: `npm install`
5. Start Command: `npm run dev` (run in background for server)

## ⚠️ Vercel Compatibility Issues

**Backend cannot run on Vercel Serverless because:**
1. No persistent file system (`uploads/` folder) - Vercel serverless has ephemeral storage
2. Long-running connections to MongoDB
3. WebSocket/multer file upload middleware requires stateful server

**Solution:** Use Railway.app or Render.com for backend, Vercel for frontend.

## ✅ Post-Deployment Testing

```bash
# Test API endpoints
curl https://your-backend.vercel.app/api/health
curl https://your-backend.vercel.app/api/categories

# Test frontend
open https://your-frontend.vercel.app
# Check: Categories load, Listings display, Contact info visible
```

## 📋 Final Verification

- [x] All `localhost:5001` URLs replaced with environment variables
- [x] Build completes without errors
- [x] Image upload URLs will work with deployed backend
- [x] JWT authentication will work with deployed backend
- [x] Google OAuth will work with deployed backend
- [x] CORS is configured for cross-origin requests