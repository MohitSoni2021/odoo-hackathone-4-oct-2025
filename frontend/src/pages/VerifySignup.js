import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import { 
  EnvelopeIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const VerifySignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otpCode) {
      toast.error('Please provide both email and verification code');
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifySignup(email, otpCode);
      toast.success('Account verified successfully! You are now authenticated.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed. Please check your code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface font-inter">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-center items-start bg-primary text-white px-20 flex-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="max-w-xl relative z-10">
          <div className="flex items-center gap-4 mb-24 group cursor-default">
            <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center shadow-premium transition-transform group-hover:scale-110 duration-500">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase italic">InTrack</span>
          </div>

          <h1 className="text-7xl font-black leading-[1.05] tracking-tight mb-10">
            Identity<br />
            <span className="text-accent italic">Verification.</span><br />
            Required.
          </h1>

          <p className="text-xl text-white/60 font-medium max-w-md leading-relaxed mb-16">
            Confirm your corporate credentials to unlock your financial dashboard.
          </p>
        </div>

        <div className="absolute bottom-12 left-20 text-xs font-bold text-white/20 tracking-[0.3em] uppercase">
          © 2025 Global Finance Corp.
        </div>
      </div>

      {/* Auth Side */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -ml-32 -mt-32"></div>
        
        <div className="w-full max-w-md relative z-10">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-black text-accent uppercase tracking-widest hover:gap-3 transition-all mb-12">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Login
          </Link>

          <div className="mb-12">
            <h2 className="text-4xl font-black text-text-primary tracking-tight mb-3">Verify Account</h2>
            <p className="text-text-muted font-medium">Enter the 10-digit security code sent to your email.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Verification Email</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full pl-14 pr-6 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Security Code</label>
              <div className="relative">
                <ShieldCheckIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  placeholder="Enter 10-digit code"
                  className="w-full pl-14 pr-6 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40 tracking-[0.2em]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-10 bg-accent text-white py-5 text-sm font-black rounded-xl hover:bg-accent-dark transition-all shadow-premium active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div>
                  Verifying...
                </>
              ) : (
                <>
                  Confirm Identity
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-text-muted">
              Didn't receive a code?{' '}
              <button 
                onClick={() => toast.info('Please try logging in again to resend code.')}
                className="font-black text-accent hover:underline uppercase tracking-tighter ml-1"
              >
                Resend Code
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifySignup;
