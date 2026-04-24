import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, updateUser, fetchUsers } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import { XMarkIcon, UserIcon, EnvelopeIcon, KeyIcon, GlobeAltIcon, UserPlusIcon, IdentificationIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Japan',
  'Germany', 'France', 'Italy', 'Spain', 'Brazil', 'Mexico', 'China',
];

const UserModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { selectedUser, users } = useSelector((state) => state.users);
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

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        firstName: selectedUser.firstName || '',
        lastName: selectedUser.lastName || '',
        email: selectedUser.email || '',
        password: '',
        role: selectedUser.role || 'employee',
        country: selectedUser.country || 'United States',
        manager: selectedUser.manager?._id || '',
        isActive: selectedUser.isActive !== undefined ? selectedUser.isActive : true,
      });
    } else {
      setFormData({
        firstName: '', lastName: '', email: '', password: '',
        role: 'employee', country: 'United States', manager: '', isActive: true,
      });
    }
  }, [selectedUser]);

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
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (!selectedUser && !formData.password) {
        toast.error('Password is required for new users');
        setLoading(false);
        return;
      }

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        country: formData.country,
        isActive: formData.isActive,
      };

      if (formData.password) userData.password = formData.password;
      if (formData.role === 'employee' && formData.manager) userData.manager = formData.manager;

      if (selectedUser) {
        await dispatch(updateUser({ id: selectedUser._id, userData })).unwrap();
        toast.success('User updated successfully');
      } else {
        await dispatch(createUser(userData)).unwrap();
        toast.success('User created successfully');
      }

      dispatch(fetchUsers());
      onClose();
    } catch (error) {
      toast.error(error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const managers = users.filter((user) => user.role === 'manager');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      {/* Premium Backdrop Blur */}
      <div 
        className="fixed inset-0 bg-primary/40 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-surface w-full max-w-xl rounded-xl shadow-premium-lg overflow-hidden animate-in zoom-in duration-300 border border-border">

        {/* Header */}
        <div className="px-10 py-8 bg-secondary/30 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent rounded-xl shadow-premium">
              <UserPlusIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-h-m font-bold text-text-primary tracking-tight">
                {selectedUser ? 'Edit Personnel' : 'Onboard New User'}
              </h3>
              <p className="text-small text-text-muted">Configure profile and access levels.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-xl transition-all"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
                <IdentificationIcon className="h-4 w-4 text-accent" /> First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium"
                placeholder="John"
              />

            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
                <IdentificationIcon className="h-4 w-4 text-accent" /> Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium"
                placeholder="Doe"
              />

            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
              <EnvelopeIcon className="h-4 w-4 text-accent" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={!!selectedUser}
              className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="john.doe@company.com"
            />

          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
              <KeyIcon className="h-4 w-4 text-accent" /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!selectedUser}
              className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium"
              placeholder={selectedUser ? '••••••••' : 'Set complex password'}
            />

            <p className="text-[10px] text-text-muted/60 ml-1 font-medium tracking-wide italic">
              {selectedUser ? 'Leave blank to keep existing password.' : 'Minimum 8 characters required.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Role */}
            <div className="space-y-2">
              <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-accent" /> System Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium appearance-none cursor-pointer"
              >

                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
                <GlobeAltIcon className="h-4 w-4 text-accent" /> Location
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium appearance-none cursor-pointer"
              >

                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Manager Selection */}
          {formData.role === 'employee' && (
            <div className="space-y-2 animate-in slide-in-from-top duration-300">
              <label className="text-small font-bold text-text-secondary ml-1 flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-accent" /> Reporting Manager
              </label>
              <select
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium appearance-none cursor-pointer"
              >

                <option value="">No Manager Assigned</option>
                {managers.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                    {manager.firstName} {manager.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Active Status */}
          <div className="flex items-center justify-between p-5 bg-secondary/30 rounded-xl border border-border">

            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-success' : 'bg-text-muted/30'}`}></div>
              <span className="text-body font-bold text-text-primary">Enable User Access</span>
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
          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-4 text-body font-bold text-text-muted bg-secondary hover:bg-border rounded-xl transition-all active:scale-95"
            >

              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 text-body font-bold text-white bg-accent hover:bg-accent-dark rounded-xl shadow-premium transition-all active:scale-95 disabled:opacity-50"
            >

              {loading ? 'Processing...' : selectedUser ? 'Save Changes' : 'Complete Onboarding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;