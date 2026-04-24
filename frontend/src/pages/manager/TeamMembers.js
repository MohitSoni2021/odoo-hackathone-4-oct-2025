import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyTeam } from '../../store/slices/userSlice';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  IdentificationIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

const TeamMembers = () => {
  const dispatch = useDispatch();
  const { team, loading } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    dispatch(fetchMyTeam());
  }, [dispatch]);

  const filteredTeam = team?.filter((member) => {
    const matchesSearch =
      member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || member.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const roleStats = {
    all: team?.length || 0,
    manager: team?.filter((m) => m.role === 'manager').length || 0,
    employee: team?.filter((m) => m.role === 'employee').length || 0,
  };

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary rounded-2xl shadow-premium">
            <UsersIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-h-xl font-bold text-text-primary tracking-tight">Team Synergy</h1>
            <p className="text-body text-text-muted opacity-80">Collaborate and oversee the collective performance of your division.</p>
          </div>
        </div>

        <div className="bg-surface px-8 py-4 rounded-3xl border border-border shadow-premium flex items-center gap-4">
          <div className="text-right border-r border-border pr-4">
            <div className="text-small font-bold text-text-muted uppercase">Team Velocity</div>
            <div className="text-h-m font-bold text-text-primary">{team?.length || 0} Members</div>
          </div>
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
            <BriefcaseIcon className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface p-8 rounded-[2rem] border border-border shadow-premium flex items-center gap-6 group hover:border-primary/30 transition-all cursor-default">
          <div className="p-4 bg-primary rounded-2xl text-white shadow-premium transition-transform group-hover:scale-110">
            <UsersIcon className="h-7 w-7" />
          </div>
          <div>
            <div className="text-small font-bold text-text-muted uppercase tracking-widest">Total Personnel</div>
            <div className="text-2xl font-black text-text-primary mt-1">{roleStats.all}</div>
          </div>
        </div>

        <div className="bg-surface p-8 rounded-[2rem] border border-border shadow-premium flex items-center gap-6 group hover:border-info/30 transition-all cursor-default">
          <div className="p-4 bg-info rounded-2xl text-white shadow-premium transition-transform group-hover:scale-110">
            <BriefcaseIcon className="h-7 w-7" />
          </div>
          <div>
            <div className="text-small font-bold text-text-muted uppercase tracking-widest">Leadership</div>
            <div className="text-2xl font-black text-text-primary mt-1">{roleStats.manager}</div>
          </div>
        </div>

        <div className="bg-surface p-8 rounded-[2rem] border border-border shadow-premium flex items-center gap-6 group hover:border-success/30 transition-all cursor-default">
          <div className="p-4 bg-success rounded-2xl text-white shadow-premium transition-transform group-hover:scale-110">
            <IdentificationIcon className="h-7 w-7" />
          </div>
          <div>
            <div className="text-small font-bold text-text-muted uppercase tracking-widest">Core Members</div>
            <div className="text-2xl font-black text-text-primary mt-1">{roleStats.employee}</div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-surface rounded-3xl border border-border shadow-premium p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Search */}
          <div className="relative group flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search team by name or identifier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border rounded-2xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-text-muted/60 font-medium"
            />
          </div>

          {/* Role Filter */}
          <div className="relative group w-full md:w-64">
            <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border rounded-2xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all appearance-none font-medium cursor-pointer"
            >
              <option value="all">All Specialties</option>
              <option value="manager">Leadership</option>
              <option value="employee">Core Team</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Members List Card */}
      <div className="bg-surface rounded-[2rem] border border-border shadow-premium overflow-hidden">
        {loading ? (
          <div className="p-24 text-center">
            <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-secondary border-t-accent"></div>
            <p className="mt-8 text-text-muted font-bold tracking-tight uppercase text-xs">Synchronizing Team Data...</p>
          </div>
        ) : filteredTeam && filteredTeam.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/30 border-b border-border">
                  <th className="px-8 py-6 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Team Member</th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Specialization</th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Contact Info</th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Location</th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Engagement</th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTeam.map((member) => (
                  <tr key={member._id} className="hover:bg-secondary/20 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <div className="w-14 h-14 bg-primary rounded-[1.25rem] flex items-center justify-center text-white font-black text-lg shadow-premium group-hover:scale-110 transition-transform">
                            {member.firstName?.[0]}{member.lastName?.[0]}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success border-2 border-surface rounded-full shadow-sm"></div>
                        </div>
                        <div>
                          <div className="font-black text-text-primary text-lg tracking-tight">
                            {member.firstName} {member.lastName}
                            {member._id === currentUser?._id && (
                              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-accent text-white uppercase tracking-tighter">
                                Principal
                              </span>
                            )}
                          </div>
                          <div className="text-small text-text-muted font-medium flex items-center gap-1.5 mt-0.5">
                            <EnvelopeIcon className="h-3.5 w-3.5 text-accent" />
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${
                        member.role === 'manager'
                          ? 'bg-info/10 text-info border-info/20'
                          : 'bg-primary/10 text-primary border-primary/20'
                      }`}>
                        <BriefcaseIcon className="h-3 w-3 mr-2" />
                        {member.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-body font-bold text-text-secondary">
                        {member.phone || <span className="text-text-muted/40 font-normal italic">Unlisted</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-body font-bold text-text-secondary">
                        <MapPinIcon className="h-4 w-4 mr-2 text-accent" />
                        {member.country || 'Global'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-body font-black text-text-primary">
                        <DocumentTextIcon className="h-4 w-4 mr-2 text-text-muted" />
                        {member.totalExpenses || 0}
                        <span className="text-[10px] text-text-muted font-bold ml-2 uppercase tracking-tighter">Docs</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-h-s font-black text-success tracking-tight">
                        <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                        {(member.totalExpenseAmount || 0).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-24 text-center">
            <div className="w-24 h-24 bg-secondary rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <UsersIcon className="h-12 w-12 text-text-muted/30" />
            </div>
            <h3 className="text-2xl font-black text-text-primary tracking-tight">Void Ensemble</h3>
            <p className="text-text-muted mt-2 font-medium">
              {searchTerm || filterRole !== 'all'
                ? 'No personnel matches your current filtration criteria.'
                : 'Your division is currently unoccupied. Onboard members to begin.'}
            </p>
          </div>
        )}
      </div>

      {/* Analytics Footer Section */}
      {filteredTeam && filteredTeam.length > 0 && (
        <div className="bg-surface rounded-[2.5rem] border border-border shadow-premium p-10 mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-2">Scope</div>
              <div className="text-4xl font-black text-text-primary tracking-tighter">{filteredTeam.length}</div>
              <div className="text-xs font-bold text-text-muted mt-1">Active Profiles</div>
            </div>
            <div className="flex flex-col items-center text-center border-x border-border px-12">
              <div className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-2">Submissions</div>
              <div className="text-4xl font-black text-text-primary tracking-tighter">
                {filteredTeam.reduce((sum, m) => sum + (m.totalExpenses || 0), 0)}
              </div>
              <div className="text-xs font-bold text-text-muted mt-1">Global Records</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-2">Capital Outlay</div>
              <div className="text-4xl font-black text-success tracking-tighter">
                ${filteredTeam
                  .reduce((sum, m) => sum + (m.totalExpenseAmount || 0), 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs font-bold text-text-muted mt-1">Cumulative Amount</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;