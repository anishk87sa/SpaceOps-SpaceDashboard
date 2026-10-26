import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/api/client';

export function MissionNew() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Earth Observation',
    objective: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    owner: 'Dr. Evelyn Reed (Flight Director)',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.objective) {
      setError('Please provide a mission name and primary objective.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.createMission(formData);
      navigate(`/app/missions/${res.data.id}`);
    } catch (err) {
      setError(err.message || 'Failed to submit mission plan');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link
          to="/app/missions"
          className="inline-flex items-center space-x-1 text-xs font-mono text-[#94A3B8] hover:text-[#38BDF8] mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Missions Registry</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
          New Spaceflight Mission Planning Wizard
        </h1>
        <p className="text-xs text-[#94A3B8] font-mono mt-1">
          Define mission parameters, launch windows, and resource allocation.
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-between border-b border-[#263449] pb-4 font-mono text-xs">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-[#38BDF8] font-bold' : 'text-[#94A3B8]'}`}>
          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">1</span>
          <span>Basic Profile</span>
        </div>
        <div className="h-px w-12 bg-[#263449]" />
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-[#38BDF8] font-bold' : 'text-[#94A3B8]'}`}>
          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">2</span>
          <span>Objectives</span>
        </div>
        <div className="h-px w-12 bg-[#263449]" />
        <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-[#38BDF8] font-bold' : 'text-[#94A3B8]'}`}>
          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">3</span>
          <span>Review & Dispatch</span>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-[#FB7185]/10 border border-[#FB7185]/30 text-xs text-[#FB7185] flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step Content */}
      <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-panel border border-[#263449] space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-display font-semibold text-white">Step 1: Basic Information</h3>
            <div>
              <label className="block text-xs font-mono text-[#94A3B8] mb-1">Mission Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Polaris Orbital Solar Observatory"
                className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8] font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-1">Mission Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. POSO-01"
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-1">Mission Regimen Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                >
                  <option value="Earth Observation">Earth Observation</option>
                  <option value="Deep Space Communications">Deep Space Communications</option>
                  <option value="Heliophysics">Heliophysics</option>
                  <option value="Space Situational Awareness">Space Situational Awareness</option>
                  <option value="Astrophysics">Astrophysics</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-[#38BDF8] text-slate-950 font-bold font-mono text-xs uppercase cursor-pointer"
              >
                Proceed to Objectives →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-display font-semibold text-white">Step 2: Objectives & Schedule</h3>
            <div>
              <label className="block text-xs font-mono text-[#94A3B8] mb-1">Primary Operational Objective *</label>
              <textarea
                required
                rows={4}
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                placeholder="Detail orbital regime, primary payload instruments, and expected downlink parameters..."
                className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8] font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-1">Planned End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-mono text-[#94A3B8]"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-[#38BDF8] text-slate-950 font-bold font-mono text-xs uppercase cursor-pointer"
              >
                Review Plan →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 font-mono text-xs">
            <h3 className="text-sm font-display font-semibold text-white">Step 3: Review & Authorize</h3>
            <div className="p-4 rounded-xl bg-[#070B14] border border-[#263449] space-y-2 text-[#94A3B8]">
              <p><span className="text-white font-bold">Mission:</span> {formData.name}</p>
              <p><span className="text-white font-bold">Code:</span> {formData.code || 'Auto-generated'}</p>
              <p><span className="text-white font-bold">Type:</span> {formData.type}</p>
              <p><span className="text-white font-bold">Schedule:</span> {formData.startDate} to {formData.endDate}</p>
              <p><span className="text-white font-bold">Objective:</span> {formData.objective}</p>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-mono text-[#94A3B8]"
              >
                ← Edit Parameters
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#34D399] hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs uppercase shadow-lg cursor-pointer"
              >
                {loading ? 'Transmitting...' : 'Authorize & Create Mission'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default MissionNew;
