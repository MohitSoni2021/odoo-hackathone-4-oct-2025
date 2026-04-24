import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { getDefaultRouteForRole } from '../utils/navigation';
import { EnvelopeIcon, KeyIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate(getDefaultRouteForRole(user.role), { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isError) {
      if (message.toLowerCase().includes('verify your account')) {
        toast.info('Account Verification Required');
        navigate('/verify-signup', { state: { email } });
      } else {
        toast.error(message);
      }
      dispatch(reset());
    }
    if (isSuccess && user) {
      toast.success('Access Granted. Welcome back.');
      navigate(getDefaultRouteForRole(user.role), { replace: true });
      dispatch(reset());
    }
  }, [isError, isSuccess, message, user, navigate, dispatch, email]);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex bg-surface font-inter">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-center items-start bg-primary text-white px-20 flex-1 relative overflow-hidden">
        {/* Abstract Background Shapes */}
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
            Financial<br />
            <span className="text-accent italic">Intelligence.</span><br />
            Redefined.
          </h1>

          <p className="text-xl text-white/60 font-medium max-w-md leading-relaxed mb-16">
            The premium solution for enterprise expense management and real-time financial tracking.
          </p>

          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-accent">100%</span>
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Accuracy</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-accent">24/7</span>
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Availability</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-accent">SECURE</span>
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Encryption</span>
            </div>
          </div>
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
            <h2 className="text-4xl font-black text-text-primary tracking-tight mb-3">Welcome Back</h2>
            <p className="text-text-muted font-medium">Please authenticate to access your portfolio.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Corporate Email</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  placeholder="name@company.com"
                  className="w-full pl-14 pr-6 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40"

                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest group-focus-within:text-accent transition-colors">Access Key</label>
                <Link to="/forgot-password" title="Recover Access Key" className="text-[10px] font-black text-accent uppercase tracking-tighter hover:underline">Recover Key?</Link>
              </div>
              <div className="relative">
                <KeyIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40"

                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-2 px-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-10 h-5 bg-text-muted/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent shadow-inner"></div>
              </label>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Maintain Session</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-10 bg-accent text-white py-5 text-sm font-black rounded-xl hover:bg-accent-dark transition-all shadow-premium active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-text-muted">
              Unauthorized personnel?{' '}
              <Link to="/signup" className="font-black text-accent hover:underline uppercase tracking-tighter ml-1">
                Request Access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;