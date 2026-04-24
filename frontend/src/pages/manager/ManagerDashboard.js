import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExpenseStats } from '../../store/slices/expenseSlice';
import { fetchMyTeam } from '../../store/slices/userSlice';
import { useCurrency } from '../../hooks/useCurrency';
import CurrencySelector from '../../components/CurrencySelector';
import {
  UsersIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowUpRightIcon,
  ChevronRightIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  SparklesIcon,
  BriefcaseIcon,
  IdentificationIcon,
  PresentationChartLineIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { stats: expenseStats, loading: expenseLoading } = useSelector((state) => state.expenses);
  const { team, loading: teamLoading } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);
  const { formatAmount } = useCurrency();

  useEffect(() => {
    dispatch(fetchExpenseStats());
    dispatch(fetchMyTeam());
  }, [dispatch]);

  const statsCards = [
    {
      name: 'Division Force',
      value: team?.length || 0,
      icon: UsersIcon,
      color: 'bg-info',
      textColor: 'text-info',
      link: '/dashboard/team',
    },
    {
      name: 'Total Artifacts',
      value: expenseStats?.totalExpenses || 0,
      icon: DocumentTextIcon,
      color: 'bg-primary',
      textColor: 'text-primary',
      link: '/dashboard/manage-expenses',
    },
    {
      name: 'Audit Queue',
      value: expenseStats?.statusStats?.find(s => s._id === 'pending')?.count || 0,
      icon: ClockIcon,
      color: 'bg-warning',
      textColor: 'text-warning',
      link: '/dashboard/pending-approvals',
    },
    {
      name: 'Verified',
      value: expenseStats?.statusStats?.find(s => s._id === 'approved')?.count || 0,
      icon: CheckCircleIcon,
      color: 'bg-success',
      textColor: 'text-success',
      link: '/dashboard/manage-expenses?status=approved',
    },
    {
      name: 'Declined',
      value: expenseStats?.statusStats?.find(s => s._id === 'rejected')?.count || 0,
      icon: XCircleIcon,
      color: 'bg-error',
      textColor: 'text-error',
      link: '/dashboard/manage-expenses?status=rejected',
    },
    {
      name: 'Gross Liability',
      value: formatAmount(expenseStats?.totalAmount || 0),
      icon: CurrencyDollarIcon,
      color: 'bg-accent',
      textColor: 'text-accent',
      link: '/dashboard/manager-analytics',
    },
  ];

  const topCategories = expenseStats?.categoryStats?.slice(0, 5) || [];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-inter">
      {/* Strategic Command Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-xl shadow-massive p-10 md:p-14 text-white group">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px] group-hover:bg-accent/30 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-info/20 rounded-full blur-[100px] group-hover:bg-info/30 transition-all duration-700"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="px-4 py-1 bg-accent rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-massive animate-pulse">
                 Operational Status: Active
               </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4">
              Managerial <span className="text-accent">Mainframe</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium max-w-xl opacity-80 italic">
              Greeting, {user?.firstName}. System protocols are nominal. Reviewing divisional throughput and liability exposure.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-2xl rounded-xl p-8 border border-white/10 shadow-massive group-hover:border-white/20 transition-all duration-500">
            <div className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-4 text-center italic opacity-80">System Currency Protocol</div>
            <CurrencySelector showLabel={true} compact={false} />
          </div>
        </div>
      </div>


      {/* Strategic Metrics Matrix (3x2 as requested for clarity) */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="group relative bg-surface p-10 rounded-xl shadow-premium border border-border hover:shadow-massive hover:border-accent/30 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-125 group-hover:opacity-10 transition-transform duration-700">
               <stat.icon className="h-24 w-24" />
            </div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className={`p-5 rounded-xl ${stat.color} bg-opacity-10 ${stat.textColor} shadow-inner transition-transform group-hover:scale-110`}>
                <stat.icon className="h-8 w-8 stroke-[2.5]" aria-hidden="true" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <ArrowUpRightIcon className="h-5 w-5 text-accent" />
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-60 italic">
                {stat.name}
              </p>
              <h3 className="text-4xl font-black text-text-primary tracking-tighter italic">{stat.value}</h3>
            </div>
            
            <div className={`absolute bottom-0 left-0 h-1.5 w-0 ${stat.color} transition-all duration-700 group-hover:w-full opacity-50`}></div>
          </Link>
        ))}
      </div>


      {/* Dual Axis Analytical Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Division Force Overview */}
        <div className="bg-surface rounded-xl shadow-premium border border-border p-10 transition-all hover:shadow-massive relative overflow-hidden group">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-5">
               <div className="p-3 bg-primary/10 rounded-xl text-primary">
                 <BriefcaseIcon className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-black text-text-primary tracking-tighter uppercase italic">Division Force</h3>
            </div>
            <Link
              to="/dashboard/team"
              className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline flex items-center transition-all group/link italic"
            >
              Analyze All
              <ChevronRightIcon className="ml-2 h-4 w-4 group-hover/link:translate-x-2 transition-transform stroke-[3]" />
            </Link>
          </div>
          
          {teamLoading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="rounded-full h-12 w-12 border-4 border-secondary border-t-accent animate-spin mb-4"></div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Retrieving Personnel...</div>
            </div>
          ) : team && team.length > 0 ? (
            <div className="space-y-6">
              {team.slice(0, 5).map((member) => (
                <div key={member._id} className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/40 transition-all group/member cursor-pointer border border-transparent hover:border-border">
                  <div className="flex items-center space-x-5">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-slate-900 text-white font-black text-lg shadow-premium transform group-hover/member:rotate-12 transition-transform italic">
                      {member.firstName?.[0]}{member.lastName?.[0]}
                    </div>
                    <div>
                      <div className="text-sm font-black text-text-primary uppercase tracking-tight italic group-hover/member:text-accent transition-colors">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-60 mt-1">
                        {member.role} Layer
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-text-primary tracking-tighter italic">
                      {formatAmount(member.totalExpenseAmount || 0)}
                    </div>
                    <div className="text-[10px] text-text-muted font-bold uppercase tracking-tighter opacity-60 mt-0.5">
                      {member.totalExpenses || 0} Artifacts
                    </div>
                  </div>
                </div>
              ))}
              {team.length > 5 && (
                <div className="pt-6 mt-4 border-t border-border/50 text-center">
                  <Link
                    to="/dashboard/team"
                    className="text-[10px] font-black text-text-muted hover:text-accent uppercase tracking-widest transition-colors italic"
                  >
                    View {team.length - 5} Additional Operatives
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-text-muted italic bg-secondary/20 rounded-xl border border-dashed border-border/50">
              No personnel nodes detected.
            </div>
          )}
        </div>


        {/* Priority Allocation Vectors */}
        <div className="bg-surface rounded-xl shadow-premium border border-border p-10 transition-all hover:shadow-massive relative overflow-hidden group">
          <div className="flex items-center gap-5 mb-12">
             <div className="p-3 bg-accent/10 rounded-xl text-accent">
               <PresentationChartLineIcon className="h-6 w-6" />
             </div>
             <h3 className="text-xl font-black text-text-primary tracking-tighter uppercase italic">Allocation Vectors</h3>
          </div>
          
          {expenseLoading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="rounded-full h-12 w-12 border-4 border-secondary border-t-accent animate-spin mb-4"></div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Mapping Data Points...</div>
            </div>
          ) : topCategories.length > 0 ? (
            <div className="space-y-6">
              {topCategories.map((category, index) => (
                <div key={category._id} className="group/cat flex items-center justify-between p-4 rounded-xl hover:bg-secondary/40 transition-all border border-transparent hover:border-border cursor-default">
                  <div className="flex items-center space-x-5">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-[10px] shadow-massive group-hover/cat:scale-110 transition-all italic">
                      0{index + 1}
                    </span>
                    <span className="text-sm font-black text-text-primary uppercase tracking-tight italic group-hover/cat:text-accent transition-colors">
                      {category._id}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-text-primary tracking-tighter italic">
                      {formatAmount(category.totalAmount)}
                    </div>
                    <div className="text-[10px] text-text-muted font-bold uppercase tracking-tighter opacity-60 mt-0.5">
                      {category.count} Vectors
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-text-muted italic bg-secondary/20 rounded-xl border border-dashed border-border/50">
              No allocation data accessible.
            </div>
          )}
        </div>

      </div>

      {/* Executive Command Center */}
      <div className="bg-slate-900 rounded-xl shadow-massive border border-white/5 p-12 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-black text-white tracking-tighter uppercase italic mb-10 flex items-center gap-4">
             <ShieldCheckIcon className="h-6 w-6 text-accent" />
             Strategic Commands
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: '/dashboard/manage-expenses', icon: DocumentTextIcon, label: 'Asset Ledger', primary: true },
              { to: '/dashboard/pending-approvals', icon: ClockIcon, label: 'Review Queue', primary: false },
              { to: '/dashboard/manager-analytics', icon: ChartBarIcon, label: 'Intelligence', primary: false },
              { to: '/dashboard/settings', icon: Cog6ToothIcon, label: 'Protocols', primary: false },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className={`flex items-center justify-center px-8 py-5 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-massive transition-all transform hover:-translate-y-2 group/btn ${
                  action.primary 
                    ? 'bg-accent text-white hover:bg-accent/80' 
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <action.icon className="h-5 w-5 mr-3 group-hover/btn:rotate-12 transition-transform stroke-[2.5]" />
                <span className="italic">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ManagerDashboard;