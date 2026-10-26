import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight, Compass, Satellite, Sparkles } from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { PagePreloader } from '../../components/common/PagePreloader';

export function DestinationExplorer() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDestinations() {
      try {
        const res = await apiClient.getDestinations();
        setDestinations(res.data);
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDestinations();
  }, []);

  if (loading && destinations.length === 0) {
    return (
      <PagePreloader
        title="Loading Destination Explorer"
        message="Cataloging planetary bodies, natural satellites, and solar system destinations..."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>Planetary Science & Cosmic Geography</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Destination Explorer
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl font-light">
          Journey across our solar system. Explore the planetary bodies, natural satellites, and cosmic regions being actively explored by robotic probes and human spaceflight.
        </p>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-mono text-xs">
          Loading destinations...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.slug}`}
              className="group glass-panel rounded-3xl overflow-hidden border border-[#263449] hover:border-emerald-500/50 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/40 to-transparent"></div>
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-emerald-400 uppercase">
                    {dest.type}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-2xl font-bold font-display text-white group-hover:text-emerald-300 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-sky-400 font-mono">
                    {dest.tagline}
                  </p>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {dest.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-4">
                <div className="pt-4 border-t border-[#263449] flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{dest.missionsCount} Exploration Missions</span>
                  <span className="text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default DestinationExplorer;
