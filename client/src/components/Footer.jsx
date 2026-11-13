import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, Mail, Phone, MapPin, Globe, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#123B5D] text-[#EAF4FA] pt-16 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/15">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F28C45] to-[#FFB36B] flex items-center justify-center shadow-lg shadow-[#F28C45]/25">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 21.5C12 21.5 19 15 19 9.5C19 5.634 15.866 2.5 12 2.5C8.134 2.5 5 5.634 5 9.5C5 15 12 21.5 12 21.5Z" fill="#FFFFFF" />
                  <circle cx="12" cy="9.5" r="3.2" fill="#123B5D" />
                  <circle cx="12" cy="9.5" r="1.2" fill="#F28C45" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                BHARAT<span className="text-[#FFB36B] ml-1">YATRA</span>
              </span>
            </div>
            <p className="text-sm text-[#EAF4FA]/80 leading-relaxed">
              India's premier centralized tourism intelligence platform. Seamlessly plan day-wise AI itineraries, estimate realistic travel budgets, and discover verified heritage across all 28 states & 8 UTs.
            </p>
            <div className="flex items-center gap-3 pt-1 text-white/70">
              {['Facebook', 'Instagram', 'Twitter', 'YouTube'].map((social) => (
                <span
                  key={social}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#F28C45] hover:text-white transition flex items-center justify-center text-xs font-bold cursor-pointer"
                  title={social}
                >
                  {social[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Platform Modules */}
          <div className="space-y-3">
            <h4 className="text-[#FFB36B] text-xs font-extrabold tracking-wider uppercase">Platform Modules</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#EAF4FA]/85">
              <li><Link to="/about" className="hover:text-white hover:underline transition">About Bharat Yatra</Link></li>
              <li><Link to="/destinations" className="hover:text-white hover:underline transition">Destinations Directory</Link></li>
              <li><Link to="/explore" className="hover:text-white hover:underline transition">Explore Categories</Link></li>
              <li><Link to="/ai-planner" className="hover:text-white hover:underline transition">AI Day-Wise Trip Planner</Link></li>
              <li><Link to="/travel-planner" className="hover:text-white hover:underline transition">Travel Distance & Fare Estimator</Link></li>
              <li><Link to="/budget-calculator" className="hover:text-white hover:underline transition">Budget & Cost Calculator</Link></li>
              <li><Link to="/cuisine" className="hover:text-white hover:underline transition">Regional Foods & Delicacies</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:underline transition">Contact Us & Helplines</Link></li>
            </ul>
          </div>

          {/* Key Circuits */}
          <div className="space-y-3">
            <h4 className="text-[#FFB36B] text-xs font-extrabold tracking-wider uppercase">Iconic Indian Circuits</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#EAF4FA]/85">
              <li><Link to="/explore?zone=North" className="hover:text-white hover:underline transition">North: Golden Triangle & Himalayas</Link></li>
              <li><Link to="/explore?zone=South" className="hover:text-white hover:underline transition">South: Backwaters & Temple Sanctums</Link></li>
              <li><Link to="/explore?zone=West" className="hover:text-white hover:underline transition">West: Desert Citadels & Arabian Coast</Link></li>
              <li><Link to="/explore?zone=East" className="hover:text-white hover:underline transition">East: Sacred Ghats & Tea Estates</Link></li>
              <li><Link to="/explore?zone=North-East" className="hover:text-white hover:underline transition">North-East: Living Roots & Serene Valleys</Link></li>
            </ul>
          </div>

          {/* 24x7 Helplines & Contact */}
          <div className="space-y-3">
            <h4 className="text-[#FFB36B] text-xs font-extrabold tracking-wider uppercase">Helplines & Contact</h4>
            <div className="space-y-2.5 text-xs text-[#EAF4FA]/85">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FFB36B] shrink-0" />
                <span>Tourist Helpline: <strong className="text-white">1363 (24x7 Toll-Free)</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FFB36B] shrink-0" />
                <span>Railway Enquiries: <strong className="text-white">139</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FFB36B] shrink-0" />
                <span>National Emergency: <strong className="text-white">112</strong></span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                <Mail className="w-3.5 h-3.5 text-[#FFB36B] shrink-0" />
                <span>support@bharatyatra.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FFB36B] shrink-0" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#EAF4FA]/70 gap-4">
          <p>© 2026 Bharat Yatra Platform. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#F28C45] fill-[#F28C45] inline" />
            <span>for Indian Heritage & Tourism Discovery</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
