# FurniNest - Render Deployment Guide

This guide provides step-by-step instructions for deploying FurniNest to Render.com.

---

## Prerequisites

1. **GitHub Account** - Your code must be pushed to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas Account** - For production database (free tier available)

---

## Step 1: Setup MongoDB Atlas

### Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Click **"Build a Database"**
4. Choose **"M0 Sandbox"** (Free tier)
5. Select a region (choose closest to your users)
6. Name your cluster (e.g., `furninest-cluster`)
7. Click **"Create"**

### Configure Database Access

1. Go to **Database Access** → **Add New Database User**
2. Choose **Password Authentication**
3. Username: `furninest` (or your choice)
4. Password: Generate a strong password (save this!)
5. Click **"Create User"**

### Configure Network Access

1. Go to **Network Access** → **Add IP Address**
2. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
3. Click **"Confirm"**

### Get Connection String

1. Go to **Database** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select **Node.js** version
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `furninest`

**Example:**
```
mongodb+srv://furninest:your_password@furninest-cluster.xxxxx.mongodb.net/furninest?retryWrites=true&w=majority
```

---

## Step 2: Push Code to GitHub

```bash
# Initialize git if not already done
cd /Users/istiakahmmedshifat/Documents/farnichar\ buy\ sell
git init
git add .
git commit -m "Ready for Render deployment"

# Create repository on GitHub first, then:
git remote add origin https://github.com/your-username/furninest.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

### Create Backend Service

1. Go to [render.com](https://render.com) and log in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name:** `furninest-backend`
- **Region:** Choose closest to your MongoDB region
- **Branch:** `main`

**Build & Deploy:**
- **Runtime:** `Node`
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`

**Advanced:**
- **Instance Type:** `Free` (or Standard for better performance)

### Add Environment Variables

Go to **Environment** section and add these variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGO_URI` | Your MongoDB connection string | From Step 1 |
| `JWT_SECRET` | Generate a secure random string (min 32 chars) | For token encryption |
| `FRONTEND_URL` | Leave empty for now (will add after frontend deploy) | For CORS |
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `10000` | Render's default port |

**Generate JWT Secret:**
```bash
# Run this in terminal to generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Deploy

Click **"Create Web Service"** and wait for deployment to complete.

**Note:** First deployment may take 5-10 minutes.

### Get Backend URL

After deployment, copy your backend URL:
```
https://furninest-backend.onrender.com
```

---

## Step 4: Deploy Frontend to Render

### Create Frontend Service

1. Go back to Render dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect the same GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name:** `furninest-frontend`
- **Branch:** `main`

**Build & Deploy:**
- **Build Command:** `cd frontend && npm install && npm run build`
- **Publish Directory:** `frontend/dist`
- **Add Root Redirect:** No

### Add Environment Variables

Go to **Environment** section and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | Your backend URL from Step 3 | e.g., `https://furninest-backend.onrender.com` |
| `VITE_GOOGLE_CLIENT_ID` | Your Google OAuth client ID (optional) | For Google login |

### Deploy

Click **"Create Static Site"** and wait for deployment.

### Get Frontend URL

After deployment, copy your frontend URL:
```
https://furninest-frontend.onrender.com
```

---

## Step 5: Update Backend CORS

1. Go to your backend service on Render
2. Click **"Environment"**
3. Update `FRONTEND_URL` to your frontend URL:
   ```
   https://furninest-frontend.onrender.com
   ```
4. Click **"Save Changes"** - this will trigger a redeploy

---

## Step 6: Test Deployment

### Test Backend Health

```bash
curl https://furninest-backend.onrender.com/api/health
```

Expected response:
```json
{"status":"ok","message":"Backend is running"}
```

### Test Frontend

1. Open your frontend URL in browser
2. Try to:
   - Register a new user
   - Login
   - Browse listings
   - Create a listing (with image upload)
   - Mark item as sold

---

## Step 7: Seed Initial Data (Optional)

If you want to add sample categories and listings:

1. SSH into your backend service (Render doesn't support SSH directly)
2. Instead, create a temporary seed endpoint or run locally with production database

**Alternative:** Use the API to create categories manually through the frontend admin panel.

---

## Troubleshooting

### Issue: Backend deployment fails

**Solution:**
- Check Render logs for errors
- Ensure `package.json` has correct `start` script
- Verify all dependencies are in `dependencies` (not `devDependencies`)

### Issue: Frontend can't connect to backend

**Solution:**
- Check `VITE_API_URL` is correct in frontend environment variables
- Verify backend CORS allows your frontend URL
- Check backend is running (visit `/api/health` endpoint)

### Issue: MongoDB connection timeout

**Solution:**
- Verify IP whitelist in MongoDB Atlas includes `0.0.0.0/0`
- Check connection string is correct
- Ensure cluster is created (not just provisioned)

### Issue: File uploads not working

**Solution:**
- Render's free tier doesn't have persistent storage
- Files will be lost on redeploy
- **Solution:** Upgrade to paid plan or use cloud storage (S3, Cloudinary)

### Issue: "Port already in use"

**Solution:**
- Render automatically sets the port
- Don't hardcode port in code
- Use `process.env.PORT` in your server.js

---

## Free Tier Limitations

Render's free tier has some limitations:

- **Backend:** Spins down after 15 minutes of inactivity (cold start ~30 seconds)
- **Frontend:** Always available (static site)
- **File Storage:** Not persistent on free tier
- **Database:** Use MongoDB Atlas free tier instead

---

## Production Recommendations

For production use:

1. **Upgrade to paid Render plan** for:
   - No spin-down time
   - Persistent file storage
   - Better performance

2. **Use cloud storage for uploads:**
   - AWS S3
   - Cloudinary
   - Google Cloud Storage

3. **Add monitoring:**
   - Render logs
   - Error tracking (Sentry)
   - Analytics

4. **Enable custom domain:**
   - Buy domain (Namecheap, GoDaddy, etc.)
   - Configure in Render dashboard
   - Update DNS records

---

## Environment Variables Summary

### Backend (Render Web Service)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/furninest
JWT_SECRET=your_secure_random_string_min_32_chars
FRONTEND_URL=https://furninest-frontend.onrender.com
NODE_ENV=production
PORT=10000
```

### Frontend (Render Static Site)
```
VITE_API_URL=https://furninest-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Support

- **Render Docs:** https://render.com/docs
- **MongoDB Atlas Docs:** https://docs.mongodb.com/atlas
- **Project Issues:** Check GitHub issues

---

**Last Updated:** June 25, 2026
