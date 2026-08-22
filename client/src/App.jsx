import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import ExploreDestinations from './pages/ExploreDestinations';
import DestinationDetail from './pages/DestinationDetail';
import AiTripPlanner from './pages/AiTripPlanner';
import BudgetPlannerPage from './pages/BudgetPlannerPage';
import CuisineExplorer from './pages/CuisineExplorer';
import TransportGuide from './pages/TransportGuide';
import FavoritesWishlist from './pages/FavoritesWishlist';
import AdminDashboard from './pages/AdminDashboard';
import LoginRegister from './pages/LoginRegister';
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
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<ExploreDestinations />} />
              <Route path="/destination/:id" element={<DestinationDetail />} />
              <Route path="/ai-planner" element={<AiTripPlanner />} />
              <Route path="/budget-calculator" element={<BudgetPlannerPage />} />
              <Route path="/cuisine" element={<CuisineExplorer />} />
              <Route path="/transport" element={<TransportGuide />} />
              <Route path="/favorites" element={<FavoritesWishlist />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<LoginRegister />} />
              
              {/* Standalone Live Map Route */}
              <Route path="/map" element={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                  <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900">All-India Geographic GIS Explorer</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Navigate Indian heritage monuments, beaches, and high-altitude mountain circuits visually.
                    </p>
                  </div>
                  <InteractiveMap />
                </div>
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
