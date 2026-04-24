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
  ChevronDownIcon,
  IdentificationIcon,
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-inter space-y-10">
      {/* Premium Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center shadow-massive transform hover:rotate-6 transition-transform">
            <IdentificationIcon className="h-10 w-10 text-accent" />
          </div>

          <div>
            <h1 className="text-h-xl font-black text-text-primary tracking-tighter italic uppercase">Asset Registry</h1>
            <p className="text-body text-text-muted font-medium opacity-70">Strategic directory of all organization personnel and access protocols.</p>
          </div>
        </div>

        <button
          onClick={handleCreateUser}
          className="group inline-flex items-center px-8 py-4 bg-accent text-white font-black uppercase tracking-widest rounded-xl hover:bg-accent-dark transition-all shadow-premium active:scale-95 text-sm italic"
        >

          <PlusIcon className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform" />
          Onboard Asset
        </button>
      </div>

      {/* Strategic Metrics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Total Personnel', value: users.length, icon: UserGroupIcon, color: 'text-primary', bg: 'bg-primary/10' },
          { name: 'Operational', value: users.filter(u => u.isActive).length, icon: ShieldCheckIcon, color: 'text-success', bg: 'bg-success/10' },
          { name: 'Leadership', value: users.filter(u => u.role === 'manager').length, icon: UserIcon, color: 'text-info', bg: 'bg-info/10' },
          { name: 'Dormant', value: users.filter(u => !u.isActive).length, icon: XMarkIcon, color: 'text-error', bg: 'bg-error/10' },
        ].map((stat) => (
          <div key={stat.name} className="bg-surface p-8 rounded-xl border border-border shadow-premium group hover:shadow-massive transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} shadow-inner transition-transform group-hover:scale-110`}>

                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-60">{stat.name}</div>
              <div className="text-3xl font-black text-text-primary tracking-tighter italic">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Control Panel / Filters */}
      <div className="bg-surface rounded-xl border border-border shadow-premium p-10 relative overflow-hidden group">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Search Field */}
          <div className="md:col-span-6 relative group">
            <MagnifyingGlassIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-text-muted group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email or protocol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-secondary/30 border border-border rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all placeholder:text-text-muted/50 font-bold text-sm tracking-tight"
            />

          </div>

          {/* Role Protocol Selector */}
          <div className="md:col-span-3 relative group">
            <FunnelIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-secondary/30 border border-border rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all appearance-none font-bold text-sm tracking-tight cursor-pointer"
            >

              <option value="all">Global Access</option>
              <option value="admin">Governance (Admin)</option>
              <option value="manager">Leadership (Manager)</option>
              <option value="employee">Operational (Employee)</option>
            </select>
            <ChevronDownIcon className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          </div>

          {/* Status Lifecycle Selector */}
          <div className="md:col-span-3 relative group">
            <FunnelIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-secondary/30 border border-border rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all appearance-none font-bold text-sm tracking-tight cursor-pointer"
            >

              <option value="all">Lifecycle: Any</option>
              <option value="active">Operational Only</option>
              <option value="inactive">Dormant Only</option>
            </select>
            <ChevronDownIcon className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Registry Table Module */}
      <div className="bg-surface rounded-xl border border-border shadow-massive overflow-hidden">

        {loading ? (
          <div className="py-32 text-center animate-pulse">
            <div className="inline-block rounded-full h-16 w-16 border-4 border-secondary border-t-accent animate-spin mb-6"></div>
            <p className="text-text-muted font-black uppercase tracking-widest text-xs italic">Syncing Asset Registry...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-32 text-center">
            <div className="w-24 h-24 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-8 shadow-inner">

              <UserIcon className="h-12 w-12 text-text-muted/30" />
            </div>
            <p className="text-2xl font-black text-text-primary mb-3 tracking-tighter italic uppercase">No Assets Identified</p>
            <p className="text-text-muted font-medium opacity-60">Refine your strategic search parameters and re-initialize.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900 border-b border-border/10">
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Personnel Artifact</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Access Protocol</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Geo-Domain</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Operational Status</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Reporting Node</th>
                  <th className="px-10 py-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-secondary/40 transition-all group cursor-default">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-premium group-hover:scale-110 transition-transform group-hover:bg-accent duration-500 italic">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-black text-text-primary text-lg tracking-tighter uppercase italic">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs font-bold text-text-muted tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest italic ${getRoleStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-sm font-black text-text-secondary uppercase tracking-tighter italic">
                        {user.country || '-'}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${user.isActive ? 'bg-success animate-pulse' : 'bg-text-muted/30'}`}></div>
                        <span className={`text-xs font-black uppercase tracking-widest italic ${user.isActive ? 'text-success' : 'text-text-muted opacity-50'}`}>
                          {user.isActive ? 'Operational' : 'Dormant'}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-sm font-black text-text-secondary uppercase tracking-tighter italic">
                        {user.manager
                          ? `${user.manager.firstName} ${user.manager.lastName}`
                          : <span className="text-text-muted opacity-30">Null</span>}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-3 text-info bg-info/5 hover:bg-info/10 border border-info/20 rounded-xl transition-all shadow-sm active:scale-90"
                          title="Modify Asset"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-3 text-error bg-error/5 hover:bg-error/10 border border-error/20 rounded-xl transition-all shadow-sm active:scale-90"
                          title="Purge Asset"
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

      {/* Asset Configuration Modal */}
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default UserManagement;