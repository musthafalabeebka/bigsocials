import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Film, LayoutDashboard, Users, Settings, LogOut, TrendingUp, Store } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'producer':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/producer/dashboard' },
          { icon: Film, label: 'Campaigns', path: '/producer/campaigns' },
          { icon: Store, label: 'Marketplace', path: '/producer/marketplace' },
          { icon: TrendingUp, label: 'Bookings', path: '/producer/booking-analytics' },
        ];
      case 'influencer':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/influencer/dashboard' },
          { icon: Film, label: 'Campaigns', path: '/influencer/campaigns' },
        ];
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Users, label: 'Users', path: '/admin/users' },
          { icon: Settings, label: 'Settings', path: '/admin/settings' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 min-h-screen bg-surface-container-low flex flex-col" data-testid="sidebar">
      {/* Logo */}
      <div className="p-8">
        <h1 className="text-2xl font-heading font-bold text-primary" data-testid="app-logo">Big Social</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Movie Marketing</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-body font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-ambient'
                      : 'text-on-surface hover:bg-surface-container-highest'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-outline-variant/20">
        <div className="mb-4 px-4">
          <p className="text-sm font-body font-semibold text-on-surface">{user?.name}</p>
          <p className="text-xs text-muted-foreground font-body">{user?.email}</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs font-mono uppercase bg-surface-container-highest rounded-full">
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          data-testid="logout-button"
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-body font-medium text-error hover:bg-surface-container-highest transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
