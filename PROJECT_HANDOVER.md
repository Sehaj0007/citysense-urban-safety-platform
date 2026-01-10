# Urban Safety Intelligence Platform - Project Handover & Technical Documentation

## 1. Project Overview
**Name:** Urban Safety Intelligence Platform  
**Type:** Crowd-Sourced Geospatial Web Application (MERN Stack)  
**Goal:** To empower citizens with a decision-support tool for urban safety. The platform allows users to report safety incidents anonymously, visualizes data via interactive heatmaps, and provides real-time awareness of unsafe areas.
**Note:** This is a risk-awareness tool, not a substitute for law enforcement emergency systems.

---

## 2. Core Features & Functionality

### A. User Side
1.  **Authentication**: 
    - Sign up/Login (JWT-based).
    - Guest access available for viewing maps (reporting requires auth or anonymous mode depending on config).
2.  **Incident Reporting**:
    - Users can report incidents (Harassment, Theft, Violence, Unsafe Lighting, etc.).
    - **Geolocation**: Auto-detects user location or allows manual pin drop.
    - **Privacy**: Option to report anonymously.
3.  **Safety Map & Heatmap**:
    - **Markers View**: Individual incident pins color-coded by type.
    - **Heatmap View**: Density visualization showing high-risk zones.
    - **Filters**: Filter by time range (24h, 7d, 30d) and incident category.
4.  **User Dashboard**:
    - View personal history of reported incidents.
    - Manage account details.

### B. Admin Side
1.  **Analytics Dashboard**:
    - Visual charts (Bar/Pie) showing incident trends.
    - Breakdown of incidents by type.
2.  **Data Management**:
    - (Future) Ability to moderate or delete false reports.

### C. System Features
1.  **Real-time Updates**: Uses `Socket.io` to broadcast new incidents to all connected clients immediately.
2.  **Spam Prevention**: Rate limiting on the backend to prevent flooding.
3.  **Geo-Spatial Queries**: Uses MongoDB `$near` and `2dsphere` indexes to find incidents efficiently.

---

## 3. Technology Stack

### Frontend (Client)
-   **Framework**: React 19 (via Vite)
-   **Styling**: Tailwind CSS v3 (Responsive, Mobile-first)
-   **Maps**: `react-map-gl` (Mapbox GL JS wrapper)
-   **State Management**: React Context API (`AuthContext`)
-   **Forms**: `react-hook-form`
-   **Charts**: `chart.js` & `react-chartjs-2`
-   **Icons**: `lucide-react`
-   **HTTP Client**: `axios`

### Backend (Server)
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (Mongoose ODM)
    -   *Feature*: GeoJSON support for location data.
-   **Real-time**: Socket.io
-   **Authentication**: JSON Web Tokens (JWT) & `bcryptjs`
-   **Security**: `cors`, `dotenv`

---

## 4. Project Structure & Key Files

```
/ (Root)
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── Navbar.jsx      # Main navigation
│   │   ├── context/            # Global State
│   │   │   └── AuthContext.jsx # User auth state management
│   │   ├── pages/              # Route Components
│   │   │   ├── MapPage.jsx     # Core feature: Map with Heatmap/Filters
│   │   │   ├── ReportIncident.jsx # Form to submit incidents
│   │   │   ├── UserDashboard.jsx  # User history
│   │   │   └── AdminDashboard.jsx # Analytics
│   │   ├── services/           # API Integration
│   │   │   └── api.js          # Axios instance with interceptors
│   │   ├── App.jsx             # Routing setup
│   │   └── main.jsx            # Entry point
│   ├── .env                    # Client environment vars (Mapbox Token)
│   ├── tailwind.config.js      # Styling config
│   └── vite.config.js          # Build config
│
├── server/                     # Backend Application
│   ├── config/
│   │   └── db.js               # MongoDB connection logic
│   ├── controllers/            # Business Logic
│   │   ├── authController.js   # Login/Register logic
│   │   └── incidentController.js # CRUD + Geo-queries for incidents
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── models/                 # Database Schemas
│   │   ├── User.js             # User schema
│   │   └── Incident.js         # Incident schema (GeoJSON Point)
│   ├── routes/                 # API Route Definitions
│   │   ├── auth.js             # /api/auth endpoints
│   │   └── incidents.js        # /api/incidents endpoints
│   ├── index.js                # Server entry point (Express + Socket.io)
│   └── seeder.js               # Script to populate dummy data
│
└── README.md                   # Quick start guide
```

---

## 5. How It Works (Data Flow)

1.  **Reporting**: User submits form in Client -> `POST /api/incidents` -> Server validates & saves to MongoDB -> Server emits `new_incident` via Socket.io.
2.  **Visualization**: Client loads Map -> `GET /api/incidents` -> Server queries MongoDB -> Client renders Markers/Heatmap.
3.  **Real-time**: When a new incident is saved, Socket.io notifies all connected clients -> Map updates automatically without refresh.

---

## 6. Setup Instructions for Developers

### Prerequisites
-   Node.js (v18+ recommended)
-   MongoDB (Local running on port 27017 or Atlas connection string)
-   Mapbox Public Access Token (Get for free at mapbox.com)

### Step-by-Step Installation

1.  **Clone & Install Dependencies**
    ```bash
    # Root directory
    cd server && npm install
    cd ../client && npm install
    ```

2.  **Environment Configuration**
    
    **Server (.env in /server):**
    ```env
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/urban-safety
    JWT_SECRET=dev_secret_key
    ```

    **Client (.env in /client):**
    ```env
    VITE_MAPBOX_TOKEN=pk.eyJ1... (Your Mapbox Token)
    ```

3.  **Seed Database (Optional)**
    ```bash
    cd server
    npm run data:import
    ```

4.  **Run Development Servers**
    *Terminal 1 (Backend):*
    ```bash
    cd server
    npm run dev
    ```
    *Terminal 2 (Frontend):*
    ```bash
    cd client
    npm run dev
    ```

5.  **Access the App**
    -   Frontend: `http://localhost:5173`
    -   Backend API: `http://localhost:5000`

---

## 7. Immediate Next Steps / Roadmap
-   [ ] **Alert Preferences**: Allow users to subscribe to specific incident types.
-   [ ] **CSV Export**: Add functionality for admins to export incident data.
-   [ ] **Image Upload**: Replace image URL input with actual file upload (AWS S3 or Cloudinary).
-   [ ] **Moderation**: Admin tools to approve/reject flagged incidents.

