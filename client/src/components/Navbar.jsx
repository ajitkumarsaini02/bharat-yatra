import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  Calculator, 
  UtensilsCrossed, 
  Route as RouteIcon,
  Heart, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut,
  ChevronDown,
  MapPin,
  Compass as CompassIcon,
  Phone,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navHeaderRef = useRef(null);
  const location = useLocation();
  const { user, favorites, logoutUser, isAdmin } = useAuth();

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
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Explore', path: '/explore' },
    { name: 'Travel Planner', path: '/travel-planner' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      ref={navHeaderRef} 
      className="sticky top-0 z-40 w-full bg-white border-b border-[#E5EAF0] shadow-xs transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Professional Bharat Yatra Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#123B5D] to-[#1D5D85] flex items-center justify-center shadow-md shadow-[#123B5D]/20 group-hover:scale-105 transition-transform duration-300">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 21.5C12 21.5 19 15 19 9.5C19 5.634 15.866 2.5 12 2.5C8.134 2.5 5 5.634 5 9.5C5 15 12 21.5 12 21.5Z" fill="#F28C45" />
                <circle cx="12" cy="9.5" r="3.2" fill="#FFFFFF" />
                <circle cx="12" cy="9.5" r="1.2" fill="#123B5D" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#123B5D] flex items-center">
                BHARAT<span className="text-[#F28C45] ml-1">YATRA</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#718096] -mt-1">
                Incredible Tourism Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active 
                      ? 'text-[#123B5D] bg-[#EAF4FA] font-bold' 
                      : 'text-[#29445A] hover:text-[#123B5D] hover:bg-[#F7F9FC]'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-black uppercase rounded-full bg-[#F28C45] text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Saved Wishlist Link */}
            <Link
              to="/favorites"
              className="relative p-2.5 rounded-xl text-[#F28C45] hover:text-[#e0752f] bg-[#FFF5EE] border border-[#F28C45]/20 transition-all duration-200"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4 fill-[#F28C45]/20" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F28C45] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* CTA Button: Plan Your Journey */}
            <Link
              to="/ai-planner"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] hover:to-[#f29c4b] shadow-md shadow-[#F28C45]/25 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plan Your Trip</span>
            </Link>

            {/* User Profile / Admin / Login */}
            {user ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-xl hover:bg-[#EAF4FA] border border-[#E5EAF0] transition cursor-pointer"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-[#123B5D]/20"
                  />
                  <span className="text-xs font-bold text-[#123B5D] max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-[#718096]" />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E5EAF0] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-[#E5EAF0]">
                      <p className="text-xs font-bold text-[#123B5D]">{user.name}</p>
                      <p className="text-[11px] text-[#718096] truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EAF4FA] text-[#123B5D] text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3 text-[#F28C45]" />
                          <span>Admin Portal Active</span>
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-[#29445A] hover:text-[#123B5D] hover:bg-[#EAF4FA] font-bold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#F28C45]" />
                        <span>Traveler Dashboard</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs text-[#29445A] hover:text-[#123B5D] hover:bg-[#EAF4FA] font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#F28C45]" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <Link
                        to="/favorites"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-[#29445A] hover:text-[#123B5D] hover:bg-[#EAF4FA] font-medium"
                      >
                        <Heart className="w-4 h-4 text-[#F28C45]" />
                        <span>Saved Destinations</span>
                      </Link>

                      <button
                        onClick={() => {
                          logoutUser();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium text-left cursor-pointer"
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
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#123B5D] hover:bg-[#EAF4FA] border border-[#E5EAF0] transition"
              >
                <User className="w-3.5 h-3.5 text-[#F28C45]" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#123B5D] hover:bg-[#EAF4FA] transition cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5EAF0] px-4 pt-3 pb-6 space-y-2 animate-in fade-in shadow-xl">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                isActive(item.path) 
                  ? 'bg-[#EAF4FA] text-[#123B5D] font-bold' 
                  : 'text-[#29445A] hover:text-[#123B5D] hover:bg-[#F7F9FC]'
              }`}
            >
              <span>{item.name}</span>
              {item.badge && (
                <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-[#F28C45] text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="pt-2 border-t border-[#E5EAF0] grid grid-cols-2 gap-2 text-xs">
            <Link
              to="/cuisine"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-[#F7F9FC] text-[#123B5D] font-semibold text-center"
            >
              Cuisine
            </Link>
            <Link
              to="/budget-calculator"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-[#F7F9FC] text-[#123B5D] font-semibold text-center"
            >
              Budget Calculator
            </Link>
          </div>

          <div className="pt-3 border-t border-[#E5EAF0] flex flex-col gap-2">
            <Link
              to="/ai-planner"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#F28C45] to-[#FFB36B]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan Your Trip</span>
            </Link>

            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 bg-[#EAF4FA] rounded-xl hover:bg-[#dbeaf5] transition"
                >
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-[#F28C45]" />
                    <span className="text-xs font-bold text-[#123B5D] truncate">{user.name} (Dashboard)</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#123B5D] -rotate-90" />
                </Link>
                <div className="flex items-center justify-between px-2 text-xs">
                  <span className="text-[#718096] truncate">{user.email}</span>
                  <button
                    onClick={() => {
                      logoutUser();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl text-xs font-bold text-[#123B5D] bg-[#EAF4FA] border border-[#E5EAF0]"
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
