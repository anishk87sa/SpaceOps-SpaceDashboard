import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Satellite, Globe, Zap, ArrowRight } from 'lucide-react';

export function Solutions() {
  const solutions = [
    {
      title: 'Commercial Satellite Constellations',
      subtitle: 'Earth Observation & Broadband Mesh',
      desc: 'Scale ground station scheduling, telemetry processing, and orbit maintenance across hundreds of low Earth orbit spacecraft with automated pass reservation and collision warning.',
      metrics: 'Designed for 100+ Asset Constellations',
      icon: Satellite,
    },
    {
      title: 'Defense & Space Situational Awareness',
      subtitle: 'Space Domain Awareness (SDA)',
      desc: 'Track uncooperative orbital debris, calculate conjunction probabilities, and monitor space weather threats with high-assurance audit trails and role-based clearance separation.',
      metrics: 'ITAR & Defense Clearance Compliant Architecture',
      icon: Shield,
    },
    {
      title: 'Scientific & Deep Space Exploration',
      subtitle: 'Lunar, Planetary & Astrophysics',
      desc: 'Support non-Keplerian halo orbits, Deep Space Network (DSN) link coordination, optical communications cross-links, and scientific payload data harvesting.',
      metrics: 'DSN Goldstone, Madrid & Canberra Native',
      icon: Globe,
    },
    {
      title: 'SmallSat & University Programs',
      subtitle: 'Rapid Deployment & CubeSat Ops',
      desc: 'Turnkey operational mission control for new space startups and universities with zero complex server provisioning and automated TLE tracking.',
      metrics: 'Rapid Onboarding in < 24 Hours',
      icon: Zap,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="max-w-3xl">
        <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] font-semibold block mb-3">
          Industry Solutions
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
          Tailored Workspaces for Every Aerospace Mission
        </h1>
        <p className="mt-4 text-base text-[#94A3B8] leading-relaxed">
          Whether managing sovereign defense space domains, commercial telecom constellations, or deep space scientific observatories,
          SpaceOps delivers purpose-built flight intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {solutions.map((sol) => {
          const Icon = sol.icon;
          return (
            <div key={sol.title} className="p-8 rounded-2xl glass-panel border border-[#263449] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block mb-1">{sol.subtitle}</span>
                  <h3 className="text-xl font-display font-bold text-white">{sol.title}</h3>
                </div>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{sol.desc}</p>
              </div>
              <div className="pt-4 border-t border-[#263449]/60 flex items-center justify-between text-xs font-mono">
                <span className="text-[#34D399] font-semibold">{sol.metrics}</span>
                <Link to="/app/dashboard" className="text-[#38BDF8] hover:underline flex items-center space-x-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Solutions;
