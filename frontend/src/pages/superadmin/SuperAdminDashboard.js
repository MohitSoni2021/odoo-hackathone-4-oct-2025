import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { 
  BuildingOfficeIcon, 
  UserIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  IdentificationIcon,
  KeyIcon,
  XMarkIcon as CloseIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const SuperAdminDashboard = () => {
  const [hierarchy, setHierarchy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', newPassword: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchHierarchy();
  }, []);

  const fetchHierarchy = async () => {
    try {
      setLoading(true);
      const response = await api.get('/superadmin/hierarchy');
      setHierarchy(response.data.data);
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await api.post('/superadmin/change-password', formData);
      toast.success('Password updated successfully!');
      setIsModalOpen(false);
      setFormData({ email: '', newPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12 flex-wrap gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-primary rounded-2xl shadow-premium">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-h-xl font-bold text-text-primary tracking-tight">Super Admin Control</h1>
              <p className="text-body text-text-muted">System-wide company and user hierarchy</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-accent-dark transition-all shadow-premium hover:shadow-premium-lg active:scale-95 transform"
          >
            <KeyIcon className="h-5 w-5" />
            Change User Password
          </button>
        </div>

        {/* Password Change Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-surface rounded-[2rem] w-full max-w-md shadow-premium-lg overflow-hidden animate-in zoom-in duration-300 border border-border">
              <div className="p-10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-h-l font-bold text-text-primary">Reset Password</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                    <CloseIcon className="h-6 w-6 text-text-muted" />
                  </button>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-8">
                  <div>
                    <label className="form-label">User Email</label>
                    <input 
                      type="email"
                      required
                      placeholder="user@example.com"
                      className="input-field"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="form-label">New Password</label>
                    <input 
                      type="password"
                      required
                      placeholder="Min 8 characters"
                      className="input-field"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    />
                  </div>
                  <button 
                    disabled={updating}
                    className="btn-primary w-full py-4 text-lg"
                  >
                    {updating ? (
                      <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {hierarchy.map((company) => (
            <div key={company._id} className="bg-surface rounded-3xl shadow-premium border border-border overflow-hidden transition-all hover:shadow-premium-lg">
              <button 
                onClick={() => toggleExpand(company._id)}
                className={`w-full flex items-center justify-between p-8 transition-colors ${expandedItems[company._id] ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`p-3 rounded-xl ${expandedItems[company._id] ? 'bg-accent text-white' : 'bg-primary/10 text-primary'} transition-colors`}>
                    <BuildingOfficeIcon className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <span className="text-h-m font-bold text-text-primary block">{company.name}</span>
                    <span className="text-small text-text-muted font-medium uppercase tracking-widest mt-1 inline-block">
                      {company.country}
                    </span>
                  </div>
                </div>
                {expandedItems[company._id] ? (
                  <ChevronDownIcon className="h-6 w-6 text-accent" />
                ) : (
                  <ChevronRightIcon className="h-6 w-6 text-text-muted" />
                )}
              </button>

              {expandedItems[company._id] && (
                <div className="p-8 md:p-10 space-y-10 bg-secondary/30">
                  {/* Admins */}
                  <section>
                    <div className="flex items-center gap-3 mb-6 text-text-muted">
                      <IdentificationIcon className="h-5 w-5 text-accent" />
                      <h3 className="text-small font-bold uppercase tracking-widest">Admins</h3>
                      <div className="h-[1px] flex-1 bg-border/50 ml-4"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {company.admins.map(admin => (
                        <UserCard key={admin._id} user={admin} type="admin" />
                      ))}
                    </div>
                  </section>

                  {/* Managers */}
                  <section>
                    <div className="flex items-center gap-3 mb-6 text-text-muted">
                      <UserGroupIcon className="h-5 w-5 text-info" />
                      <h3 className="text-small font-bold uppercase tracking-widest">Managers</h3>
                      <div className="h-[1px] flex-1 bg-border/50 ml-4"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {company.managers.map(manager => (
                        <UserCard key={manager._id} user={manager} type="manager" />
                      ))}
                    </div>
                  </section>

                  {/* Employees */}
                  <section>
                    <div className="flex items-center gap-3 mb-6 text-text-muted">
                      <UserIcon className="h-5 w-5 text-text-primary" />
                      <h3 className="text-small font-bold uppercase tracking-widest">Employees</h3>
                      <div className="h-[1px] flex-1 bg-border/50 ml-4"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {company.employees.map(employee => (
                        <UserCard key={employee._id} user={employee} type="employee" />
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const UserCard = ({ user, type }) => {
  const typeStyles = {
    admin: 'border-accent/20 hover:border-accent bg-accent/5',
    manager: 'border-info/20 hover:border-info bg-info/5',
    employee: 'border-border hover:border-primary bg-surface',
  };

  const avatarStyles = {
    admin: 'bg-accent text-white',
    manager: 'bg-info text-white',
    employee: 'bg-primary text-white',
  };

  return (
    <div className={`flex items-center p-5 border rounded-2xl transition-all duration-300 hover:shadow-premium group ${typeStyles[type]}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold mr-4 shadow-sm group-hover:scale-110 transition-transform ${avatarStyles[type]}`}>
        {user.firstName[0]}{user.lastName[0]}
      </div>
      <div className="overflow-hidden">
        <div className="font-bold text-text-primary truncate">{user.firstName} {user.lastName}</div>
        <div className="text-small text-text-muted truncate">{user.email}</div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

