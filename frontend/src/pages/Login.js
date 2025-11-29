import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { getDefaultRouteForRole } from '../utils/navigation';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(getDefaultRouteForRole(user.role), { replace: true });
    }
  }, [user, navigate]);

  // Handle login effects
  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isSuccess && user) {
      toast.success('Welcome back!');
      navigate(getDefaultRouteForRole(user.role), { replace: true });
      dispatch(reset());
    }
  }, [isError, isSuccess, message, user, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand & Minimal Copy */}
      <div className="hidden lg:flex flex-col justify-center items-start bg-black text-white px-16 flex-1">
        <div className="max-w-xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-20">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold">Ontime</span>
          </div>

          {/* Hero Text */}
          <h1 className="text-6xl font-extrabold leading-tight">
            Expenses<br />
            <span className="text-white/40">made simple.</span>
          </h1>

          {/* Minimal Feature List */}
          <div className="mt-20 space-y-6 text-2xl font-light text-white/70">
            <div>Submit in seconds</div>
            <div>Approve instantly</div>
            <div>Track everything</div>
            <div>Any currency</div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="mt-3 text-gray-600">Sign in to your Ontime account</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="Email address"
                className="w-full px-4 py-4 text-lg border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors bg-transparent"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                placeholder="Password"
                className="w-full px-4 py-4 text-lg border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors bg-transparent"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-black font-medium hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-black text-white py-4 text-lg font-semibold rounded-lg hover:bg-gray-900 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="font-semibold text-black hover:underline">
              Register
            </a>
          </p>

          <p className="mt-12 text-center text-xs text-gray-500">© 2025 Ontime. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;