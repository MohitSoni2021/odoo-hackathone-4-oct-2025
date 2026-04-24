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
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['superadmin', 'admin', 'manager', 'employee'] },
    ];

    if (user?.role === 'superadmin') {
      return [
        ...baseNav,
        { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon, roles: ['superadmin'] },
        { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon, roles: ['superadmin'] },
      ];
    } else if (user?.role === 'admin') {
      return [
        ...baseNav,
        { name: 'Users', href: '/dashboard/users', icon: UsersIcon, roles: ['admin'] },
        { name: 'All Expenses', href: '/dashboard/manage-expenses', icon: DocumentTextIcon, roles: ['admin'] },
        { name: 'Pending Approval', href: '/dashboard/pending-approval', icon: DocumentTextIcon, roles: ['admin'], badge: true },
        { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon, roles: ['admin'] },
        { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon, roles: ['admin'] },
        { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon, roles: ['admin'] },
      ];
    } else if (user?.role === 'manager') {
      return [
        ...baseNav,
        { name: 'Team', href: '/dashboard/team', icon: UsersIcon, roles: ['manager'] },
        { name: 'Pending Approvals', href: '/dashboard/pending-approvals', icon: DocumentTextIcon, roles: ['manager'], badge: true },
        { name: 'All Expenses', href: '/dashboard/manage-expenses', icon: DocumentTextIcon, roles: ['manager'] },
        { name: 'Analytics', href: '/dashboard/manager-analytics', icon: ChartBarIcon, roles: ['manager'] },
        { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon, roles: ['manager'] },
        { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon, roles: ['manager'] },
      ];
    } else if (user?.role === 'employee') {
      return [
        ...baseNav,
        { name: 'My Expenses', href: '/dashboard/expenses', icon: DocumentTextIcon, roles: ['employee'] },
        { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon, roles: ['employee'] },
        { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon, roles: ['employee'] },
      ];
    }
    return baseNav;
  };

  const navigation = getNavigation();
  const filteredNavigation = navigation.filter((item) => item.roles.includes(user?.role));
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-primary shadow-2xl transition-transform duration-300 transform">
          <div className="flex items-center justify-between px-6 py-8">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center">
              <span className="w-8 h-8 bg-accent rounded-lg mr-3 flex items-center justify-center text-white text-lg">I</span>
              Income<span className="text-accent">Tracker</span>
            </h1>
            <button onClick={() => setSidebarOpen(false)} className="text-primary-light hover:text-white transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-4">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-4 py-3 text-body font-medium rounded-xl transition-all duration-200 ${
                  isActive(item.href) ? 'bg-accent text-white shadow-premium' : 'text-text-muted hover:bg-primary-light hover:text-white'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive(item.href) ? 'text-white' : 'text-text-muted group-hover:text-white'}`} />
                {item.name}
                {item.name === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-error rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="border-t border-primary-light/30 p-6 bg-primary-dark/20">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-white font-bold shadow-premium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="ml-4 overflow-hidden">
                <p className="text-body font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-small text-text-muted capitalize truncate">{user?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="mt-6 w-full flex items-center justify-center px-4 py-3 text-body font-semibold text-white bg-primary-light/50 rounded-xl hover:bg-error/80 transition-all duration-300 group">
              <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div 
        className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-24' : 'lg:w-72'
        }`}
      >
        <div className="flex flex-col flex-grow bg-primary overflow-y-auto border-r border-border/10 shadow-premium relative">
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-10 -right-4 z-20 bg-accent text-white p-1.5 rounded-full shadow-premium hover:bg-accent-dark transition-all transform hover:scale-110 active:scale-95"
          >
            {isCollapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
          </button>

          <div className={`flex items-center flex-shrink-0 py-10 transition-all duration-300 ${isCollapsed ? 'px-6' : 'px-8'}`}>
            <div className="flex items-center overflow-hidden">
              <div className="flex-shrink-0 w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white text-xl shadow-premium">I</div>
              {!isCollapsed && (
                <h1 className="ml-4 text-2xl font-bold tracking-tight text-white whitespace-nowrap animate-in slide-in-from-left duration-300">
                  Income<span className="text-accent">Tracker</span>
                </h1>
              )}
            </div>
          </div>

          <nav className={`flex-1 space-y-2 py-4 transition-all duration-300 ${isCollapsed ? 'px-4' : 'px-6'}`}>
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center py-3 text-body font-medium rounded-xl transition-all duration-200 relative ${
                  isActive(item.href) ? 'bg-accent text-white shadow-premium' : 'text-text-muted hover:bg-primary-light hover:text-white'
                } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                title={isCollapsed ? item.name : ''}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${isCollapsed ? '' : 'mr-3'} ${isActive(item.href) ? 'text-white' : 'text-text-muted group-hover:text-white'}`} />
                {!isCollapsed && <span className="whitespace-nowrap transition-opacity duration-300">{item.name}</span>}
                {item.name === 'Notifications' && unreadCount > 0 && (
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-error rounded-full ${isCollapsed ? 'absolute top-1 right-1 h-5 w-5 p-0' : 'ml-auto'}`}>
                    {unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className={`border-t border-primary-light/30 bg-primary-dark/20 transition-all duration-300 ${isCollapsed ? 'p-4' : 'p-8'}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-white font-bold shadow-premium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              {!isCollapsed && (
                <div className="ml-4 overflow-hidden animate-in slide-in-from-left duration-300">
                  <p className="text-body font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-small text-text-muted capitalize truncate">{user?.role}</p>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout} 
              className={`mt-6 flex items-center justify-center text-body font-semibold text-white bg-primary-light/50 rounded-xl hover:bg-error/80 transition-all duration-300 group ${isCollapsed ? 'w-12 h-12' : 'w-full py-3 px-4'}`}
              title={isCollapsed ? 'Logout' : ''}
            >
              <ArrowRightOnRectangleIcon className={`h-5 w-5 group-hover:translate-x-1 transition-transform ${isCollapsed ? '' : 'mr-2'}`} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:pl-24' : 'lg:pl-72'
      }`}>
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-20 flex-shrink-0 bg-surface/80 backdrop-blur-md border-b border-border shadow-premium">
          <button
            type="button"
            className="border-r border-border px-6 text-text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent lg:hidden transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-8">
            <div className="flex flex-1 items-center">
              <h2 className="text-h-xl font-bold text-text-primary tracking-tight">
                {filteredNavigation.find((item) => isActive(item.href))?.name || 'Income Tracker'}
              </h2>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <Link
                to="/dashboard/notifications"
                className="relative p-2 text-text-secondary hover:text-accent hover:bg-secondary rounded-xl transition-all duration-300"
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-error ring-2 ring-surface animate-pulse"></span>
                )}
              </Link>
              <div className="h-8 w-[1px] bg-border mx-2"></div>
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-body font-semibold text-text-primary">{user?.firstName}</p>
                  <p className="text-small text-text-muted capitalize">{user?.role}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-premium">
                  {user?.firstName?.[0]}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-8">
            <div className="w-full px-4 sm:px-8 md:px-10">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;