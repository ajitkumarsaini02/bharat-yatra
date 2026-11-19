# ⚙️ Bharat Yatra Backend (Express + MongoDB REST API)

Backend service and travel intelligence engine for **Bharat Yatra (भारत यात्रा)**.

- **Port**: `5000` (Default)
- **Base Route**: `/api`
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM (includes in-memory fallback for zero-config mode)
- **Authentication**: JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`) + Direct Traveler Registration

---

## 🌐 REST API Endpoints Overview

### 1. Destinations & Tourism
- `GET /api/destinations` — Retrieve 114+ handpicked monuments with search, category, zone, and budget filters.
- `GET /api/destinations/:id` — Retrieve detailed record for a destination (includes Wikipedia lore, weather coords, and cuisine).
- `GET /api/destinations/search?q={query}` — External place autocomplete and search.
- `GET /api/destinations/nearby?lat={lat}&lng={lng}&radius={m}` — Proximity search for nearby monuments.
- `POST /api/destinations` — Create new destination (Requires Admin).
- `POST /api/destinations/ai-generate` — Auto-enrich destination fields via AI (Requires Admin).
- `DELETE /api/destinations/:id` — Remove destination (Restricted to original creator/admin).

### 2. Multi-Modal Travel & Transit (`/api/travel`)
- `GET /api/travel/plan` or `POST /api/travel/plan` — Comprehensive distance, road routing, train, bus, flight, outstation cab, and hotel cost comparison.
- `GET /api/travel/train/search` — Query Indian Railway stations and schedules (RailRadar & IndianRail APIs).
- `GET /api/travel/bus/search` — Query intercity bus departures and boarding points (AOPAY Bus API).
- `GET /api/travel/flight/search` — Query domestic flight options (Aviationstack API).
- `GET /api/travel/cab/estimate` — Query outstation sedan, SUV, and hatchback fares (Ola Dev API & Haversine distance engine).
- `POST /api/travel/save-plan` — Save a selected transit option to the traveler's planned trips.

### 3. AI Trip Planning
- `POST /api/planner/generate` — Generate custom 1–7 day hour-by-hour itinerary based on pace, group type, budget, and monument opening hours.
- `POST /api/planner/save` — Save generated itinerary to traveler account.
- `GET /api/planner/saved` — Retrieve user's saved itineraries.
- `DELETE /api/planner/saved/:id` — Delete saved itinerary.

### 4. Travel Budgeting & Expense Forecaster
- `POST /api/budget/calculate` — Calculate itemized trip forecast (Stays, Rail/Air, Local Commute, Food, Heritage Entry, Buffer) with money-saving hacks.

### 5. Regional Cuisine
- `GET /api/cuisine` — Retrieve curated regional state delicacies, legendary food stalls, and dietary categories.

### 6. Contact & Helplines
- `POST /api/contact` — Log and process traveler inquiries and feedback messages.

### 7. Authentication & User Management
- `POST /api/auth/register` — Direct registration for new traveler accounts (No OTP required).
- `POST /api/auth/login` — Sign in as traveler or admin with JWT issuance.
- `GET /api/auth/profile` — Get profile for authenticated user.
- `POST /api/auth/change-password` — Change password for authenticated user.
- `POST /api/auth/favorites/toggle` — Add or remove destination from wishlist.
- `GET /api/auth/favorites` — Get saved favorites.
- `POST /api/auth/send-otp` — Generate and send a 6-digit registration OTP to user's email (legacy/optional).
- `POST /api/auth/verify-otp` — Verify OTP code.
- `POST /api/auth/verify-otp-register` — Complete user registration upon verified OTP.

### 8. Admin Control Center (`/api/admin`)
- `GET /api/admin/users` — Get list of administrative staff.
- `POST /api/admin/users` — Create new admin account.
- `DELETE /api/admin/users/:id` — Delete admin account (Super Admin only with security password).
- `GET /api/admin/all-accounts` — View all registered traveler accounts.
- `PUT /api/admin/users/:userId/role` — Update user permissions (`user` vs `admin`).
- `DELETE /api/admin/all-users/:userId` — Delete user account (Super Admin only).

---

## 🚀 Running the Server Locally

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Create `.env` inside `server/`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bharat_yatra
JWT_SECRET=your_jwt_secret_key_here
GEOAPIFY_API_KEY=your_optional_geoapify_key
```

### 3. Start the Server
```bash
npm start
```
Server runs at `http://localhost:5000`. Health check endpoint: `http://localhost:5000/api/health`.
