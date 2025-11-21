# 🚀 Quick Start Guide - HMS Platform

## Prerequisites Checklist

- ✅ Node.js 18+ installed
- ✅ MongoDB installed (local) OR MongoDB Atlas account
- ✅ npm or yarn package manager
- ✅ (Optional) Google Gemini API key for AI features

## 5-Minute Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

The `.env` file is already configured with default values. For production or to use AI features, update:

```bash
# Edit backend/.env
nano backend/.env
```

**Key configurations:**
- `MONGODB_URI` - Your MongoDB connection string
- `GEMINI_API_KEY` - Your Google Gemini API key (get from https://makersuite.google.com/app/apikey)
- `JWT_SECRET` / `JWT_REFRESH_SECRET` - Change these to random secure strings in production

### 3. Start MongoDB (if running locally)

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# Or use MongoDB Atlas (cloud) - just update MONGODB_URI
```

### 4. Seed the Database

```bash
cd backend
npm run seed
```

**This creates:**
- 2 hotel chains
- 4 properties (Mumbai, Delhi, Goa, Bangalore)
- 120+ rooms
- Demo users for all roles
- Menu items, events, parking slots, inventory

### 5. Start the Server

```bash
npm run dev
```

**Server runs at:** `http://localhost:5000`

### 6. Test the API

```bash
# Health check
curl http://localhost:5000/health

# Login as guest
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "guest@demo.com", "password": "password123"}'

# Get hotel properties
curl http://localhost:5000/api/hotels/properties
```

## 📝 Demo Accounts

| Role     | Email               | Password    |
|----------|---------------------|-------------|
| Guest    | guest@demo.com      | password123 |
| Business | business@demo.com   | password123 |
| Family   | family@demo.com     | password123 |
| Employee | employee@demo.com   | password123 |
| Manager  | manager@demo.com    | password123 |
| Admin    | admin@demo.com      | password123 |

## 🧪 Testing the System

### 1. Authentication Flow

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+91-9999999999"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "password123"
  }'

# Save the accessToken from response for subsequent requests
```

### 2. Browse Hotels & Rooms

```bash
# Get all hotel chains
curl http://localhost:5000/api/hotels/chains

# Get all properties
curl http://localhost:5000/api/hotels/properties

# Search rooms in Mumbai
curl "http://localhost:5000/api/rooms?propertyId=<property_id>&guests=2"
```

### 3. Make a Booking (Protected - Requires JWT)

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer <your_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "property": "<property_id>",
    "roomId": "<room_id>",
    "checkInDate": "2024-12-10",
    "checkOutDate": "2024-12-15",
    "numberOfGuests": 2,
    "totalPrice": 25000
  }'
```

### 4. Order Food

```bash
# Get menu
curl "http://localhost:5000/api/menu?propertyId=<property_id>"

# Place order
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <your_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "property": "<property_id>",
    "room": "<room_id>",
    "items": [
      {"menuItem": "<menu_item_id>", "quantity": 2}
    ],
    "deliveryInstructions": "Room 201, please knock"
  }'
```

### 5. AI Features (Protected - Manager/Admin)

```bash
# Demand Forecast
curl -X POST http://localhost:5000/api/ai/forecast \
  -H "Authorization: Bearer <manager_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyName": "Grand Luxury Mumbai",
    "historicalBookings": [120, 135, 145, 160, 180],
    "seasonalEvents": ["Diwali", "Christmas"],
    "month": "December 2024"
  }'

# Dynamic Pricing
curl -X POST http://localhost:5000/api/ai/pricing \
  -H "Authorization: Bearer <manager_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyName": "Grand Luxury Mumbai",
    "basePrice": 5000,
    "occupancyRate": 75,
    "seasonalFactor": 1.3,
    "competitorPrices": [4500, 5200, 4800]
  }'
```

## 🔑 API Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

**Token expires in:** 1 hour (configurable)
**Refresh token expires in:** 7 days (configurable)

## 📊 Available Endpoints Summary

