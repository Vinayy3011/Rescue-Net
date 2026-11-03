import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import {
  Users,
  Shield,
  MapPin,
  Radio,
  Wrench,
  CheckCircle,
  Clock,
  ArrowRight,
  Phone
} from 'lucide-react';

export const RescueTeamManagement: React.FC = () => {
  const { teams, emergencies, assignTeamToEmergency, setSelectedEmergencyId, setActiveTab } = useEmergency();

  const [assignmentModalTeamId, setAssignmentModalTeamId] = useState<string | null>(null);
  const [targetEmergencyId, setTargetEmergencyId] = useState<string>('');

  const pendingEmergencies = emergencies.filter((e) => e.status === 'Pending' || e.status === 'In Progress');

  const handleQuickAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentModalTeamId || !targetEmergencyId) return;
    assignTeamToEmergency(targetEmergencyId, assignmentModalTeamId);
    setAssignmentModalTeamId(null);
    setTargetEmergencyId('');
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Tactical Operations · Rescue Fleet Dispatch</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Rescue Team Management
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Monitor emergency response units, team readiness, specialized apparatus, and assign active units to high-priority distress alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl flex items-center gap-3">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Fleet</span>
              <span className="text-sm font-bold text-white font-mono">{teams.length} Teams</span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Available</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {teams.filter((t) => t.status === 'Available').length} Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Rescue Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const assignedEmergency = emergencies.find((e) => e.id === team.currentEmergencyId);

          return (
            <div
              key={team.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                {/* Top Badge & Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                      {team.specialization}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{team.name}</h3>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      team.status === 'Available'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : team.status === 'Dispatched'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-700/40 text-slate-400 border border-slate-700'
                    }`}
                  >
                    ● {team.status}
                  </span>
                </div>

                {/* Team Lead & Base Location */}
                <div className="space-y-2 text-xs text-slate-300 py-3 border-y border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Unit Commander:</span>
                    <span className="font-semibold text-slate-200">{team.lead}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Active Crew:</span>
                    <span className="font-mono text-slate-200">{team.membersCount} Certified Rescuers</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Base Depot:</span>
                    <span className="text-slate-300 truncate max-w-[180px] text-right" title={team.baseLocation}>
                      {team.baseLocation}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Comms:</span>
                    <span className="font-mono text-[11px] text-blue-400">{team.contact}</span>
                  </div>
                </div>

                {/* Team Members Roster */}
                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Crew Manifest:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {team.members.map((member, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Key Equipment:
                  </span>
                  <ul className="text-[11px] text-slate-400 space-y-0.5">
                    {team.equipment.slice(0, 3).map((eq, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 truncate">
                        <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Currently Assigned Emergency */}
                {assignedEmergency && (
                  <div className="mt-4 p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-amber-300 font-bold text-[11px]">
                      <span>CURRENTLY DISPATCHED</span>
                      <span className="font-mono">{assignedEmergency.id}</span>
                    </div>
                    <div className="text-slate-200 font-semibold truncate">
                      {assignedEmergency.victimName} · {assignedEmergency.type}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {assignedEmergency.locationName}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEmergencyId(assignedEmergency.id);
                        setActiveTab('dashboard');
                      }}
                      className="text-[11px] text-amber-400 hover:underline pt-1 block cursor-pointer"
                    >
                      View Incident in Dashboard →
                    </button>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-800">
                {team.status === 'Available' ? (
                  <button
                    onClick={() => setAssignmentModalTeamId(team.id)}
                    className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-950"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Deploy to Active Incident</span>
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-slate-500 py-1 font-mono">
                    Unit engaged on mission
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deployment Modal */}
      {assignmentModalTeamId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Deploy Unit: {teams.find((t) => t.id === assignmentModalTeamId)?.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select an ongoing emergency to allocate this team immediately.
            </p>

            <form onSubmit={handleQuickAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Incident
                </label>
                <select
                  required
                  value={targetEmergencyId}
                  onChange={(e) => setTargetEmergencyId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select incident needing assistance...</option>
                  {pendingEmergencies.map((em) => (
                    <option key={em.id} value={em.id}>
                      [{em.id}] {em.type} - {em.victimName} ({em.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignmentModalTeamId(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!targetEmergencyId}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
