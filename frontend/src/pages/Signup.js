import React, { useState, useEffect } from 'react';
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

  const { firstName, lastName, email, password, confirmPassword, companyName, country } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
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
      const response = await axios.post(`${API_URL}/admin/create-admin`, {
        firstName,
        lastName,
        email,
        password,
        companyName,
        country,
      });

      if (response.data) {
        toast.success('Account created successfully! Please login.');
        navigate('/login');
      }
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-light via-neutral-light to-secondary-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-primary">
            Expense Manager
          </h2>
          <p className="mt-2 text-sm text-neutral-dark">
            Join us to manage your expenses efficiently
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-primary text-center">
              Create Admin Account
            </h3>
            <p className="mt-2 text-center text-sm text-neutral-dark">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-secondary hover:text-secondary-dark transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="input-field"
                  placeholder="John"
                  value={firstName}
                  onChange={onChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Doe"
                  value={lastName}
                  onChange={onChange}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="john.doe@example.com"
                value={email}
                onChange={onChange}
              />
            </div>

            {/* Company Name Field */}
            <div>
              <label htmlFor="companyName" className="form-label">
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                className="input-field"
                placeholder="e.g., Acme Corporation"
                value={companyName}
                onChange={onChange}
              />
            </div>

            {/* Country Field */}
            <div>
              <label htmlFor="country" className="form-label">
                Country
              </label>
              <select
                id="country"
                name="country"
                required
                className="input-field"
                value={country}
                onChange={onChange}
              >
                <option value="">Select a country</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Italy">Italy</option>
                <option value="Spain">Spain</option>
                <option value="India">India</option>
                <option value="Japan">Japan</option>
                <option value="China">China</option>
                <option value="Brazil">Brazil</option>
                <option value="Mexico">Mexico</option>
                <option value="South Korea">South Korea</option>
                <option value="Singapore">Singapore</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Sweden">Sweden</option>
                <option value="Norway">Norway</option>
                <option value="Denmark">Denmark</option>
              </select>
            </div>

            {/* Password Fields */}
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={onChange}
              />
              <p className="text-xs text-neutral-dark mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="input-field"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={onChange}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="btn-primary w-full flex justify-center items-center py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
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
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Terms and Privacy */}
          <p className="text-xs text-center text-neutral-dark">
            By signing up, you agree to our{' '}
            <a href="#" className="text-secondary hover:text-secondary-dark">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-secondary hover:text-secondary-dark">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;