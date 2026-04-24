import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, deleteUser, setSelectedUser } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import UserModal from '../../components/modals/UserModal';

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateUser = () => {
    dispatch(setSelectedUser(null));
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    dispatch(setSelectedUser(user));
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search);

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin':    return 'bg-error/10 text-error border-error/20';
      case 'manager':  return 'bg-info/10 text-info border-info/20';
      case 'employee': return 'bg-success/10 text-success border-success/20';
      default:         return 'bg-secondary text-text-muted border-border';
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary rounded-2xl shadow-premium">
            <UserGroupIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-h-xl font-bold text-text-primary tracking-tight">User Management</h1>
            <p className="text-body text-text-muted opacity-80">Directory of all organization personnel and access levels.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleCreateUser}
            className="group inline-flex items-center px-6 py-3.5 bg-accent text-white font-bold rounded-2xl hover:bg-accent-dark transition-all shadow-premium active:scale-95"
          >
            <PlusIcon className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
            New User
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface p-6 rounded-3xl border border-border shadow-premium flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary"><UserGroupIcon className="h-6 w-6" /></div>
          <div>
            <div className="text-small font-bold text-text-muted uppercase">Total Users</div>
            <div className="text-2xl font-bold text-text-primary">{users.length}</div>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-3xl border border-border shadow-premium flex items-center gap-4">
          <div className="p-3 bg-success/10 rounded-xl text-success"><ShieldCheckIcon className="h-6 w-6" /></div>
          <div>
            <div className="text-small font-bold text-text-muted uppercase">Active</div>
            <div className="text-2xl font-bold text-text-primary">{users.filter(u => u.isActive).length}</div>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-3xl border border-border shadow-premium flex items-center gap-4">
          <div className="p-3 bg-info/10 rounded-xl text-info"><UserIcon className="h-6 w-6" /></div>
          <div>
            <div className="text-small font-bold text-text-muted uppercase">Managers</div>
            <div className="text-2xl font-bold text-text-primary">{users.filter(u => u.role === 'manager').length}</div>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-3xl border border-border shadow-premium flex items-center gap-4">
          <div className="p-3 bg-error/10 rounded-xl text-error"><XMarkIcon className="h-6 w-6" /></div>
          <div>
            <div className="text-small font-bold text-text-muted uppercase">Inactive</div>
            <div className="text-2xl font-bold text-text-primary">{users.filter(u => !u.isActive).length}</div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-surface rounded-3xl border border-border shadow-premium p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Search */}
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border rounded-2xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-text-muted/60 font-medium"
            />
          </div>

          {/* Role Filter */}
          <div className="relative group">
            <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border rounded-2xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all appearance-none font-medium cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative group">
            <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border rounded-2xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all appearance-none font-medium cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-surface rounded-[2rem] border border-border shadow-premium overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-accent"></div>
            <p className="mt-6 text-text-muted font-medium">Refreshing directory...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <UserIcon className="h-10 w-10 text-text-muted/40" />
            </div>
            <p className="text-xl font-bold text-text-primary mb-2">No users found</p>
            <p className="text-text-muted">Adjust your search parameters and try again.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/30 border-b border-border">
                  <th className="px-8 py-6 text-left text-xs font-bold text-text-muted uppercase tracking-widest">User Details</th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Access Role</th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Location</th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Reports To</th>
                  <th className="px-8 py-6 text-right text-xs font-bold text-text-muted uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-bold text-text-primary">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-small text-text-muted">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold border ${getRoleStyle(user.role)}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-body font-medium text-text-secondary">
                      {user.country || '-'}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-success animate-pulse' : 'bg-text-muted/30'}`}></div>
                        <span className={`text-small font-bold ${user.isActive ? 'text-success' : 'text-text-muted'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-body font-medium text-text-secondary">
                      {user.manager
                        ? `${user.manager.firstName} ${user.manager.lastName}`
                        : <span className="text-text-muted opacity-50 italic">None</span>}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-info hover:bg-info/10 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default UserManagement;