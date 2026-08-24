import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ShieldCheck, Compass, KeyRound } from 'lucide-react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await loginUser(email.trim(), password, role);
        setSuccessMsg(`Signed in successfully as ${res?.user?.role === 'admin' ? 'Administrator' : 'Traveler'}!`);
        setTimeout(() => {
          if (res?.user?.role === 'admin' || role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 400);
      } else {
        const res = await registerUser(name.trim(), email.trim(), password, role, adminSecretKey.trim());
        setSuccessMsg(`Account created successfully as ${role === 'admin' ? 'Administrator' : 'Traveler'}!`);
        setTimeout(() => {
          if (role === 'admin' || res?.user?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 400);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-900/10 dark:border-amber-500/20 shadow-2xl space-y-6 transition-colors">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-md transition-colors ${
            role === 'admin' 
              ? 'bg-amber-600 text-white shadow-amber-600/30' 
              : 'gradient-saffron shadow-amber-500/25'
          }`}>
            {role === 'admin' ? (
              <ShieldCheck className="w-7 h-7 text-white" />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#0A192F]"></div>
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-black text-[#0A192F] dark:text-slate-100 tracking-tight">
            {isLogin
              ? role === 'admin'
                ? 'Sign In to Admin Portal'
                : 'Sign In as Traveler'
              : role === 'admin'
                ? 'Create Administrator Account'
                : 'Create Traveler Account'}
          </h2>
          
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isLogin
              ? role === 'admin'
                ? 'Access Bharat Yatra content management & 112+ monuments database.'
                : 'Access saved AI itineraries, budget planner, and wishlist.'
              : role === 'admin'
                ? 'Register a new administrator for tourism directory management.'
                : 'Join Bharat Yatra to create custom itineraries and discover India.'}
          </p>
        </div>

        {/* Tab Switcher (Sign In vs Register) */}
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
          
          {/* Role Picker for BOTH Sign In & Register */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-900/70 dark:text-slate-300 uppercase block">
              {isLogin ? 'Select Sign In Role' : 'Select Account Type'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setRole('user'); setError(''); }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                  role === 'user'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-300 shadow-xs font-black'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
                }`}
              >
                <Compass className="w-5 h-5 text-emerald-500" />
                <span>Traveler (User)</span>
              </button>

              <button
                type="button"
                onClick={() => { setRole('admin'); setError(''); }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                  role === 'admin'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-300 shadow-xs font-black'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Admin (Manager)</span>
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-amber-900/70 dark:text-slate-300 uppercase block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={role === 'admin' ? 'Admin Full Name' : 'Enter your full name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden focus:border-amber-600 text-[#0A192F] dark:text-slate-100"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-amber-900/70 dark:text-slate-300 uppercase block mb-1">
              {role === 'admin' ? 'Admin Email Address' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder={role === 'admin' ? 'admin@bharatyatra.com' : 'your.email@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden focus:border-amber-600 text-[#0A192F] dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-amber-900/70 dark:text-slate-300 uppercase block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden focus:border-amber-600 text-[#0A192F] dark:text-slate-100"
              />
            </div>
          </div>

          {/* Admin Secret Passcode Field only for Admin Register */}
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
            className={`w-full py-3.5 rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50 cursor-pointer ${
              role === 'admin'
                ? 'bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400'
                : 'bg-[#0A192F] hover:bg-[#020C1B] text-amber-300 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400'
            }`}
          >
            {loading
              ? 'Processing...'
              : isLogin
                ? role === 'admin'
                  ? 'Sign In to Admin Portal'
                  : 'Sign In as Traveler'
                : role === 'admin'
                  ? 'Create Administrator Account'
                  : 'Create Traveler Account'}
          </button>
        </form>

      </div>
    </div>
  );
}
