# 🇮🇳 BHARAT YATRA (भारत यात्रा)
### Centralized Indian Tourism Discovery, AI-Assisted Trip Planner & Transport Comparison Platform

**Live Website:** [https://bharat-yatra-psi.vercel.app/](https://bharat-yatra-psi.vercel.app/)

---

## 📌 1. Overview & Vision

**Bharat Yatra** is an integrated, state-of-the-art Indian tourism and travel intelligence platform dedicated to showcasing the rich cultural heritage and geographical diversity of India. The platform combines **112+ comprehensive monuments and tourist destinations** across all 28 states and union territories, offering AI-assisted day-wise itinerary generation, smart budget forecasting, intercity & local transport comparison (**Train + Bus + Flight + Cab + Auto**), live GIS mapping, and role-based administration with creator-ownership protection.

---

## 🎯 2. Platform Navigation & Modules

The platform is structured into **6 core navigation modules**:

1. 🏛️ **Explore Destinations (`/explore`)**: Browse 112+ monuments with multi-criteria filters (State, Category, Zone, Budget, Search Query) and verified photography.
2. 🤖 **AI Trip Planner (`/ai-planner`)**: Generate custom **1 to 7 day itineraries** tailored by destination, traveler persona, interests, transit fare, and budget.
3. 💰 **Budget Planner (`/budget-calculator`)**: Calculate total trip expenses with integrated selected transport fare (${\text{Transport Cost} = \text{Selected Fare} \times \text{Travellers}}$) plus Stay, Food, Local Commute, Tickets, and Buffer.
4. 🚍 **Travel Planner (`/travel-planner`)**: Comprehensive intercity and local transport distance & fare comparison matrix covering **Train, Bus, Flight, Cab/Taxi, and Auto**.
5. 🍱 **Regional Cuisine (`/cuisine`)**: Discover state-wise traditional thalis, street foods, and regional food specialties.
6. 🗺️ **Live Map (`/map`)**: Standalone GIS Explorer mapping heritage monuments, beaches, high-altitude mountain circuits, and transit hubs across India.

---

## 🚘 3. Travel Distance & Fare Planner Architecture

The Travel Planner uses a **Provider-Adapter Architecture** to normalize live responses from external transport APIs into a standard transport data model:

```
                          ┌──────────────────────────────────────┐
                          │          TRAVEL PLANNER UI           │
                          │   [All] [Train] [Bus] [Flight] [Cab] │
                          └──────────────────┬───────────────────┘
                                             │
                                             ▼
                          ┌──────────────────────────────────────┐
                          │       EXPRESS BACKEND CONTROLLER     │
                          │        (/api/travel/compare)         │
                          └──────────────────┬───────────────────┘
                                             │
         ┌──────────────────┬────────────────┼──────────────────┬──────────────────┐
         ▼                  ▼                ▼                  ▼                  ▼
┌──────────────────┐┌──────────────┐┌─────────────────┐┌──────────────────┐┌──────────────────┐
│  RailRadar API   ││ AOPAY Bus    ││ Aviationstack   ││ Ola Dev API      ││ Geoapify / OSRM  │
│  (Train Provider)││ (Bus Provider││ (Flight Provider││ (Cab/Auto Provider││ (Road Routing)   │
└────────┬─────────┘└──────┬───────┘└────────┬────────┘└────────┬─────────┘└────────┬─────────┘
         │                 │                 │                  │                   │
         └─────────────────┴─────────┬───────┴──────────────────┴───────────────────┘
                                     ▼
                          ┌──────────────────────────────────────┐
                          │    NORMALIZER ENGINE                 │
                          │    (travelNormalizer.js / cab)       │
                          └──────────────────┬───────────────────┘
                                             │ Standard Model
                                             ▼
                          ┌──────────────────────────────────────┐
                          │         NORMALIZED TRANSPORT         │
                          │  mode, provider, operator, number,   │
                          │  source, destination, departure,     │
                          │  arrival, duration, distanceKm,      │
                          │  fare { amount, type }, availability │
                          └──────────────────────────────────────┘
```

### Integrated Providers:
* **🚆 Train Integration**: **RailRadar API** (`https://api.railradar.in/v1`) with fallback to **Indian Rail API** (`https://indianrailapi.com/api-collection`).
* **🚌 Bus Integration**: **AOPAY Bus API** (`https://aopay.in/bus-api`) for intercity bus search, fares, seats, and boarding/dropping points.
* **✈ Flight Integration**: **Aviationstack API** (`https://aviationstack.com/`) for schedules and flight status, paired with a configurable `FlightFareProvider` adapter.
* **🚕 Cab & Auto Integration**: **Ola Developer API** (`https://developers.olacabs.com/docs/overview`) for ride estimates (`GET /v1/products`), ETA, min/max fare ranges, upfront pricing, and peak surge info.
* **🛣️ GIS Routing**: **Geoapify Routing API** and **OSRM Engine** for actual highway driving distances.

---

## 🏷️ 4. Data Transparency & Labeling Rules

To ensure authentic travel information, every price and distance clearly identifies its source:

| Badge / Label | Meaning & Condition |
| :--- | :--- |
| `LIVE PROVIDER DATA` *(Emerald)* | Returned directly from an authorized provider API (RailRadar, IndianRail, AOPAY, Aviationstack, Ola). |
| `PROVIDER ESTIMATE` *(Amber)* | Returned by provider min-max fare estimate endpoints (e.g. Ola / Uber ride range). |
| `ESTIMATED` *(Amber)* | Calculated fallback when API key is unconfigured or returns no data; explicitly labeled as estimated. |
| `UNAVAILABLE` *(Rose)* | Returned when live provider data is unconfigured or unavailable. |
| `Geoapify Road Distance` | Labeled for actual highway driving routes calculated via routing engines. |
| `Approx. Geographic Distance` | Labeled strictly for straight-line Haversine spherical air distance. Never called "road distance". |

---

## 🌐 5. Backend REST API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET/POST` | `/api/travel/compare` | Compare Train, Bus, Flight, Cab & Auto options simultaneously | Public |
| `GET/POST` | `/api/travel/plan` | Calculate travel plan, distances, hotel rates, and budget | Public |
| `GET` | `/api/travel/train/search` | Search trains between stations | Public |
| `GET` | `/api/travel/train/status` | Get live train running status | Public |
| `GET` | `/api/travel/bus/search` | Search intercity buses via AOPAY API | Public |
| `GET` | `/api/travel/flight/search` | Search flight schedules via Aviationstack API | Public |
| `GET` | `/api/travel/cab/estimate` | Get ride estimates via Ola Developer API | Public |
| `GET` | `/api/travel/cab/availability` | Check ride category availability | Public |
| `GET` | `/api/travel/stations/search` | Autocomplete Indian Railway station names/codes | Public |
| `GET` | `/api/travel/airports/search` | Autocomplete Indian airport IATA codes | Public |
| `POST` | `/api/travel/save-plan` | Save selected transport option to user profile | Public / Auth |
| `GET` | `/api/destinations` | List all 112+ destinations with filters | Public |
| `POST` | `/api/planner/generate` | Generate personalized day-wise AI itinerary | Public |
| `POST` | `/api/budget/calculate` | Calculate customized travel budget breakdown | Public |

---

## 📁 6. Project Structure

```
bharat-yatra/
├── server/
│   ├── controllers/       # travelController, destinationController, authController, budgetController, aiPlannerController
│   ├── data/              # tourismData.js (112+ curated monuments dataset, cuisines)
│   ├── middleware/        # auth.js (verifyToken, verifyAdmin)
│   ├── models/            # TravelPlan.js, TravelSearch.js, Destination.js, User.js, Admin.js, Itinerary.js, Review.js
│   ├── routes/            # apiRoutes.js, travelRoutes.js
│   ├── services/          # geocodingService, geoapifyService, weatherService, wikipediaService
│   │   └── travel/        # Provider-Adapter Architecture
│   │       ├── train/     # railRadarProvider.js, indianRailProvider.js
│   │       ├── bus/       # aopayProvider.js
│   │       ├── flight/    # aviationstackProvider.js, flightFareProvider.js
│   │       ├── cab/       # olaProvider.js, uberProvider.js, cabNormalizer.js, cabService.js
│   │       ├── stationService.js  # Indian Railway station code lookup
│   │       ├── airportService.js  # Indian Airport IATA code lookup
│   │       ├── cacheService.js    # In-memory TTL cache service
│   │       ├── travelNormalizer.js# Standard transport model normalizer
│   │       └── travelService.js   # Orchestrator & distance engine
│   ├── server.js          # Express server entry point
│   ├── .env               # Environment configuration
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── components/    # Navbar, Footer, TransportMap, FareDisplay, AvailabilityBadge, TravelDetailsModal
│   │   │   └── TravelPlanner/ # TravelSearch, TravelModeTabs, TransportResultCard, TrainCard, BusCard, FlightCard, CabCard
│   │   ├── context/       # AuthContext, ThemeContext
│   │   ├── pages/         # Home, ExploreDestinations, DestinationDetail, TravelPlanner, AiTripPlanner,
│   │   │                  # BudgetPlannerPage, CuisineExplorer, FavoritesWishlist, AdminDashboard, LoginRegister
│   │   ├── services/      # api.js (Axios client with automatic server & local fallback)
│   │   ├── App.jsx        # Route definitions
│   │   └── index.css      # Indian heritage styling system & dark mode
│   ├── vite.config.js
│   └── package.json
├── .env.example
└── README.md
```

---

## 🚀 7. Installation & Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ajitkumarsaini02/bharat-yatra.git
cd bharat-yatra
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` inside `server/`:
```env
# Server Configuration (Node.js Express)
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bharat_yatra
JWT_SECRET=bharat_yatra_super_secret_key_2026

# Transport Provider API Keys (Server-Side Only)
RAILRADAR_API_KEY=your_railradar_api_key
INDIAN_RAIL_API_KEY=your_indian_rail_api_key
AOPAY_BUS_API_KEY=your_aopay_bus_api_key
AVIATIONSTACK_API_KEY=your_aviationstack_api_key
FLIGHT_FARE_API_KEY=your_flight_fare_api_key
OLA_API_KEY=your_ola_api_key
OLA_CLIENT_ID=your_ola_client_id
OLA_CLIENT_SECRET=your_ola_client_secret
UBER_CLIENT_ID=your_uber_client_id
UBER_CLIENT_SECRET=your_uber_client_secret
UBER_SERVER_TOKEN=your_uber_server_token
GEOAPIFY_API_KEY=your_geoapify_api_key
```

Create `.env` inside `client/`:
```env
# Client Configuration (Vite React)
VITE_API_URL=http://localhost:5000
```

Start the Backend Server:
```bash
npm start
```
* Backend runs on: `http://localhost:5000`

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
* Frontend runs on: `http://localhost:5173`

---

## 📄 License & Credits

Developed as an educational and cultural initiative to promote Indian heritage, tourism discovery, and travel intelligence.  
All rights reserved © 2026 Bharat Yatra Platform.
