import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

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

      toast.success('Account created! Welcome to Ontime');
      navigate('/login');
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side – Brand & Copy (Same as Login) */}
      <div className="hidden lg:flex flex-col pt-10 items-start bg-black text-white px-16 flex-1">
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

          {/* Hero */}
          <h1 className="text-6xl font-extrabold leading-tight">
            Expenses<br />
            <span className="text-white/40">made simple.</span>
          </h1>

          {/* Minimal Features */}
          <div className="mt-20 space-y-6 text-2xl font-light text-white/70">
            <div>Submit in seconds</div>
            <div>Approve instantly</div>
            <div>Track everything</div>
            <div>Any currency</div>
          </div>
        </div>
      </div>

      {/* Right Side – Signup Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 mt-10">
            <h2 className="text-4xl font-extrabold text-gray-900">Get started</h2>
            <p className="mt-3 text-gray-600">Create your Ontime account</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={onChange}
                placeholder="First name"
                required
                className="px-4 py-4 text-lg border-0 border-b-2 border-gray-300 focus:border-black outline-none transition bg-transparent"
              />
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={onChange}
                placeholder="Last name"
                required
                className="px-4 py-4 text-lg border-0 border-b-2 border-gray-300 focus:border-black outline-none transition bg-transparent"
              />
            </div>

            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Work email"
              required
              className="w-full px-4 py-4 text-lg border-0 border-b-2 border-gray-300 focus:border-black outline-none transition bg-transparent"
            />

            <input
              type="text"
              name="companyName"
              value={companyName}
              onChange={onChange}
              placeholder="Company name"
              required
              className="w-full px-4 py-4 text-lg border-0 border-b-2 border-gray-300 focus:border-black outline-none transition bg-transparent"
            />

            <select
              name="country"
              value={country}
              onChange={onChange}
              required
              className="w-full px-4 py-4 text-lg border-0 border-b-2 border-gray-300 focus:border-black outline-none transition bg-transparent"
            >
              <option value="">Country</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="India">India</option>
              {/* Add more as needed */}
              <option value="Other">Other</option>
            </select>

            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password (6+ characters)"
              required
              minLength="6"
              className="w-full px-4 py-4 text-lg border-0 border-b-2 border-gray-300 focus:border-black outline-none transition bg-transparent"
            />

            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder="Confirm password"
              required
              className="w-full px-4 py-4 text-lg border-0 border-b-2 border-gray-300 focus:border-black outline-none transition bg-transparent"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-black text-white py-4 text-lg font-semibold rounded-lg hover:bg-gray-900 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-black hover:underline">
              Sign in
            </Link>
          </p>

          <p className="mt-12 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <a href="#" className="underline">Terms</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>
            <br />© 2025 Ontime. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;