import React, { useState } from 'react';
import { User, Bell, Shield, Key, Eye, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function UserSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Dr. Evelyn Reed',
    email: user?.email || 'admin@spaceops.org',
    title: user?.title || 'Flight Operations Director',
    organization: user?.organization || 'SpaceOps Mission Command',
    timezone: 'UTC (Coordinated Universal Time)',
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    criticalAlertsEmail: true,
    passAosNotification: true,
    spaceWeatherSpikes: true,
    weeklyReportDigest: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block">
          Console Customization & Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
          Operator Settings & Preferences
        </h1>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-[#263449] font-mono text-xs">
        {[
          { id: 'profile', label: 'Operator Profile', icon: User },
          { id: 'notifications', label: 'Alert Thresholds', icon: Bell },
          { id: 'security', label: 'Security & 2FA', icon: Shield },
          { id: 'integrations', label: 'API Keys', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 flex items-center space-x-2 border-b-2 font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#38BDF8] text-[#38BDF8] font-bold'
                  : 'border-transparent text-[#94A3B8] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-[#34D399]/10 border border-[#34D399]/30 text-xs text-[#34D399] flex items-center space-x-2 font-mono">
          <CheckCircle2 className="w-4 h-4" />
          <span>Operator preferences synchronized successfully.</span>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="p-8 rounded-3xl glass-panel border border-[#263449] space-y-5 font-mono text-xs">
          <h3 className="text-sm font-display font-semibold text-white">Console Identity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#94A3B8] mb-1">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1">Official Email</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full bg-[#0D1422] border border-[#263449] rounded-xl px-3.5 py-2 text-[#94A3B8] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#94A3B8] mb-1">Operational Role Title</label>
              <input
                type="text"
                value={profileData.title}
                onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1">Mission Command Timezone</label>
              <select
                value={profileData.timezone}
                onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2 text-white"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST / Space Coast (UTC-5)</option>
                <option value="CST">CST / Houston Control (UTC-6)</option>
                <option value="PST">PST / JPL Goldstone (UTC-8)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold uppercase cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSave} className="p-8 rounded-3xl glass-panel border border-[#263449] space-y-5 font-mono text-xs">
          <h3 className="text-sm font-display font-semibold text-white">Alert Dispatch Preferences</h3>
          <div className="space-y-3">
            {[
              { key: 'criticalAlertsEmail', title: 'Critical Anomaly Push', desc: 'Dispatch instant SMS/email when an on-orbit asset trips a critical fault' },
              { key: 'passAosNotification', title: 'Ground Pass AOS Pre-warning', desc: 'Receive T-5 min countdown alert before acquisition of signal' },
              { key: 'spaceWeatherSpikes', title: 'Space Weather Flux Spikes', desc: 'Notify when solar proton flux or geomagnetic storm exceeds Kp 6 index' },
              { key: 'weeklyReportDigest', title: 'Weekly Performance Digest', desc: 'Summary report of total downlink volume and pass durations' },
            ].map((pref) => (
              <label key={pref.key} className="p-4 rounded-xl bg-[#070B14] border border-[#263449] flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-white font-bold block">{pref.title}</span>
                  <span className="text-[#94A3B8] text-[11px]">{pref.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPrefs[pref.key]}
                  onChange={(e) => setNotificationPrefs({ ...notificationPrefs, [pref.key]: e.target.checked })}
                  className="w-4 h-4 accent-[#38BDF8]"
                />
              </label>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold uppercase cursor-pointer"
            >
              Save Notification Preferences
            </button>
          </div>
        </form>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="p-8 rounded-3xl glass-panel border border-[#263449] space-y-6 font-mono text-xs">
          <h3 className="text-sm font-display font-semibold text-white">Session Security & Clearance</h3>
          <div className="p-4 rounded-xl bg-[#070B14] border border-[#263449] flex items-center justify-between">
            <div>
              <span className="text-white font-bold block">Two-Factor Authentication (2FA)</span>
              <span className="text-[#34D399] text-[11px]">Enforced via Hardware Security Key / TOTP</span>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#34D399]/20 text-[#34D399] font-bold">ACTIVE</span>
          </div>

          <div className="p-4 rounded-xl bg-[#070B14] border border-[#263449] flex items-center justify-between">
            <div>
              <span className="text-white font-bold block">JSON Web Token Lifespan</span>
              <span className="text-[#94A3B8] text-[11px]">Automatic re-authentication required every 7 days</span>
            </div>
            <span className="text-slate-300">7 Days (Standard)</span>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="p-8 rounded-3xl glass-panel border border-[#263449] space-y-6 font-mono text-xs">
          <h3 className="text-sm font-display font-semibold text-white">Programmatic API Keys</h3>
          <div className="p-4 rounded-xl bg-[#070B14] border border-[#263449] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">SpaceOps Operational API Key</span>
              <span className="text-[#34D399] text-[10px] font-bold">ACTIVE</span>
            </div>
            <div className="p-2.5 rounded bg-[#111C2E] border border-[#263449] text-[#38BDF8] truncate">
              orb_live_sec_89f02931bc47812903481239
            </div>
            <p className="text-[#94A3B8] text-[10px]">
              Grants read access to satellite telemetry streams and pass schedules. Never commit to public code repositories.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSettings;
