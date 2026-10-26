import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from '../../services/api/client';
import { useAuth } from '../../context/AuthContext';
import { favoritesService } from '../../services/supabase/favoritesService';
import { CesiumGlobe } from '../../components/orbital/CesiumGlobe';
import { SatelliteSearchFilter } from '../../components/orbital/SatelliteSearchFilter';
import { SatelliteDetailPanel } from '../../components/orbital/SatelliteDetailPanel';
import { TimeControls } from '../../components/orbital/TimeControls';
import { GlobeStatusBar } from '../../components/orbital/GlobeStatusBar';
import {
  Satellite,
  Compass,
  Layers,
  ChevronLeft,
  ChevronRight,
  Menu,
  Sparkles,
  AlertCircle,
  Radio,
} from 'lucide-react';

export function SatelliteTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  // Primary State
  const [satellites, setSatellites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusInfo, setStatusInfo] = useState({
    source: 'CelesTrak GP API',
    lastUpdated: null,
    quality: 'nominal',
  });

  // Visual & Interaction States
  const [showOrbitTrajectory, setShowOrbitTrajectory] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Favorites (local storage + user profile)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('spaceops_favorite_satellites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Simulation Clock
  const [simulationTime, setSimulationTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isLive, setIsLive] = useState(true);

  const simulationTimeRef = useRef(new Date());
  const isPlayingRef = useRef(true);
  const speedMultiplierRef = useRef(1);
  const isLiveRef = useRef(true);

  useEffect(() => {
    simulationTimeRef.current = simulationTime;
  }, [simulationTime]);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier;
  }, [speedMultiplier]);
  useEffect(() => {
    isLiveRef.current = isLive;
  }, [isLive]);

  // Clock animation tick
  useEffect(() => {
    let animId;
    let lastTick = performance.now();

    const loop = (now) => {
      animId = requestAnimationFrame(loop);
      const deltaMs = now - lastTick;
      lastTick = now;

      if (isPlayingRef.current) {
        if (isLiveRef.current && speedMultiplierRef.current === 1) {
          const currentRealDate = new Date();
          simulationTimeRef.current = currentRealDate;
          setSimulationTime(currentRealDate);
        } else {
          const advancedMs = deltaMs * speedMultiplierRef.current;
          const newDate = new Date(simulationTimeRef.current.getTime() + advancedMs);
          simulationTimeRef.current = newDate;
          setSimulationTime(newDate);
        }
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 1. Fetch satellite catalog and categories
  const fetchData = async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshing(true);
    else setLoading(true);

    try {
      const [satRes, catRes, statusRes] = await Promise.all([
        apiClient.getSatellites(forceRefresh ? { refresh: 'true' } : {}),
        apiClient.getSatelliteCategories(),
        apiClient.getSatellitesStatus(),
      ]);

      const loadedSats = satRes?.data?.satellites || [];
      setSatellites(loadedSats);
      setCategories(catRes?.data || []);
      setStatusInfo({
        source: satRes?.data?.source || 'CelesTrak GP API',
        lastUpdated: satRes?.data?.lastUpdated || new Date().toISOString(),
        quality: satRes?.data?.dataQualityStatus || 'nominal',
      });

      // Handle initial deep-linked NORAD ID from query param
      const targetNorad = searchParams.get('noradId');
      if (targetNorad) {
        const found = loadedSats.find((s) => s.noradId.toString() === targetNorad);
        if (found) {
          setSelectedSatellite(found);
        }
      } else if (!selectedSatellite && loadedSats.length > 0) {
        // Default select ISS if present, otherwise first satellite
        const iss = loadedSats.find((s) => s.noradId === 25544) || loadedSats[0];
        setSelectedSatellite(iss);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load satellites:', err);
      setError('Unable to load live satellite catalog. Falling back to cached orbital elements.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update URL params when selection or filters change
  const handleSelectSatellite = useCallback(
    (sat) => {
      setSelectedSatellite(sat);
      if (sat) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set('noradId', sat.noradId.toString());
          return next;
        });
      }
    },
    [setSearchParams]
  );

  const handleSelectCategory = useCallback(
    (catId) => {
      setSelectedCategory(catId);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (catId === 'all') next.delete('category');
        else next.set('category', catId);
        return next;
      });
    },
    [setSearchParams]
  );

  // Toggle Favorite
  const handleToggleFavorite = async () => {
    if (!selectedSatellite) return;
    const noradId = selectedSatellite.noradId;
    const isCurrentlyFav = favorites.includes(noradId);
    let nextFavs;

    if (isCurrentlyFav) {
      nextFavs = favorites.filter((id) => id !== noradId);
      if (user?.id) {
        await favoritesService.removeFavorite(user.id, 'satellite', noradId.toString());
      }
    } else {
      nextFavs = [...favorites, noradId];
      if (user?.id) {
        await favoritesService.addFavorite(
          user.id,
          'satellite',
          noradId.toString(),
          selectedSatellite.name,
          {
            noradId,
            category: selectedSatellite.category,
            url: `/satellites?noradId=${noradId}`,
          }
        );
      }
    }
    setFavorites(nextFavs);
    try {
      localStorage.setItem('spaceops_favorite_satellites', JSON.stringify(nextFavs));
    } catch (e) {
      // Ignore
    }
  };

  // Step simulation time
  const handleStepTime = (deltaMs) => {
    setIsLive(false);
    const newDate = new Date(simulationTimeRef.current.getTime() + deltaMs);
    simulationTimeRef.current = newDate;
    setSimulationTime(newDate);
  };

  const handleResetToNow = () => {
    setIsLive(true);
    setSpeedMultiplier(1);
    const now = new Date();
    simulationTimeRef.current = now;
    setSimulationTime(now);
  };

  // Visible satellites count (after category and search filtering)
  const visibleCount = satellites.filter((sat) => {
    const matchesCategory =
      selectedCategory === 'all' || sat.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      sat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sat.noradId.toString().includes(searchQuery);
    return matchesCategory && matchesSearch;
  }).length;

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-4.5rem)] flex flex-col bg-[#070B14] overflow-hidden">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#070B14]/85 backdrop-blur-md">
          <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-[#0D1422] border border-[#263449] shadow-2xl">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
              <Satellite className="w-5 h-5 text-sky-400 absolute inset-0 m-auto" />
            </div>
            <div className="text-center font-mono space-y-1">
              <span className="text-sm font-bold text-white tracking-wider block">
                INITIALIZING 3D ORBITAL ENGINE
              </span>
              <span className="text-xs text-slate-400">
                Fetching CelesTrak TLE catalog & propagating SGP4 orbits...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Sidebar (Search & Categories) */}
        <div
          className={`transition-all duration-300 ease-in-out z-20 ${
            sidebarOpen
              ? 'translate-x-0 relative'
              : '-translate-x-full absolute left-0 top-0 bottom-0 pointer-events-none'
          }`}
        >
          <SatelliteSearchFilter
            satellites={satellites}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSatellite={selectedSatellite}
            onSelectSatellite={handleSelectSatellite}
          />
        </div>

        {/* Sidebar Toggle Handle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 z-30 p-2 rounded-xl bg-[#0D1422]/90 border border-[#263449] text-slate-300 hover:text-white hover:bg-[#162338] backdrop-blur-md shadow-xl transition-all cursor-pointer"
          style={{ left: sidebarOpen ? 'calc(20rem + 1rem)' : '1rem' }}
          title={sidebarOpen ? 'Collapse Satellite Registry' : 'Open Satellite Registry'}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Center: 3D Earth Globe with CesiumJS */}
        <div className="relative flex-1 h-full w-full overflow-hidden">
          <CesiumGlobe
            satellites={satellites}
            selectedSatellite={selectedSatellite}
            onSelectSatellite={handleSelectSatellite}
            showOrbitTrajectory={showOrbitTrajectory}
            isFollowing={isFollowing}
            onToggleFollow={() => setIsFollowing(!isFollowing)}
            simulationTime={simulationTime}
            isPlaying={isPlaying}
            speedMultiplier={speedMultiplier}
          />

          {/* Floating Time Controls Bar at bottom center */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
            <TimeControls
              simulationTime={simulationTime}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              speedMultiplier={speedMultiplier}
              onChangeSpeed={(s) => {
                setSpeedMultiplier(s);
                if (s !== 1) setIsLive(false);
              }}
              onResetToNow={handleResetToNow}
              onStepTime={handleStepTime}
              isLive={isLive}
            />
          </div>

          {/* Selected Satellite Details Floating Dossier */}
          {selectedSatellite && (
            <SatelliteDetailPanel
              satellite={selectedSatellite}
              onClose={() => setSelectedSatellite(null)}
              isFollowing={isFollowing}
              onToggleFollow={() => setIsFollowing(!isFollowing)}
              showOrbitTrajectory={showOrbitTrajectory}
              onToggleOrbit={() => setShowOrbitTrajectory(!showOrbitTrajectory)}
              simulationTime={simulationTime}
              isFavorite={favorites.includes(selectedSatellite.noradId)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </div>
      </div>

      {/* Bottom Telemetry Status Bar */}
      <GlobeStatusBar
        totalSatellites={satellites.length}
        visibleSatellites={visibleCount}
        dataSource={statusInfo.source}
        lastRefreshTime={statusInfo.lastUpdated}
        dataQualityStatus={statusInfo.quality}
        onManualRefresh={() => fetchData(true)}
        isRefreshing={isRefreshing}
      />
    </div>
  );
}

export default SatelliteTrackingPage;
