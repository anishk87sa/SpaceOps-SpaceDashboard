import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Rocket,
  Clock,
  MapPin,
  ExternalLink,
  ChevronLeft,
  Bookmark,
  Radio,
  Sparkles,
  Info,
  Compass,
  Satellite,
  CloudSun,
  ShieldCheck,
  AlertCircle,
  Share2,
  Check,
  Navigation
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { useAuth } from '../../context/AuthContext';
import { favoritesService } from '../../services/supabase/favoritesService';
import { AuthPromptModal } from '../../components/auth/AuthPromptModal';
import { getLocalBookmarks } from '../../utils/storage';
import { PagePreloader } from '../../components/common/PagePreloader';

export function LaunchDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [launch, setLaunch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState({ text: 'Calculating...', precision: 'second' });

  // Intelligent mission association
  const connectedMission = React.useMemo(() => {
    if (!launch) return null;
    const text = `${launch.name || ''} ${launch.payload || ''} ${launch.mission?.name || ''} ${launch.description || ''}`.toLowerCase();
    if (text.includes('artemis')) return { name: 'Artemis Lunar Program', slug: 'artemis-program' };
    if (text.includes('europa') || text.includes('clipper')) return { name: 'Europa Clipper', slug: 'europa-clipper' };
    if (text.includes('station') || text.includes('iss') || text.includes('cygnus') || text.includes('crew dragon'))
      return { name: 'International Space Station (ISS)', slug: 'international-space-station' };
    if (text.includes('jwst') || text.includes('webb')) return { name: 'James Webb Space Telescope', slug: 'james-webb-space-telescope' };
    if (text.includes('perseverance')) return { name: 'Mars 2020 Perseverance Rover', slug: 'mars-perseverance-rover' };
    if (text.includes('chandrayaan')) return { name: 'Chandrayaan-3', slug: 'chandrayaan-3' };
    return null;
  }, [launch]);

  useEffect(() => {
    async function loadLaunch() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.getLaunchBySlug(slug);
        setLaunch(res.data);

        // Check if bookmarked in Supabase or localStorage
        if (user?.id) {
          const favorited = await favoritesService.isFavorited(user.id, 'launch', [res.data.slug, res.data.id, slug].filter(Boolean));
          setIsBookmarked(favorited);
        } else {
          const saved = getLocalBookmarks();
          setIsBookmarked(saved.some((b) => b.id === res.data.id || b.slug === slug || b.entity_id === res.data.slug || b.entity_id === res.data.id));
        }
      } catch (err) {
        console.error('Failed to load launch dossier:', err);
        setError(err.message || 'Launch mission record not found');
      } finally {
        setLoading(false);
      }
    }
    loadLaunch();
  }, [slug, user]);

  // Precision-aware countdown timer
  useEffect(() => {
    if (!launch?.plannedLaunchDate) return;

    const calculateTime = () => {
      const precision = (launch.netPrecision || 'Second').toLowerCase();
      const now = new Date().getTime();
      const target = new Date(launch.plannedLaunchDate).getTime();
      const diff = target - now;

      if (precision === 'month' || precision === 'quarter' || precision === 'year') {
        const dateObj = new Date(launch.plannedLaunchDate);
        const monthYear = dateObj.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
        setCountdown({
          text: `Target: ${monthYear}`,
          precision: 'month',
        });
        return;
      }

      if (precision === 'day') {
        const dateObj = new Date(launch.plannedLaunchDate);
        const dayDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        setCountdown({
          text: `Target Date: ${dayDate}`,
          precision: 'day',
        });
        return;
      }

      if (diff <= 0) {
        const isSuccess = launch.launchStatus === 'success';
        setCountdown({
          text: isSuccess ? 'T-00:00:00 (Liftoff Completed)' : 'T-00:00:00 (In Flight / Concluded)',
          precision: 'second',
          expired: true,
        });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({
          text: `T-${days > 0 ? `${days}d ` : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
          precision: 'second',
          expired: false,
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [launch]);

  const toggleBookmark = async () => {
    if (!launch) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setFavoriteLoading(true);
    try {
      const entityId = launch.slug || slug || String(launch.id);
      if (isBookmarked) {
        await favoritesService.removeFavorite(user.id, 'launch', [entityId, launch.id, launch.slug, slug].filter(Boolean));
        setIsBookmarked(false);
      } else {
        await favoritesService.addFavorite(user.id, {
          entityType: 'launch',
          entityId: entityId,
          entityName: launch.name,
          metadata: {
            summary: `${launch.rocket?.fullName || launch.rocket?.name || 'Orbital Rocket'} • ${launch.provider?.name || launch.launchProvider || 'Provider'}`,
            url: `/launches/${entityId}`,
            launchDate: launch.launchDate || launch.net,
          },
        });
        setIsBookmarked(true);
      }
    } catch (e) {
      console.error('Error toggling launch favorite:', e);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <PagePreloader
        title="Loading Launch Dossier"
        message="Connecting to orbital manifest, rocket staging, and launch facility telemetry..."
      />
    );
  }

  if (!loading && (error || !launch)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-3xl font-bold font-display text-white">Launch Not Found</h2>
        <p className="text-sm text-slate-300">
          The requested launch dossier could not be located in our verified spaceflight manifest.
        </p>
        <Link
          to="/launches"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Launch Tracker</span>
        </Link>
      </div>
    );
  }

  const isCompleted = launch.launchStatus === 'success';
  const isFailed = launch.launchStatus === 'failed';
  const isGo = launch.launchStatus === 'go';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* 1. Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to="/launches"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Launches Tracker</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#111C2E] hover:bg-[#162338] text-slate-300 border border-[#263449] text-xs font-mono transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={toggleBookmark}
            disabled={favoriteLoading}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-all disabled:opacity-50 cursor-pointer ${
              isBookmarked
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                : 'bg-[#111C2E] text-slate-300 border-[#263449] hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{favoriteLoading ? 'Updating...' : isBookmarked ? 'Saved to Favorites' : 'Add to Favorites'}</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Mission Card */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 font-semibold">
              {launch.provider?.name || launch.launchProvider || 'Commercial Launch Provider'}
            </span>
            <span className="text-slate-500">•</span>
            <span
              className={`text-xs font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : isFailed
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : isGo
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}
            >
              {launch.status?.name || launch.scheduleConfidence || launch.launchStatus}
            </span>

            {typeof launch.probability === 'number' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-sky-950/70 text-xs font-mono text-sky-300 border border-sky-800/50">
                <CloudSun className="w-3.5 h-3.5 text-sky-400" />
                <span>Weather: {launch.probability}% GO</span>
              </span>
            )}
          </div>

          {/* Countdown Clock Display */}
          <div className="px-5 py-2.5 rounded-xl bg-slate-950/90 border border-amber-500/30 font-mono text-base sm:text-lg font-bold text-amber-300 flex items-center space-x-2 shadow-inner">
            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{countdown.text}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
          {launch.name}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-4xl font-light leading-relaxed">
          {launch.mission?.description || launch.description}
        </p>

        {/* Live Broadcast / Webcast Button */}
        {launch.streamUrl && (
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={launch.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg hover:shadow-red-600/30"
            >
              <Radio className="w-4 h-4 text-white animate-pulse" />
              <span>Watch Official Launch Webcast</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* 3. Detailed Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rocket Vehicle Card */}
        <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-slate-400">
            <Rocket className="w-4 h-4 text-amber-400" />
            <span>Launch Vehicle</span>
          </div>
          <div className="text-lg font-bold font-display text-white">
            {launch.rocket?.fullName || launch.rocket?.name || (typeof launch.rocket === 'string' ? launch.rocket : 'Orbital Launch Vehicle')}
          </div>
          <p className="text-xs text-slate-400 font-mono">
            {launch.rocket?.family || launch.rocketFamily ? `Family: ${launch.rocket?.family || launch.rocketFamily}` : 'Configuration verified'}
            {launch.rocket?.variant || launch.rocketVariant ? ` • Variant ${launch.rocket?.variant || launch.rocketVariant}` : ''}
          </p>
        </div>

        {/* Launch Site & Pad Card */}
        <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-slate-400">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <span>Launch Facility & Pad</span>
          </div>
          <div className="text-lg font-bold font-display text-white truncate" title={launch.location?.name || launch.launchSite}>
            {launch.pad?.name || launch.padDetails?.name || launch.launchSite}
          </div>
          <p className="text-xs text-slate-400 font-mono truncate">
            {launch.location?.name || launch.padDetails?.location || launch.launchSite}
          </p>
          {(launch.pad?.mapUrl || launch.padDetails?.mapUrl) && (
            <a
              href={launch.pad?.mapUrl || launch.padDetails?.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-[11px] font-mono text-sky-400 hover:underline pt-1"
            >
              <Navigation className="w-3 h-3" />
              <span>View Coordinates on Map</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>

        {/* Target Destination & Orbit Card */}
        <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-slate-400">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Destination Orbit</span>
          </div>
          <div className="text-lg font-bold font-display text-white">
            {launch.mission?.orbit?.name || launch.destination || 'Low Earth Orbit'}
          </div>
          <p className="text-xs text-slate-400 font-mono">
            {launch.mission?.orbit?.abbrev || launch.destinationAbbrev ? `Orbit Code: ${launch.mission?.orbit?.abbrev || launch.destinationAbbrev}` : 'Orbital Insertion'}
          </p>
        </div>

        {/* Primary Payload Card */}
        <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-slate-400">
            <Satellite className="w-4 h-4 text-purple-400" />
            <span>Primary Mission Payload</span>
          </div>
          <div className="text-lg font-bold font-display text-white truncate" title={launch.mission?.name || launch.payload}>
            {launch.mission?.name || launch.payload || 'Orbital Payload'}
          </div>
          <p className="text-xs text-slate-400 font-mono">
            {launch.mission?.type || launch.payloadType ? `Type: ${launch.mission?.type || launch.payloadType}` : 'Orbital Deployment'}
          </p>
          {connectedMission && (
            <Link
              to={`/missions/${connectedMission.slug}`}
              className="inline-flex items-center space-x-1.5 text-xs font-mono text-indigo-400 hover:text-indigo-300 pt-1 underline"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Related Mission: {connectedMission.name} →</span>
            </Link>
          )}
        </div>
      </div>


      {/* 4. Timing & Schedule Freshness Notice Card */}
      <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>Launch Timing Precision & Spaceflight Freshness Notice</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-300">
          <div className="space-y-1">
            <span className="text-slate-400 block">Universal Coordinated Time (UTC):</span>
            <span className="text-white font-bold">
              {launch.plannedLaunchDate ? new Date(launch.plannedLaunchDate).toUTCString() : 'To Be Determined'}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block">Your Local Browser Timezone:</span>
            <span className="text-white font-bold">
              {launch.plannedLaunchDate ? new Date(launch.plannedLaunchDate).toLocaleString() : 'To Be Determined'}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-light pt-2 border-t border-[#263449]/60">
          Rocket launch schedules are dynamically influenced by range safety parameters, atmospheric upper-level wind shear, and orbital intercept geometries. If date precision is marked as provisional (Month or Day window), exact liftoff second will be published as launch providers confirm range approval.
        </p>
      </div>

      {/* 5. Related Discoveries & Education Links */}
      <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
        <h3 className="text-base font-bold font-display text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Related Space Exploration Resources</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/missions"
            className="p-4 rounded-xl bg-[#0D1422] border border-[#263449] hover:border-sky-500/40 transition-all block group"
          >
            <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">Missions Directory</span>
            <div className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
              Explore Active Space Missions
            </div>
            <p className="text-xs text-slate-400 mt-1">Discover interplanetary spacecraft currently operating in space.</p>
          </Link>

          <Link
            to="/spacecraft"
            className="p-4 rounded-xl bg-[#0D1422] border border-[#263449] hover:border-amber-500/40 transition-all block group"
          >
            <span className="text-[10px] font-mono text-amber-400 uppercase block mb-1">Spacecraft Fleet</span>
            <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              Spacecraft & Telescopes
            </div>
            <p className="text-xs text-slate-400 mt-1">Explore rovers, orbiters, deep-space probes, and space stations.</p>
          </Link>

          <Link
            to="/learn"
            className="p-4 rounded-xl bg-[#0D1422] border border-[#263449] hover:border-purple-500/40 transition-all block group"
          >
            <span className="text-[10px] font-mono text-purple-400 uppercase block mb-1">Space Education</span>
            <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              How Rocket Launches Work
            </div>
            <p className="text-xs text-slate-400 mt-1">Learn about staging, orbital mechanics, and propulsion systems.</p>
          </Link>
        </div>
      </div>

      {/* 6. Official Sources & Attribution */}
      <div className="p-6 rounded-2xl bg-[#0D1422] border border-[#263449] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Data Provider: {launch.dataSource || 'Launch Library 2 (The Space Devs)'}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Attribution: Data provided by The Space Devs / Launch Library 2
          </p>
        </div>

        {launch.sources && launch.sources.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {launch.sources.map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-[#162338] hover:bg-[#20314f] text-slate-200 border border-[#263449] text-[11px] transition-colors"
              >
                <span>{s.name}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}
      </div>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        entityName={launch?.name}
        entityType="Launch"
      />
    </div>
  );
}

export default LaunchDetail;