| Category    | Method | Endpoint                    | Auth Required | Role            |
|-------------|--------|-----------------------------|---------------|-----------------|
| Auth        | POST   | /api/auth/register          | No            | -               |
| Auth        | POST   | /api/auth/login             | No            | -               |
| Auth        | POST   | /api/auth/refresh           | No            | -               |
| Auth        | POST   | /api/auth/logout            | No            | -               |
| Hotels      | GET    | /api/hotels/chains          | No            | -               |
| Hotels      | GET    | /api/hotels/properties      | No            | -               |
| Hotels      | GET    | /api/hotels/properties/:id  | No            | -               |
| Rooms       | GET    | /api/rooms                  | No            | -               |
| Bookings    | POST   | /api/bookings               | Yes           | Guest+          |
| Bookings    | GET    | /api/bookings/my-bookings   | Yes           | Guest+          |
| Tasks       | GET    | /api/employees/tasks        | Yes           | Employee+       |
| Tasks       | PATCH  | /api/employees/tasks/:id    | Yes           | Employee+       |
| Menu        | GET    | /api/menu                   | No            | -               |
| Orders      | POST   | /api/orders                 | Yes           | Guest+          |
| Orders      | GET    | /api/orders/my-orders       | Yes           | Guest+          |
| Events      | GET    | /api/events                 | No            | -               |
| Parking     | GET    | /api/parking/slots          | Yes           | Employee+       |
| Cabs        | POST   | /api/cabs                   | Yes           | Guest+          |
| Loyalty     | GET    | /api/loyalty/my-points      | Yes           | Guest+          |
| Feedback    | POST   | /api/feedback               | Yes           | Guest+          |
| AI          | POST   | /api/ai/forecast            | Yes           | Manager/Admin   |
| AI          | POST   | /api/ai/pricing             | Yes           | Manager/Admin   |
| AI          | POST   | /api/ai/recommend           | Yes           | Guest+          |
| AI          | POST   | /api/ai/feedback-summary    | Yes           | Manager/Admin   |
| AI          | POST   | /api/ai/attractions         | Yes           | Guest+          |
| Dashboard   | GET    | /api/dashboard/analytics    | Yes           | Manager/Admin   |

## 🛠 Development Commands

```bash
# Start dev server with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database seed
npm run seed

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm test
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
**Problem:** `Failed to connect to MongoDB`

**Solutions:**
1. Check if MongoDB is running: `mongosh` (should connect)
2. Verify MONGODB_URI in `.env`
3. For MongoDB Atlas:
   - Check whitelist IP (add 0.0.0.0/0 for testing)
   - Verify credentials
   - Check connection string format

### Port Already in Use
**Problem:** `Port 5000 already in use`

**Solution:**
```bash
# Change PORT in .env to 5001 or another available port
# Or kill the process using port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
```

### JWT Errors
**Problem:** `Invalid or expired token`

**Solutions:**
1. Login again to get fresh token
2. Check token format in Authorization header: `Bearer <token>`
3. Ensure token hasn't expired (1 hour default)
4. Use refresh token endpoint to get new access token

### AI Features Not Working
**Problem:** `Failed to generate AI response`

**Solution:**
1. Get valid Gemini API key from https://makersuite.google.com/app/apikey
2. Update GEMINI_API_KEY in `.env`
3. Restart server
4. Note: AI features work with demo data even without valid key (returns fallback responses)

## 📦 Production Deployment

### Option 1: Railway (Recommended - Easiest)

1. Push code to GitHub
2. Go to https://railway.app
3. New Project → Deploy from GitHub
4. Select your repository
5. Add environment variables (MongoDB Atlas URI, JWT secrets, Gemini key)
6. Deploy!

**Railway will:**
- Auto-detect Node.js
- Install dependencies
- Run build command
- Start the server

### Option 2: Heroku

```bash
# Install Heroku CLI
# Login and create app
heroku create hms-backend

# Set environment variables
heroku config:set MONGODB_URI=<your_mongodb_atlas_uri>
heroku config:set JWT_SECRET=<random_string>
heroku config:set JWT_REFRESH_SECRET=<random_string>
heroku config:set GEMINI_API_KEY=<your_key>

# Deploy
git push heroku main

# Run seed (optional)
heroku run npm run seed
```

### Option 3: Docker

```bash
# Build image
docker build -t hms-backend .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI=<your_uri> \
  -e JWT_SECRET=<secret> \
  -e JWT_REFRESH_SECRET=<secret> \
  -e GEMINI_API_KEY=<key> \
  hms-backend
```

### Option 4: VPS (DigitalOcean, AWS EC2, etc.)

```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js and MongoDB
# Clone repository
git clone <your-repo>
cd hms-platform/backend

# Install dependencies
npm install

# Set up environment variables
nano .env

# Build
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start dist/server.js --name hms-backend
pm2 startup
pm2 save

# Set up nginx as reverse proxy
# SSL with Let's Encrypt
```

## 🔒 Production Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET and JWT_REFRESH_SECRET to strong random strings
- [ ] Use MongoDB Atlas or managed MongoDB instance
- [ ] Set NODE_ENV=production
- [ ] Configure CORS_ORIGIN to your frontend domain
- [ ] Enable HTTPS (use SSL/TLS certificates)
- [ ] Review and adjust rate limiting settings
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Enable MongoDB backups
- [ ] Review and harden security headers
- [ ] Set up proper logging
- [ ] Configure firewall rules
- [ ] Use environment-specific API keys

## 📞 Need Help?

- **Documentation:** See main README.md
- **Issues:** Open an issue on GitHub
- **API Testing:** Use Postman or Thunder Client with provided examples

## 🎉 You're Ready!

Your Hotel Management System backend is now running. Next steps:

1. Explore the API using the demo credentials
2. Build a frontend using the API documentation
3. Customize the business logic for your needs
4. Deploy to production when ready

**Happy coding! 🚀**
