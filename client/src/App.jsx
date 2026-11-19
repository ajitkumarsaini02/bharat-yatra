import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import ExploreDestinations from './pages/ExploreDestinations';
import DestinationDetail from './pages/DestinationDetail';
import AiTripPlanner from './pages/AiTripPlanner';
import BudgetPlannerPage from './pages/BudgetPlannerPage';
import CuisineExplorer from './pages/CuisineExplorer';
import FavoritesWishlist from './pages/FavoritesWishlist';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import LoginRegister from './pages/LoginRegister';
import TravelPlanner from './pages/TravelPlanner';
import InteractiveMap from './components/InteractiveMap';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-[#29445A] selection:bg-[#F28C45] selection:text-white transition-colors duration-300">
          {/* Top Sticky Navigation */}
          <Navbar />

          {/* Main Routing Body */}
          <main className="flex-1">
            <Routes>
              {/* Public routes — reachable without signing in */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/about-us" element={<Navigate to="/about" replace />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<LoginRegister />} />

              {/* Protected routes — guests are redirected to /login */}
              <Route path="/destinations" element={<ProtectedRoute><ExploreDestinations /></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><ExploreDestinations /></ProtectedRoute>} />
              <Route path="/destination/:id" element={<ProtectedRoute><DestinationDetail /></ProtectedRoute>} />
              <Route path="/ai-planner" element={<ProtectedRoute><AiTripPlanner /></ProtectedRoute>} />
              <Route path="/budget-calculator" element={<ProtectedRoute><BudgetPlannerPage /></ProtectedRoute>} />
              <Route path="/travel-planner" element={<ProtectedRoute><TravelPlanner /></ProtectedRoute>} />
              <Route path="/cuisine" element={<ProtectedRoute><CuisineExplorer /></ProtectedRoute>} />
              <Route path="/transport" element={<Navigate to="/travel-planner" replace />} />
              <Route path="/favorites" element={<ProtectedRoute><FavoritesWishlist /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/user-dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

              {/* Standalone Live Map Route */}
              <Route path="/map" element={
                <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-white shadow-2xl">
                    <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#F28C45]/15 blur-3xl pointer-events-none" />
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#1D5D85]/40 blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 max-w-3xl space-y-3">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB36B] text-xs font-bold tracking-wide">
                        <span>Interactive GIS Navigation</span>
                      </div>
                      <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                        All-India Geographic <span className="text-[#FFB36B]">GIS Explorer</span>
                      </h1>
                      <p className="text-white/85 text-sm sm:text-base leading-relaxed font-medium">
                        Navigate 114+ Indian heritage monuments, coastal beaches, tiger reserves, and high-altitude mountain circuits visually with live coordinates.
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E5EAF0] shadow-xl">
                    <InteractiveMap />
                  </div>
                </div>
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Floating Scroll to Top Arrow */}
          <ScrollToTopButton />
        </div>
      </Router>
    </AuthProvider>
  );
}
