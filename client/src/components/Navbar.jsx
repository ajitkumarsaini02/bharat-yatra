import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  Calculator, 
  UtensilsCrossed, 
  Train, 
  MapPin, 
  Heart, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navHeaderRef = useRef(null);
  const location = useLocation();
  const { user, favorites, logoutUser, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Close menus on click outside & escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (navHeaderRef.current && !navHeaderRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto-close dropdowns on navigation
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'AI Trip Planner', path: '/ai-planner', icon: Sparkles, badge: 'Smart' },
    { name: 'Budget Planner', path: '/budget-calculator', icon: Calculator },
    { name: 'Regional Cuisine', path: '/cuisine', icon: UtensilsCrossed },
    { name: 'Transport Guide', path: '/transport', icon: Train },
    { name: 'Live Map', path: '/map', icon: MapPin },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header ref={navHeaderRef} className="sticky top-0 z-40 w-full glass-panel dark:glass-dark border-b border-amber-900/10 dark:border-amber-500/20 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl gradient-saffron flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300">
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#0A192F]"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#0A192F] dark:text-white flex items-center">
                BHARAT<span className="text-amber-600 dark:text-amber-400 ml-1">YATRA</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-amber-300 -mt-1">
                Tourism & AI Planner
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active 
                      ? 'text-[#0A192F] dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-500/50 shadow-xs font-bold' 
                      : 'text-slate-800 dark:text-slate-200 hover:text-[#0A192F] dark:hover:text-white hover:bg-amber-50 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-amber-600 dark:text-amber-400' : 'text-amber-700/80 dark:text-amber-400/80'}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] font-extrabold uppercase rounded-full gradient-saffron text-slate-950 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-800 dark:text-amber-300 hover:bg-amber-100/70 dark:hover:bg-slate-800/90 border border-amber-900/10 dark:border-amber-500/30 transition-all duration-200 cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-800" />
              )}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/favorites"
              className="relative p-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50/50 dark:bg-rose-950/40 hover:bg-rose-100/60 dark:hover:bg-rose-900/60 border border-rose-200/60 dark:border-rose-500/30 transition-all duration-200"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5 fill-rose-500/15 dark:fill-rose-500/30" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-md shadow-rose-500/50 animate-pulse">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* User Profile / Admin / Login */}
            {user ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-2xl hover:bg-amber-50 dark:hover:bg-slate-800 transition border border-amber-900/15 dark:border-amber-500/30 cursor-pointer"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                  <span className="text-xs font-bold text-[#0A192F] dark:text-slate-100 max-w-[90px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-700/60 dark:text-amber-400" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-amber-200 dark:border-amber-500/30 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-amber-100 dark:border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-[#0A192F] dark:text-slate-100 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3 text-amber-600" /> Admin Access
                        </span>
                      )}
                    </div>

                    <Link
                      to="/favorites"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 font-medium"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Saved Favorites ({favorites.length})</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 text-xs text-[#0A192F] dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-amber-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logoutUser();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-medium text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 gradient-saffron shadow-sm hover:opacity-95 transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger & Theme Toggle Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-800 border border-amber-900/10 dark:border-amber-500/30 transition cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-800" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0F172A] border-b border-amber-200 dark:border-amber-500/20 px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive(item.path) 
                    ? 'bg-amber-100 dark:bg-amber-950 text-[#0A192F] dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-500/40' 
                    : 'text-slate-800 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-0.5 text-[10px] font-bold uppercase rounded-full gradient-saffron text-slate-950">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-amber-100 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between p-3 bg-amber-50/70 dark:bg-slate-800/80 rounded-xl">
                <span className="text-xs font-bold text-[#0A192F] dark:text-slate-200 truncate">{user.name}</span>
                <button
                  onClick={() => {
                    logoutUser();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 gradient-saffron"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
