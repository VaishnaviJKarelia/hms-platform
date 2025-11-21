# 🚀 Deployment Guide - HMS Platform

## Prerequisites

Before deploying, you need:
- GitHub account (to host code)
- MongoDB Atlas account (free tier available)
- Railway/Heroku account (for backend deployment)
- Google Gemini API key (for AI features)

---

## Step 1: Setup MongoDB Atlas (Free Cloud Database)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create a free cluster (M0 tier)

2. **Configure Database Access**
   - Go to "Database Access" → Add New Database User
   - Create username and password (save these!)
   - Set privileges to "Read and write to any database"

3. **Configure Network Access**
   - Go to "Network Access" → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for testing
   - For production, whitelist specific IPs

4. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://username:password@cluster.mongodb.net/hms-platform`

---

## Step 2: Get Google Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the API key (save it securely)

---

## Step 3: Push Code to GitHub

```bash
cd ~/hms-platform

# Add all files
git add .

# Commit
git commit -m "Initial commit: Complete HMS Platform backend"

# Create repository on GitHub
# Go to https://github.com/new and create a new repository named "hms-platform"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/hms-platform.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Railway (Recommended - Easiest)

### 4.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub account

### 4.2 Deploy Backend

1. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your `hms-platform` repository

2. **Configure Build Settings**
   - Railway will auto-detect Node.js
   - Build command: `cd backend && npm install && npm run build`
   - Start command: `cd backend && npm start`

3. **Add Environment Variables**
   Click "Variables" tab and add:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hms-platform
   JWT_SECRET=your-super-long-random-string-here-minimum-32-chars
   JWT_REFRESH_SECRET=another-super-long-random-string-minimum-32-chars
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   GEMINI_API_KEY=your-gemini-api-key-here
   CORS_ORIGIN=*
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

   **⚠️ Generate Secure JWT Secrets:**
   ```bash
   # Run these commands to generate random strings:
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)

5. **Get Your Live URL**
   - Railway will provide a URL like: `https://hms-platform-production.up.railway.app`
   - Your API will be available at: `https://your-url.railway.app`

6. **Seed Database (Optional)**
   - Go to Railway dashboard
   - Click your service
   - Click "..." → "Run Command"
   - Enter: `cd backend && npm run seed`

---

## Step 5: Test Your Deployed API

```bash
# Replace YOUR_RAILWAY_URL with your actual Railway URL

# Health check
curl https://YOUR_RAILWAY_URL/health

# Get hotels
curl https://YOUR_RAILWAY_URL/api/hotels/properties

# Login
curl -X POST https://YOUR_RAILWAY_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"guest@demo.com","password":"password123"}'
```

---

## Alternative: Deploy to Heroku

### 5.1 Install Heroku CLI
```bash
brew tap heroku/brew && brew install heroku
```

### 5.2 Login and Create App
```bash
cd ~/hms-platform
heroku login
heroku create hms-platform-backend
```

### 5.3 Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/hms-platform"
heroku config:set JWT_SECRET="your-secret-here"
heroku config:set JWT_REFRESH_SECRET="your-refresh-secret-here"
heroku config:set GEMINI_API_KEY="your-gemini-key"
heroku config:set CORS_ORIGIN="*"
```

### 5.4 Create Procfile
```bash
cd ~/hms-platform
echo "web: cd backend && npm start" > Procfile
git add Procfile
git commit -m "Add Procfile"
```

### 5.5 Deploy
```bash
git push heroku main

# Seed database
heroku run "cd backend && npm run seed"

# View logs
heroku logs --tail
```

Your app will be at: `https://hms-platform-backend.herokuapp.com`

---

## Alternative: Docker Deployment

### Create Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### Build and Run
```bash
cd ~/hms-platform/backend

# Build image
docker build -t hms-backend .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-secret" \
  -e JWT_REFRESH_SECRET="your-refresh-secret" \
  -e GEMINI_API_KEY="your-gemini-key" \
  hms-backend
```

### Deploy to Cloud
- **AWS ECS/Fargate**: Use Docker image
- **Google Cloud Run**: Deploy container directly
- **Azure Container Instances**: Deploy from Docker Hub

