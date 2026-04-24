import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserStats } from '../../store/slices/userSlice';
import { fetchExpenseStats } from '../../store/slices/expenseSlice';
import { useCurrency } from '../../hooks/useCurrency';
import CurrencySelector from '../../components/CurrencySelector';
import {
  UsersIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowUpRightIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  PresentationChartLineIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats: userStats, loading: userLoading } = useSelector((state) => state.users);
  const { stats: expenseStats, loading: expenseLoading } = useSelector((state) => state.expenses);
  const { user } = useSelector((state) => state.auth);
  const { formatAmount } = useCurrency();

  useEffect(() => {
    dispatch(fetchUserStats());
    dispatch(fetchExpenseStats());
  }, [dispatch]);

  const statsCards = [
    { name: 'Personnel Scope',   value: userStats?.totalUsers || 0,          icon: UsersIcon,         color: 'text-primary',  bg: 'bg-primary/10', link: '/dashboard/users' },
    { name: 'Audit Volume',      value: expenseStats?.totalExpenses || 0,    icon: DocumentTextIcon,  color: 'text-accent',   bg: 'bg-accent/10',  link: '/dashboard/manage-expenses' },
    { name: 'Validation Queue',  value: expenseStats?.byStatus?.pending || 0,icon: ClockIcon,         color: 'text-warning',  bg: 'bg-warning/10', link: '/dashboard/manage-expenses?status=pending' },
    { name: 'Authorized',        value: expenseStats?.byStatus?.approved || 0,icon: CheckBadgeIcon,    color: 'text-success',  bg: 'bg-success/10', link: '/dashboard/manage-expenses?status=approved' },
    { name: 'Portfolio Declined', value: expenseStats?.byStatus?.rejected || 0,icon: XCircleIcon,       color: 'text-error',    bg: 'bg-error/10',   link: '/dashboard/manage-expenses?status=rejected' },
    { name: 'Total Liquidity',   value: formatAmount(expenseStats?.totalAmount || 0), icon: CurrencyDollarIcon, color: 'text-info', bg: 'bg-info/10', link: '/dashboard/analytics' },
    { name: 'Active Assets',     value: userStats?.activeUsers || 0,         icon: ShieldCheckIcon,   color: 'text-success',  bg: 'bg-success/10', link: '/dashboard/users?status=active' },
    { name: 'Dormant Profiles',  value: userStats?.inactiveUsers || 0,       icon: XCircleIcon,       color: 'text-text-muted', bg: 'bg-secondary', link: '/dashboard/users?status=inactive' },
    { name: 'Managers',          value: userStats?.byRole?.manager || 0,     icon: UsersIcon,         color: 'text-info',     bg: 'bg-info/10',    link: '/dashboard/users?role=manager' },
  ];

  const topCategories = expenseStats?.byCategory
    ? [...expenseStats.byCategory].sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5)
    : [];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 font-inter">
      {/* Premium Header */}
      <div className="bg-surface rounded-xl shadow-premium border border-border p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
           <ShieldCheckIcon className="h-64 w-64" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="flex items-center space-x-8">
            <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center shadow-massive group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-3xl italic uppercase">A</span>
            </div>
            <div>
              <h1 className="text-h-xl font-black text-text-primary tracking-tighter italic uppercase">
                Governance Portal
              </h1>
              <p className="text-body text-text-muted font-medium opacity-70">Welcome back, Principal {user?.firstName}. System status is operational.</p>
            </div>
          </div>
          <div className="bg-secondary/50 backdrop-blur-sm p-5 rounded-xl border border-border flex items-center gap-4">
             <div className="text-right">
                <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Active Currency</div>
                <div className="mt-1"><CurrencySelector /></div>
             </div>
          </div>
        </div>
      </div>


      {/* 3x3 Strategic Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {statsCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="group bg-surface rounded-xl border border-border p-8 shadow-premium hover:shadow-massive hover:border-accent/30 transition-all duration-500 transform hover:-translate-y-2"
          >
            <div className="flex items-center justify-between mb-8">
              <div className={`p-5 rounded-xl ${stat.bg} ${stat.color} shadow-inner transition-transform group-hover:scale-110`}>
                <stat.icon className="h-10 w-10" />
              </div>
              <div className="bg-secondary p-3 rounded-xl group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                <ArrowUpRightIcon className="h-5 w-5 text-text-muted group-hover:text-white" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 opacity-60">
                {stat.name}
              </p>
              <h3 className="text-4xl font-black text-text-primary tracking-tighter italic">{stat.value}</h3>
            </div>
          </Link>
        ))}
      </div>


      {/* Distribution & Performance Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Personnel Composition */}
        <div className="lg:col-span-7 bg-surface rounded-xl border border-border p-10 shadow-premium">
          <div className="flex items-center justify-between mb-10">
             <h3 className="text-h-m font-black text-text-primary uppercase tracking-tighter italic">Personnel Composition</h3>
             <UsersIcon className="h-6 w-6 text-primary" />
          </div>
          
          {userLoading ? (
            <div className="py-20 text-center animate-pulse">
              <div className="inline-block rounded-full h-12 w-12 border-4 border-secondary border-t-accent animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-10">
              {[
                { role: 'Governance (Admins)', count: userStats?.byRole?.admin || 0, color: 'bg-error', textColor: 'text-error' },
                { role: 'Leadership (Managers)', count: userStats?.byRole?.manager || 0, color: 'bg-info', textColor: 'text-info' },
                { role: 'Operations (Employees)', count: userStats?.byRole?.employee || 0, color: 'bg-success', textColor: 'text-success' },
              ].map((item) => (
                <div key={item.role} className="flex flex-col space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                       <span className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 block">{item.role}</span>
                       <span className={`text-2xl font-black ${item.textColor} tracking-tight`}>{item.count} Profiles</span>
                    </div>
                    <span className="text-sm font-black text-text-primary bg-secondary px-3 py-1 rounded-xl">
                      {((item.count / (userStats?.totalUsers || 1)) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-secondary rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full ${item.color} transition-all duration-1000 ease-out shadow-premium`}
                      style={{ width: `${(item.count / (userStats?.totalUsers || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Domain Impact */}
        <div className="lg:col-span-5 bg-surface rounded-xl border border-border p-10 shadow-premium">
          <div className="flex items-center justify-between mb-10">
             <h3 className="text-h-m font-black text-text-primary uppercase tracking-tighter italic">Domain Impact</h3>
             <PresentationChartLineIcon className="h-6 w-6 text-accent" />
          </div>
          
          {expenseLoading ? (
            <div className="py-20 text-center animate-pulse">
               <div className="inline-block rounded-full h-12 w-12 border-4 border-secondary border-t-accent animate-spin"></div>
            </div>
          ) : topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((cat, i) => (
                <div key={cat._id} className="group flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 border border-transparent hover:border-border transition-all cursor-default">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-premium group-hover:bg-accent transition-colors">
                      0{i + 1}
                    </div>
                    <div>
                      <p className="font-black text-text-primary uppercase tracking-tighter text-sm">{cat._id}</p>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{cat.count} Audit Artifacts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-text-primary text-lg italic tracking-tighter">
                      {formatAmount(cat.totalAmount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-border rounded-xl">
              <DocumentTextIcon className="h-12 w-12 text-text-muted/20 mx-auto mb-4" />
              <p className="text-text-muted font-bold italic">No capital distribution data identified.</p>
            </div>
          )}
        </div>
      </div>

      {/* Governance Actions Hub */}
      <div className="bg-slate-900 rounded-xl p-12 text-white relative overflow-hidden shadow-massive">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <h3 className="text-h-m font-black uppercase tracking-tighter italic mb-12 flex items-center gap-3">
             <ShieldCheckIcon className="h-6 w-6 text-accent" />
             Governance Hub
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link
              to="/dashboard/users/new"
              className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-all hover:scale-105"
            >
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-6 shadow-premium">
                <UserPlusIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-body font-black uppercase tracking-widest text-white">Onboard Asset</div>
              <p className="text-[10px] font-bold text-slate-400 mt-2">Initialize new personnel profile.</p>
            </Link>

            <Link
              to="/dashboard/manage-expenses?status=pending"
              className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-all hover:scale-105"
            >
              <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center mb-6 shadow-premium">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-body font-black uppercase tracking-widest text-white">Queue Audit</div>
              <p className="text-[10px] font-bold text-slate-400 mt-2">Validate pending capital requests.</p>
            </Link>

            <Link
              to="/dashboard/analytics"
              className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-all hover:scale-105"
            >
              <div className="w-12 h-12 bg-info rounded-xl flex items-center justify-center mb-6 shadow-premium">
                <PresentationChartLineIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-body font-black uppercase tracking-widest text-white">Global Audit</div>
              <p className="text-[10px] font-bold text-slate-400 mt-2">Generate strategic performance reports.</p>
            </Link>

            <Link
              to="/dashboard/settings"
              className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-all hover:scale-105"
            >
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-premium">
                <CogIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-body font-black uppercase tracking-widest text-white">Core Config</div>
              <p className="text-[10px] font-bold text-slate-400 mt-2">Adjust system-wide governance tokens.</p>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;