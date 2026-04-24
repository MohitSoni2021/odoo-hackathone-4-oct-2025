import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { fetchUnreadCount } from '../store/slices/notificationSlice';
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  BellIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BriefcaseIcon,
  BanknotesIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchUnreadCount());
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getNavigation = () => {
    const baseNav = [
      { name: 'Home Portal', href: '/dashboard', icon: HomeIcon, roles: ['superadmin', 'admin', 'manager', 'employee'] },
    ];

    if (user?.role === 'superadmin') {
      return [
        ...baseNav,
        { name: 'Governance', href: '/dashboard/notifications', icon: BellIcon, roles: ['superadmin'] },
        { name: 'System Core', href: '/dashboard/settings', icon: Cog6ToothIcon, roles: ['superadmin'] },
      ];
    } else if (user?.role === 'admin') {
      return [
        ...baseNav,
        { name: 'Personnel', href: '/dashboard/users', icon: UsersIcon, roles: ['admin'] },
        { name: 'Asset Ledger', href: '/dashboard/manage-expenses', icon: DocumentTextIcon, roles: ['admin'] },
        { name: 'Audit Queue', href: '/dashboard/pending-approval', icon: BriefcaseIcon, roles: ['admin'], badge: true },
        { name: 'Intelligence', href: '/dashboard/analytics', icon: ChartBarIcon, roles: ['admin'] },
        { name: 'Protocols', href: '/dashboard/notifications', icon: BellIcon, roles: ['admin'] },
        { name: 'Configuration', href: '/dashboard/settings', icon: Cog6ToothIcon, roles: ['admin'] },
      ];
    } else if (user?.role === 'manager') {
      return [
        ...baseNav,
        { name: 'Division', href: '/dashboard/team', icon: UsersIcon, roles: ['manager'] },
        { name: 'Validation', href: '/dashboard/pending-approvals', icon: BriefcaseIcon, roles: ['manager'], badge: true },
        { name: 'Sub-Ledger', href: '/dashboard/manage-expenses', icon: DocumentTextIcon, roles: ['manager'] },
        { name: 'Divisional Data', href: '/dashboard/manager-analytics', icon: ChartBarIcon, roles: ['manager'] },
        { name: 'Protocols', href: '/dashboard/notifications', icon: BellIcon, roles: ['manager'] },
        { name: 'Configuration', href: '/dashboard/settings', icon: Cog6ToothIcon, roles: ['manager'] },
      ];
    } else if (user?.role === 'employee') {
      return [
        ...baseNav,
        { name: 'My Portfolio', href: '/dashboard/expenses', icon: DocumentTextIcon, roles: ['employee'] },
        { name: 'Protocols', href: '/dashboard/notifications', icon: BellIcon, roles: ['employee'] },
        { name: 'Core Config', href: '/dashboard/settings', icon: Cog6ToothIcon, roles: ['employee'] },
      ];
    }
    return baseNav;
  };

  const navigation = getNavigation();
  const filteredNavigation = navigation.filter((item) => item.roles.includes(user?.role));
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      {/* Mobile sidebar - Slate/Orange Mobile Overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex w-80 flex-col bg-slate-900 shadow-2xl transition-all duration-500 ease-out transform">
          <div className="flex items-center justify-between px-8 py-10">
            <h1 className="text-2xl font-black tracking-tighter text-white italic uppercase flex items-center">
              <span className="w-10 h-10 bg-accent rounded-xl mr-3 flex items-center justify-center text-white text-xl shadow-massive">I</span>
              In<span className="text-accent ml-1">Track</span>
            </h1>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-800 rounded-xl">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-6 py-4 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-5 py-4 text-sm font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                  isActive(item.href) ? 'bg-accent text-white shadow-massive italic' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className={`mr-4 h-5 w-5 ${isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-accent'}`} />
                {item.name}
                {item.name === 'Protocols' && unreadCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center h-6 w-6 text-[10px] font-black leading-none text-white bg-error rounded-full shadow-inner">
                    {unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="p-8 border-t border-white/5 bg-slate-950/50">
            <Link to="/dashboard/profile" onClick={() => setSidebarOpen(false)} className="flex items-center mb-8 group cursor-pointer">
              <div className="h-14 w-14 rounded-xl bg-accent flex items-center justify-center text-white font-black text-lg shadow-massive italic group-hover:scale-110 transition-transform">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="ml-5 overflow-hidden">
                <p className="text-sm font-black text-white uppercase tracking-tight italic truncate group-hover:text-accent transition-colors">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 opacity-60 truncate group-hover:opacity-100 transition-opacity">{user?.role} NODE</p>
              </div>
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center justify-center px-6 py-4 text-xs font-black uppercase tracking-widest text-white bg-error/20 border border-error/30 rounded-xl hover:bg-error hover:border-error transition-all duration-500 group">

              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              Terminate Session
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Premium Slate/Orange Interface */}
      <div 
        className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-500 ease-in-out z-40 ${
          isCollapsed ? 'lg:w-28' : 'lg:w-80'
        }`}
      >
        <div className="flex flex-col flex-grow bg-slate-900 overflow-hidden shadow-massive relative">
          {/* Elite Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-12 -right-4 z-50 bg-accent text-white p-2 rounded-xl shadow-massive hover:bg-accent/80 transition-all transform hover:scale-110 active:scale-90 border-4 border-slate-900"
          >
            {isCollapsed ? <ChevronRightIcon className="h-4 w-4 stroke-[3]" /> : <ChevronLeftIcon className="h-4 w-4 stroke-[3]" />}
          </button>

          <div className={`flex items-center flex-shrink-0 py-12 transition-all duration-500 ${isCollapsed ? 'px-8' : 'px-10'}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-massive italic transform hover:rotate-12 transition-transform">I</div>
              {!isCollapsed && (
                <h1 className="ml-5 text-2xl font-black tracking-tighter text-white whitespace-nowrap italic uppercase animate-in slide-in-from-left duration-500">
                  In<span className="text-accent ml-1">Track</span>
                </h1>
              )}
            </div>
          </div>

          <nav className={`flex-1 space-y-2 py-6 overflow-y-auto scrollbar-hide transition-all duration-500 ${isCollapsed ? 'px-6' : 'px-8'}`}>
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 relative ${
                  isActive(item.href) ? 'bg-accent text-white shadow-massive italic translate-x-2' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                } ${isCollapsed ? 'justify-center px-0' : 'px-5'}`}
                title={isCollapsed ? item.name : ''}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 transition-all duration-500 ${isCollapsed ? '' : 'mr-4'} ${isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-accent'}`} />
                {!isCollapsed && <span className="whitespace-nowrap transition-all duration-500 opacity-100">{item.name}</span>}
                {item.name === 'Protocols' && unreadCount > 0 && (
                  <span className={`inline-flex items-center justify-center h-6 w-6 text-[10px] font-black leading-none text-white bg-error rounded-full shadow-massive ${isCollapsed ? 'absolute -top-1 -right-1 border-2 border-slate-900' : 'ml-auto'}`}>
                    {unreadCount}
                  </span>
                )}
                {isActive(item.href) && !isCollapsed && (
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-massive animate-pulse"></div>
                )}
              </Link>
            ))}
          </nav>

          <div className={`border-t border-white/5 bg-slate-950/30 transition-all duration-500 ${isCollapsed ? 'p-6' : 'p-10'}`}>
            <Link to="/dashboard/profile" className="flex items-center group cursor-pointer">
              <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-accent flex items-center justify-center text-white font-black shadow-massive italic text-lg transform group-hover:scale-110 transition-transform">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              {!isCollapsed && (
                <div className="ml-5 overflow-hidden animate-in slide-in-from-left duration-500">
                  <p className="text-sm font-black text-white uppercase tracking-tight italic truncate group-hover:text-accent transition-colors">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 opacity-50 truncate group-hover:opacity-100 transition-opacity">{user?.role} ACCESS</p>
                </div>
              )}
            </Link>
            <button 
              onClick={handleLogout} 
              className={`mt-10 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white bg-white/5 border border-white/10 rounded-xl hover:bg-error hover:border-error transition-all duration-500 group ${isCollapsed ? 'w-14 h-14' : 'w-full py-5 px-4'}`}
              title={isCollapsed ? 'Terminate Session' : ''}
            >
              <ArrowRightOnRectangleIcon className={`h-5 w-5 group-hover:translate-x-1 transition-transform ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && <span className="italic">Terminate</span>}
            </button>
          </div>

        </div>
      </div>

      {/* Main Execution Content */}
      <div className={`flex flex-col flex-1 min-h-screen transition-all duration-500 ease-in-out ${
        isCollapsed ? 'lg:pl-28' : 'lg:w-[calc(100%-320px)] lg:pl-80'
      }`}>
        {/* Glassmorphism Command Bar */}
        <div className="sticky top-0 z-30 flex h-24 flex-shrink-0 bg-slate-50/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-500">
          <button
            type="button"
            className="border-r border-slate-200 px-8 text-slate-500 hover:text-accent focus:outline-none lg:hidden transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-7 w-7" />
          </button>
          <div className="flex flex-1 justify-between px-10">
            <div className="flex flex-1 items-center">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-slate-200/50 rounded-xl">
                   <Squares2X2Icon className="h-5 w-5 text-slate-500" />
                 </div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic opacity-80">
                  {filteredNavigation.find((item) => isActive(item.href))?.name || 'System Overview'}
                </h2>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-6">
              <Link
                to="/dashboard/notifications"
                className="relative p-3 text-slate-500 hover:text-accent hover:bg-white rounded-2xl transition-all duration-500 shadow-sm border border-transparent hover:border-slate-200"
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 block h-3.5 w-3.5 rounded-full bg-error ring-4 ring-slate-50 animate-pulse shadow-massive"></span>
                )}
              </Link>
              
              <div className="h-10 w-[1px] bg-slate-200 mx-2"></div>
              
              <Link to="/dashboard/profile" className="flex items-center space-x-5 group cursor-pointer">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight italic group-hover:text-accent transition-colors">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">Verified Node</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black shadow-massive transform group-hover:rotate-12 transition-transform border-2 border-transparent group-hover:border-accent">
                  {user?.firstName?.[0]}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Global Port Mainframe */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="py-10">
            <div className="max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-12">
               <div className="bg-transparent rounded-xl transition-all duration-700 min-h-[calc(100vh-180px)]">
                  <Outlet />
               </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;