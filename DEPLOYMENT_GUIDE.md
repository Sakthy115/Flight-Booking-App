# 🚀 Flight Booking App - Deployment Guide

This guide will help you deploy your flight booking application to the web so anyone can access it online.

## 📋 Table of Contents

1. [Quick Deployment (Easiest)](#quick-deployment-easiest)
2. [Production Deployment (Recommended)](#production-deployment-recommended)
3. [Advanced Deployment](#advanced-deployment)

---

## 🎯 Quick Deployment (Easiest)

### Option 1: Deploy to Vercel (Frontend) + Render (Backend)

**Best for:** Quick deployment, free tier available, minimal configuration

#### **Step 1: Deploy Backend to Render**

1. **Create a Render account**: Go to [render.com](https://render.com) and sign up
2. **Connect your GitHub**: Push your code to GitHub first
3. **Create a new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name**: `flight-booking-api`
     - **Root Directory**: `backend`
     - **Environment**: `Go`
     - **Build Command**: `go build -o main .`
     - **Start Command**: `./main`
     - **Plan**: Free
4. **Add Environment Variables** (if needed):
   - `PORT`: 8080
5. **Deploy**: Click "Create Web Service"
6. **Note your backend URL**: e.g., `https://flight-booking-api.onrender.com`

#### **Step 2: Deploy Frontend to Vercel**

1. **Create a Vercel account**: Go to [vercel.com](https://vercel.com) and sign up
2. **Install Vercel CLI** (optional):
   ```powershell
   npm install -g vercel
   ```
3. **Update API URL in frontend**:
   - Edit `frontend/src/services/api.ts`
   - Change `http://localhost:8080` to your Render backend URL
4. **Deploy via Vercel Dashboard**:
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
5. **Deploy**: Click "Deploy"
6. **Your app is live!** 🎉

**Pros:**
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy to set up
- ✅ Auto-deploy on git push

**Cons:**
- ⚠️ Free tier has limitations (sleep after inactivity)
- ⚠️ Backend may have cold starts

---

## 🏆 Production Deployment (Recommended)

### Option 2: Deploy to Cloud Platform (AWS, Google Cloud, Azure)

**Best for:** Production-ready, scalable applications

#### **Using Google Cloud Platform (GCP)**

##### **Backend Deployment (Cloud Run)**

1. **Install Google Cloud CLI**: Download from [cloud.google.com/sdk](https://cloud.google.com/sdk)

2. **Authenticate**:
   ```powershell
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Create Dockerfile** in `backend/` directory:
   ```dockerfile
   FROM golang:1.22-alpine AS builder
   WORKDIR /app
   COPY go.mod go.sum ./
   RUN go mod download
   COPY . .
   RUN go build -o main .

   FROM alpine:latest
   RUN apk --no-cache add ca-certificates
   WORKDIR /root/
   COPY --from=builder /app/main .
   EXPOSE 8080
   CMD ["./main"]
   ```

4. **Deploy to Cloud Run**:
   ```powershell
   cd backend
   gcloud run deploy flight-booking-api `
     --source . `
     --platform managed `
     --region us-central1 `
     --allow-unauthenticated
   ```

5. **Note your backend URL**: e.g., `https://flight-booking-api-xxxxx.run.app`

##### **Frontend Deployment (Firebase Hosting)**

1. **Install Firebase CLI**:
   ```powershell
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```powershell
   firebase login
   ```

3. **Initialize Firebase** in project root:
   ```powershell
   firebase init hosting
   ```
   - Select: Use existing project or create new
   - Public directory: `frontend/dist`
   - Single-page app: Yes
   - GitHub deploys: No (for now)

4. **Update API URL** in `frontend/src/services/api.ts`:
   - Change to your Cloud Run backend URL

5. **Build and Deploy**:
   ```powershell
   cd frontend
   npm run build
   cd ..
   firebase deploy --only hosting
   ```

6. **Your app is live!** 🎉

**Pros:**
- ✅ Production-ready
- ✅ Scalable
- ✅ No cold starts (Cloud Run)
- ✅ Custom domain support
- ✅ Better performance

**Cons:**
- ⚠️ May incur costs (but has free tier)
- ⚠️ More complex setup

---

## 🔧 Advanced Deployment

### Option 3: Docker + VPS (Full Control)

**Best for:** Maximum control, custom infrastructure

#### **Prerequisites**
- VPS (DigitalOcean, Linode, AWS EC2)
- Docker installed on VPS

#### **Step 1: Create Docker Compose**

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

#### **Step 2: Create Frontend Dockerfile**

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

#### **Step 3: Deploy to VPS**

1. **SSH into your VPS**:
   ```bash
   ssh user@your-vps-ip
   ```

2. **Install Docker and Docker Compose**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

3. **Clone your repository**:
   ```bash
   git clone https://github.com/yourusername/flight-booking-app.git
   cd flight-booking-app
   ```

4. **Run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

5. **Set up domain** (optional):
   - Point your domain to VPS IP
   - Set up SSL with Let's Encrypt

**Pros:**
- ✅ Full control
- ✅ No platform limitations
- ✅ Can customize everything

**Cons:**
- ⚠️ Requires server management
- ⚠️ You handle security, updates, scaling

---

## 📝 Pre-Deployment Checklist

Before deploying, make sure to:

- [ ] **Update API URLs**: Change `localhost:8080` to production backend URL
- [ ] **Environment Variables**: Set up proper environment variables
- [ ] **Build the frontend**: Run `npm run build` to create production build
- [ ] **Test locally**: Ensure everything works on `localhost`
- [ ] **Security**: Remove any hardcoded secrets or API keys
- [ ] **CORS**: Update CORS settings in backend for production domain
- [ ] **WebSocket URL**: Update WebSocket connection URL in frontend
- [ ] **Error Handling**: Add proper error handling and logging
- [ ] **Database**: Set up a real database (currently using in-memory)

---

## 🔐 Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Never commit secrets to git
3. **CORS**: Restrict CORS to your frontend domain only
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Input Validation**: Validate all user inputs
6. **Authentication**: Add user authentication for bookings

---

## 🎯 Recommended Path for Beginners

**Start with Option 1 (Vercel + Render)**:
1. It's the easiest and fastest
2. Free tier is generous
3. Automatic deployments
4. Good for testing and demos

**Upgrade to Option 2 (GCP/AWS) when**:
1. You need better performance
2. You have real users
3. You need more control
4. You're ready for production

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Google Cloud Run](https://cloud.google.com/run/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Docker Documentation](https://docs.docker.com/)

---

## 🆘 Need Help?

If you encounter issues during deployment:

1. Check the deployment logs
2. Verify environment variables
3. Test API endpoints manually
4. Check CORS settings
5. Ensure WebSocket connections work

---

**Good luck with your deployment! 🚀**
