import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Globe, Sparkles, Database, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#263449] bg-[#070B14] text-slate-400 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#263449]">
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold font-display tracking-wider text-white">
                SPACEOPS
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Your window into space exploration. Discover upcoming rocket launches, follow active interplanetary missions, explore spacecraft, and stay updated on humanity's journey through the cosmos.
            </p>
            <div className="flex items-center space-x-3 text-xs font-mono text-sky-400">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Public Space Feeds</span>
              </span>
            </div>
          </div>

          {/* Column 1: Exploration */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-4 font-semibold">
              Exploration
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/missions" className="hover:text-sky-400 transition-colors">
                  All Missions
                </Link>
              </li>
              <li>
                <Link to="/missions?status=active" className="hover:text-sky-400 transition-colors">
                  Active Missions
                </Link>
              </li>
              <li>
                <Link to="/launches" className="hover:text-sky-400 transition-colors">
                  Upcoming Launches
                </Link>
              </li>
              <li>
                <Link to="/spacecraft" className="hover:text-sky-400 transition-colors">
                  Spacecraft Directory
                </Link>
              </li>
              <li>
                <Link to="/astronauts" className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                  <span>Astronauts</span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded font-mono">LIVE</span>
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-sky-400 transition-colors">
                  Planetary Destinations
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Observations & News */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-4 font-semibold">
              Observations & News
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/events" className="hover:text-sky-400 transition-colors">
                  Celestial Events
                </Link>
              </li>
              <li>
                <Link to="/events?type=meteor" className="hover:text-sky-400 transition-colors">
                  Meteor Showers
                </Link>
              </li>
              <li>
                <Link to="/events?type=eclipse" className="hover:text-sky-400 transition-colors">
                  Solar & Lunar Eclipses
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-sky-400 transition-colors">
                  Space News Feed
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-sky-400 transition-colors">
                  Public Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Learning & Sources */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-4 font-semibold">
              Education & Data
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/learn" className="hover:text-sky-400 transition-colors">
                  Space Learning Center
                </Link>
              </li>
              <li>
                <Link to="/learn/how-rocket-launches-work" className="hover:text-sky-400 transition-colors">
                  How Rockets Work
                </Link>
              </li>
              <li>
                <Link to="/sources" className="hover:text-sky-400 transition-colors flex items-center space-x-1">
                  <span>Data Sources Policy</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-sky-400 transition-colors">
                  About SpaceOps
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-sky-400 transition-colors">
                  Contact & Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SpaceOps. Dedicated to open science, space exploration, and public education.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300">Terms of Use</Link>
            <Link to="/sources" className="hover:text-slate-300">Attribution</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
