import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Lock,
  LogOut,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function UserSettings() {
  const { user, profile, preferences, updatePreferences, resetPassword, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('preferences');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Preference fields
  const [theme, setTheme] = useState('dark');
  const [timezone, setTimezone] = useState('UTC');
  const [launchAlerts, setLaunchAlerts] = useState(true);
  const [eventAlerts, setEventAlerts] = useState(true);
  const [missionMilestones, setMissionMilestones] = useState(false);
  const [showCountdowns, setShowCountdowns] = useState(true);
  const [showOrbitalGlobe, setShowOrbitalGlobe] = useState(true);

  // Security fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Load preferences from context
  useEffect(() => {
    if (preferences) {
      setTheme(preferences.theme || 'dark');
      setTimezone(preferences.timezone || 'UTC');
      if (preferences.notification_preferences) {
        setLaunchAlerts(Boolean(preferences.notification_preferences.launchAlerts));
        setEventAlerts(Boolean(preferences.notification_preferences.eventAlerts));
        setMissionMilestones(Boolean(preferences.notification_preferences.missionMilestones));
      }
      if (preferences.dashboard_preferences) {
        setShowCountdowns(preferences.dashboard_preferences.showCountdowns !== false);
        setShowOrbitalGlobe(preferences.dashboard_preferences.showOrbitalGlobe !== false);
      }
    }
  }, [preferences]);

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSaving(true);

    try {
      await updatePreferences({
        theme,
        timezone,
        notification_preferences: {
          launchAlerts,
          eventAlerts,
          missionMilestones,
        },
        dashboard_preferences: {
          showCountdowns,
          showOrbitalGlobe,
          favoriteDestinations: preferences?.dashboard_preferences?.favoriteDestinations || ['Mars', 'Moon'],
        },
      });

      setSuccessMsg('Your preferences have been saved to Supabase.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('New password must contain at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setUpdatingPassword(true);
    try {
      await resetPassword(newPassword);
      setPasswordSuccess('Password updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setErrorMsg('Please type DELETE to confirm account removal.');
      return;
    }

    setDeleting(true);
    try {
      await deleteAccount();
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete account.');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[#263449] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Configure exploration alerts, themes, timezones, and account security.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-mono transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
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

      {/* Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-mono transition-all text-left ${
              activeTab === 'preferences'
                ? 'bg-sky-500/15 border border-sky-500/30 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-[#111C2E]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Theme & Display</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-mono transition-all text-left ${
              activeTab === 'notifications'
                ? 'bg-sky-500/15 border border-sky-500/30 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-[#111C2E]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-mono transition-all text-left ${
              activeTab === 'security'
                ? 'bg-sky-500/15 border border-sky-500/30 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-[#111C2E]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Account Security</span>
          </button>

          <button
            onClick={() => setActiveTab('danger')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-mono transition-all text-left ${
              activeTab === 'danger'
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400 font-semibold'
                : 'text-slate-400 hover:text-rose-400 hover:bg-[#111C2E]'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9">
          {activeTab === 'preferences' && (
            <form onSubmit={handleSavePreferences} className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#263449] space-y-6">
              <h3 className="text-base font-display font-bold text-white border-b border-[#263449] pb-3">
                Display & Timezone Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Theme Palette</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                  >
                    <option value="dark">Deep Cosmic Dark (Default)</option>
                    <option value="midnight">Midnight Nebula</option>
                    <option value="obsidian">Obsidian Black</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Timezone Format</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                  >
                    <option value="UTC">UTC (Universal Time Coordinated)</option>
                    <option value="America/New_York">Eastern Time (US / EST)</option>
                    <option value="America/Los_Angeles">Pacific Time (US / PST)</option>
                    <option value="Europe/London">London (GMT / BST)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Asia/Kolkata">India (IST)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#263449]">
                <h4 className="text-xs font-mono uppercase text-sky-400 font-semibold tracking-wider">
                  Dashboard Discovery Layout
                </h4>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCountdowns}
                    onChange={(e) => setShowCountdowns(e.target.checked)}
                    className="rounded border-[#263449] bg-[#111C2E] text-sky-400 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs text-white block">Next Launch Countdown Widget</span>
                    <span className="text-[11px] text-slate-400 block font-light">Show high-precision T-minus launch clock on homepage</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOrbitalGlobe}
                    onChange={(e) => setShowOrbitalGlobe(e.target.checked)}
                    className="rounded border-[#263449] bg-[#111C2E] text-sky-400 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs text-white block">3D Interactive Celestial Globe</span>
                    <span className="text-[11px] text-slate-400 block font-light">Render Three.js orbital globe in active spacecraft view</span>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-[#263449] flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleSavePreferences} className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#263449] space-y-6">
              <h3 className="text-base font-display font-bold text-white border-b border-[#263449] pb-3">
                Exploration Notification Subscriptions
              </h3>

              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-2xl bg-[#111C2E]/60 border border-[#263449] hover:bg-[#111C2E] transition-colors">
                  <input
                    type="checkbox"
                    checked={launchAlerts}
                    onChange={(e) => setLaunchAlerts(e.target.checked)}
                    className="mt-1 rounded border-[#263449] bg-[#111C2E] text-sky-400 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">Rocket Launch Go-For-Flight Notifications</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5 font-light">
                      Alerts when favorited rocket launches enter terminal countdown (T-1 hour) or reschedule.
                    </span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-2xl bg-[#111C2E]/60 border border-[#263449] hover:bg-[#111C2E] transition-colors">
                  <input
                    type="checkbox"
                    checked={eventAlerts}
                    onChange={(e) => setEventAlerts(e.target.checked)}
                    className="mt-1 rounded border-[#263449] bg-[#111C2E] text-sky-400 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">Astronomical & Celestial Events</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5 font-light">
                      Reminders for visible meteor showers, planetary oppositions, and solar/lunar eclipses.
                    </span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-2xl bg-[#111C2E]/60 border border-[#263449] hover:bg-[#111C2E] transition-colors">
                  <input
                    type="checkbox"
                    checked={missionMilestones}
                    onChange={(e) => setMissionMilestones(e.target.checked)}
                    className="mt-1 rounded border-[#263449] bg-[#111C2E] text-sky-400 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">Deep-Space Mission Milestones</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5 font-light">
                      Weekly digest of planetary encounters, orbit insertions, and telescope discoveries.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-[#263449] flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Notification Preferences'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#263449] space-y-6">
              <h3 className="text-base font-display font-bold text-white border-b border-[#263449] pb-3">
                Security & Password Management
              </h3>

              {passwordSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  <Key className="w-4 h-4" />
                  <span>{updatingPassword ? 'Updating...' : 'Update Password'}</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/30 space-y-6">
              <div className="flex items-center space-x-3 text-rose-400">
                <Trash2 className="w-5 h-5" />
                <h3 className="text-base font-display font-bold">Delete Explorer Account</h3>
              </div>

              <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <p>
                  Permanently remove your SpaceOps account profile, all cloud-synced favorites, custom watchlists, and notification subscriptions.
                </p>
                <p className="text-rose-400 font-mono">
                  Warning: This action cannot be undone. All personal records in Supabase will be permanently erased.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3">
                <label className="block text-xs font-mono text-slate-300">
                  Type <span className="font-bold text-rose-400">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="w-full max-w-xs bg-[#111C2E] border border-rose-500/40 rounded-xl px-3.5 py-2 text-xs text-white font-mono uppercase"
                />

                <div>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== 'DELETE' || deleting}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase font-mono tracking-wider transition-all disabled:opacity-30 cursor-pointer"
                  >
                    {deleting ? 'Erasing Account...' : 'Permanently Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSettings;
