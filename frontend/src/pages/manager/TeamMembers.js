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
  ChevronDownIcon,
  UserGroupIcon,
  ShieldCheckIcon,
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-inter space-y-10">
      {/* Premium Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center shadow-massive transform hover:rotate-6 transition-transform">
            <UserGroupIcon className="h-10 w-10 text-accent" />
          </div>

          <div>
            <h1 className="text-h-xl font-black text-text-primary tracking-tighter italic uppercase">Personnel Registry</h1>
            <p className="text-body text-text-muted font-medium opacity-70">
              Collaborate and oversee the collective performance of your division.
            </p>
          </div>
        </div>

        <div className="bg-surface px-8 py-5 rounded-xl border border-border shadow-premium flex items-center gap-8 group hover:shadow-massive transition-all cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-700">
             <BriefcaseIcon className="h-20 w-20" />
          </div>
          <div className="text-right border-r border-border pr-8 relative z-10">
            <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Active Nodes</div>
            <div className="text-3xl font-black text-text-primary mt-1 tracking-tighter italic">{team?.length || 0} Members</div>
          </div>
          <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent shadow-inner group-hover:scale-110 transition-transform relative z-10">
            <ShieldCheckIcon className="h-7 w-7" />
          </div>
        </div>

      </div>

      {/* Strategic Metrics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'Total Personnel', value: roleStats.all, icon: UsersIcon, color: 'text-primary', bg: 'bg-primary/10' },
          { name: 'Leadership Core', value: roleStats.manager, icon: BriefcaseIcon, color: 'text-info', bg: 'bg-info/10' },
          { name: 'Operation Units', value: roleStats.employee, icon: IdentificationIcon, color: 'text-success', bg: 'bg-success/10' },
        ].map((stat) => (
          <div key={stat.name} className="bg-surface p-10 rounded-xl border border-border shadow-premium group hover:shadow-massive transition-all relative overflow-hidden">
             <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={`p-5 rounded-xl ${stat.bg} ${stat.color} shadow-inner transition-transform group-hover:scale-110`}>
                <stat.icon className="h-8 w-8" />
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-60">{stat.name}</div>
              <div className="text-5xl font-black text-text-primary tracking-tighter italic">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Personnel Control Panel */}
      <div className="bg-surface rounded-[2.5rem] border border-border shadow-premium p-10 relative overflow-hidden group">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Search Field */}
          <div className="md:col-span-8 relative group">
            <MagnifyingGlassIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-text-muted group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Filter by name, identifier, or email sequence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-secondary/30 border border-border rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all placeholder:text-text-muted/50 font-bold text-sm tracking-tight"
            />

          </div>

          {/* Specialty Protocol Selector */}
          <div className="md:col-span-4 relative group">
            <FunnelIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-secondary/30 border border-border rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all appearance-none font-bold text-sm tracking-tight cursor-pointer"
            >

              <option value="all">Protocol: All Specialties</option>
              <option value="manager">Leadership Layer</option>
              <option value="employee">Core Operatives</option>
            </select>
            <ChevronDownIcon className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Personnel Registry Module */}
      <div className="bg-surface rounded-xl border border-border shadow-massive overflow-hidden">

        {loading ? (
          <div className="py-32 text-center animate-pulse">
            <div className="inline-block rounded-full h-16 w-16 border-4 border-secondary border-t-accent animate-spin mb-6 shadow-massive"></div>
            <p className="text-text-muted font-black uppercase tracking-[0.2em] text-[10px] italic">Synchronizing Division Nodes...</p>
          </div>
        ) : filteredTeam && filteredTeam.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900 border-b border-border/10">
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Operative Identity</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Specialization</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Contact Sequence</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Geospatial Node</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Data Artifacts</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Capital Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTeam.map((member) => (
                  <tr key={member._id} className="hover:bg-secondary/40 transition-all group cursor-default">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-premium group-hover:scale-110 group-hover:bg-accent transition-all duration-500 italic">
                            {member.firstName?.[0]}{member.lastName?.[0]}
                          </div>

                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success border-4 border-surface rounded-full shadow-massive"></div>
                        </div>
                        <div>
                          <div className="font-black text-text-primary text-xl tracking-tighter uppercase italic group-hover:text-accent transition-colors">
                            {member.firstName} {member.lastName}
                            {member._id === currentUser?._id && (
                              <span className="ml-4 inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black bg-accent text-white uppercase tracking-tighter shadow-sm not-italic">
                                Principal Node
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-text-muted font-bold flex items-center gap-2 mt-1.5 uppercase tracking-widest opacity-60">
                            <EnvelopeIcon className="h-3.5 w-3.5 text-accent" />
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border italic shadow-sm ${
                        member.role === 'manager'
                          ? 'bg-info/10 text-info border-info/20'
                          : 'bg-primary/10 text-primary border-primary/20'
                      }`}>
                        <BriefcaseIcon className="h-3 w-3 mr-2" />
                        {member.role}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-sm font-black text-text-primary italic tracking-tight">
                        {member.phone || <span className="text-text-muted/40 font-bold uppercase tracking-widest not-italic">Unlisted</span>}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center text-sm font-black text-text-primary italic uppercase tracking-tighter">
                        <MapPinIcon className="h-4 w-4 mr-2 text-accent" />
                        {member.country || 'Global Infrastructure'}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center text-sm font-black text-text-primary italic">
                        <DocumentTextIcon className="h-4 w-4 mr-2 text-text-muted group-hover:text-accent transition-colors" />
                        {member.totalExpenses || 0}
                        <span className="text-[10px] text-text-muted font-bold ml-2 uppercase tracking-[0.2em] not-italic opacity-60">Artifacts</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center text-2xl font-black text-success tracking-tighter italic">
                        <CurrencyDollarIcon className="h-6 w-6 mr-1 text-accent" />
                        {(member.totalExpenseAmount || 0).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-32 text-center bg-secondary/10">
            <div className="w-24 h-24 bg-surface rounded-xl flex items-center justify-center mx-auto mb-8 shadow-inner">

              <UsersIcon className="h-12 w-12 text-text-muted/30" />
            </div>
            <h3 className="text-2xl font-black text-text-primary tracking-tighter uppercase italic">Void Ensemble</h3>
            <p className="text-text-muted mt-3 font-medium opacity-60 italic">
              {searchTerm || filterRole !== 'all'
                ? 'No personnel matches your current filtration protocol.'
                : 'Your division is currently unoccupied. Onboard members to begin integration.'}
            </p>
          </div>
        )}
      </div>

      {/* Strategic Analytics Summary */}
      {filteredTeam && filteredTeam.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-white/5 shadow-massive p-12 relative overflow-hidden text-white group">

          <div className="absolute top-0 left-0 w-full h-full bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-3">Geopolitical Scope</div>
              <div className="text-5xl font-black text-white tracking-tighter italic">{filteredTeam.length}</div>
              <div className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest opacity-60">Active Profiles</div>
            </div>
            <div className="flex flex-col items-center text-center border-x border-white/10 px-12">
              <div className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-3">Submission Throughput</div>
              <div className="text-5xl font-black text-white tracking-tighter italic">
                {filteredTeam.reduce((sum, m) => sum + (m.totalExpenses || 0), 0)}
              </div>
              <div className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest opacity-60">Global Artifacts</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-3">Gross Capital Outlay</div>
              <div className="text-5xl font-black text-success tracking-tighter italic">
                ${filteredTeam
                  .reduce((sum, m) => sum + (m.totalExpenseAmount || 0), 0)
                  .toLocaleString()}
              </div>
              <div className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest opacity-60">Cumulative Investment</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;