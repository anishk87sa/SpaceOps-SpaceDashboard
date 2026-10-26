import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Rocket,
  Search,
  Compass,
  Satellite,
  Globe,
  Calendar,
  Newspaper,
  BookOpen,
  Bookmark,
  LayoutDashboard,
  Menu,
  X,
  User,
  Users,
  Settings,
  LogOut,
  Radio,
  ChevronDown,
  Sparkles,
  Shield
} from 'lucide-react';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { Footer } from './Footer';
import { useAuth } from '../../context/AuthContext';

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Live 3D', path: '/satellites', icon: Radio, isSpecial: true },
    { name: 'Explore', path: '/missions', icon: Compass },
    { name: 'Astronauts', path: '/astronauts', icon: Users },
    { name: 'Launches', path: '/launches', icon: Rocket },
    { name: 'Calendar', path: '/events', icon: Calendar },
    { name: 'Spacecraft', path: '/spacecraft', icon: Satellite },
    { name: 'Destinations', path: '/destinations', icon: Globe },
    { name: 'News', path: '/news', icon: Newspaper },
    { name: 'Learn', path: '/learn', icon: BookOpen },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Explorer';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-[#F1F5F9] selection:bg-sky-400 selection:text-black">
      {/* Global Search Dialog Modal */}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* Main Top Header */}
      {/* Main Top Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-[#263449] bg-[#070B14]/90 backdrop-blur-md w-full">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 xl:gap-4">
          {/* Logo & Space Identity */}
          <Link to="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center glow-cyan transition-transform group-hover:scale-105 shadow-lg">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold font-display tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-sky-100 to-indigo-300">
                SPACEOPS
              </span>
              <span className="hidden md:block text-[9px] sm:text-[10px] tracking-widest text-sky-400 uppercase font-mono">
                Space Exploration
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 shrink-0">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              const isSpecial = link.isSpecial;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-2 xl:px-3 py-1.5 rounded-lg text-[11px] xl:text-xs font-medium tracking-wide uppercase transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50 font-semibold shadow-sm'
                      : isSpecial
                      ? 'text-sky-400 hover:text-white bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-[#111C2E]'
                  }`}
                >
                  {isSpecial && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                  )}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth User Menu */}
          <div className="hidden sm:flex items-center space-x-1.5 xl:space-x-2 shrink-0">
            {/* Global Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#111C2E] hover:bg-[#162338] border border-[#263449] text-xs text-slate-300 hover:text-white transition-all font-mono whitespace-nowrap cursor-pointer"
              title="Search across all space exploration topics"
            >
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden 2xl:inline text-[10px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Favorites Shortcut */}
            <Link
              to="/favorites"
              className={`p-2 rounded-lg border border-[#263449] transition-all shrink-0 ${
                location.pathname === '/favorites'
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                  : 'bg-[#111C2E] text-slate-300 hover:text-white hover:bg-[#162338]'
              }`}
              title="Personal Favorites & Watchlist"
            >
              <Bookmark className="w-4 h-4" />
            </Link>

            {/* Public Discovery Dashboard CTA */}
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-lg bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-semibold text-xs uppercase tracking-wider font-mono transition-all shadow-md glow-cyan whitespace-nowrap shrink-0"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>

            {/* User Account Navigation (Authenticated vs Guest) */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl bg-[#111C2E] hover:bg-[#162338] border border-[#263449] hover:border-sky-500/40 transition-all cursor-pointer"
                  aria-label="User Account Menu"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0D1422] border border-[#263449] p-1.5 shadow-2xl z-50 animate-fade-in font-mono text-xs">
                    {/* User Header */}
                    <div className="px-3 py-2.5 border-b border-[#263449]">
                      <p className="font-semibold text-white truncate">{displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    {/* Nav Items */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#162338] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-sky-400" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/favorites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#162338] transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                        <span>My Favorites</span>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#162338] transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="pt-1 border-t border-[#263449]">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg border border-[#263449] hover:border-slate-500 bg-[#111C2E] hover:bg-[#162338] text-xs font-mono text-slate-200 hover:text-white transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 hover:bg-sky-500/25 text-xs font-mono text-sky-400 font-semibold transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 rounded-lg bg-[#111C2E] text-slate-300 hover:text-white"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#111C2E]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#263449] bg-[#070B14]/95 backdrop-blur-xl px-4 py-4 space-y-1 animate-fadeIn">
            {/* User Profile Banner in Mobile */}
            {isAuthenticated ? (
              <div className="p-3 mb-2 rounded-2xl bg-[#111C2E] border border-[#263449] flex items-center justify-between">
                <div className="flex items-center space-x-2.5 truncate">
                  <div className="w-8 h-8 rounded-lg bg-sky-400 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate text-xs font-mono">
                    <p className="text-white font-semibold truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-[#070B14] text-sky-400 hover:text-white"
                  title="View Profile"
                >
                  <User className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center rounded-xl bg-[#111C2E] border border-[#263449] text-xs font-mono text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center rounded-xl bg-sky-400 text-slate-950 font-bold text-xs font-mono uppercase"
                >
                  Register
                </Link>
              </div>
            )}

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 font-semibold'
                      : 'text-slate-300 hover:bg-[#111C2E] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-sky-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <div className="pt-3 mt-3 border-t border-[#263449] flex flex-col space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Exploration Dashboard</span>
              </Link>
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-2 rounded-lg bg-[#111C2E] text-slate-300 hover:text-white text-xs font-mono uppercase"
              >
                <Bookmark className="w-3.5 h-3.5 text-sky-400" />
                <span>My Favorites & Watchlist</span>
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full py-2 rounded-lg bg-[#111C2E] text-slate-300 hover:text-white text-xs font-mono"
                  >
                    <Settings className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Account Settings</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center space-x-2 w-full py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Outlet for Pages */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Realigned Public Discovery Footer */}
      <Footer />
    </div>
  );
}

export default PublicLayout;
