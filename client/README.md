# 🎨 Bharat Yatra Frontend (React + Vite + Tailwind CSS)

Welcome to the frontend application for **Bharat Yatra (भारत यात्रा)** — India's premier centralized tourism intelligence and AI-assisted travel planning platform.

- **Live URL**: [https://bharatyatra-india.vercel.app](https://bharatyatra-india.vercel.app)
- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4 with custom Indian Heritage & Ocean Blue design system
- **Icons**: Lucide React
- **Mapping**: Leaflet + React-Leaflet + OpenStreetMap
- **State Management**: React Context (`AuthContext`, `ThemeContext`)

---

## 🎨 Brand Color System

The UI uses a modern, high-contrast, accessible Indian tourism palette:

| Color Token | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| **Primary Ocean Blue** | `#123B5D` | Major headings, hero backgrounds, primary branding, navigation active states |
| **Secondary Royal Blue**| `#1D5D85` | Supporting badges, gradient transitions, secondary buttons |
| **Light Blue Well** | `#EAF4FA` | Icon background wells, subtle pill tags, active button backgrounds |
| **Sunset Orange Accent**| `#F28C45` | Primary action CTAs, highlight badges, interactive icons, scroll-to-top |
| **Golden Orange Accent**| `#FFB36B` | Heading gradient highlights, sub-badges, rating stars |
| **Main Canvas BG** | `#F7F9FC` | Soft, clean, modern neutral background |
| **Card Canvas BG** | `#FFFFFF` | High-contrast white card containers with subtle borders |
| **Subtle Border** | `#E5EAF0` | Crisp dividers and card container boundaries |
| **Primary Body Text** | `#29445A` | High-legibility dark navy-slate text for prose, forms, and descriptions |
| **Secondary Text** | `#718096` | Subtitles, metadata, captions, and secondary details |

---

## 🧭 Clean Page Navigation (Zero Hash `#` Policy)

Every section has an independent, clean route:

| Route | Page Component | Description |
| :--- | :--- | :--- |
| `/` | `Home.jsx` | Landing page with Hero search, categories, popular places & GIS map |
| `/destinations` | `ExploreDestinations.jsx` | 114+ handpicked sites with filters (State, Zone, Theme, Budget) |
| `/explore` | `ExploreDestinations.jsx` | Thematic category explorer |
| `/destination/:id` | `DestinationDetail.jsx` | Rich monument details, Wikipedia lore, live weather, audio guide, reviews |
| `/ai-planner` | `AiTripPlanner.jsx` | Day-by-day customized itinerary generator with PDF export & offline download |
| `/budget-calculator` | `BudgetPlannerPage.jsx`| Real-time tariff and expense forecaster with zero hidden costs |
| `/travel-planner` | `TravelPlanner.jsx` | Multi-modal distance & fare comparisons (Rail, Flight, AC Bus, Cab) |
| `/cuisine` | `CuisineExplorer.jsx` | Regional Indian food showcase, iconic delicacies & heritage sweetshops |
| `/about` | `AboutUs.jsx` | Mission, core pillars, impact metrics, and pan-India coverage |
| `/contact` | `Contact.jsx` | 24x7 verified tourist helplines (1363, 139, 112) and traveler inquiry form |
| `/favorites` | `FavoritesWishlist.jsx` | Dedicated saved destinations wishlist & transit trips |
| `/dashboard` | `UserDashboard.jsx` | Comprehensive traveler hub for explorer tier, AI itineraries, wishlist, and security |
| `/map` | `InteractiveMap.jsx` | Fullscreen interactive OpenStreetMap GIS explorer |
| `/admin` | `AdminDashboard.jsx` | Role-protected admin content & team management portal |
| `/login` | `LoginRegister.jsx` | Traveler authentication & direct registration |

---

## ⚡ Global Features

1. **Floating Scroll-To-Top Button (`ScrollToTopButton.jsx`)**:
   - Fixed at `bottom-6 right-6` with Sunset Orange gradient.
   - Automatically appears when user scrolls down > 320px.
   - Performs smooth return scroll to the top.
2. **Hero Banners & Metric Cards**:
   - Uniform header containers with ambient glows and gold highlights across all pages.
   - 4-card metric strip highlighting key numbers and capabilities.
3. **Bottom Call-to-Action Banners**:
   - Full-width Ocean Blue banners at the footer of each page guiding travelers to next actions.

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Configure Environment
Create a `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Run Dev Server
```bash
npm run dev
```
Open `http://localhost:3000` (or `http://localhost:5173`) in your browser.

### 4. Build for Production
```bash
npm run build
```
Creates an optimized production bundle inside `client/dist/`.
