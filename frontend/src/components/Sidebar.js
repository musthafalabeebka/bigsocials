import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Film, LayoutDashboard, Users, Settings, LogOut, TrendingUp, Store, Sparkles, Handshake, BriefcaseBusiness } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'producer':
        return [
          { icon: Handshake,       label: 'Vendors',     path: '/producer/vendors' },
          { icon: LayoutDashboard, label: 'Dashboard',   path: '/producer/dashboard' },
          { icon: Store,           label: 'Influencer Marketplace', path: '/producer/marketplace' },
          { icon: TrendingUp,      label: 'Bookings',    path: '/producer/booking-analytics' },
          { icon: Sparkles,        label: 'AI PR Agent', path: '/producer/ai-pr-agent' },
        ];
      case 'influencer':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/influencer/dashboard' },
          { icon: Film,            label: 'Campaigns', path: '/influencer/campaigns' },
        ];
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Users,           label: 'Users',     path: '/admin/users' },
          { icon: Settings,        label: 'Settings',  path: '/admin/settings' },
        ];
      case 'vendor':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/vendor/dashboard' },
          { icon: BriefcaseBusiness, label: 'Requests', path: '/vendor/dashboard' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const roleAccent = user?.role === 'influencer' ? '#9333ea' : user?.role === 'admin' ? '#dc2626' : '#0028aa';
  const roleBg     = user?.role === 'influencer' ? '#fce8ff'  : user?.role === 'admin' ? '#fef2f2'  : '#eef1ff';

  return (
    <div className="w-64 min-h-screen bg-white flex flex-col border-r border-[#eee]" data-testid="sidebar">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#f0f0f0]">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: roleAccent }}>
            <Film className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-heading font-bold" data-testid="app-logo">
            Big<span style={{ color: roleAccent }}>Social</span>
          </span>
        </Link>
        <p className="text-xs text-[#aaa] font-body mt-1 pl-0.5">Movie Marketing</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-body font-semibold text-sm transition-all ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-[#666] hover:text-[#1b1c19] hover:bg-[#f8f9fa]'
                  }`}
                  style={isActive ? { background: roleAccent } : {}}
                >
                  <Icon className="w-4.5 h-4.5 w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-[#f0f0f0]">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-heading font-bold text-sm"
            style={{ background: roleBg, color: roleAccent }}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-[#1b1c19] truncate">{user?.name}</p>
            <p className="text-xs text-[#aaa] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          data-testid="logout-button"
          className="flex items-center gap-2.5 px-4 py-2.5 w-full rounded-xl text-sm font-semibold text-[#dc2626] hover:bg-[#fef2f2] transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