---

## Post-Deployment Checklist

### ✅ Required
- [ ] MongoDB Atlas cluster created and connected
- [ ] Environment variables set (especially JWT secrets)
- [ ] API endpoints responding (test with curl/Postman)
- [ ] Database seeded with demo data
- [ ] HTTPS enabled (Railway/Heroku do this automatically)

### ✅ Security
- [ ] JWT secrets are long random strings (64+ chars)
- [ ] MongoDB network access configured properly
- [ ] CORS_ORIGIN set to specific domain (or * for testing)
- [ ] Rate limiting enabled
- [ ] No .env file committed to git

### ✅ Optional
- [ ] Custom domain configured
- [ ] Monitoring setup (Railway/Heroku dashboards)
- [ ] Error tracking (Sentry, LogRocket)
- [ ] Backup strategy for MongoDB
- [ ] CI/CD pipeline (GitHub Actions)

---

## Your Live Endpoints

After deployment, your API will be available at:

```
Base URL: https://your-app-name.railway.app

Public Endpoints:
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/hotels/chains
  GET    /api/hotels/properties
  GET    /api/rooms
  GET    /api/menu
  GET    /api/events
  GET    /health

Protected Endpoints (require JWT):
  POST   /api/bookings
  GET    /api/bookings/my-bookings
  POST   /api/orders
  GET    /api/loyalty/my-points
  POST   /api/feedback
  ... and 30+ more endpoints
```

---

## Demo Credentials (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Guest | guest@demo.com | password123 |
| Business | business@demo.com | password123 |
| Employee | employee@demo.com | password123 |
| Manager | manager@demo.com | password123 |
| Admin | admin@demo.com | password123 |

---

## Troubleshooting

### App Not Starting
- Check Railway/Heroku logs
- Verify all environment variables are set
- Ensure MongoDB connection string is correct
- Check if port is correctly configured

### Database Connection Failed
- Verify MongoDB Atlas whitelist includes Railway/Heroku IPs (or use 0.0.0.0/0)
- Check MongoDB username and password
- Ensure connection string format is correct

### Build Failed
- Check that all dependencies are in package.json
- Verify TypeScript compiles locally: `npm run build`
- Check Railway/Heroku build logs for specific errors

### 502/504 Errors
- Check if app is listening on correct PORT
- Verify MongoDB connection is successful
- Check Railway/Heroku logs for crashes

---

## Monitoring Your Deployment

### Railway Dashboard
- View logs in real-time
- Monitor CPU/memory usage
- Check deployment status
- View environment variables

### Heroku Dashboard
- `heroku logs --tail` for live logs
- `heroku ps` for dyno status
- Heroku dashboard for metrics

### MongoDB Atlas
- Monitor database usage
- View slow queries
- Check connection count
- Setup alerts

---

## Next Steps After Deployment

1. **Test All Endpoints**
   - Use Postman collection
   - Test authentication flow
   - Verify RBAC works correctly

2. **Build Frontend**
   - Use deployed backend URL
   - Implement all three portals (Guest, Employee, Admin)
   - Deploy frontend to Vercel/Netlify

3. **Setup Monitoring**
   - Add error tracking (Sentry)
   - Setup uptime monitoring (UptimeRobot)
   - Configure alerts

4. **Add Analytics**
   - Track API usage
   - Monitor performance
   - Log errors

5. **Custom Domain (Optional)**
   - Purchase domain
   - Configure DNS
   - Setup SSL certificate

---

## 🎉 Congratulations!

Your Hotel Management System backend is now live and accessible worldwide!

**Your Live API:** https://your-app-name.railway.app

Share this URL with your frontend team or start building the React frontend to consume these APIs.

---

## Need Help?

- **Railway Issues**: https://railway.app/help
- **MongoDB Atlas Issues**: https://www.mongodb.com/docs/atlas/
- **Project Documentation**: See README.md and QUICKSTART.md
- **API Reference**: All endpoints documented in README.md

---

**Built with ❤️ for enterprise hotel management**
