import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  ArrowLeft,
  Calendar,
  Globe,
  Radio,
  Bookmark,
  ExternalLink,
  Shield,
  Sparkles,
  Award,
  Clock,
  Compass
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { PagePreloader } from '../../components/common/PagePreloader';
import { favoritesService } from '../../services/supabase/favoritesService';
import { useAuth } from '../../context/AuthContext';

export function AstronautDetail() {
  const { id } = useParams();
  const [astronaut, setAstronaut] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    async function loadAstronaut() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.getAstronautById(id);
        if (res && res.data) {
          setAstronaut(res.data);
        } else {
          setError(`Astronaut dossier '${id}' not found`);
        }
      } catch (err) {
        console.error('Failed to load astronaut:', err);
        setError(err.message || 'Unable to retrieve astronaut record');
      } finally {
        setLoading(false);
      }
    }
    loadAstronaut();
  }, [id]);

  useEffect(() => {
    async function checkBookmarked() {
      if (!user || !astronaut) return;
      try {
        const res = await favoritesService.isFavorited(user.id, 'astronaut', String(astronaut.id));
        setIsBookmarked(res);
      } catch (e) {
        // Fallback
      }
    }
    checkBookmarked();
  }, [user, astronaut]);

  const handleToggleBookmark = async () => {
    if (!astronaut) return;
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      await favoritesService.toggleFavorite(user?.id, {
        entityType: 'astronaut',
        entityId: String(astronaut.id),
        name: astronaut.name,
        slug: astronaut.slug,
        title: astronaut.name,
        imageUrl: astronaut.image,
        metadata: {
          agency: astronaut.agency?.name,
          country: astronaut.nationality,
          timeInSpace: astronaut.timeInSpace,
          inSpace: astronaut.inSpace
        }
      });
    } catch (err) {
      console.warn('Failed to toggle bookmark:', err);
    }
  };

  if (loading) {
    return (
      <PagePreloader
        title="Accessing Flight Dossier"
        message="Retrieving official NASA & international spaceflight records..."
      />
    );
  }

  if (error || !astronaut) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <Users className="w-16 h-16 text-slate-600 mx-auto" />
        <h2 className="text-2xl font-bold font-display text-white">Astronaut Dossier Not Found</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">{error}</p>
        <Link
          to="/astronauts"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Astronauts Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Back button */}
      <div>
        <Link
          to="/astronauts"
          className="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Astronauts</span>
        </Link>
      </div>

      {/* Hero Dossier Header */}
      <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-[#263449] bg-gradient-to-br from-[#0D1422] via-[#111C2E] to-[#0D1422] relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          {/* Avatar Image */}
          <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-2xl bg-[#070B14] border-2 border-sky-400/40 overflow-hidden shrink-0 shadow-2xl">
            <img
              src={
                astronaut.image ||
                'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=600&q=80'
              }
              alt={astronaut.name}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Details */}
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {astronaut.inSpace ? (
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-[11px] font-mono tracking-wider uppercase shadow-md shadow-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
                  <span>Currently in Orbit</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 text-[11px] font-mono uppercase">
                  {astronaut.statusLabel || astronaut.status}
                </span>
              )}
              <span className="text-xs font-mono text-slate-400">
                {astronaut.nationality} ({astronaut.countryCode})
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
              {astronaut.name}
            </h1>

            <p className="text-sm font-mono text-sky-400">
              {astronaut.agency?.name} • {astronaut.agency?.abbrev}
            </p>

            {astronaut.currentCraft && (
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Station Habitation: {astronaut.currentCraft}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleToggleBookmark}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md'
                    : 'bg-[#111C2E] text-slate-200 hover:text-white border-[#263449]'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isBookmarked ? 'Saved in Favorites' : 'Add to Favorites'}</span>
              </button>

              {astronaut.wikiUrl && (
                <a
                  href={astronaut.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#111C2E] hover:bg-[#162338] border border-[#263449] text-xs font-mono text-sky-400 hover:text-sky-300 transition-all"
                >
                  <span>Wikipedia Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-[#263449] text-center space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Time In Space
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {astronaut.timeInSpace || '0d'}
          </div>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-[#263449] text-center space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Flights
          </div>
          <div className="text-xl font-bold font-mono text-sky-400">
            {astronaut.flightsCount}
          </div>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-[#263449] text-center space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Spacewalks (EVAs)
          </div>
          <div className="text-xl font-bold font-mono text-indigo-400">
            {astronaut.spacewalksCount}
          </div>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-[#263449] text-center space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            EVA Cumulative Time
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {astronaut.evaTime || '0h'}
          </div>
        </div>
      </div>

      {/* Biography & Records */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
            <h3 className="text-base font-bold font-display text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-sky-400" />
              <span>Biographical Profile</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {astronaut.bio}
            </p>
          </div>
        </div>

        {/* Career Timeline */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
            <h3 className="text-base font-bold font-display text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Career Milestones</span>
            </h3>
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#090E17] border border-[#1E293B]">
                <span className="text-slate-400 block text-[10px]">First Launch:</span>
                <span className="text-white font-medium">
                  {astronaut.firstFlight
                    ? new Date(astronaut.firstFlight).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'Historical Records'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#090E17] border border-[#1E293B]">
                <span className="text-slate-400 block text-[10px]">Most Recent Flight:</span>
                <span className="text-white font-medium">
                  {astronaut.lastFlight
                    ? new Date(astronaut.lastFlight).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'Current Service'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#090E17] border border-[#1E293B]">
                <span className="text-slate-400 block text-[10px]">Primary Agency:</span>
                <span className="text-sky-300 font-medium">
                  {astronaut.agency?.name || 'International'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AstronautDetail;
