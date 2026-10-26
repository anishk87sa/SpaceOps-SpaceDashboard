import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Rocket,
  LayoutDashboard,
  Compass,
  Satellite,
  Radio,
  Calendar,
  Globe,
  Activity,
  AlertTriangle,
  BarChart3,
  Database,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Terminal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApiHealth } from '../../hooks/useApiHealth';

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { health } = useApiHealth();

  const isBackendConnected = Boolean(health?.status === 'healthy' || health?.status === 'degraded');

  const navigationSections = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
        { name: 'Calendar View', path: '/events', icon: Calendar },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { name: 'Missions', path: '/app/missions', icon: Compass },
        { name: 'Satellites', path: '/app/satellites', icon: Satellite },
        { name: 'Ground Sites', path: '/app/ground-stations', icon: Radio },
        { name: 'Pass Schedule', path: '/app/communication-passes', icon: Calendar },
      ],
    },
    {
      title: 'MONITORING',
      items: [
        { name: 'Live 3D Tracking', path: '/satellites', icon: Globe },
        { name: 'Telemetry', path: '/app/telemetry', icon: Activity },
        { name: 'Alerts', path: '/app/alerts', icon: AlertTriangle, badge: '2' },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { name: 'Analytics', path: '/app/analytics', icon: BarChart3 },
        { name: 'Data Explorer', path: '/app/data', icon: Database },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { name: 'Team & Roles', path: '/app/team', icon: Users },
        { name: 'System Settings', path: '/app/settings', icon: Settings },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-[#F1F5F9]">
      {/* Top Application Header */}
      <header className="h-16 border-b border-[#263449] bg-[#0D1422] flex items-center justify-between px-4 sm:px-6 z-40 sticky top-0">
        <div className="flex items-center space-x-4">
          <Link to="/app/dashboard" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#38BDF8] to-[#818CF8] flex items-center justify-center glow-cyan">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-wider text-white hidden sm:inline">
              SPACEOPS
            </span>
          </Link>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider hidden md:inline">
            Mission Control Center
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center w-72 lg:w-96 relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search satellites, missions, TLE, ground stations..."
            className="w-full bg-[#111C2E] border border-[#263449] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] font-mono"
          />
        </div>

        {/* Right Header Badges */}
        <div className="flex items-center space-x-4">
          {/* Connection Pill */}
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#111C2E] border border-[#263449] text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isBackendConnected ? 'bg-[#34D399]' : 'bg-[#FBBF24]'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isBackendConnected ? 'bg-[#34D399]' : 'bg-[#FBBF24]'
                }`}
              ></span>
            </span>
            <span className="text-[11px] text-[#94A3B8] hidden sm:inline">
              {isBackendConnected ? 'TELEMETRY LIVE' : 'DETACHED'}
            </span>
          </div>

          {/* Alerts Icon */}
          <Link
            to="/app/alerts"
            className="relative p-2 rounded-lg text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#111C2E] transition-colors"
            title="View Active Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FB7185]"></span>
          </Link>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-[#111C2E] text-left transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#38BDF8]/40 to-[#818CF8]/40 border border-[#38BDF8]/50 flex items-center justify-center text-xs font-bold text-[#38BDF8] font-mono">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OP'}
              </div>
              <div className="hidden lg:block text-xs leading-tight">
                <span className="block font-medium text-[#F1F5F9] truncate max-w-[120px]">
                  {user?.name || 'Dr. Evelyn Reed'}
                </span>
                <span className="block text-[10px] text-[#38BDF8] font-mono">
                  {user?.role || 'Administrator'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#111C2E] border border-[#263449] py-1 shadow-2xl z-50 text-xs font-mono">
                <div className="px-3 py-2 border-b border-[#263449]">
                  <p className="text-[#F1F5F9] font-medium truncate">{user?.name || 'Dr. Evelyn Reed'}</p>
                  <p className="text-[#94A3B8] text-[10px] truncate">{user?.email || 'admin@spaceops.org'}</p>
                </div>
                <Link
                  to="/app/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#162338]"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>User Preferences</span>
                </Link>
                <Link
                  to="/"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#162338]"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Public Portal</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-[#FB7185] hover:bg-[#162338] border-t border-[#263449] cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Terminate Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Left Sidebar */}
        <aside
          className={`border-r border-[#263449] bg-[#0D1422] transition-all duration-300 flex flex-col justify-between z-30 shrink-0 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div className="py-4 overflow-y-auto max-h-[calc(100vh-4rem)] space-y-6">
            {navigationSections.map((section) => (
              <div key={section.title} className="px-3">
                {!sidebarCollapsed && (
                  <p className="px-3 text-[10px] font-mono tracking-widest text-[#94A3B8]/60 uppercase font-semibold mb-2">
                    {section.title}
                  </p>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 font-semibold'
                            : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111C2E]'
                        }`}
                        title={sidebarCollapsed ? item.name : undefined}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#38BDF8]' : 'text-[#94A3B8] group-hover:text-white'}`} />
                        {!sidebarCollapsed && (
                          <span className="ml-3 truncate">{item.name}</span>
                        )}
                        {!sidebarCollapsed && item.badge && (
                          <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/30">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Calendar Launcher in Sidebar */}
          <div className="p-3 border-t border-[#263449]">
            <Link
              to="/events"
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center p-2' : 'space-x-2.5 px-3 py-2'
              } rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-medium transition-all group`}
              title="Access Calendar View"
            >
              <Calendar className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
              {!sidebarCollapsed && <span className="truncate">Calendar View</span>}
            </Link>
          </div>

          {/* Sidebar Collapse Toggle */}
          <div className="p-3 border-t border-[#263449]">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#111C2E] transition-colors"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* Dynamic Route Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#070B14] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
