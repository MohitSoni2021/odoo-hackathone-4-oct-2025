import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import { EnvelopeIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('OTP sent to your email.');
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
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
            Account<br />
            <span className="text-accent italic">Recovery.</span><br />
            Simplified.
          </h1>

          <p className="text-xl text-white/60 font-medium max-w-md leading-relaxed mb-16">
            Regain access to your financial intelligence dashboard with a single step.
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
          <div className="mb-12">
            <Link to="/login" className="inline-flex items-center text-xs font-bold text-accent uppercase tracking-widest mb-8 hover:gap-2 transition-all">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
            <h2 className="text-4xl font-black text-text-primary tracking-tight mb-3">Forgot Access Key?</h2>
            <p className="text-text-muted font-medium">Enter your corporate email to receive a security code.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Corporate Email</label>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-10 bg-accent text-white py-5 text-sm font-black rounded-xl hover:bg-accent-dark transition-all shadow-premium active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div>
                  Sending Code...
                </>
              ) : (
                <>
                  Request Security Code
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
