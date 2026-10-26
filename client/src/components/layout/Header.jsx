import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, Activity, ShieldCheck, Database, Compass, Eye, Satellite, Radio } from 'lucide-react';

export function Header({ backendConnected = false }) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Activity },
    { name: '3D Tracking', path: '/satellites', icon: Radio },
    { name: 'Launches', path: '/launches', icon: Rocket },
    { name: 'Missions', path: '/missions', icon: Compass },
    { name: 'Spacecraft', path: '/spacecraft', icon: Satellite },
    { name: 'Watchlist', path: '/watchlist', icon: Eye },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cyan-900/30 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center glow-cyan transition-transform group-hover:scale-105">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold font-display tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-400">
                SPACEOPS
              </span>
              <span className="block text-[10px] tracking-widest text-cyan-400/80 uppercase font-mono">
                Mission Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide uppercase transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-cyan-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Telemetry Status Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  backendConnected ? 'bg-cyan-400' : 'bg-amber-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  backendConnected ? 'bg-cyan-500' : 'bg-amber-500'
                }`}
              ></span>
            </span>
            <span className="text-slate-300">
              {backendConnected ? 'API ONLINE' : 'API DISCONNECTED'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
