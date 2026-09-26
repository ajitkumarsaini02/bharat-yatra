import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ExploreDestinations from './pages/ExploreDestinations';
import DestinationDetail from './pages/DestinationDetail';
import AiTripPlanner from './pages/AiTripPlanner';
import BudgetPlannerPage from './pages/BudgetPlannerPage';
import CuisineExplorer from './pages/CuisineExplorer';
import FavoritesWishlist from './pages/FavoritesWishlist';
import AdminDashboard from './pages/AdminDashboard';
import LoginRegister from './pages/LoginRegister';
import TravelPlanner from './pages/TravelPlanner';
import InteractiveMap from './components/InteractiveMap';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#080E1A] text-slate-900 dark:text-slate-100 selection:bg-amber-500 selection:text-slate-950 transition-colors duration-300">
          {/* Top Sticky Navigation */}
          <Navbar />

          {/* Main Routing Body */}
          <main className="flex-1">
            <Routes>
              {/* Public routes — reachable without signing in */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginRegister />} />

              {/* Protected routes — guests are redirected to /login */}
              <Route path="/explore" element={<ProtectedRoute><ExploreDestinations /></ProtectedRoute>} />
              <Route path="/destination/:id" element={<ProtectedRoute><DestinationDetail /></ProtectedRoute>} />
              <Route path="/ai-planner" element={<ProtectedRoute><AiTripPlanner /></ProtectedRoute>} />
              <Route path="/budget-calculator" element={<ProtectedRoute><BudgetPlannerPage /></ProtectedRoute>} />
              <Route path="/travel-planner" element={<ProtectedRoute><TravelPlanner /></ProtectedRoute>} />
              <Route path="/cuisine" element={<ProtectedRoute><CuisineExplorer /></ProtectedRoute>} />
              <Route path="/transport" element={<Navigate to="/travel-planner" replace />} />
              <Route path="/favorites" element={<ProtectedRoute><FavoritesWishlist /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

              {/* Standalone Live Map Route */}
              <Route path="/map" element={
                <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                  <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-black text-[#0A192F] dark:text-white tracking-tight">All-India Geographic GIS Explorer</h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Navigate Indian heritage monuments, beaches, and high-altitude mountain circuits visually.
                    </p>
                  </div>
                  <InteractiveMap />
                </div>
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}
