import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser, registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(name, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role) => {
    if (role === 'admin') {
      setEmail('admin@bharatyatra.com');
      setPassword('admin123');
      await loginUser('admin@bharatyatra.com', 'admin123');
    } else {
      setEmail('traveler@bharatyatra.com');
      setPassword('user123');
      await loginUser('traveler@bharatyatra.com', 'user123');
    }
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-2xl space-y-6">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-saffron flex items-center justify-center mx-auto shadow-md shadow-amber-500/25">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#0A192F]"></div>
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#0A192F] tracking-tight">
            {isLogin ? 'Sign In to Bharat Yatra' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-500">
            Save custom AI itineraries, maintain wishlists, and submit ratings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-amber-50/80 p-1.5 rounded-2xl border border-amber-100">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              isLogin ? 'bg-white text-[#0A192F] shadow-xs' : 'text-amber-900 hover:text-[#0A192F]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              !isLogin ? 'bg-white text-[#0A192F] shadow-xs' : 'text-amber-900 hover:text-[#0A192F]'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-amber-900/70 uppercase block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Travel Explorer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden focus:border-amber-600 text-[#0A192F]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-amber-900/70 uppercase block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden focus:border-amber-600 text-[#0A192F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-amber-900/70 uppercase block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden focus:border-amber-600 text-[#0A192F]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#0A192F] text-amber-300 font-bold text-xs hover:bg-[#020C1B] transition shadow-md disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="pt-2 border-t border-amber-100 space-y-2">
          <span className="text-[11px] font-bold text-amber-800/60 uppercase tracking-wider block text-center">
            Quick 1-Click Demo Login
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('user')}
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Traveler Demo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
