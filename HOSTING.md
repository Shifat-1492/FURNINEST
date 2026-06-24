# FurniNest - Hosting & Deployment Guide

This guide explains how to prepare and deploy the FurniNest furniture marketplace.

---

## Pre-Deployment Checklist

### 1. **Environment Configuration**

#### Backend (.env)
Create `.env` in `backend/` folder with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key
PORT=5001
GOOGLE_CLIENT_ID=your_google_oauth_client_id (optional)
```

**MongoDB Options:**
- **Local**: `mongodb://localhost:27017/furninest` (development only)
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
- **Other providers**: Any MongoDB-compatible service

#### Frontend (.env)
Create `.env` in `frontend/` folder with:
```
VITE_API_URL=https://your-backend-domain.com
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

> **Note:** `VITE_API_URL` defaults to `http://localhost:5001` if not set. For production, set this to your deployed backend URL.

---

## Build Instructions

### Backend Build & Run

```bash
cd backend

# Install dependencies
npm install

# Start production server
npm start
# or with explicit port:
PORT=5001 node server.js

# Development (auto-reload):
npm run dev
```

**Backend serves on:** `http://localhost:5001`

### Frontend Build

```bash
cd frontend

# Install dependencies
npm install

# Build for production (creates dist/ folder)
npm run build

# Preview production build locally
npm run preview
```

**Frontend build output:** `frontend/dist/` folder — static HTML/JS/CSS files ready for hosting.

---

## Deployment Scenarios

### Scenario 1: **Render.com** (Recommended for Beginners)

#### Backend Deployment

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create **New → Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Name:** `furninest-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Publish directory:** Leave blank
6. Add environment variables (Settings → Environment):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `PORT` (set to `5001`)
7. Deploy

Backend URL: `https://furninest-backend.onrender.com`

#### Frontend Deployment

1. Build locally:
   ```bash
   cd frontend
   VITE_API_URL=https://furninest-backend.onrender.com npm run build
   ```
2. Create **New → Static Site**
3. Connect GitHub repo, set:
   - **Publish directory:** `frontend/dist`
4. Deploy

Frontend URL: `https://furninest-frontend.onrender.com`

---

### Scenario 2: **Vercel** (Frontend) + **Railway** (Backend)

#### Backend on Railway

1. Go to [railway.app](https://railway.app)
2. Create project → GitHub repo
3. Add environment variables from `.env`
4. Railway auto-deploys on push

#### Frontend on Vercel

1. Build frontend with correct API URL:
   ```bash
   VITE_API_URL=https://your-railway-backend-url npm run build
   ```
2. Go to [vercel.com](https://vercel.com)
3. Import frontend folder
4. Set build output directory to `frontend/dist`
5. Deploy

---

### Scenario 3: **Docker + Any Cloud** (AWS, Google Cloud, DigitalOcean)

#### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV PORT=5001
EXPOSE 5001

CMD ["npm", "start"]
```

#### Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

ARG VITE_API_URL=http://localhost:5001
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# Serve static files with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Frontend nginx.conf

Create `frontend/nginx.conf`:
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

#### Docker Compose (Local Testing)

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      MONGO_URI: mongodb://mongo:27017/furninest
      JWT_SECRET: dev_secret_key
      PORT: 5001
    depends_on:
      - mongo

  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_URL: http://localhost:5001
    ports:
      - "80:80"

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Run locally:
```bash
docker-compose up
# App runs on http://localhost
```

---

## Post-Deployment Tasks

### 1. **Database Setup**

If using MongoDB Atlas:
- Create a cluster
- Add IP whitelist (or allow all: `0.0.0.0/0` for testing)
- Get connection string and add to `.env`

If using local MongoDB:
- Install MongoDB locally or use Docker

### 2. **Seed Initial Data** (Optional)

Run seed script to add sample categories:
```bash
cd backend
node seed.js
```

### 3. **File Uploads Configuration**

Backend stores uploads in `backend/uploads/` folder. For production:
- **Option A:** Use persistent storage (EBS, Google Cloud Storage, etc.)
- **Option B:** Use S3 or similar (requires code changes to `multer` config)
- **Option C:** Set up NFS mount for multi-instance deployments

### 4. **CORS Configuration**

Update `backend/server.js` for production:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

### 5. **SSL/HTTPS**

- Render, Vercel, Railway, and most modern hosting services auto-enable HTTPS
- Update `VITE_API_URL` to use `https://` for production

---

## Environment Variables Summary

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `MONGO_URI` | ✅ Backend | `mongodb+srv://user:pass@cluster.mongodb.net/db` | MongoDB connection string |
| `JWT_SECRET` | ✅ Backend | `my_super_secure_random_key_123` | For token encryption |
| `PORT` | ❌ Backend | `5001` | Defaults to 5000 if omitted |
| `VITE_API_URL` | ❌ Frontend | `https://api.example.com` | Defaults to `http://localhost:5001` |
| `GOOGLE_CLIENT_ID` | ❌ Both | `xxxxx.apps.googleusercontent.com` | For Google OAuth (optional) |

---

## Performance Tips

1. **Frontend Caching:** Configure static asset caching (gzip, CDN)
2. **Database Indexing:** MongoDB queries use `title`, `category`, `status` — ensure indexed
3. **Image Optimization:** Limit upload size to 5MB (already enforced in code)
4. **Load Balancing:** Use reverse proxy (nginx) for multiple backend instances
5. **Monitoring:** Add logging service (Sentry, LogRocket, etc.)

---

## Troubleshooting

### Issue: Frontend can't reach backend
**Solution:** Check `VITE_API_URL` env var — must match backend URL

### Issue: Uploads not working
**Solution:** Ensure `backend/uploads/` directory exists and is writable

### Issue: MongoDB connection timeout
**Solution:** Check IP whitelist in MongoDB Atlas, or verify connection string

### Issue: "Port already in use"
**Solution:** Change `PORT` in `.env`, or kill existing process using that port

---

## Quick Start for Production

```bash
# 1. Clone repo
git clone <repo-url>
cd farnichar\ buy\ sell

# 2. Setup backend
cd backend
cp .env.example .env
# Edit .env with production values
npm install
npm start

# 3. Setup frontend (in new terminal)
cd frontend
cp .env.example .env
# Edit .env with production API URL
npm install
npm run build
# Deploy dist/ folder to static hosting

# Done! Visit https://your-frontend-url
```

---

## Support & Resources

- **MongoDB Docs:** https://docs.mongodb.com
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Docker Docs:** https://docs.docker.com
- **Express.js:** https://expressjs.com
- **React/Vite:** https://vitejs.dev

---

**Last Updated:** June 24, 2026
