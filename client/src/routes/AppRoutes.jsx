import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { PublicLayout } from '../components/layout/PublicLayout';

// Public Space Discovery Pages
import { Home } from '../pages/Public/Home';
import { PublicDashboard } from '../pages/Dashboard/PublicDashboard';
import { MissionsDirectory } from '../pages/Missions/MissionsDirectory';
import { MissionDetail } from '../pages/Missions/MissionDetail';
import { AstronautsDirectory } from '../pages/Astronauts/AstronautsDirectory';
import { AstronautDetail } from '../pages/Astronauts/AstronautDetail';
import { LaunchTracker } from '../pages/Launches/LaunchTracker';
import { LaunchDetail } from '../pages/Launches/LaunchDetail';
import { SpacecraftDirectory } from '../pages/Spacecraft/SpacecraftDirectory';
import { SpacecraftDetail } from '../pages/Spacecraft/SpacecraftDetail';
import { DestinationExplorer } from '../pages/Destinations/DestinationExplorer';
import { DestinationDetail } from '../pages/Destinations/DestinationDetail';
import { SpaceEventsCalendar } from '../pages/Events/SpaceEventsCalendar';
import { EventDetail } from '../pages/Events/EventDetail';
import { SpaceNews } from '../pages/News/SpaceNews';
import { NewsDetail } from '../pages/News/NewsDetail';
import { LearnCenter } from '../pages/Learn/LearnCenter';
import { ArticleDetail } from '../pages/Learn/ArticleDetail';
import { SearchResults } from '../pages/Search/SearchResults';
import { BookmarksPage } from '../pages/Bookmarks/BookmarksPage';
import { SourcesPage } from '../pages/Sources/SourcesPage';
import { About } from '../pages/Public/About';
import { Contact } from '../pages/Public/Contact';
import { SatelliteTrackingPage } from '../pages/Satellites/SatelliteTrackingPage';

// Auth & Protected Account Pages
import { Login } from '../pages/Auth/Login';
import { Register } from '../pages/Auth/Register';
import { ForgotPassword } from '../pages/Auth/ForgotPassword';
import { ResetPassword } from '../pages/Auth/ResetPassword';
import { UserProfile } from '../pages/Account/UserProfile';
import { UserSettings } from '../pages/Account/UserSettings';
import { MyFavorites } from '../pages/Account/MyFavorites';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// 404
import { NotFound } from '../pages/NotFound/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Space Exploration Routes wrapped in Unified PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<PublicDashboard />} />

        {/* Missions */}
        <Route path="/missions" element={<MissionsDirectory />} />
        <Route path="/missions/:slug" element={<MissionDetail />} />

        {/* Astronauts & Human Spaceflight */}
        <Route path="/astronauts" element={<AstronautsDirectory />} />
        <Route path="/astronauts/:id" element={<AstronautDetail />} />

        {/* Launches */}
        <Route path="/launches" element={<LaunchTracker />} />
        <Route path="/launches/:slug" element={<LaunchDetail />} />

        {/* Real-time 3D Earth & Satellite Tracking */}
        <Route path="/satellites" element={<SatelliteTrackingPage />} />
        <Route path="/satellite-tracking" element={<Navigate to="/satellites" replace />} />
        <Route path="/satellite-intelligence" element={<SatelliteTrackingPage />} />

        {/* Spacecraft */}
        <Route path="/spacecraft" element={<SpacecraftDirectory />} />
        <Route path="/spacecraft/:slug" element={<SpacecraftDetail />} />

        {/* Destinations */}
        <Route path="/destinations" element={<DestinationExplorer />} />
        <Route path="/destinations/:slug" element={<DestinationDetail />} />

        {/* Space Events */}
        <Route path="/events" element={<SpaceEventsCalendar />} />
        <Route path="/events/:slug" element={<EventDetail />} />

        {/* Space News */}
        <Route path="/news" element={<SpaceNews />} />
        <Route path="/news/:slug" element={<NewsDetail />} />

        {/* Educational Learning Center */}
        <Route path="/learn" element={<LearnCenter />} />
        <Route path="/learn/:slug" element={<ArticleDetail />} />

        {/* Search */}
        <Route path="/search" element={<SearchResults />} />
        <Route path="/sources" element={<SourcesPage />} />

        {/* Bookmarks & Favorites */}
        <Route path="/bookmarks" element={<Navigate to="/favorites" replace />} />
        <Route path="/saved-missions" element={<Navigate to="/favorites?filter=mission" replace />} />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <MyFavorites />
            </ProtectedRoute>
          }
        />

        {/* Protected Personal Account Dossiers */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <UserSettings />
            </ProtectedRoute>
          }
        />

        {/* Aliases for /app/* routes */}
        <Route path="/app/profile" element={<Navigate to="/profile" replace />} />
        <Route path="/app/settings" element={<Navigate to="/settings" replace />} />
        <Route path="/app/favorites" element={<Navigate to="/favorites" replace />} />
        <Route path="/app/bookmarks" element={<Navigate to="/favorites" replace />} />
        <Route path="/app/saved-missions" element={<Navigate to="/favorites?filter=mission" replace />} />

        {/* About & Contact */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<SourcesPage />} />
        <Route path="/terms" element={<SourcesPage />} />

        {/* Repurpose Old Routes into Public Exploration Redirects */}
        <Route path="/platform" element={<Navigate to="/dashboard" replace />} />
        <Route path="/capabilities" element={<Navigate to="/learn" replace />} />
        <Route path="/solutions" element={<Navigate to="/destinations" replace />} />
        <Route path="/mission-operations" element={<Navigate to="/missions" replace />} />
        <Route path="/analytics" element={<Navigate to="/dashboard" replace />} />
        <Route path="/docs" element={<Navigate to="/learn" replace />} />
        <Route path="/app/*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* 2. Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 3. Fallback Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
