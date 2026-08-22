import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#020C1B] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl gradient-saffron flex items-center justify-center shadow-lg shadow-amber-500/25">
                <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#020C1B]"></div>
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                BHARAT<span className="text-amber-400 ml-1">YATRA</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              An intelligent, centralized platform designed to simplify tourism discovery across all 28 states & 8 UTs of India with personalized AI-powered itineraries and smart budget forecasting.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-amber-400 text-sm font-bold tracking-wider uppercase">Platform Modules</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li><Link to="/explore" className="hover:text-amber-300 transition">Destinations & Heritage</Link></li>
              <li><Link to="/ai-planner" className="hover:text-amber-300 transition">AI Day-Wise Trip Planner</Link></li>
              <li><Link to="/budget-calculator" className="hover:text-amber-300 transition">Budget & Cost Estimator</Link></li>
              <li><Link to="/cuisine" className="hover:text-amber-300 transition">Regional Flavors & Foods</Link></li>
              <li><Link to="/transport" className="hover:text-amber-300 transition">Transit & Railway Guide</Link></li>
              <li><Link to="/map" className="hover:text-amber-300 transition">Interactive GIS Map</Link></li>
            </ul>
          </div>

          {/* Key Circuits */}
          <div className="space-y-3">
            <h4 className="text-amber-400 text-sm font-bold tracking-wider uppercase">Popular Indian Circuits</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li><Link to="/explore?zone=North" className="hover:text-amber-300 transition">North: Golden Triangle & Himalayas</Link></li>
              <li><Link to="/explore?zone=South" className="hover:text-amber-300 transition">South: Backwaters & Temple Towns</Link></li>
              <li><Link to="/explore?zone=West" className="hover:text-amber-300 transition">West: Desert Forts & Coastlines</Link></li>
              <li><Link to="/explore?zone=East" className="hover:text-amber-300 transition">East: Heritage & Sacred Rivers</Link></li>
              <li><Link to="/explore?zone=North-East" className="hover:text-amber-300 transition">North-East: Living Roots & Valleys</Link></li>
            </ul>
          </div>

          {/* Travel Helpline & Support */}
          <div className="space-y-3">
            <h4 className="text-amber-400 text-sm font-bold tracking-wider uppercase">National Travel Helplines</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tourist Helpline: <strong className="text-white">1363 (24x7 Toll-Free)</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Railway Enquiries: <strong className="text-white">139</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span>National Emergency: <strong className="text-white">112</strong></span>
              </p>
              <p className="flex items-center gap-2 pt-1">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>support@bharatyatra.in</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Bharat Yatra Platform. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Indian Tourism Discovery</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
