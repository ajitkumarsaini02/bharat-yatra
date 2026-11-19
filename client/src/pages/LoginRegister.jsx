import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Mail, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user'); // 'user' | 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser, registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/dashboard';

  // Handle registration without OTP
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim()) {
      setError('Please enter your Full Name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your Email Address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(name.trim(), email.trim(), password, role);
      setSuccessMsg('Account created successfully! Welcome to Bharat Yatra.');
      setTimeout(() => {
        if (res?.user?.role === 'admin' || role === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirectTo);
        }
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await loginUser(email.trim(), password, role);
      setSuccessMsg(`Signed in successfully as ${res?.user?.role === 'admin' ? 'Administrator' : 'Traveler'}!`);
      setTimeout(() => {
        if (res?.user?.role === 'admin' || role === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirectTo);
        }
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-2xl space-y-6 transition-colors">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-md transition-colors bg-gradient-to-br from-[#123B5D] to-[#1D5D85] text-white">
            {role === 'admin' && isLogin ? (
              <ShieldCheck className="w-6 h-6 text-[#FFB36B]" />
            ) : !isLogin ? (
              <User className="w-6 h-6 text-[#FFB36B]" />
            ) : (
              <Compass className="w-6 h-6 text-[#FFB36B]" />
            )}
          </div>
          
          <h2 className="text-2xl font-black text-[#123B5D] tracking-tight">
            {isLogin
              ? role === 'admin'
                ? 'Sign In to Admin Portal'
                : 'Sign In as Traveler'
              : 'Create Your Account'}
          </h2>
          
          <p className="text-xs text-[#718096] font-medium">
            {isLogin
              ? role === 'admin'
                ? 'Access Bharat Yatra content management & user permission database.'
                : 'Access saved AI itineraries, budget planner, and wishlist.'
              : 'Sign up to plan trips, save AI itineraries, and explore Bharat.'}
          </p>
        </div>

        {/* Tab Switcher (Sign In vs Register) */}
        <div className="flex bg-[#EAF4FA] p-1.5 rounded-2xl border border-[#E5EAF0]">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              isLogin ? 'bg-white text-[#123B5D] shadow-xs' : 'text-[#718096] hover:text-[#123B5D]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              !isLogin ? 'bg-white text-[#123B5D] shadow-xs' : 'text-[#718096] hover:text-[#123B5D]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2">
            <span className="shrink-0 font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORMS */}
        {isLogin ? (
          /* ================= SIGN IN FORM ================= */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#123B5D] uppercase block">
                Select Sign In Portal
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setRole('user'); setError(''); }}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    role === 'user'
                      ? 'bg-[#EAF4FA] border-[#F28C45] text-[#123B5D] shadow-xs font-black'
                      : 'bg-[#F7F9FC] border border-[#E5EAF0] text-[#718096] hover:border-slate-300'
                  }`}
                >
                  <Compass className="w-5 h-5 text-[#F28C45]" />
                  <span>Traveler (User)</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setRole('admin'); setError(''); }}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    role === 'admin'
                      ? 'bg-[#EAF4FA] border-[#F28C45] text-[#123B5D] shadow-xs font-black'
                      : 'bg-[#F7F9FC] border border-[#E5EAF0] text-[#718096] hover:border-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-[#123B5D]" />
                  <span>Admin (Manager)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#123B5D] uppercase block mb-1">
                {role === 'admin' ? 'Admin Email Address' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#F28C45] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={role === 'admin' ? 'admin@bharatyatra.com' : 'your.email@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs font-semibold outline-hidden focus:border-[#F28C45] text-[#29445A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#123B5D] uppercase block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#F28C45] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs font-semibold outline-hidden focus:border-[#F28C45] text-[#29445A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50 cursor-pointer bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] hover:to-[#f29c4b] text-white"
            >
              {loading ? 'Signing in...' : role === 'admin' ? 'Sign In to Admin Portal' : 'Sign In as Traveler'}
            </button>
          </form>
        ) : (
          /* ================= REGISTER FORM (DIRECT SIGN UP) ================= */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#123B5D] uppercase block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#F28C45] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs font-semibold outline-hidden focus:border-[#F28C45] text-[#29445A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#123B5D] uppercase block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#F28C45] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs font-semibold outline-hidden focus:border-[#F28C45] text-[#29445A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#123B5D] uppercase block mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#F28C45] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs font-semibold outline-hidden focus:border-[#F28C45] text-[#29445A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#123B5D] uppercase block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#F28C45] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs font-semibold outline-hidden focus:border-[#F28C45] text-[#29445A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] text-white transition shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{loading ? 'Creating Account...' : 'Create Account & Start Exploring'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
