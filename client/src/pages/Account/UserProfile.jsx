import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  Building,
  Bookmark,
  Shield,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Camera,
  Sparkles,
  Rocket
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { favoritesService } from '../../services/supabase/favoritesService';

export function UserProfile() {
  const { user, profile, updateProfile, isConfigured } = useAuth();
  const [editing, setEditing] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync profile data into form state
  useEffect(() => {
    if (profile || user) {
      setDisplayName(profile?.display_name || user?.user_metadata?.display_name || user?.name || '');
      setUsername(profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || '');
      setAffiliation(profile?.affiliation || user?.user_metadata?.affiliation || user?.organization || 'Space Explorer');
      setAvatarUrl(profile?.avatar_url || user?.user_metadata?.avatar_url || '');
    }
  }, [profile, user]);

  // Load count of user favorites
  useEffect(() => {
    async function loadStats() {
      if (user?.id) {
        setLoadingFavorites(true);
        const { data } = await favoritesService.getFavorites(user.id);
        setFavoritesCount(data?.length || 0);
        setLoadingFavorites(false);
      }
    }
    loadStats();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSaving(true);

    try {
      await updateProfile({
        display_name: displayName,
        username,
        affiliation,
        avatar_url: avatarUrl,
      });
      setSuccessMsg('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const accountCreatedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent Explorer';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#263449] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SPACE EXPLORER PROFILE</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Account Dossier
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Manage your personal profile, credentials, and space exploration achievements.
          </p>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#111C2E] hover:bg-[#162338] border border-[#263449] text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Avatar & Overview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-[#263449] text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 p-0.5 shadow-2xl mx-auto glow-cyan">
                <div className="w-full h-full rounded-3xl bg-[#0D1422] flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <User className="w-10 h-10 text-sky-400" />
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#070B14] flex items-center justify-center" title="Active Explorer">
                <Shield className="w-3.5 h-3.5 text-slate-950" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display font-bold text-white">
                {displayName || 'Space Explorer'}
              </h2>
              <p className="text-xs font-mono text-sky-400 mt-0.5">
                @{username || 'explorer'}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-2 bg-[#111C2E] py-1 px-2.5 rounded-lg border border-[#263449] inline-block">
                {affiliation || 'Space Science Enthusiast'}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 border-t border-[#263449] grid grid-cols-2 gap-3 text-center">
              <Link to="/favorites" className="p-3 rounded-2xl bg-[#111C2E] hover:bg-[#162338] border border-[#263449] transition-colors">
                <div className="text-lg font-display font-bold text-sky-400">
                  {loadingFavorites ? '...' : favoritesCount}
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Favorites</div>
              </Link>
              <Link to="/settings" className="p-3 rounded-2xl bg-[#111C2E] hover:bg-[#162338] border border-[#263449] transition-colors">
                <div className="text-lg font-display font-bold text-indigo-400">Active</div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Status</div>
              </Link>
            </div>
          </div>

          {/* Account Metadata Card */}
          <div className="glass-panel rounded-3xl p-5 border border-[#263449] space-y-3 font-mono text-xs">
            <div className="flex items-center space-x-2.5 text-slate-400">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Joined: {accountCreatedDate}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-400 truncate">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Provider: {user?.app_metadata?.provider || 'Email / Supabase'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Details or Read-Only Dossier */}
        <div className="lg:col-span-8">
          {editing ? (
            <form onSubmit={handleSave} className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#263449] space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#263449]">
                <h3 className="text-base font-display font-bold text-white">Edit Profile Details</h3>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111C2E]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Display Name *</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Affiliation / Bio / Community Title</label>
                <input
                  type="text"
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  placeholder="e.g. Lead Astronomy Curator / High School Science Club"
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Avatar Image URL (Optional)</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                />
                <p className="text-[10px] text-slate-500 font-mono mt-1">Direct URL to an avatar image (JPG, PNG, WebP).</p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#263449]">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#111C2E] hover:bg-[#162338] text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#263449] space-y-6">
              <h3 className="text-base font-display font-bold text-white border-b border-[#263449] pb-3">
                Space Explorer Profile Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Full Name</span>
                  <p className="text-white text-sm font-medium">{displayName || 'Not specified'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Username</span>
                  <p className="text-sky-400 text-sm">@{username || 'explorer'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Verified Email</span>
                  <p className="text-white text-sm">{user?.email}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Affiliation</span>
                  <p className="text-white text-sm">{affiliation || 'Space Enthusiast'}</p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Account ID (UUID)</span>
                  <p className="text-slate-400 text-[11px] font-mono break-all">{user?.id}</p>
                </div>
              </div>

              {/* Action Buttons to Settings / Favorites */}
              <div className="pt-6 border-t border-[#263449] flex flex-wrap gap-3">
                <Link
                  to="/favorites"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 hover:bg-sky-500/25 transition-colors text-xs font-mono"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>View Saved Favorites</span>
                </Link>
                <Link
                  to="/settings"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#111C2E] border border-[#263449] text-slate-300 hover:text-white transition-colors text-xs font-mono"
                >
                  <span>Account Settings</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
