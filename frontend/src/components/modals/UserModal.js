import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, updateUser, fetchUsers } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import { XMarkIcon } from '@heroicons/react/24/outline';

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'India',
  'Japan',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Brazil',
  'Mexico',
  'China',
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
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'employee',
        country: 'United States',
        manager: '',
        isActive: true,
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
      // Validation
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

      if (formData.password && formData.password.length < 8) {
        toast.error('Password must be at least 8 characters');
        setLoading(false);
        return;
      }

      // Prepare data
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        country: formData.country,
        isActive: formData.isActive,
      };

      // Add password only if provided
      if (formData.password) {
        userData.password = formData.password;
      }

      // Add manager only if role is employee and manager is selected
      if (formData.role === 'employee' && formData.manager) {
        userData.manager = formData.manager;
      }

      if (selectedUser) {
        // Update user
        await dispatch(updateUser({ id: selectedUser._id, userData })).unwrap();
        toast.success('User updated successfully');
      } else {
        // Create user
        await dispatch(createUser(userData)).unwrap();
        toast.success('User created successfully');
      }

      // Refresh users list
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedUser ? 'Edit User' : 'Create New User'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={!!selectedUser}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-100"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password {!selectedUser && '*'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!selectedUser}
                  placeholder={selectedUser ? 'Leave blank to keep current password' : ''}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 8 characters
                </p>
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Manager (only for employees) */}
              {formData.role === 'employee' && (
                <div>
                  <label
                    htmlFor="manager"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Manager
                  </label>
                  <select
                    id="manager"
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  >
                    <option value="">No Manager</option>
                    {managers.map((manager) => (
                      <option key={manager._id} value={manager._id}>
                        {manager.firstName} {manager.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Active User
                </label>
              </div>

              {/* Buttons */}
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                >
                  {loading ? 'Saving...' : selectedUser ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;