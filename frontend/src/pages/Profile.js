import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import { 
  UserIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon, 
  IdentificationIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  KeyIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Request OTP, 2: Reset
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    toast.info('Profile update functionality coming soon!');
    setIsEditing(false);
  };

  const handleRequestOTP = async () => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(user.email);
      toast.success('Security code sent to your email');
      setResetStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (passwordData.newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters long');
    }
    if (passwordData.otp.length !== 10) {
      return toast.error('Please enter the 10-character OTP');
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(user.email, passwordData.otp, passwordData.newPassword);
      toast.success('Access credentials updated successfully');
      setShowPasswordReset(false);
      setResetStep(1);
      setPasswordData({ otp: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const DetailCard = ({ icon: Icon, label, value, color = "accent" }) => (
    <div className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center text-${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{label}</p>
          <p className="text-lg font-black text-text-primary tracking-tight">{value || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-primary rounded-xl p-10 text-white shadow-premium">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center text-5xl font-black italic shadow-massive">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">
              {user?.firstName} <span className="text-accent">{user?.lastName}</span>
            </h1>
            <p className="text-lg font-bold text-white/70 uppercase tracking-widest italic">
              {user?.company?.name || 'InTrack Global'}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                {user?.role} NODE
              </span>
              <span className="px-4 py-1.5 bg-accent/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-accent/30 text-accent">
                {user?.isVerified ? 'VERIFIED IDENTITY' : 'PENDING VERIFICATION'}
              </span>
            </div>
          </div>
          <div className="md:ml-auto">
            <button 
              onClick={() => {
                setIsEditing(!isEditing);
                setShowPasswordReset(false);
              }}
              className="flex items-center gap-3 px-6 py-3 bg-white text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-massive active:scale-95"
            >
              {isEditing ? (
                <><XMarkIcon className="w-4 h-4" /> Cancel</>
              ) : (
                <><PencilSquareIcon className="w-4 h-4" /> Edit Profile</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Core Info */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-xl border border-border shadow-premium overflow-hidden">
            <div className="px-8 py-6 border-b border-border bg-secondary/30">
              <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-3">
                <IdentificationIcon className="w-5 h-5 text-accent" />
                Personal Information
              </h3>
            </div>
            
            <div className="p-8">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">First Name</label>
                      <input 
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none font-bold text-text-primary transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Last Name</label>
                      <input 
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none font-bold text-text-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full px-5 py-4 bg-secondary/30 border border-border rounded-xl font-bold text-text-muted cursor-not-allowed opacity-60"
                    />
                    <p className="text-[10px] text-text-muted font-medium ml-1 italic">* Email cannot be modified for security reasons.</p>
                  </div>
                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent-dark transition-all shadow-premium active:scale-95"
                    >
                      <CheckIcon className="w-4 h-4" /> Save Modifications
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <DetailCard icon={UserIcon} label="First Name" value={user?.firstName} />
                  <DetailCard icon={UserIcon} label="Last Name" value={user?.lastName} />
                  <DetailCard icon={EnvelopeIcon} label="Email Address" value={user?.email} color="primary" />
                  <DetailCard icon={ShieldCheckIcon} label="Account Status" value={user?.isVerified ? 'Verified' : 'Pending'} color={user?.isVerified ? 'success' : 'warning'} />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-premium overflow-hidden">
            <div className="px-8 py-6 border-b border-border bg-secondary/30 flex justify-between items-center">
              <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-3">
                <KeyIcon className="w-5 h-5 text-accent" />
                Security & Access
              </h3>
              {!showPasswordReset && (
                <button 
                  onClick={() => {
                    setShowPasswordReset(true);
                    setIsEditing(false);
                  }}
                  className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline"
                >
                  Change Password
                </button>
              )}
            </div>
            
            <div className="p-8">
              {showPasswordReset ? (
                <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
                  {resetStep === 1 ? (
                    <div className="flex flex-col items-center text-center max-w-sm mx-auto space-y-6">
                      <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                        <ShieldCheckIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-text-primary tracking-tight">OTP Verification Required</h4>
                        <p className="text-sm text-text-muted font-medium mt-2">To update your password, we need to verify your identity. A 10-character security code will be sent to your email.</p>
                      </div>
                      <button 
                        onClick={handleRequestOTP}
                        disabled={isLoading}
                        className="w-full py-4 bg-accent text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent-dark transition-all shadow-premium disabled:opacity-50"
                      >
                        {isLoading ? 'Requesting Code...' : 'Request Security Code'}
                      </button>
                      <button onClick={() => setShowPasswordReset(false)} className="text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-text-primary">Cancel Protocol</button>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordReset} className="space-y-6 max-w-md mx-auto">
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Security Code (OTP)</label>
                        <input 
                          type="text" 
                          value={passwordData.otp}
                          onChange={(e) => setPasswordData({...passwordData, otp: e.target.value})}
                          placeholder="10-CHAR CODE"
                          maxLength={10}
                          className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none font-black tracking-widest text-text-primary transition-all text-center"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2 group">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">New Password</label>
                          <input 
                            type="password" 
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            placeholder="••••••••"
                            className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none font-bold text-text-primary transition-all"
                          />
                        </div>
                        <div className="space-y-2 group">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Confirm New Password</label>
                          <input 
                            type="password" 
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            placeholder="••••••••"
                            className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none font-bold text-text-primary transition-all"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button 
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 py-4 bg-accent text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent-dark transition-all shadow-premium disabled:opacity-50"
                        >
                          {isLoading ? 'Updating...' : 'Update Access Key'}
                        </button>
                        <button 
                          type="button"
                          onClick={() => setResetStep(1)}
                          className="px-6 py-4 bg-secondary text-text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-border transition-all"
                        >
                          Back
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <DetailCard icon={ShieldCheckIcon} label="Two-Factor Status" value="OTP ENFORCED" color="success" />
                  <DetailCard icon={KeyIcon} label="Password Age" value="Recent" color="primary" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-premium overflow-hidden">
            <div className="px-8 py-6 border-b border-border bg-secondary/30">
              <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-3">
                <BuildingOfficeIcon className="w-5 h-5 text-accent" />
                Organizational Identity
              </h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailCard 
                  icon={BuildingOfficeIcon} 
                  label="Company Name" 
                  value={user?.company?.name || 'InTrack Global'} 
                  color="accent" 
                />
                <DetailCard 
                  icon={IdentificationIcon} 
                  label="Organization ID" 
                  value={user?.company?._id?.slice(-12).toUpperCase() || 'ORG-882910'} 
                  color="primary" 
                />
                <DetailCard 
                  icon={UserIcon} 
                  label="Administrative Unit" 
                  value={user?.role === 'admin' ? 'Strategic Command' : 'Operational Division'} 
                  color="info" 
                />
                <DetailCard 
                  icon={ShieldCheckIcon} 
                  label="Clearance Level" 
                  value={user?.role?.toUpperCase() || 'OPERATIVE'} 
                  color="success" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats/Meta */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl border border-border shadow-premium text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-2xl mb-6">
              <IdentificationIcon className="w-10 h-10 text-accent" />
            </div>
            <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-2">Member Since</h4>
            <p className="text-2xl font-black text-text-primary tracking-tighter italic">
              {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="bg-primary p-8 rounded-xl shadow-massive text-white relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Security Rating</h4>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-black italic tracking-tighter">9.8</span>
              <span className="text-white/40 font-black text-xs mb-2">/ 10</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[98%] shadow-[0_0_10px_rgba(255,107,61,0.5)]"></div>
            </div>
            <p className="mt-6 text-[10px] font-bold text-white/60 leading-relaxed italic">
              Your account identity is verified and protected by our advanced encryption protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
