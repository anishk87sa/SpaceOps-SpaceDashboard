import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Globe,
  Compass,
  Satellite,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Info
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { PagePreloader } from '../../components/common/PagePreloader';

export function DestinationDetail() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDestination() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.getDestinationBySlug(slug);
        setDestination(res.data);
      } catch (err) {
        console.error('Failed to load destination:', err);
        setError(err.message || 'Planetary destination not found');
      } finally {
        setLoading(false);
      }
    }
    loadDestination();
  }, [slug]);

  if (loading) {
    return (
      <PagePreloader
        title="Loading Destination Profile"
        message="Computing planetary characteristics, orbital dynamics, and active exploration assets..."
      />
    );
  }

  if (!loading && (error || !destination)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold font-display text-white mb-4">Destination Not Found</h2>
        <Link to="/destinations" className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase font-mono">
          Return to Destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      {/* Back button */}
      <div>
        <Link
          to="/destinations"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Destination Explorer</span>
        </Link>
      </div>

      {/* Hero Visual Card */}
      <div className="relative rounded-3xl overflow-hidden border border-[#263449] glass-panel shadow-2xl">
        <div className="h-72 sm:h-96 relative">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/60 to-transparent"></div>
          <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-mono text-emerald-400 uppercase">
            {destination.type}
          </div>
        </div>

        <div className="p-8 sm:p-12 -mt-24 relative z-10 space-y-4">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-wider block">
            {destination.tagline}
          </span>

          <h1 className="text-3xl sm:text-5xl font-bold font-display text-white">
            {destination.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-4xl font-light leading-relaxed">
            {destination.description}
          </p>
        </div>
      </div>

      {/* Physical & Orbital Facts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D1422] border border-[#263449]">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
            Distance from Earth
          </span>
          <span className="text-base font-bold text-white">{destination.distanceFromEarth}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1422] border border-[#263449]">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
            Orbital Period
          </span>
          <span className="text-base font-bold text-white">{destination.orbitalPeriod}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1422] border border-[#263449]">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
            Active Missions Count
          </span>
          <span className="text-base font-bold text-emerald-400">{destination.missionsCount} Active</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1422] border border-[#263449]">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
            Operating Spacecraft
          </span>
          <span className="text-base font-bold text-sky-400">{destination.spacecraftCount} Robotic Assets</span>
        </div>
      </div>

      {/* Exploration Highlights & Educational Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Highlights */}
          {destination.highlights && (
            <div className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-4">
              <h2 className="text-xl font-bold font-display text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Exploration Highlights</span>
              </h2>
              <ul className="space-y-3">
                {destination.highlights.map((h, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Educational Note */}
          {destination.educationalSummary && (
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#111C2E] to-[#0D1422] border border-emerald-500/30 space-y-3">
              <h2 className="text-xl font-bold font-display text-white flex items-center space-x-2">
                <Info className="w-5 h-5 text-sky-400" />
                <span>Scientific Note & Orbital Mechanics</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {destination.educationalSummary}
              </p>
            </div>
          )}
        </div>

        {/* Right: Associated Missions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center space-x-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Associated Missions</span>
            </h3>

            {destination.relatedMissions?.length > 0 ? (
              <div className="space-y-3">
                {destination.relatedMissions.map((m) => (
                  <Link
                    key={m.id}
                    to={`/missions/${m.slug}`}
                    className="p-3 rounded-xl bg-[#0D1422] hover:bg-[#162338] border border-[#263449] block group transition-all"
                  >
                    <span className="text-[10px] font-mono text-emerald-400 uppercase block">
                      {m.organization}
                    </span>
                    <h4 className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {m.name}
                    </h4>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No active mission profiles recorded for this query.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetail;
