import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  EnvelopeIcon, 
  KeyIcon, 
  UserIcon, 
  BuildingOfficeIcon, 
  GlobeAltIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    country: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { firstName, lastName, email, password, confirmPassword, companyName, country } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/admin/create-admin`, {
        firstName,
        lastName,
        email,
        password,
        companyName,
        country,
      });

      toast.success('Enterprise Account Initiated. Welcome to Income Tracker.');
      navigate('/login');
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Verification failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface font-inter overflow-x-hidden">
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
            <span className="text-3xl font-black tracking-tighter uppercase italic">Income Tracker</span>
          </div>

          <h1 className="text-7xl font-black leading-[1.05] tracking-tight mb-10">
            Join the<br />
            <span className="text-accent italic">Elite</span> Financial<br />
            Network.
          </h1>

          <p className="text-xl text-white/60 font-medium max-w-md leading-relaxed mb-16">
            Initiate your enterprise-grade financial ecosystem and take control of your corporate spending.
          </p>

          <div className="flex flex-wrap gap-12">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Automated</span>
              <span className="text-xl font-black text-white italic">Workflows</span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-12">
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Real-time</span>
              <span className="text-xl font-black text-white italic">Analytics</span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-12">
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Global</span>
              <span className="text-xl font-black text-white italic">Compliance</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-20 text-xs font-bold text-white/20 tracking-[0.3em] uppercase">
          © 2025 Global Finance Corp.
        </div>
      </div>

      {/* Auth Side */}
      <div className="flex-1 flex items-center justify-center p-8 py-20 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="w-full max-w-lg relative z-10">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-text-primary tracking-tight mb-3">Initiate Onboarding</h2>
            <p className="text-text-muted font-medium">Create your administrative account to begin.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">First Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={onChange}
                    required
                    placeholder="John"
                    className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40"

                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Last Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={onChange}
                    required
                    placeholder="Doe"
                    className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40"

                  />
                </div>
              </div>
            </div>

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
                  placeholder="john.doe@company.com"
                  className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-border rounded-2xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Organization</label>
                <div className="relative">
                  <BuildingOfficeIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    name="companyName"
                    value={companyName}
                    onChange={onChange}
                    required
                    placeholder="Inc. Corp"
                    className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40"

                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Jurisdiction</label>
                <div className="relative">
                  <GlobeAltIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
                  <select
                    name="country"
                    value={country}
                    onChange={onChange}
                    required
                    className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-border rounded-2xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary appearance-none cursor-pointer"
                  >
                    <option value="">Global</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="India">India</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Access Key</label>
                <div className="relative">
                  <KeyIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40"

                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Confirm Key</label>
                <div className="relative">
                  <KeyIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={onChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40"

                  />
                </div>
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
                  Initializing...
                </>
              ) : (
                <>
                  Initialize Account
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-text-muted">
              Already have an profile?{' '}
              <Link to="/login" className="font-black text-accent hover:underline uppercase tracking-tighter ml-1">
                Enter System
              </Link>
            </p>
          </div>

          <div className="mt-16 text-center text-[10px] font-bold text-text-muted/40 uppercase tracking-[0.2em] leading-loose">
            By initializing, you agree to our <a href="#!" className="text-accent underline">Protocols</a> & <a href="#!" className="text-accent underline">Privacy Charters</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;