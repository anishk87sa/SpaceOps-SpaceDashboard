import React, { useEffect, useState } from 'react';
import { Users, Shield, Plus, Mail, CheckCircle2, User, Clock, Terminal, X } from 'lucide-react';
import { apiClient } from '../../services/api/client';

export function TeamRoles() {
  const [team, setTeam] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Operator',
    department: 'Mission Operations Wing',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamRes, logsRes] = await Promise.all([
        apiClient.getTeam(),
        apiClient.getAuditLogs(),
      ]);
      setTeam(teamRes?.data || []);
      setAuditLogs(logsRes?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.inviteMember(newMember);
      setShowInviteModal(false);
      fetchData();
    } catch (err) {
      alert('Error sending invitation: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]">
        <div>
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block">
            Access Control & Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            Team & Operational Roles
          </h1>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-lg glow-cyan cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Flight Operator</span>
        </button>
      </div>

      {/* Team Roster Grid */}
      <div className="rounded-2xl glass-panel border border-[#263449] overflow-hidden">
        <div className="p-4 bg-[#0D1422] border-b border-[#263449] flex justify-between items-center">
          <h3 className="text-sm font-display font-bold text-white">Active Flight Operations Personnel</h3>
          <span className="text-xs font-mono text-[#38BDF8]">{team.length} Clearances Active</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#94A3B8] animate-pulse">
            Querying personnel security clearance matrix...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#111C2E] text-[#94A3B8] text-[10px] uppercase">
                <tr>
                  <th className="px-6 py-3">Operator Name</th>
                  <th className="px-6 py-3">Role & Clearance</th>
                  <th className="px-6 py-3">Department / Console</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Last Telemetry Session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263449]/60">
                {team.map((m) => (
                  <tr key={m.id} className="hover:bg-[#111C2E]/40">
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-white block">{m.name}</span>
                      <span className="text-[11px] text-[#94A3B8]">{m.email}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-[#38BDF8] border border-sky-800/40">
                        {m.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-300">{m.department}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        m.status === 'active' ? 'bg-[#34D399]/20 text-[#34D399]' : 'bg-[#FBBF24]/20 text-[#FBBF24]'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right text-slate-400">{m.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Immutable Audit Log Feed */}
      <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#263449]">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-sm font-display font-semibold text-white">System Security & Operations Audit Trail</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">Immutable Ledger</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-[#070B14]/70 border border-[#263449] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="px-1.5 py-0.5 rounded bg-[#111C2E] text-[#38BDF8] text-[10px] font-bold">
                  {log.action}
                </span>
                <span className="text-white">{log.target}</span>
              </div>
              <div className="flex items-center space-x-3 text-[#94A3B8] text-[11px]">
                <span>By: {log.user}</span>
                <span>• {new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1422] border border-[#263449] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
              <h3 className="text-lg font-display font-bold text-white">Invite Flight Operator</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#94A3B8] mb-1">Operator Full Name *</label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="elena@spaceops.org"
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1">Role / Clearance Level</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
                >
                  <option value="Administrator">Administrator (Flight Director)</option>
                  <option value="Operations Manager">Operations Manager (Dynamics Lead)</option>
                  <option value="Operator">Operator (Ground Controller)</option>
                  <option value="Analyst">Analyst (Telemetry Specialist)</option>
                  <option value="Viewer">Viewer (Read-Only Access)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-[#94A3B8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold uppercase"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamRoles;
