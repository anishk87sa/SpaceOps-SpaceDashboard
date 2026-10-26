import React from 'react';
import { Rocket, Globe, Compass, BookOpen, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 animate-fade-in">
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold block">
          About SpaceOps
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
          Your Window into Space Exploration
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
          SpaceOps is a public-facing space exploration information platform dedicated to bringing humanity's voyages beyond Earth into one accessible, scientifically accurate, and visually captivating website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <Compass className="w-8 h-8 text-sky-400" />
          <h3 className="text-lg font-display font-bold text-white">Discovery & Education</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            We believe complex orbital mechanics and planetary science should be understandable for everyone—from middle school students to lifelong stargazers.
          </p>
        </div>

        <div className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <Globe className="w-8 h-8 text-indigo-400" />
          <h3 className="text-lg font-display font-bold text-white">Truthful Information</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            We never fabricate exact launch seconds or generate fake breaking news. We clearly distinguish confirmed milestones from proposed exploration plans.
          </p>
        </div>

        <div className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <BookOpen className="w-8 h-8 text-emerald-400" />
          <h3 className="text-lg font-display font-bold text-white">Open Science</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            We aggregate open data feeds from NASA, ESA, ISRO, and celestial observatories with full attribution, providing direct links back to original scientific papers.
          </p>
        </div>
      </div>

      {/* Exploration Call to Action */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-950 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold font-display text-white">
            Start Exploring Today
          </h3>
          <p className="text-xs text-slate-300 max-w-lg">
            Discover active missions, rocket launch countdowns, and upcoming celestial phenomena in our unified public dashboard.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all shadow-lg shrink-0"
        >
          Open Space Dashboard
        </Link>
      </div>
    </div>
  );
}

export default About;
