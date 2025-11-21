<<<<<<< HEAD
# 🏨 Hotel Management System (HMS) - Enterprise SaaS Platform

A complete, production-grade, AI-powered Hotel Management System built for multi-property hotel chains with premium enterprise UI and comprehensive features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Demo Credentials](#demo-credentials)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [AI Features](#ai-features)
- [Contributing](#contributing)

## ✨ Features

### 🎯 Core Modules

- **Multi-Property Management** - Support for hotel chains with multiple properties
- **Room Management** - Categories, real-time availability, dynamic pricing
- **Booking System** - Complete booking lifecycle with payment integration
- **Employee Management** - Task assignment, attendance, performance tracking
- **Inventory Management** - Stock tracking, reorder alerts
- **Menu & Food Ordering** - In-app menu, order tracking, delivery management
- **Event Management** - Conferences, weddings, workshops
- **Smart Parking** - QR-based entry/exit, real-time slot tracking
- **Cab Booking** - Integrated cab service for guests
- **Loyalty Program** - Points system with membership tiers (Regular, Business, Family)
- **Feedback & Reviews** - Guest satisfaction tracking

### 🤖 AI-Powered Features

- **Demand Forecasting** - Predict booking trends using historical data
- **Dynamic Pricing** - AI-suggested pricing based on occupancy and competition
- **Personalized Recommendations** - Guest-specific room and service suggestions
- **Sentiment Analysis** - Automated feedback analysis and insights
- **Attraction Recommendations** - AI-generated local itineraries

### 👥 User Portals

#### Guest Portal
- Search and filter rooms
- Real-time booking with availability
- Trip budget estimator
- Menu ordering with cart
- Cab booking
- Loyalty dashboard
- Event browsing
- WiFi credentials access
- Multi-language support (English + Hindi)

#### Employee Portal
- Task management dashboard
- Accept and complete tasks
- Attendance tracking
- Performance metrics
- Parking management

#### Admin/Manager Portal
- Multi-property analytics dashboard
- KPIs: Revenue, Occupancy, ADR, RevPAR
- Hotel chain and property management
- Room and pricing management
- Employee management
- Inventory control
- Menu management
- AI analytics and insights
- Feedback analysis
- Report generation

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js with TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with refresh tokens
- **Validation:** Zod
- **Security:** Helmet, CORS, Rate Limiting, Bcrypt
- **AI:** Google Gemini Flash API

### Frontend (To Be Built)
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Theme:** Dark + Light mode support

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Guest    │  │   Employee   │  │    Admin     │        │
│  │   Portal   │  │    Portal    │  │    Portal    │        │
│  └────────────┘  └──────────────┘  └──────────────┘        │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/REST API
┌────────────────────────┴────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js Server with Middleware                    │  │
│  │  - CORS   - Rate Limiting   - Compression             │  │
│  │  - Helmet - Body Parser     - Morgan Logging          │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Auth     │  │   Business   │  │      AI      │       │
│  │   Service   │  │    Logic     │  │   Service    │       │
│  └─────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Route Handlers (Booking, Room, Employee, etc.)      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                      DATA ACCESS LAYER                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Mongoose Models & Schemas                            │  │
│  │  - User  - Hotel  - Room  - Booking  - Payment       │  │
│  │  - Task  - Order  - Event - Parking  - Loyalty       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                      DATABASE LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MongoDB Atlas / Local                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

EXTERNAL SERVICES
┌──────────────────┐
│  Google Gemini   │  (AI Features)
│   Flash API      │
└──────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB 6+ (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hms-platform
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hms-platform

# JWT Secrets (Generate secure random strings!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here

# CORS
CORS_ORIGIN=http://localhost:5173
```

4. **Start MongoDB** (if running locally)
```bash
# macOS (via Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

5. **Seed the database**
```bash
npm run seed
```

6. **Start the development server**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Testing the API

Test with curl:
```bash
# Health check
curl http://localhost:5000/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+91-9999999999"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "guest@demo.com",
    "password": "password123"
  }'
```

## 🔐 Demo Credentials

Use these credentials to test different user roles:

| Role     | Email               | Password    | Description                    |
|----------|---------------------|-------------|--------------------------------|
| Guest    | guest@demo.com      | password123 | Regular member guest           |
| Business | business@demo.com   | password123 | Business tier member           |
| Family   | family@demo.com     | password123 | Family tier member             |
| Employee | employee@demo.com   | password123 | Hotel staff member             |
| Manager  | manager@demo.com    | password123 | Property manager               |
| Admin    | admin@demo.com      | password123 | System administrator           |

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91-9876543210",
  "role": "guest" // optional
}
```

#### POST /api/auth/login
Login and receive JWT tokens
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /api/auth/refresh
Refresh access token
```json
{
  "refreshToken": "<refresh_token>"
}
```

#### POST /api/auth/logout
Logout and invalidate refresh token
```json
{
  "refreshToken": "<refresh_token>"
}
```

### Hotel Endpoints

- `GET /api/hotels/chains` - Get all hotel chains
- `GET /api/hotels/properties` - Get all properties (query: city, chainId)
- `GET /api/hotels/properties/:id` - Get property details

### Room Endpoints

- `GET /api/rooms` - Search rooms (query: propertyId, guests, minPrice, maxPrice)

### Booking Endpoints (Protected)

- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/my-bookings` - Get user's bookings

### Employee Endpoints (Protected - Employee Role)

- `GET /api/employees/tasks` - Get assigned tasks
- `PATCH /api/employees/tasks/:id` - Update task status

### Menu Endpoints

- `GET /api/menu` - Get menu items (query: propertyId, category)

### Order Endpoints (Protected)

- `POST /api/orders` - Place a food order
- `GET /api/orders/my-orders` - Get user's orders

### Event Endpoints

- `GET /api/events` - Get upcoming events (query: propertyId)

### Parking Endpoints (Protected - Employee/Admin)

- `GET /api/parking/slots` - Get parking slots (query: propertyId)

### Cab Endpoints (Protected)

- `POST /api/cabs` - Book a cab

### Loyalty Endpoints (Protected)

- `GET /api/loyalty/my-points` - Get loyalty points and transactions

### Feedback Endpoints (Protected)

- `POST /api/feedback` - Submit feedback

### AI Endpoints (Protected)

- `POST /api/ai/forecast` - Get demand forecast (Admin/Manager)
- `POST /api/ai/pricing` - Get pricing suggestions (Admin/Manager)
- `POST /api/ai/recommend` - Get personalized recommendations
- `POST /api/ai/feedback-summary` - Get sentiment analysis (Admin/Manager)
- `POST /api/ai/attractions` - Get local attractions

### Dashboard Endpoints (Protected - Admin/Manager)

- `GET /api/dashboard/analytics` - Get property analytics (query: propertyId, startDate, endDate)

## 📁 Project Structure

```
hms-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts   # JWT authentication & RBAC
│   │   ├── models/
│   │   │   ├── User.ts              # User model with password hashing
│   │   │   ├── Hotel.ts             # Hotel chain & property models
│   │   │   ├── Room.ts              # Room category & room models
│   │   │   ├── Booking.ts           # Booking & payment models
│   │   │   └── index.ts             # All other models (Task, Menu, etc.)
│   │   ├── routes/
│   │   │   ├── auth.routes.ts       # Authentication routes
│   │   │   ├── index.ts             # Consolidated route definitions
│   │   │   └── *.routes.ts          # Individual route exports
│   │   ├── services/
│   │   │   ├── auth.service.ts      # JWT token generation/verification
│   │   │   └── ai.service.ts        # Google Gemini AI integration
│   │   ├── scripts/
│   │   │   └── seed.ts              # Database seeding script
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript type definitions
│   │   └── server.ts                # Express app entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/                         # (To be implemented)
├── shared/                          # Shared types and constants
├── docs/                            # Additional documentation
└── README.md                        # This file
```

## 🤖 AI Features

The system integrates Google Gemini Flash API for advanced AI capabilities:

### 1. Demand Forecasting
Analyzes historical booking data and seasonal events to predict future demand.

**Example Request:**
```json
POST /api/ai/forecast
{
  "propertyName": "Grand Luxury Mumbai",
  "historicalBookings": [120, 135, 145, 160, 180],
  "seasonalEvents": ["Diwali", "New Year"],
  "month": "December 2024"
}
```

### 2. Dynamic Pricing
Suggests optimal room prices based on occupancy, seasonality, and competition.

**Example Request:**
```json
POST /api/ai/pricing
{
  "propertyName": "Grand Luxury Mumbai",
  "basePrice": 5000,
  "occupancyRate": 75,
  "seasonalFactor": 1.3,
  "competitorPrices": [4500, 5200, 4800]
}
```

### 3. Personalized Recommendations
Provides tailored room and service recommendations based on guest preferences.

**Example Request:**
```json
POST /api/ai/recommend
{
  "guestPreferences": ["sea view", "spa", "quiet"],
  "bookingHistory": ["Deluxe Room", "Beach Villa"],
  "membershipTier": "business"
}
```

### 4. Sentiment Analysis
Analyzes guest feedback to extract insights and actionable recommendations.

**Example Request:**
```json
POST /api/ai/feedback-summary
{
  "propertyId": "property_id_here"
}
```

### 5. Attraction Recommendations
Generates local attraction suggestions and itineraries.

**Example Request:**
```json
POST /api/ai/attractions
{
  "location": "Mumbai",
  "preferences": ["cultural sites", "food", "shopping"]
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Refresh Tokens** - Long-lived refresh tokens with rotation
- **Password Hashing** - Bcrypt with salt rounds
- **Role-Based Access Control (RBAC)** - Fine-grained permissions
- **Rate Limiting** - Prevents API abuse
- **CORS Protection** - Configurable origin whitelist
- **Helmet Security Headers** - Protection against common vulnerabilities
- **Input Validation** - Zod schema validation
- **Sensitive Data Filtering** - Automatic removal of passwords/tokens from responses

## 📊 Database Seeding

The seed script creates:
- 2 hotel chains
- 4 hotel properties (Mumbai, Delhi, Goa, Bangalore)
- 6 room categories
- 120+ rooms across all properties
- 7 demo users (guests, employees, manager, admin)
- Sample bookings
- Employee tasks
- 20 menu items per property
- 2 events
- 120 parking slots
- Inventory items

Run seeding:
```bash
cd backend
npm run seed
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run with coverage
npm run test:coverage
```

## 📦 Deployment

### Backend Deployment

#### Option 1: Traditional Server
```bash
# Build
npm run build

# Start production server
npm start
```

#### Option 2: Docker
```bash
# Build image
docker build -t hms-backend .

# Run container
docker run -p 5000:5000 --env-file .env hms-backend
```

#### Option 3: Cloud Platforms
- **Heroku:** Use provided Procfile
- **Railway:** Auto-detects Node.js
- **AWS EC2/ECS:** Use Docker image
- **Google Cloud Run:** Containerized deployment
- **Azure App Service:** Node.js support

### Environment Variables for Production

Ensure these are set securely in production:
- Generate strong random strings for JWT_SECRET and JWT_REFRESH_SECRET
- Use MongoDB Atlas for managed database
- Obtain a valid Gemini API key
- Set NODE_ENV=production
- Configure CORS_ORIGIN to your frontend domain

## 🌐 Frontend Development

The frontend is built with React, TypeScript, Vite, and Tailwind CSS. It includes:

- Responsive design
- Dark/light mode
- Multi-language support (i18n)
- Premium UI components (Radix UI)
- Real-time updates
- Interactive dashboards with charts

**Note:** Frontend implementation is not included in this backend-focused deliverable but can be built using the provided API documentation.

## 📖 Additional Documentation

- [API Reference](docs/API.md) - Detailed API endpoints
- [Database Schema](docs/DATABASE.md) - MongoDB collection schemas
- [Architecture Guide](docs/ARCHITECTURE.md) - System design details
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment steps
- [Contributing Guide](docs/CONTRIBUTING.md) - How to contribute

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for advanced AI capabilities
- MongoDB for flexible NoSQL database
- Express.js community for robust backend framework
- All open-source contributors

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Email: support@hms-platform.com
- Documentation: https://docs.hms-platform.com

---

**Built with ❤️ for enterprise hotel management**
=======
# hms-platform
>>>>>>> 2df2318e880a203ab21cd8e106b4bc188a4cb126
