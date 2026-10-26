import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket,
  Compass,
  Calendar,
  Newspaper,
  Globe,
  Satellite,
  Clock,
  ArrowRight,
  Bookmark,
  Sparkles,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Users,
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { getLocalBookmarks } from '../../utils/storage';
import { PagePreloader } from '../../components/common/PagePreloader';

export function PublicDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [inSpaceCount, setInSpaceCount] = useState(11);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  async function loadDashboard() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.getDashboardFeed();
      setDashboardData(res.data);

      try {
        const astroRes = await apiClient.getAstronautsInSpace();
        if (astroRes?.totalInSpace) {
          setInSpaceCount(astroRes.totalInSpace);
        }
      } catch (e) {
        // Fallback
      }
    } catch (err) {
      console.error('Failed to load exploration dashboard:', err);
      setError(err?.message || 'Could not load space exploration dashboard feed.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();

    // Load saved bookmarks safely
    const saved = getLocalBookmarks();
    setBookmarks(saved);
  }, []);

  // 1. Loading State
  if (loading && !dashboardData) {
    return (
      <PagePreloader
        title="Loading Exploration Dashboard"
        message="Compiling real-time orbital metrics, upcoming liftoffs, space weather, and news..."
      />
    );
  }
  // 2. Error State with Retry
  if (error && !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-display text-white">
            Exploration Dashboard Unavailable
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">{error}</p>
        </div>
        <button
          onClick={loadDashboard}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs font-mono uppercase tracking-wider transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const summary = dashboardData?.summary;
  const nextScheduledLaunch = dashboardData?.upcomingLaunches?.[0];
  const nextLaunchLabel = nextScheduledLaunch?.name
    ? `Next: ${nextScheduledLaunch.name}`
    : 'View Next Scheduled Launch';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      {/* 1. Dashboard Welcome & Overview */}
      <div className="border-b border-[#263449] pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-sky-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Discovery Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Your Space Exploration Dashboard
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl font-light">
              Discover what's launching, explore active interplanetary missions, and track upcoming celestial observations.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/events"
              className="px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-xs font-mono text-purple-300 border border-purple-500/40 flex items-center space-x-1.5 transition-all shadow-sm"
              title="Open Space Events & Launches Calendar"
            >
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Calendar View</span>
            </Link>
            <Link
              to="/astronauts"
              className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-xs font-mono text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 transition-all shadow-sm"
              title="Open Real-time Astronauts & Crew Manifest"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Astronauts</span>
            </Link>
            <Link
              to="/launches"
              className="px-3.5 py-2 rounded-xl bg-[#111C2E] hover:bg-[#162338] text-xs font-mono text-slate-200 border border-[#263449] flex items-center space-x-1.5 transition-all"
            >
              <Rocket className="w-3.5 h-3.5 text-amber-400" />
              <span>Launches</span>
            </Link>
            <Link
              to="/missions"
              className="px-3.5 py-2 rounded-xl bg-[#111C2E] hover:bg-[#162338] text-xs font-mono text-slate-200 border border-[#263449] flex items-center space-x-1.5 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Missions</span>
            </Link>
            <Link
              to="/news"
              className="px-3.5 py-2 rounded-xl bg-[#111C2E] hover:bg-[#162338] text-xs font-mono text-slate-200 border border-[#263449] flex items-center space-x-1.5 transition-all"
            >
              <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
              <span>News</span>
            </Link>
            <Link
              to="/bookmarks"
              className="px-3.5 py-2 rounded-xl bg-[#111C2E] hover:bg-[#162338] text-xs font-mono text-slate-200 border border-[#263449] flex items-center space-x-1.5 transition-all"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Watchlist</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        <Link
          to="/astronauts"
          className="p-6 rounded-2xl glass-panel border border-emerald-500/30 hover:border-emerald-500/60 transition-all group bg-gradient-to-br from-emerald-950/20 to-transparent"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-emerald-400">Humans in Orbit</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-white group-hover:text-emerald-300 transition-colors">
            {inSpaceCount}
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
            <span>Aboard ISS & Tiangong</span>
            <ArrowRight className="w-3 h-3 shrink-0 group-hover:translate-x-1 transition-transform" />
          </p>
        </Link>

        <Link
          to="/launches"
          className="p-6 rounded-2xl glass-panel border border-[#263449] hover:border-amber-500/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-slate-400">Scheduled Launches</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Rocket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-white group-hover:text-amber-300 transition-colors">
            {summary?.upcomingLaunchesCount ?? dashboardData?.upcomingLaunches?.length ?? 0}
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
            <span className="truncate">{nextLaunchLabel}</span>
            <ArrowRight className="w-3 h-3 shrink-0 group-hover:translate-x-1 transition-transform" />
          </p>
        </Link>

        <Link
          to="/missions?status=active"
          className="p-6 rounded-2xl glass-panel border border-[#263449] hover:border-sky-500/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-slate-400">Active Missions</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-white group-hover:text-sky-300 transition-colors">
            {summary?.activeMissionsCount ?? dashboardData?.activeMissions?.length ?? 0}
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
            <span>Across Mars, Moon & Deep Space</span>
            <ArrowRight className="w-3 h-3 shrink-0 group-hover:translate-x-1 transition-transform" />
          </p>
        </Link>

        <Link
          to="/news"
          className="p-6 rounded-2xl glass-panel border border-[#263449] hover:border-cyan-500/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-slate-400">Recent Discoveries</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
            {summary?.recentUpdatesCount ?? dashboardData?.recentUpdates?.length ?? 0}
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
            <span>Verified Agency Updates</span>
            <ArrowRight className="w-3 h-3 shrink-0 group-hover:translate-x-1 transition-transform" />
          </p>
        </Link>

        <Link
          to="/events"
          className="p-6 rounded-2xl glass-panel border border-purple-500/30 hover:border-purple-500/60 transition-all group bg-gradient-to-br from-purple-950/20 to-transparent"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-purple-300">Calendar Events</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-white group-hover:text-purple-300 transition-colors">
            {summary?.upcomingEventsCount ?? dashboardData?.upcomingEvents?.length ?? 0}
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
            <span>Showers, Eclipses & Conjunctions</span>
            <ArrowRight className="w-3 h-3 shrink-0 group-hover:translate-x-1 transition-transform" />
          </p>
        </Link>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Upcoming Launches & Active Missions */}
        <div className="lg:col-span-8 space-y-10">
          {/* Upcoming Launches Table/Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-white flex items-center space-x-2">
                <Rocket className="w-5 h-5 text-amber-400" />
                <span>Next Scheduled Launches</span>
              </h2>
              <Link to="/launches" className="text-xs font-mono text-sky-400 hover:underline">
                View All Launches →
              </Link>
            </div>

            <div className="space-y-3">
              {dashboardData?.upcomingLaunches && dashboardData.upcomingLaunches.length > 0 ? (
                dashboardData.upcomingLaunches.map((launch) => {
                  const rocketName =
                    launch.rocket?.fullName ||
                    launch.rocket?.name ||
                    (typeof launch.rocket === 'string' ? launch.rocket : 'Orbital Launch Vehicle');
                  const providerName =
                    launch.provider?.name || launch.launchProvider || 'Commercial Launch Provider';
                  const payloadName =
                    launch.mission?.name || launch.payload || 'Orbital Payload Delivery';
                  const launchDate = launch.launchDate || launch.plannedLaunchDate;
                  const dateFormatted = launchDate
                    ? new Date(launchDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Date TBD';
                  const statusStr = (launch.launchStatus || '').toLowerCase();
                  const statusBadgeClass =
                    statusStr === 'go'
                      ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
                      : statusStr === 'tbd'
                      ? 'text-amber-400 bg-amber-500/15 border-amber-500/30'
                      : 'text-sky-400 bg-sky-500/15 border-sky-500/30';
                  const confidence =
                    launch.scheduleConfidence || launch.status?.name || 'Scheduled';

                  return (
                    <div
                      key={launch.id}
                      className="p-4 rounded-xl bg-[#0D1422] border border-[#263449] hover:border-sky-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono text-sky-400 font-semibold truncate max-w-[220px]">
                            {providerName}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs font-mono text-slate-400 truncate max-w-[180px]">
                            {rocketName}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${statusBadgeClass}`}
                          >
                            {confidence}
                          </span>
                        </div>
                        <Link
                          to={`/launches/${launch.slug}`}
                          className="text-sm font-bold text-white hover:text-sky-300 transition-colors block truncate"
                        >
                          {launch.name}
                        </Link>
                        <p className="text-xs text-slate-400 line-clamp-1">{payloadName}</p>
                      </div>

                      <div className="flex items-center space-x-4 shrink-0 sm:text-right">
                        <div>
                          <div className="text-xs font-mono font-bold text-amber-300 flex items-center space-x-1 sm:justify-end">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>{dateFormatted}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[150px]">
                            {launch.location?.name || launch.launchSite || 'Global Launch Facility'}
                          </span>
                        </div>
                        <Link
                          to={`/launches/${launch.slug}`}
                          className="p-2 rounded-lg bg-[#162338] text-slate-300 hover:text-white hover:bg-sky-500 hover:text-slate-950 transition-all"
                          title="View Launch Details"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 rounded-xl bg-[#0D1422] border border-[#263449] text-center text-xs text-slate-400 font-mono">
                  No scheduled launches available right now.
                </div>
              )}
            </div>
          </div>

          {/* Active Missions Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-white flex items-center space-x-2">
                <Compass className="w-5 h-5 text-sky-400" />
                <span>Active Exploration Missions</span>
              </h2>
              <Link to="/missions" className="text-xs font-mono text-sky-400 hover:underline">
                Explore All Missions →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dashboardData?.activeMissions?.slice(0, 4).map((mission) => (
                <Link
                  key={mission.id}
                  to={`/missions/${mission.slug}`}
                  className="p-4 rounded-xl glass-panel border border-[#263449] hover:border-sky-500/40 transition-all flex space-x-4 group"
                >
                  <img
                    src={mission.featuredImage}
                    alt={mission.name}
                    className="w-20 h-20 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-sky-400 uppercase block">
                      {mission.destination}
                    </span>
                    <h3 className="text-sm font-bold font-display text-white group-hover:text-sky-300 transition-colors truncate">
                      {mission.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{mission.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Calendar Widget, Bookmarks, News & Destinations */}
        <div className="lg:col-span-4 space-y-8">
          {/* Calendar View Quick Access Widget */}
          <div className="p-6 rounded-2xl glass-panel border border-purple-500/30 bg-gradient-to-b from-purple-950/25 via-[#0D1422] to-[#0D1422] space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-white">Space Calendar</h3>
                  <p className="text-[10px] font-mono text-purple-300">Observations & Milestones</p>
                </div>
              </div>
              <Link
                to="/events"
                className="text-[11px] font-mono text-purple-400 hover:underline"
              >
                View Full →
              </Link>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Track meteor showers, eclipses, planetary conjunctions, and scheduled rocket liftoffs on the comprehensive space calendar.
            </p>

            <div className="space-y-2">
              {dashboardData?.upcomingEvents?.slice(0, 3).map((evt) => (
                <Link
                  key={evt.id}
                  to={`/events/${evt.slug}`}
                  className="p-2.5 rounded-lg bg-[#070B14] hover:bg-[#162338] border border-[#263449] block group transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
                    <span className="text-purple-400 font-semibold">{evt.eventType}</span>
                    <span className="text-slate-400">
                      {new Date(evt.startTime).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h4 className="text-xs font-medium text-slate-200 group-hover:text-purple-300 transition-colors truncate">
                    {evt.title}
                  </h4>
                </Link>
              ))}
            </div>

            <Link
              to="/events"
              className="w-full py-2.5 px-4 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 hover:text-white font-mono text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md group"
            >
              <Calendar className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>Open Calendar View →</span>
            </Link>
          </div>

          {/* User Watchlist / Bookmarks Panel */}
          <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center space-x-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>Your Watchlist</span>
              </h3>
              <Link to="/bookmarks" className="text-[11px] font-mono text-amber-400 hover:underline">
                {bookmarks.length > 0 ? `All (${bookmarks.length}) →` : 'Open →'}
              </Link>
            </div>

            {bookmarks.length > 0 ? (
              <div className="space-y-2">
                {bookmarks.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    to={item.url}
                    className="p-2.5 rounded-lg bg-[#0D1422] hover:bg-[#162338] border border-[#263449] block group transition-all"
                  >
                    <div className="text-[10px] font-mono text-amber-400 uppercase mb-0.5">
                      {item.itemType}
                    </div>
                    <h4 className="text-xs font-medium text-slate-200 group-hover:text-amber-300 transition-colors truncate">
                      {item.title}
                    </h4>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 space-y-2">
                <p className="text-xs text-slate-400 font-light">
                  No saved items yet. Bookmark missions, launches, or guides to track them here.
                </p>
                <Link
                  to="/missions"
                  className="inline-block text-xs font-mono text-sky-400 hover:underline"
                >
                  Explore Missions to Bookmark →
                </Link>
              </div>
            )}
          </div>

          {/* Latest Discoveries & Updates Feed */}
          <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center space-x-2">
                <Newspaper className="w-4 h-4 text-cyan-400" />
                <span>Latest Space News</span>
              </h3>
              <Link to="/news" className="text-[11px] font-mono text-sky-400 hover:underline">
                More →
              </Link>
            </div>

            <div className="space-y-4">
              {dashboardData?.recentUpdates?.map((news) => (
                <Link
                  key={news.id}
                  to={`/news/${news.slug}`}
                  className="block group space-y-1 pb-3 border-b border-[#263449]/50 last:border-0 last:pb-0"
                >
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>{news.publisher}</span>
                    <span>{new Date(news.publicationDate).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {news.headline}
                  </h4>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Destinations Shortcuts */}
          <div className="p-6 rounded-2xl bg-[#0D1422] border border-[#263449] space-y-4">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center space-x-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Explore Destinations</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Moon', slug: 'moon' },
                { name: 'Mars', slug: 'mars' },
                { name: 'Jupiter', slug: 'jupiter' },
                { name: 'Earth Orbit', slug: 'earth-orbit' },
              ].map((dest) => (
                <Link
                  key={dest.slug}
                  to={`/destinations/${dest.slug}`}
                  className="px-3 py-2 rounded-lg bg-[#111C2E] hover:bg-emerald-500/20 hover:text-emerald-300 border border-[#263449] text-xs font-mono text-slate-300 text-center transition-all"
                >
                  {dest.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicDashboard;
