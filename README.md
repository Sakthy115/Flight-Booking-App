# Flight Booking Application

A high-performance flight booking application built with **React + Vite** (Frontend) and **Go** (Backend).

## 🚀 Technology Stack

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **TypeScript** - Type safety
- **React Query** - Data fetching and caching
- **React Router** - Navigation
- **WebSocket** - Real-time price updates

### Backend
- **Go 1.22+** - High-performance backend
- **Gin** - HTTP framework
- **Gorilla WebSocket** - Real-time communication
- **Concurrent processing** - Goroutines for API aggregation

## 📋 Prerequisites

Before running this application, you need to install:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Go** (v1.22 or higher) - [Download here](https://go.dev/dl/)

## 🛠️ Installation

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup

```bash
cd backend
go mod download
go run main.go
```

The backend will run on `http://localhost:8080`

## 📁 Project Structure

```
project 1/
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API integration
│   │   ├── types/         # TypeScript definitions
│   │   └── App.tsx        # Main app component
│   └── package.json
│
├── backend/               # Go application
│   ├── internal/
│   │   ├── handlers/     # HTTP request handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Data structures
│   │   └── router/       # Route definitions
│   ├── main.go           # Application entry point
│   └── go.mod
│
└── README.md
```

## 🎯 Features

- **Flight Search**: Search flights with origin, destination, dates, and passenger count
- **Real-time Pricing**: Live price updates via WebSocket
- **Concurrent API Calls**: Go goroutines aggregate multiple GDS sources simultaneously
- **Interactive Seat Selection**: Visual seat map with availability
- **Booking Management**: Complete booking flow with passenger details
- **Mock Payment**: Simulated payment gateway integration
- **Premium UI**: Modern design with animations and micro-interactions

## 🔌 API Endpoints

### Flight Search
```
POST /api/flights/search
Body: {
  "origin": "JFK",
  "destination": "LAX",
  "departureDate": "2026-02-15",
  "returnDate": "2026-02-22",
  "passengers": 2,
  "class": "economy"
}
```

### Create Booking
```
POST /api/bookings
Body: {
  "flightId": "FL123",
  "passengers": [...],
  "seats": [...],
  "payment": {...}
}
```

### WebSocket Connection
```
ws://localhost:8080/ws/prices
```

## 🧪 Development

### Frontend Development
- Hot Module Replacement (HMR) enabled
- TypeScript for type safety
- ESLint for code quality

### Backend Development
- Auto-reload with `air` (optional): `go install github.com/cosmtrek/air@latest`
- Run with air: `air` in backend directory

## 🚢 Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend
```bash
cd backend
go build -o flight-booking-api
# Deploy the binary to your server
```

## 📝 Next Steps

1. **Install Node.js and Go** using the links above
2. **Run the installation commands** for both frontend and backend
3. **Open your browser** to `http://localhost:5173`
4. **Start searching for flights!**

## 🔧 Future Enhancements

- [ ] Integrate real GDS APIs (Amadeus, Sabre)
- [ ] Add PostgreSQL/MongoDB for persistent storage
- [ ] Implement user authentication
- [ ] Add email notifications
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Multi-language support
- [ ] Mobile app (React Native)

## 🌐 Deployment

Ready to deploy your app to the web? We've got you covered!

### Quick Deploy Options

1. **Deploy to Render (Easiest & Recommended)** ⭐
   ```bash
   .\deploy-render.ps1
   ```
   **See detailed guide**: [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
   - Deploy both frontend & backend to Render
   - 100% FREE tier available
   - Takes ~20 minutes

2. **Interactive Deployment Script**
   ```bash
   .\deploy.ps1
   ```
   This will guide you through different deployment options.

2. **Vercel + Render (Recommended for Beginners)**
   - **Frontend**: Deploy to Vercel (Free)
   - **Backend**: Deploy to Render (Free)
   - See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions

3. **Docker Deployment**
   ```bash
   docker-compose up --build
   ```
   Access at `http://localhost`

### Deployment Files Included

- ✅ `backend/Dockerfile` - Backend containerization
- ✅ `frontend/Dockerfile` - Frontend containerization
- ✅ `docker-compose.yml` - Full stack orchestration
- ✅ `frontend/vercel.json` - Vercel configuration
- ✅ `frontend/nginx.conf` - Production nginx config
- ✅ `DEPLOYMENT_GUIDE.md` - Complete deployment guide

**📖 For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.
