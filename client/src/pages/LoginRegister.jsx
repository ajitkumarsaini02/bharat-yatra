import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ShieldCheck, Compass, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user'); // 'user' | 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser, registerUser } = useAuth();
  const navigate = useNavigate();

  const handleQuickFill = (type) => {
    setError('');
    setSuccessMsg('');
    if (type === 'admin') {
      setEmail('admin@bharatyatra.com');
      setPassword('Admin123!');
      if (!isLogin) {
        setName('Yatra Administrator');
        setRole('admin');
        setAdminSecretKey('bharat_admin_2026');
      }
    } else {
      setEmail('traveler@bharatyatra.com');
      setPassword('Traveler123!');
      if (!isLogin) {
        setName('Aarav Sharma');
        setRole('user');
        setAdminSecretKey('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await loginUser(email, password);
        setSuccessMsg('Signed in successfully!');
        setTimeout(() => {
          if (res?.user?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 500);
      } else {
        const res = await registerUser(name, email, password, role, adminSecretKey);
        setSuccessMsg(`Account created successfully as ${role.toUpperCase()}!`);
        setTimeout(() => {
          if (role === 'admin' || res?.user?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 500);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-900/10 dark:border-amber-500/20 shadow-2xl space-y-6 transition-colors">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-saffron flex items-center justify-center mx-auto shadow-md shadow-amber-500/25">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#0A192F]"></div>
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#0A192F] dark:text-slate-100 tracking-tight">
            {isLogin ? 'Sign In to Bharat Yatra' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isLogin
              ? 'Access AI trip itineraries, wishlist, and admin dashboard controls.'
              : 'Join Bharat Yatra as a Traveler or Platform Administrator.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-amber-50/80 dark:bg-slate-800 p-1.5 rounded-2xl border border-amber-100 dark:border-slate-700">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              isLogin ? 'bg-white dark:bg-slate-900 text-[#0A192F] dark:text-amber-300 shadow-xs' : 'text-amber-900 dark:text-slate-400 hover:text-[#0A192F]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              !isLogin ? 'bg-white dark:bg-slate-900 text-[#0A192F] dark:text-amber-300 shadow-xs' : 'text-amber-900 dark:text-slate-400 hover:text-[#0A192F]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Quick Fill Helpers */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200/60 dark:border-slate-700 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick Demo Login & Register:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('user')}
              className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              <span>Demo Traveler</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-amber-900 dark:text-amber-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Picker for Register */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-900/70 dark:text-slate-300 uppercase block">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    role === 'user'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <Compass className="w-4 h-4 text-emerald-500" />
                  <span>Traveler (User)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    role === 'admin'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Admin (Manager)</span>
                </button>
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-amber-900/70 dark:text-slate-300 uppercase block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden focus:border-amber-600 text-[#0A192F] dark:text-slate-100"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-amber-900/70 dark:text-slate-300 uppercase block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden focus:border-amber-600 text-[#0A192F] dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-amber-900/70 dark:text-slate-300 uppercase block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden focus:border-amber-600 text-[#0A192F] dark:text-slate-100"
              />
            </div>
          </div>

          {/* Admin Secret Passcode Field */}
          {!isLogin && role === 'admin' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-amber-900/70 dark:text-slate-300 uppercase">
                  Admin Passcode
                </label>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Default: bharat_admin_2026</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="bharat_admin_2026"
                  value={adminSecretKey}
                  onChange={(e) => setAdminSecretKey(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden focus:border-amber-600 text-[#0A192F] dark:text-slate-100"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#0A192F] dark:bg-amber-500 text-amber-300 dark:text-slate-950 font-bold text-xs hover:bg-[#020C1B] dark:hover:bg-amber-400 transition shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? 'Processing...'
              : isLogin
                ? 'Sign In'
                : `Create ${role === 'admin' ? 'Admin' : 'Traveler'} Account`}
          </button>
        </form>

      </div>
    </div>
  );
}
