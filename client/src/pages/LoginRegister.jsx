import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Mail, ShieldCheck, Compass, KeyRound, CheckCircle2, ArrowLeft, Clock, Sparkles, Check, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user'); // 'user' | 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP Verification state (1: Info & Send OTP, 2: Enter & Verify OTP, 3: Set Password)
  const [otpStep, setOtpStep] = useState(1); 
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const otpInputsRef = useRef([]);

  const { loginUser, sendRegistrationOTP, verifyOnlyOTP, verifyOTPAndRegister } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  // Timer effect for OTP resend countdown
  useEffect(() => {
    let timer;
    if (otpStep === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpStep, countdown]);

  // Handle single-digit input in OTP boxes
  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.substring(value.length - 1);
    setOtpDigits(newDigits);
    setError('');

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtpDigits(digits);
      otpInputsRef.current[5]?.focus();
    }
  };

  // STEP 1: Send OTP to Email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim()) {
      setError('Please enter your Full Name and Email Address.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendRegistrationOTP(email.trim());
      if (res?.devOtpHint) {
        setSuccessMsg(`🔐 6-Digit OTP sent to ${email.trim()}! (Verification Code: ${res.devOtpHint})`);
        setOtpDigits(res.devOtpHint.split(''));
      } else {
        setSuccessMsg(res.message || `6-Digit OTP sent to ${email.trim()}`);
        setOtpDigits(['', '', '', '', '', '']);
      }
      setOtpStep(2);
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify Only OTP Code
  const handleVerifyOTPOnly = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const otpCode = otpDigits.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOnlyOTP(email.trim(), otpCode);
      setVerifiedOtp(otpCode);
      setSuccessMsg(res.message || '✓ OTP Verified! Now set your account password.');
      setOtpStep(3);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Create Password & Complete Registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

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
      const res = await verifyOTPAndRegister(name.trim(), email.trim(), password, verifiedOtp || otpDigits.join(''));
      setSuccessMsg('✨ Account created & email verified successfully!');
      setTimeout(() => {
        if (res?.user?.role === 'admin') {
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

  const handleResendOTP = async () => {
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await sendRegistrationOTP(email.trim());
      setSuccessMsg(res.message || 'A fresh OTP has been sent to your email!');
      setCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to resend OTP.');
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
            {!isLogin && otpStep === 2 ? (
              <KeyRound className="w-6 h-6 text-white animate-pulse" />
            ) : !isLogin && otpStep === 3 ? (
              <Lock className="w-6 h-6 text-white" />
            ) : role === 'admin' && isLogin ? (
              <ShieldCheck className="w-6 h-6 text-[#FFB36B]" />
            ) : (
              <Compass className="w-6 h-6 text-[#FFB36B]" />
            )}
          </div>
          
          <h2 className="text-2xl font-black text-[#123B5D] tracking-tight">
            {isLogin
              ? role === 'admin'
                ? 'Sign In to Admin Portal'
                : 'Sign In as Traveler'
              : otpStep === 1
                ? 'Register & Get Email OTP'
                : otpStep === 2
                  ? 'Verify 6-Digit OTP'
                  : 'Create Account Password'}
          </h2>
          
          <p className="text-xs text-[#718096] font-medium">
            {isLogin
              ? role === 'admin'
                ? 'Access Bharat Yatra content management & user permission database.'
                : 'Access saved AI itineraries, budget planner, and wishlist.'
              : otpStep === 1
                ? 'Enter your name and email to receive a 6-digit verification code.'
                : otpStep === 2
                  ? `Enter the 6-digit code sent to ${email}`
                  : `OTP verified for ${email}! Set a password to complete account creation.`}
          </p>
        </div>

        {/* Tab Switcher (Sign In vs Register) */}
        <div className="flex bg-[#EAF4FA] p-1.5 rounded-2xl border border-[#E5EAF0]">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setOtpStep(1); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              isLogin ? 'bg-white text-[#123B5D] shadow-xs' : 'text-[#718096] hover:text-[#123B5D]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setOtpStep(1); setError(''); setSuccessMsg(''); }}
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
          /* ================= REGISTER FORM (3-STEP VERIFICATION) ================= */
          <div>
            {otpStep === 1 ? (
              /* STEP 1: Full Name & Email Address -> Send OTP */
              <form onSubmit={handleSendOTP} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] text-white transition shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4 text-white" />
                  <span>{loading ? 'Sending OTP Code...' : 'Send 6-Digit OTP to Email'}</span>
                </button>
              </form>
            ) : otpStep === 2 ? (
              /* STEP 2: Enter & Verify 6-Digit OTP Code */
              <form onSubmit={handleVerifyOTPOnly} className="space-y-5">
                <button
                  type="button"
                  onClick={() => setOtpStep(1)}
                  className="text-xs text-[#123B5D] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to details ({email})</span>
                </button>

                <div>
                  <label className="text-xs font-bold text-[#123B5D] uppercase block mb-2 text-center">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-11 h-13 text-center text-xl font-black rounded-xl bg-[#F7F9FC] border-2 border-[#E5EAF0] focus:border-[#F28C45] text-[#123B5D] outline-hidden transition shadow-xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Countdown / Resend UI */}
                <div className="text-center text-xs space-y-1">
                  {countdown > 0 ? (
                    <p className="text-[#718096] flex items-center justify-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#F28C45]" />
                      <span>Resend OTP available in <strong>{countdown}s</strong></span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-[#F28C45] font-bold hover:underline cursor-pointer"
                    >
                      Didn't receive OTP? Resend Code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otpDigits.join('').length !== 6}
                  className="w-full py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] text-white transition shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>{loading ? 'Verifying OTP...' : 'Verify 6-Digit OTP'}</span>
                </button>
              </form>
            ) : (
              /* STEP 3: OTP Verified -> Create Account Password */
              <form onSubmit={handleCompleteRegistration} className="space-y-4">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Verified: {email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpStep(1)}
                    className="text-[10px] text-slate-500 underline font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
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
                  <span>{loading ? 'Creating Account...' : 'Complete Sign Up & Start Exploring'}</span>
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}


