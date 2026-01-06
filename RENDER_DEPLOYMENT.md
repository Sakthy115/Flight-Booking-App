# 🚀 Deploy to Render - Complete Guide

This guide will walk you through deploying **both frontend and backend** to Render.com (100% free tier available).

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Render account (sign up at [render.com](https://render.com))
- [ ] Your code pushed to GitHub

---

## 🎯 Deployment Overview

We'll deploy:
1. **Backend** → Render Web Service (Go)
2. **Frontend** → Render Static Site (React)

**Total time: ~20 minutes**

---

## 📦 Step 1: Prepare Your Code

### 1.1 Push to GitHub

If you haven't already:

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Flight Booking App"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/flight-booking-app.git
git branch -M main
git push -u origin main
```

### 1.2 Create Render Configuration (Optional but Recommended)

I've created a `render.yaml` file for you that automates the deployment.

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Create Backend Web Service

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click **"New +"** → **"Web Service"**

2. **Connect GitHub Repository**
   - Click **"Connect account"** under GitHub
   - Authorize Render to access your repositories
   - Select your `flight-booking-app` repository

3. **Configure Backend Service**

   Fill in the following settings:

   | Setting | Value |
   |---------|-------|
   | **Name** | `flight-booking-backend` |
   | **Region** | Choose closest to you (e.g., Oregon, Frankfurt) |
   | **Branch** | `main` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Go` |
   | **Build Command** | `go build -o main .` |
   | **Start Command** | `./main` |
   | **Instance Type** | `Free` |

4. **Add Environment Variables** (Optional)

   Click **"Advanced"** → **"Add Environment Variable"**:
   
   | Key | Value |
   |-----|-------|
   | `PORT` | `8080` |
   | `GIN_MODE` | `release` |

5. **Create Web Service**
   - Click **"Create Web Service"**
   - Wait 2-5 minutes for deployment
   - You'll see build logs in real-time

6. **Copy Your Backend URL**
   - Once deployed, you'll see: `https://flight-booking-backend-xxxx.onrender.com`
   - **Copy this URL** - you'll need it for the frontend!

### 2.2 Verify Backend is Running

Test your backend:
```
https://flight-booking-backend-xxxx.onrender.com/api/health
```

You should see a response (or 404 if health endpoint doesn't exist - that's okay).

---

## 🎨 Step 3: Deploy Frontend to Render

### 3.1 Update Frontend API Configuration

**IMPORTANT:** Before deploying frontend, update the API URL.

Edit `frontend/src/services/api.ts`:

```typescript
// Change from:
const API_BASE_URL = 'http://localhost:8080';

// To your Render backend URL:
const API_BASE_URL = 'https://flight-booking-backend-xxxx.onrender.com';
```

**Commit and push this change:**
```powershell
git add frontend/src/services/api.ts
git commit -m "Update API URL for production"
git push
```

### 3.2 Create Frontend Static Site

1. **Go to Render Dashboard**
   - Click **"New +"** → **"Static Site"**

2. **Connect Same Repository**
   - Select your `flight-booking-app` repository

3. **Configure Frontend Service**

   | Setting | Value |
   |---------|-------|
   | **Name** | `flight-booking-frontend` |
   | **Branch** | `main` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |

4. **Add Environment Variables** (if needed)

   Click **"Advanced"** → **"Add Environment Variable"**:
   
   | Key | Value |
   |-----|-------|
   | `NODE_VERSION` | `18` |

5. **Create Static Site**
   - Click **"Create Static Site"**
   - Wait 3-5 minutes for build and deployment
   - Watch the build logs

6. **Your App is Live!** 🎉
   - You'll get a URL like: `https://flight-booking-frontend.onrender.com`
   - Click it to see your live app!

---

## ✅ Step 4: Verify Everything Works

### 4.1 Test Your Live App

1. **Open your frontend URL**
   - `https://flight-booking-frontend.onrender.com`

2. **Test Flight Search**
   - Origin: `JFK`
   - Destination: `LAX`
   - Select dates and passengers
   - Click Search

3. **Check WebSocket Connection**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for WebSocket connection messages
   - Prices should update in real-time

### 4.2 Troubleshooting

**If frontend can't connect to backend:**

1. Check CORS settings in `backend/internal/router/router.go`:
   ```go
   config := cors.DefaultConfig()
   config.AllowOrigins = []string{
       "http://localhost:5173",
       "https://flight-booking-frontend.onrender.com", // Add this
   }
   ```

2. Commit and push:
   ```powershell
   git add backend/internal/router/router.go
   git commit -m "Update CORS for production"
   git push
   ```

3. Render will auto-deploy the changes

**If WebSocket doesn't work:**

- Render free tier supports WebSockets ✅
- Check browser console for errors
- Verify WebSocket URL uses `wss://` (not `ws://`)

---

## 🔄 Step 5: Automatic Deployments

### Enable Auto-Deploy

Both services are now set up for **automatic deployment**:

- Every time you push to `main` branch
- Render automatically rebuilds and deploys
- No manual intervention needed!

### Manual Redeploy

If needed, you can manually redeploy:

1. Go to Render Dashboard
2. Select your service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Backend Web Service | Free | $0/month |
| Frontend Static Site | Free | $0/month |
| **Total** | | **$0/month** |

### Free Tier Limitations

- ⚠️ **Backend sleeps after 15 min of inactivity**
  - First request after sleep takes ~30 seconds
  - Subsequent requests are fast
- ✅ **750 hours/month** (enough for one service 24/7)
- ✅ **100 GB bandwidth/month**
- ✅ **Automatic HTTPS**
- ✅ **Custom domains supported**

### Upgrade Options

If you need 24/7 uptime without cold starts:

- **Starter Plan**: $7/month per service
- No sleep, faster builds, more resources

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain

1. **In Render Dashboard**
   - Select your frontend service
   - Go to **"Settings"** → **"Custom Domains"**
   - Click **"Add Custom Domain"**

2. **Enter Your Domain**
   - Example: `flightbooking.com`

3. **Update DNS Records**
   - Add CNAME record in your domain registrar
   - Point to Render's URL

4. **SSL Certificate**
   - Render automatically provisions SSL
   - Your site will be HTTPS

---

## 📊 Monitoring & Logs

### View Logs

**Backend Logs:**
1. Go to backend service in Render
2. Click **"Logs"** tab
3. See real-time server logs

**Frontend Build Logs:**
1. Go to frontend service
2. Click **"Events"** tab
3. See build and deployment history

### Metrics

- View request counts
- Monitor response times
- Track bandwidth usage

---

## 🔧 Advanced Configuration

### Using render.yaml (Infrastructure as Code)

Create `render.yaml` in your project root for automated setup:

```yaml
services:
  - type: web
    name: flight-booking-backend
    runtime: go
    buildCommand: go build -o main .
    startCommand: ./main
    rootDir: backend
    envVars:
      - key: PORT
        value: 8080
      - key: GIN_MODE
        value: release
    
  - type: web
    name: flight-booking-frontend
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    rootDir: frontend
    envVars:
      - key: NODE_VERSION
        value: 18
```

Push this file and Render will auto-configure everything!

---

## 🎯 Quick Reference

### Backend URLs
- **Service URL**: `https://flight-booking-backend-xxxx.onrender.com`
- **API Endpoint**: `https://flight-booking-backend-xxxx.onrender.com/api`
- **WebSocket**: `wss://flight-booking-backend-xxxx.onrender.com/ws/prices`

### Frontend URLs
- **Live Site**: `https://flight-booking-frontend.onrender.com`

### Important Files to Update
- `frontend/src/services/api.ts` - API base URL
- `backend/internal/router/router.go` - CORS settings

---

## 📝 Deployment Checklist

Before going live:

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] API URL updated in frontend
- [ ] CORS configured for production domain
- [ ] WebSocket connection working
- [ ] Flight search working
- [ ] Seat selection working
- [ ] Booking flow complete
- [ ] No console errors in browser
- [ ] Mobile responsive (test on phone)

---

## 🆘 Common Issues & Solutions

### Issue: "Build Failed"

**Solution:**
- Check build logs in Render
- Verify `go.mod` and `package.json` are committed
- Ensure build commands are correct

### Issue: "Service Unavailable"

**Solution:**
- Backend might be sleeping (free tier)
- Wait 30 seconds and refresh
- Check if service is running in Render dashboard

### Issue: "CORS Error"

**Solution:**
- Update CORS settings in backend
- Add your frontend domain to allowed origins
- Redeploy backend

### Issue: "WebSocket Connection Failed"

**Solution:**
- Use `wss://` instead of `ws://` in production
- Check backend logs for WebSocket errors
- Verify Render supports WebSocket (it does!)

---

## 🎉 Congratulations!

Your flight booking app is now **live on the internet**! 

Share your app:
- ✈️ **Frontend**: `https://flight-booking-frontend.onrender.com`
- 🔌 **Backend**: `https://flight-booking-backend-xxxx.onrender.com`

**Next Steps:**
- Share with friends and get feedback
- Monitor usage in Render dashboard
- Consider upgrading if you get real traffic
- Add analytics (Google Analytics, etc.)
- Implement real payment gateway
- Connect to real flight APIs

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Go Deployment](https://render.com/docs/deploy-go)
- [Render Static Sites](https://render.com/docs/static-sites)
- [Render Free Tier](https://render.com/docs/free)

**Need help?** Check Render's community forum or their support docs!
