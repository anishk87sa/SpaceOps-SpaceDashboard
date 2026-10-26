import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Globe,
  Eye,
  ChevronLeft,
  Sparkles,
  ExternalLink,
  Info,
  Bookmark,
  Compass,
  Satellite,
  Rocket,
  Video,
  ArrowRight,
  RefreshCw,
  Share2,
  Check
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { useAuth } from '../../context/AuthContext';
import { favoritesService } from '../../services/supabase/favoritesService';
import { AuthPromptModal } from '../../components/auth/AuthPromptModal';
import { getLocalBookmarks } from '../../utils/storage';
import { PagePreloader } from '../../components/common/PagePreloader';

export function EventDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [copied, setCopied] = useState(false);

  async function loadEvent() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.getEventBySlug(slug);
      setEvent(res.data);

      // Check if bookmarked in Supabase or localStorage
      if (user?.id) {
        const favorited = await favoritesService.isFavorited(user.id, 'event', [res.data.slug, res.data.id, slug].filter(Boolean));
        setIsBookmarked(favorited);
      } else {
        const saved = getLocalBookmarks();
        setIsBookmarked(saved.some((b) => b.id === res.data.id || b.slug === slug || b.entity_id === res.data.slug || b.entity_id === res.data.id));
      }
    } catch (err) {
      console.error('Failed to load event:', err);
      setError(err.message || 'Space event not found in registry');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvent();
  }, [slug, user]);

  const toggleBookmark = async () => {
    if (!event) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setFavoriteLoading(true);
    try {
      const entityId = event.slug || slug || String(event.id);
      if (isBookmarked) {
        await favoritesService.removeFavorite(user.id, 'event', [entityId, event.id, event.slug, slug].filter(Boolean));
        setIsBookmarked(false);
      } else {
        await favoritesService.addFavorite(user.id, {
          entityType: 'event',
          entityId: entityId,
          entityName: event.title,
          metadata: {
            summary: `${event.eventType} • ${event.description}`,
            url: `/events/${entityId}`,
            date: event.date,
          },
        });
        setIsBookmarked(true);
      }
    } catch (e) {
      console.error('Error toggling event favorite:', e);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <PagePreloader
        title="Loading Celestial Event Dossier"
        message="Calculating observation angles, universal coordinates, and visibility windows..."
      />
    );
  }

  if (!loading && (error || !event)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold font-display text-white">Event Not Found</h2>
        <p className="text-sm text-slate-300 font-light">
          {error || `Space event '${slug}' could not be located in our verified ephemeris registry.`}
        </p>
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={loadEvent}
            className="px-4 py-2 rounded-xl bg-[#162338] hover:bg-[#20314f] text-slate-200 border border-[#263449] font-mono text-xs"
          >
            Retry Request
          </button>
          <Link
            to="/events"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase font-mono"
          >
            Return to Space Events Calendar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* 1. Back and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/events"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-purple-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Space Events Calendar</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#263449] bg-[#111C2E] hover:bg-[#162338] text-xs font-mono text-slate-300 hover:text-white transition-all"
            title="Copy Direct Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={toggleBookmark}
            disabled={favoriteLoading}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-all disabled:opacity-50 cursor-pointer ${
              isBookmarked
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                : 'bg-[#111C2E] text-slate-300 border-[#263449] hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
            <span>{favoriteLoading ? 'Updating...' : isBookmarked ? 'Saved to Favorites' : 'Add to Favorites'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Hero Header */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-purple-500/30 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{event.eventType}</span>
            <span>•</span>
            <span>{event.category}</span>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Timezone: <span className="text-purple-300 font-bold">{event.timeZone || 'UTC'}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white">
          {event.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-4xl font-light leading-relaxed">
          {event.description}
        </p>

        {/* Date & Time Displays */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#263449]/70 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#0D1422] border border-[#263449] space-y-1">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Universal Coordinated Time (UTC)</span>
            </span>
            <p className="text-white font-bold">
              {event.startTime ? new Date(event.startTime).toUTCString() : 'Date TBD'}
              {event.endTime && event.endTime !== event.startTime && ` — ${new Date(event.endTime).toUTCString()}`}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0D1422] border border-[#263449] space-y-1">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Your Local Browser Time</span>
            </span>
            <p className="text-white font-bold">
              {event.startTime ? new Date(event.startTime).toLocaleString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) : 'Local Time TBD'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Viewing Guidance Card */}
      {event.viewingGuidance && (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-[#111C2E] to-[#0D1422] border border-purple-500/30 space-y-4">
          <h2 className="text-xl font-bold font-display text-white flex items-center space-x-2">
            <Eye className="w-5 h-5 text-purple-400" />
            <span>Public Viewing Guidance & Telescope Tips</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            {event.viewingGuidance}
          </p>
        </div>
      )}

      {/* 4. Connected Entities: Mission & Spacecraft Links */}
      {event.relatedEntities && (event.relatedEntities.mission || event.relatedEntities.spacecraft) && (
        <div className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <h3 className="text-lg font-bold font-display text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Connected Space Exploration Entities</span>
          </h3>
          <p className="text-xs text-slate-300 font-light">
            This space event is tied to an active space mission or robotic explorer in our registry:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {event.relatedEntities.mission && (
              <Link
                to={event.relatedEntities.mission.url}
                className="p-5 rounded-2xl bg-[#0D1422] border border-indigo-500/40 hover:border-indigo-400 transition-all block group"
              >
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono uppercase mb-2">
                  <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  <span>Related Mission Dossier</span>
                </div>
                <div className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                  <span>{event.relatedEntities.mission.name}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-400 mt-1 font-light">
                  Inspect comprehensive scientific objectives, timelines, and instruments.
                </p>
              </Link>
            )}

            {event.relatedEntities.spacecraft && (
              <Link
                to={event.relatedEntities.spacecraft.url}
                className="p-5 rounded-2xl bg-[#0D1422] border border-cyan-500/40 hover:border-cyan-400 transition-all block group"
              >
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono uppercase mb-2">
                  <Satellite className="w-4 h-4" />
                  <span>Related Spacecraft Explorer</span>
                </div>
                <div className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>{event.relatedEntities.spacecraft.name}</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-400 mt-1 font-light">
                  Explore vehicle specifications, power systems, antennas, and discoveries.
                </p>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 5. Visibility, Location & Lead Organization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#0D1422] border border-[#263449] space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>Location & Visibility</span>
          </span>
          <p className="text-sm font-semibold text-white">{event.locationOrVisibility}</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D1422] border border-[#263449] space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>Source & Scientific Organization</span>
          </span>
          <p className="text-sm font-semibold text-white">
            {event.source} ({event.relatedOrganization || 'International Astronomical Body'})
          </p>
        </div>
      </div>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        entityName={event?.title}
        entityType="Event"
      />
    </div>
  );
}

export default EventDetail;
