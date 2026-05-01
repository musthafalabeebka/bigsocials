import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Tag, LayoutDashboard, Users, Settings, LogOut, Store, Sparkles, Handshake, BadgeIndianRupee, BarChart3, BrainCircuit, ShieldCheck, ScanFace, Instagram, Film, ChevronsLeft, ChevronsRight, Newspaper, CalendarDays, HeartHandshake, Swords } from 'lucide-react';

const SIDEBAR_COLLAPSED_KEY = 'bigsocials_sidebar_collapsed';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const savedSidebarState = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (savedSidebarState !== null) {
      return savedSidebarState === 'true';
    }

    return window.matchMedia('(max-width: 767px)').matches;
  });

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed));
  }, [isCollapsed]);

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
          { icon: BarChart3,       label: 'Booking Analytics', path: '/producer/booking-analytics' },
          { icon: BrainCircuit,     label: 'MIA Agent', path: '/producer/mia-agent' },
          { icon: Sparkles,        label: 'AI PR Agent', path: '/producer/ai-pr-agent' },
          ...(user?.account_type === 'brand'
            ? [{ icon: BadgeIndianRupee, label: 'Movie Bids', path: '/producer/movie-bids' }]
            : []),
        ];
      case 'influencer':
        if (user?.account_type === 'actor') {
          return [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/actor/dashboard' },
            { icon: Film, label: 'Films', path: '/actor/films' },
            { icon: Instagram, label: 'Social Media', path: '/actor/social-media' },
            { icon: CalendarDays, label: 'Content Planner', path: '/actor/content-planner' },
            { icon: ShieldCheck, label: 'Crisis Management', path: '/actor/pr-dashboard' },
            { icon: Handshake,   label: 'Brand Collabs', path: '/actor/brand-collabs' },
            { icon: ScanFace,    label: 'Digital Twin', path: '/actor/commercial-tools?tool=digital-twin' },
            { icon: Newspaper,   label: 'PR & Media', path: '/actor/pr-media' },
            { icon: HeartHandshake, label: 'Fans Units', path: '/actor/fans-units' },
            { icon: Swords,      label: 'Competitors', path: '/actor/competitors' },
          ];
        }

        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/influencer/dashboard' },
          { icon: Tag,            label: 'Campaigns', path: '/influencer/campaigns' },
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
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const roleAccent = '#0028aa';
  const roleBg     = '#eef1ff';

  return (
    <div
      className={`min-h-screen bg-white flex flex-col border-r border-[#eee] flex-shrink-0 transition-all duration-200 ${
        isCollapsed ? 'w-16 sm:w-20' : 'w-64'
      }`}
      data-testid="sidebar"
    >

      {/* Logo */}
      <div className={`${isCollapsed ? 'px-2 sm:px-3' : 'px-4 sm:px-6'} py-6 border-b border-[#f0f0f0]`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between gap-3'}`}>
        <Link
          to="/"
          className={`flex items-center gap-2.5 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}
          title="BigSocial"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: roleAccent }}>
            <Tag className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
          <span className="text-xl font-heading font-bold truncate" data-testid="app-logo">
            Big<span style={{ color: roleAccent }}>Social</span>
          </span>
          )}
        </Link>
        {!isCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#777] hover:bg-[#f8f9fa] hover:text-[#1b1c19] transition-all"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}
        </div>
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#777] hover:bg-[#f8f9fa] hover:text-[#1b1c19] transition-all mx-auto mt-4"
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        ) : (
          <p className="text-xs text-[#aaa] font-body mt-1 pl-0.5">Brand campaigns</p>
        )}
      </div>

      {/* Navigation */}
      <nav className={`${isCollapsed ? 'px-2 sm:px-3' : 'px-3'} flex-1 py-4`}>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const [itemPath, itemHash] = item.path.split('#');
            const isActive = location.pathname === itemPath && (!itemHash || location.hash === `#${itemHash}`);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center rounded-xl font-body font-semibold text-sm transition-all ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-2.5'
                  } ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-[#666] hover:text-[#1b1c19] hover:bg-[#f8f9fa]'
                  }`}
                  style={isActive ? { background: roleAccent } : {}}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className={`${isCollapsed ? 'p-2 sm:p-4' : 'p-4'} border-t border-[#f0f0f0]`}>
        <div className={`flex items-center gap-3 px-2 mb-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-heading font-bold text-sm"
            style={{ background: roleBg, color: roleAccent }}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          {!isCollapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-[#1b1c19] truncate">{user?.name}</p>
            <p className="text-xs text-[#aaa] truncate">{user?.email}</p>
          </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          data-testid="logout-button"
          className={`flex items-center w-full rounded-xl text-sm font-semibold text-[#dc2626] hover:bg-[#fef2f2] transition-all ${
            isCollapsed ? 'justify-center px-0 py-3' : 'gap-2.5 px-4 py-2.5'
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
