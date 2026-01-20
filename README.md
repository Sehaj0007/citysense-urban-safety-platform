# Urban Safety Intelligence Platform

A city-level safety awareness and prevention system where users can anonymously report safety incidents, view risk heatmaps, and receive real-time alerts for unsafe areas. This platform serves as a decision-support and risk-awareness tool.

## Features

- **User Authentication**: Secure JWT-based signup/login with role support (User/Admin).
- **Incident Reporting**: Submit safety incidents with location, type, description, and optional image. Supports anonymous reporting.
- **Interactive Safety Map**: Visualizes incidents on a map with clustered markers.
- **Real-time Alerts**: (Backend Logic) Socket.io integration for real-time incident broadcasting.
- **User Dashboard**: View personal reports and manage account.
- **Admin Dashboard**: Analytics on incident trends, types, and total counts.
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Maps: React Leaflet + OpenStreetMap (token-free, open-source)
- React Hook Form
- Chart.js
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.io
- JSON Web Token (JWT)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local instance running on port 27017 or Atlas URI)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd urban-safety-platform
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**
   ```bash
   cd ../client
   npm install
   ```

## Configuration

### Server
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/urban-safety
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
```

### Client
Create a `.env` file in the `client` directory:
```env
```

## Running the Application

1. **Start MongoDB**
   Ensure your local MongoDB service is running.

2. **Seed Data (Optional)**
   Populate the database with sample users and incidents.
   ```bash
   cd server
   npm run data:import
   ```

3. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`.

4. **Start the Frontend Client**
   Open a new terminal:
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`.

## API Endpoints

**Auth**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

**Incidents**
- `GET /api/incidents` - Get all incidents
- `POST /api/incidents` - Report a new incident
- `GET /api/incidents/nearby?lat=x&lng=y&dist=z` - Get incidents near a location
- `GET /api/incidents/my` - Get logged-in user's incidents

**Admin**
- `GET /api/admin/analytics` - Get system stats (Admin only)

## License
MIT
