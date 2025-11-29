import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { getDefaultRouteForRole } from '../utils/navigation';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Redirect if already logged in (on component mount)
    if (user && !isLoading) {
      const defaultRoute = getDefaultRouteForRole(user.role);
      navigate(defaultRoute, { replace: true });
    }
  }, []); // Only run on mount

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess && user) {
      toast.success('Login successful!');
      const defaultRoute = getDefaultRouteForRole(user.role);
      navigate(defaultRoute, { replace: true });
      dispatch(reset());
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center [py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-900 ">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Logo/Brand Section */}
          <div className="relative hidden lg:flex flex-col justify-between bg-black p-10">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-primary">Ontime</span>
            </div>
            <div className="mt-8 ">
              <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight text-white">
                Unlock Your
                <span className="text-white/50 block">Team Performance</span>
              </h2>
              <p className="mt-4 text-neutral-dark max-w-md">
                Manage expenses smarter and collaborate with your team seamlessly.
              </p>
            </div>
            {/* Simple Illustration */}
            <div className="mt-8 mx-auto w-full max-w-md">
              
            </div>
          </div>

          {/* Form Card */}
          <div className="p-6 sm:p-10">
            <div className="max-w-md mx-auto">
              <div>
                <h3 className="text-3xl font-extrabold text-primary">Welcome to Ontime</h3>
                <p className="mt-2 text-sm text-neutral-dark">
                  Unlock Your Team Performance
                </p>
                <p className="mt-4 text-sm text-neutral-dark">
                  Don't have an account?{' '}
                  <a href="/signup" className="font-semibold text-secondary hover:text-secondary-dark transition-colors">
                    Register
                  </a>
                </p>
              </div>

              <form className="mt-8 space-y-5" onSubmit={onSubmit}>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-neutral-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="input-field pl-10"
                      placeholder="you@example.com"
                      value={email}
                      onChange={onChange}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-neutral-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="input-field pl-10"
                      placeholder="••••••••"
                      value={password}
                      onChange={onChange}
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-secondary focus:ring-secondary border-neutral-dark rounded cursor-pointer" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-primary cursor-pointer">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="/forgot-password" className="font-medium text-secondary hover:text-secondary-dark transition-colors">
                      Forgot password?
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-primary bg-black rounded-md hover:bg-black/80 w-full flex justify-center items-center py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Login
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-dark">Secure Login</span>
                </div>
              </div>

              {/* Additional Info */}
              <p className="text-xs text-center text-neutral-dark mt-4">2025 All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;