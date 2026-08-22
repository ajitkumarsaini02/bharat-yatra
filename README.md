# 🇮🇳 BHARAT YATRA
### Centralized Tourism Discovery & AI-Assisted Personalized Trip Planning Full-Stack Web Application

---

## 📌 1. Overview & Problem Statement

India offers a vast spectrum of tourist destinations, monuments, beaches, cultural places, food, and local experiences. However, travelers often need to use multiple platforms to find information about destinations, hotels, transportation, attractions, and expenses. This makes travel planning time-consuming and fragmented.

### Major Problems Addressed:
* **Fragmented Information:** Travel information is scattered across disparate blogs and websites.
* **Difficulty in Custom Discovery:** Finding suitable destinations according to budget, persona, and interests is difficult.
* **Tedious Manual Planning:** Constructing day-wise itineraries requires hours of manual research.
* **Unpredictable Expenses:** Estimating overall expenses and category allocations (stay, food, transit, entry tickets) is complex.
* **Hidden Local Gems:** Regional cuisines, GI crafts, and cultural etiquettes often go undiscovered.

---

## 🎯 2. Key Features & Capabilities

1. **Destination Discovery:** Explore monuments, beaches, hill stations, wildlife reserves, and spiritual centers across all Indian zones (North, South, West, East, North-East).
2. **AI-Assisted Trip Planner:** Generate personalized day-wise travel itineraries with morning/afternoon/evening slots, timings, and local tips.
3. **Smart Budget Estimator:** Real-time multi-category expense forecast with interactive sliders and money-saving hacks.
4. **Interactive GIS Maps:** OpenStreetMap / Leaflet integration with interactive pins across India.
5. **Regional Food & Cuisine Explorer:** State-wise famous delicacies and iconic food joints.
6. **Transport & Connectivity Hub:** IRCTC train guidelines, flight routes, state buses, and last-mile transit tips.
7. **Favorites & Community Reviews:** Wishlist saving and star ratings with traveler reviews.
8. **Admin Dashboard:** Content management and platform analytics.

---

## 🛠️ 3. Technology Stack & Architecture

```
                       ┌─────────────────────────────────────────┐
                       │           BHARAT YATRA CLIENT           │
                       │    React.js + Tailwind CSS + Leaflet   │
                       └──────────────────┬──────────────────────┘
                                          │ REST API / JSON
                                          ▼
                       ┌─────────────────────────────────────────┐
                       │          EXPRESS & NODE BACKEND         │
                       │   Auth, AI Planner, Budget, Reviews     │
                       └──────────────────┬──────────────────────┘
                                          │ Mongoose ODM
                                          ▼
                       ┌─────────────────────────────────────────┐
                       │            MONGODB DATABASE             │
                       │ (with standalone in-memory demo state) │
                       └─────────────────────────────────────────┘
```

* **Frontend:** React (Vite) + Tailwind CSS + Lucide Icons + React-Leaflet + Canvas Confetti
* **Backend:** Node.js + Express.js + JWT Authentication + bcryptjs
* **Database:** MongoDB + Mongoose (with dual-mode in-memory fallback)
* **GIS Maps:** OpenStreetMap + Leaflet.js
* **AI Module:** Algorithmic recommendation engine generating day-wise plans, packing checklists, and expense distributions.

---

## 🚀 4. How to Run the Project

### 1. Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 2. Start Backend Server
```bash
cd server
npm install
npm start
```
*Backend runs on:* `http://localhost:5000`  
*API Health check:* `http://localhost:5000/api/health`

### 3. Start Frontend Client (in a separate terminal)
```bash
cd client
npm install
npm run dev
```
*Frontend runs on:* `http://localhost:5173` (or the port displayed in Vite).

---

## ⚡ 5. Demo Logins

The app includes 1-click demo buttons on the Sign In page:
* **Admin Demo:** `admin@bharatyatra.com` / `admin123` (Access Admin Dashboard & Data Controls)
* **Traveler Demo:** `traveler@bharatyatra.com` / `user123` (Access Favorites & AI Trip Saves)

---

## 📂 6. Project Structure

```
Bharat Yatra/
├── server/
│   ├── controllers/       # Auth, Destinations, AI Planner, Budget, Reviews
│   ├── data/              # 30+ destinations, cuisines, transport datasets
│   ├── middleware/        # JWT auth verification
│   ├── models/            # Mongoose schemas for User, Destination, Itinerary, Review
│   ├── routes/            # Express API route endpoints
│   ├── server.js          # Main Express server entry
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/    # Navbar, Footer, DestinationCard, InteractiveMap, Hero
│   │   ├── context/       # AuthContext, Wishlist, Saved Itineraries
│   │   ├── pages/         # Home, Explore, Detail, AI Planner, Budget, Cuisine, Transport, Admin, Auth
│   │   ├── services/      # Axios API client
│   │   ├── data/          # Client dataset fallback
│   │   ├── App.jsx        # Routing configuration
│   │   └── index.css      # Indian heritage styling & animations
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```
"# bharat-yatra" 
