import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket,
  Compass,
  Satellite,
  Globe,
  Calendar,
  Newspaper,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
  Eye,
  CheckCircle2,
  Info,
  Users
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { OrbitalGlobe } from '../../components/orbital/OrbitalGlobe';
import { PagePreloader } from '../../components/common/PagePreloader';

export function Home() {
  const [homeData, setHomeData] = useState(null);
  const [astronautsInSpace, setAstronautsInSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    async function fetchHome() {
      try {
        const res = await apiClient.getHomeFeed();
        setHomeData(res.data);

        try {
          const astroRes = await apiClient.getAstronautsInSpace();
          if (astroRes?.success) {
            setAstronautsInSpace(astroRes);
          }
        } catch (e) {
          // Non-fatal
        }
      } catch (err) {
        console.error('Failed to load homepage feed:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHome();
  }, []);

  // Live countdown timer calculation for upcoming launches
  useEffect(() => {
    if (!homeData?.upcomingLaunches) return;

    const interval = setInterval(() => {
      const updated = {};
      const now = new Date().getTime();

      homeData.upcomingLaunches.forEach((launch) => {
        const target = new Date(launch.plannedLaunchDate).getTime();
        const diff = target - now;

        if (diff <= 0) {
          updated[launch.id] = { expired: true, text: 'T-00:00:00 (Launched / In Flight)' };
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          updated[launch.id] = {
            expired: false,
            days,
            hours,
            minutes,
            seconds,
            formatted: `T-${days > 0 ? `${days}d ` : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          };
        }
      });
      setTimeRemaining(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [homeData]);

  if (loading && !homeData) {
    return (
      <PagePreloader
        title="Initializing SpaceOps Gateway"
        message="Retrieving upcoming rocket launches, active missions, and celestial watch..."
      />
    );
  }

  const featured = homeData?.featuredMission;

  return (
    <div className="space-y-24 pb-20 overflow-hidden animate-fade-in">
      {/* 6.2 HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-[#263449]/60">
        {/* Ambient Cosmic Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-300">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Your Window into Space Exploration</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-tight">
                Humanity's Journey Into Space,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-sky-200 to-indigo-300">
                  All in One Place.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Explore active missions, follow upcoming rocket launches, discover spacecraft, and stay connected with humanity's exploration of the universe.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/missions"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-xl glow-cyan flex items-center justify-center space-x-2"
                >
                  <Compass className="w-4 h-4 text-slate-950" />
                  <span>Explore Space Missions</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>

                <Link
                  to="/launches"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#111C2E] hover:bg-[#162338] text-slate-200 hover:text-white border border-[#263449] font-medium text-sm transition-all flex items-center justify-center space-x-2"
                >
                  <Rocket className="w-4 h-4 text-sky-400" />
                  <span>Upcoming Launches</span>
                </Link>
              </div>

              {/* Quick Discovery Chips */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-mono text-slate-400">
                <span className="text-slate-500">Popular:</span>
                <Link to="/missions/europa-clipper" className="hover:text-sky-400 underline decoration-slate-700">Europa Clipper</Link>
                <span>•</span>
                <Link to="/missions/mars-perseverance-rover" className="hover:text-sky-400 underline decoration-slate-700">Perseverance Rover</Link>
                <span>•</span>
                <Link to="/spacecraft/jwst-observatory" className="hover:text-sky-400 underline decoration-slate-700">James Webb Telescope</Link>
                <span>•</span>
                <Link to="/events" className="hover:text-sky-400 underline decoration-slate-700">Meteor Showers</Link>
              </div>
            </div>

            {/* Right Visual: Interactive 3D Educational Spacecraft Tracker */}
            <div className="lg:col-span-5 relative">
              <div className="w-full aspect-square max-w-[480px] mx-auto rounded-3xl overflow-hidden glass-panel border border-sky-500/20 shadow-2xl relative group">
                <OrbitalGlobe />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#0D1422]/90 backdrop-blur-md border border-[#263449] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-slate-300 font-mono">Live 3D Earth & Satellite Tracking</span>
                  </div>
                  <Link to="/satellites" className="text-sky-400 hover:underline flex items-center space-x-1 font-semibold">
                    <span>Launch 3D Orbit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6.3 UPCOMING LAUNCHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
              <Rocket className="w-4 h-4" />
              <span>Rocket Liftoff Countdown</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Upcoming Rocket Launches
            </h2>
          </div>
          <Link
            to="/launches"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-sky-400 hover:text-sky-300 uppercase tracking-wider"
          >
            <span>All Upcoming Launches</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Launches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeData?.upcomingLaunches?.map((launch) => {
            const timer = timeRemaining[launch.id];
            return (
              <div
                key={launch.id}
                className="glass-panel rounded-2xl p-6 border border-[#263449] hover:border-sky-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-[#162338] text-[11px] font-mono text-sky-300 border border-[#263449]">
                      {launch.launchProvider}
                    </span>
                    <span
                      className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        launch.launchStatus === 'go'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {launch.scheduleConfidence || launch.launchStatus}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-white group-hover:text-sky-300 transition-colors mb-2">
                    {launch.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {launch.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300 mb-6 font-mono">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Rocket className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{launch.rocket?.fullName || launch.rocket?.name || (typeof launch.rocket === 'string' ? launch.rocket : 'Orbital Launch Vehicle')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{launch.launchSite}</span>
                    </div>
                  </div>
                </div>

                {/* Countdown & CTA */}
                <div className="pt-4 border-t border-[#263449]/70 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {timer?.formatted || new Date(launch.plannedLaunchDate).toLocaleDateString()}
                    </span>
                  </div>
                  <Link
                    to={`/launches/${launch.slug}`}
                    className="p-2 rounded-lg bg-[#162338] hover:bg-sky-500 hover:text-slate-950 text-slate-300 transition-colors"
                    title="View Launch Details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6.6 FEATURED MISSION SPOTLIGHT */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-sky-500/30 glass-panel shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-mono text-sky-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Space Exploration Mission</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
                  {featured.name}
                </h2>

                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  {featured.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3 rounded-xl bg-[#0D1422] border border-[#263449]">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Destination</span>
                    <span className="text-sm font-semibold text-white">{featured.destination}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D1422] border border-[#263449]">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Organization</span>
                    <span className="text-sm font-semibold text-white">{featured.organization}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D1422] border border-[#263449]">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Status</span>
                    <span className="text-sm font-semibold text-emerald-400 uppercase">{featured.status}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    to={`/missions/${featured.slug}`}
                    className="px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono transition-all shadow-lg glow-cyan flex items-center space-x-2"
                  >
                    <span>Full Mission Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {featured.officialWebsite && (
                    <a
                      href={featured.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-xl bg-[#111C2E] hover:bg-[#162338] text-slate-300 hover:text-white border border-[#263449] text-xs font-mono flex items-center space-x-1.5"
                    >
                      <span>Official NASA Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 h-full min-h-[300px] lg:min-h-[450px] relative">
                <img
                  src={featured.featuredImage}
                  alt={featured.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#111C2E] via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6.4 ACTIVE MISSIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Solar System Exploration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Active Space Missions
            </h2>
          </div>
          <Link
            to="/missions"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-sky-400 hover:text-sky-300 uppercase tracking-wider"
          >
            <span>All Space Missions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {homeData?.activeMissions?.map((mission) => (
            <Link
              key={mission.id}
              to={`/missions/${mission.slug}`}
              className="glass-panel rounded-2xl overflow-hidden border border-[#263449] hover:border-sky-500/40 transition-all flex flex-col group"
            >
              <div className="h-44 relative overflow-hidden">
                <img
                  src={mission.featuredImage}
                  alt={mission.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-emerald-400 uppercase">
                  {mission.status}
                </div>
                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 text-[11px] font-mono text-sky-300 border border-slate-800">
                  {mission.destination}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] font-mono text-slate-400 mb-1">
                    {mission.organization} • Launched {new Date(mission.launchDate).getFullYear()}
                  </div>
                  <h3 className="text-base font-bold font-display text-white group-hover:text-sky-300 transition-colors">
                    {mission.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                    {mission.summary}
                  </p>
                </div>

                <div className="flex items-center text-xs font-mono text-sky-400 pt-2 group-hover:translate-x-1 transition-transform">
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6.5 HUMANS IN SPACE & ACTIVE ORBITAL CREW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl glass-panel border border-[#263449] bg-gradient-to-r from-[#070B14] via-[#0E1726] to-[#070B14] space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <Users className="w-4 h-4" />
                <span>Live Orbital Habitation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Humans in Space Right Now
              </h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Real-time manifest of expedition crews currently conducting microgravity science aboard the International Space Station and Tiangong Space Station.
              </p>
            </div>
            <Link
              to="/astronauts"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg flex items-center space-x-2 self-start sm:self-auto shrink-0"
            >
              <span>Explore All Astronauts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
            {(astronautsInSpace?.astronauts || []).slice(0, 6).map((c) => (
              <Link
                key={c.id || c.name}
                to={`/astronauts/${c.slug || c.id}`}
                className="group p-3 rounded-2xl bg-[#090E17]/80 hover:bg-[#111C2E] border border-[#1E293B] hover:border-emerald-500/40 transition-all flex flex-col items-center text-center space-y-2.5 shadow-md"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-400/40 group-hover:scale-105 transition-transform bg-[#070B14]">
                  <img
                    src={c.thumbnail || c.image || 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=200&q=80'}
                    alt={c.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {c.name}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                    {c.agency?.abbrev || 'ISS'} • {c.station || 'Orbit'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6.7 EXPLORE BY DESTINATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4" />
              <span>Cosmic Geography</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Explore by Destination
            </h2>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-sky-400 hover:text-sky-300 uppercase tracking-wider"
          >
            <span>All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeData?.destinations?.map((dest) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.slug}`}
              className="relative rounded-2xl overflow-hidden glass-panel border border-[#263449] hover:border-sky-500/50 group transition-all h-64 flex flex-col justify-end p-6"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 group-hover:opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/70 to-transparent"></div>

              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-mono text-sky-400 uppercase tracking-wider">
                  {dest.type}
                </span>
                <h3 className="text-xl font-bold font-display text-white group-hover:text-sky-300 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {dest.tagline}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800">
                  <span>{dest.missionsCount} Active Missions</span>
                  <span className="text-sky-400 group-hover:translate-x-1 transition-transform">Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6.8 SPACE EVENTS & ASTRONOMICAL PHENOMENA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Celestial Watch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Upcoming Space & Astronomical Events
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-sky-400 hover:text-sky-300 uppercase tracking-wider"
          >
            <span>Full Space Calendar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {homeData?.upcomingEvents?.map((evt) => (
            <Link
              key={evt.id}
              to={`/events/${evt.slug}`}
              className="glass-panel rounded-2xl p-6 border border-[#263449] hover:border-purple-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-mono text-purple-300">
                    {evt.eventType}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(evt.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display text-white group-hover:text-purple-300 transition-colors">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-[#263449]/70 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="truncate max-w-[280px]">Visibility: {evt.locationOrVisibility}</span>
                <span className="text-purple-400 group-hover:translate-x-1 transition-transform shrink-0">Details →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6.5 LATEST SPACE NEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              <Newspaper className="w-4 h-4" />
              <span>Scientific Reporting</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Latest Space News & Discoveries
            </h2>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-sky-400 hover:text-sky-300 uppercase tracking-wider"
          >
            <span>All News Updates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homeData?.latestNews?.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.slug}`}
              className="glass-panel rounded-2xl overflow-hidden border border-[#263449] hover:border-cyan-500/40 transition-all flex flex-col group"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] font-mono text-cyan-300 border border-slate-700">
                  {item.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] font-mono text-slate-400 mb-2">
                    {item.publisher} • {new Date(item.publicationDate).toLocaleDateString()}
                  </div>
                  <h3 className="text-base font-bold font-display text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {item.headline}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="flex items-center text-xs font-mono text-cyan-400 pt-2 group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6.9 EDUCATIONAL DISCOVERY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 border border-[#263449] bg-gradient-to-b from-[#111C2E] to-[#070B14]">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-sky-400 block mb-2">
              For Students, Enthusiasts & Curious Minds
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-4">
              Understand the Universe, One Mission at a Time.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore accessible, scientifically accurate educational guides explaining how rockets reach orbital velocity, how rovers drill on Mars, and how space telescopes see into cosmic dawn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeData?.educationalArticles?.map((art) => (
              <Link
                key={art.id}
                to={`/learn/${art.slug}`}
                className="p-6 rounded-2xl bg-[#0D1422] border border-[#263449] hover:border-sky-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                    <span className="text-sky-400">{art.category}</span>
                    <span>{art.readingTime}</span>
                  </div>
                  <h3 className="text-base font-bold font-display text-white group-hover:text-sky-300 transition-colors mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#263449] flex items-center text-xs font-mono text-sky-400">
                  <span>Explore Guide</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/learn"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono uppercase tracking-wider font-semibold transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Visit Educational Learning Center</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6.10 SPACE AGENCIES & ORGANIZATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
            Global Space Exploration Community
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Space Agencies & Organizations
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {homeData?.organizations?.map((org) => (
            <div
              key={org.id}
              className="p-5 rounded-2xl glass-panel border border-[#263449] text-center hover:border-sky-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-lg font-bold font-display text-white block mb-1">
                  {org.shortName}
                </span>
                <span className="text-[10px] font-mono text-sky-400 uppercase block mb-2">
                  {org.country}
                </span>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {org.description}
                </p>
              </div>
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 pt-3 border-t border-[#263449] text-[11px] font-mono text-slate-400 hover:text-sky-300 flex items-center justify-center space-x-1"
              >
                <span>Official Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 6.11 FINAL DISCOVERY CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-10 sm:p-16 border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-950 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              There's Always Something Happening in Space.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed font-light">
              Discover the missions, scientific discoveries, and celestial events shaping humanity's future beyond Earth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/missions"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-xl glow-cyan flex items-center justify-center space-x-2"
              >
                <Compass className="w-4 h-4 text-slate-950" />
                <span>Explore Space Missions</span>
              </Link>
              <Link
                to="/events"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#111C2E] hover:bg-[#162338] text-slate-200 hover:text-white border border-[#263449] font-medium text-sm transition-all flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>View Space Calendar</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
