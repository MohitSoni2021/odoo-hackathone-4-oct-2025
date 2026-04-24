import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createUser, fetchUsers } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import { ArrowLeftIcon, UserPlusIcon, IdentificationIcon, EnvelopeIcon, KeyIcon, ShieldCheckIcon, GlobeAltIcon, UserIcon } from '@heroicons/react/24/outline';

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Japan', 'Germany', 'France', 'Italy', 'Spain', 'Brazil', 'Mexico', 'China' 
];

const CreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'employee',
    country: 'United States',
    manager: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        toast.error('Please fill all required fields');
        return;
      }

      if (formData.password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }

      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role,
        country: formData.country,
        isActive: formData.isActive,
      };

      if (formData.role === 'employee' && formData.manager) {
        userData.manager = formData.manager;
      }

      await dispatch(createUser(userData)).unwrap();
      toast.success('User created successfully');
      dispatch(fetchUsers());
      navigate('/dashboard/users');
    } catch (err) {
      toast.error(err?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const managers = users.filter((u) => u.role === 'manager');

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary rounded-xl shadow-premium">

            <UserPlusIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-h-xl font-bold text-text-primary tracking-tight">Onboard New Talent</h1>
            <p className="text-body text-text-muted opacity-80">Create a professional profile and assign system permissions.</p>
          </div>
        </div>

        <div>
          <button
            onClick={() => navigate('/dashboard/users')}
            className="group inline-flex items-center px-6 py-3 bg-secondary text-text-primary font-bold rounded-xl hover:bg-border transition-all active:scale-95"
          >

            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Directory
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-xl border border-border shadow-premium overflow-hidden">

            <div className="px-10 py-8 bg-secondary/30 border-b border-border">
              <h3 className="text-h-m font-bold text-text-primary tracking-tight flex items-center gap-2">
                <IdentificationIcon className="h-6 w-6 text-accent" /> Personnel Credentials
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
                    First Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium"
                    placeholder="e.g. Michael"
                  />

                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
                    Last Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium"
                    placeholder="e.g. Scott"
                  />

                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4 text-accent" /> Email Address <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium"
                    placeholder="michael.scott@dundermifflin.com"
                  />

                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
                    <KeyIcon className="h-4 w-4 text-accent" /> Initial Password <span className="text-error">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium"
                    placeholder="••••••••"
                  />

                  <p className="text-[10px] text-text-muted/60 ml-1 font-medium italic">Min. 8 chars</p>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-accent" /> Access Level <span className="text-error">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium appearance-none cursor-pointer"
                  >

                    <option value="employee">Employee (Basic Access)</option>
                    <option value="manager">Manager (Team Approval)</option>
                    <option value="admin">Administrator (Full Access)</option>
                  </select>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
                    <GlobeAltIcon className="h-4 w-4 text-accent" /> Regional Office <span className="text-error">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium appearance-none cursor-pointer"
                  >

                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Manager Selection */}
              {formData.role === 'employee' && (
                <div className="space-y-2 animate-in slide-in-from-top duration-300">
                  <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-accent" /> Reporting To
                  </label>
                  <select
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium appearance-none cursor-pointer"
                  >

                    <option value="">No Manager Assigned</option>
                    {managers.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.firstName} {m.lastName} ({m.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-6 bg-secondary/30 rounded-xl border border-border">

                <div>
                  <h4 className="text-body font-bold text-text-primary">Instant Activation</h4>
                  <p className="text-small text-text-muted">Allow user to sign in immediately after creation.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-text-muted/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-success shadow-inner"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-8 border-t border-border">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/users')}
                  disabled={loading}
                  className="px-8 py-4 text-body font-bold text-text-muted bg-secondary hover:bg-border rounded-xl transition-all active:scale-95"
                >

                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-4 text-body font-bold text-white bg-accent hover:bg-accent-dark rounded-xl shadow-premium transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                >

                  {loading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="h-5 w-5" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Information/Guide */}
        <div className="space-y-8">
          <div className="bg-primary p-8 rounded-xl shadow-premium text-white relative overflow-hidden group">

            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform">
              <ShieldCheckIcon className="h-32 w-32" />
            </div>
            <h3 className="text-h-m font-bold mb-4 relative z-10">Security First</h3>
            <p className="text-body opacity-90 relative z-10 leading-relaxed">
              Ensure you assign the correct role. Admins can view financial data and delete records. Managers can only approve team expenses.
            </p>
          </div>

          <div className="bg-surface p-8 rounded-xl border border-border shadow-premium">

            <h3 className="text-h-s font-bold text-text-primary mb-6">Onboarding Checklist</h3>
            <ul className="space-y-4">
              {[
                'Verified corporate email address',
                'Correct departmental regional office',
                'Reporting manager assigned (if Employee)',
                'Initial password meets security policy'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-success/20 rounded-full text-success">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                  </div>
                  <span className="text-small text-text-secondary font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;