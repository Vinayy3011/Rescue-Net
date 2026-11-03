import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { EmergencyStatus } from '../types/emergency';
import { EmergencyMap } from './EmergencyMap';
import {
  X,
  MapPin,
  Clock,
  Phone,
  User,
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertTriangle,
  Send,
  Wifi,
  Sparkles,
  Loader2
} from 'lucide-react';

interface AiAnalysisResult {
  triageLevel: string;
  recommendedTeam: string;
  riskAssessment: string;
  immediateActions: string[];
  specializedEquipment: string[];
}

interface EmergencyDetailsModalProps {
  emergencyId: string;
  onClose: () => void;
}

export const EmergencyDetailsModal: React.FC<EmergencyDetailsModalProps> = ({ emergencyId, onClose }) => {
  const { emergencies, teams, updateEmergencyStatus, assignTeamToEmergency } = useEmergency();
  const alert = emergencies.find((e) => e.id === emergencyId);

  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [statusNote, setStatusNote] = useState<string>('');
  const [confirmResolve, setConfirmResolve] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AiAnalysisResult | null>(null);

  if (!alert) return null;

  const runAiTriage = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emergencyType: alert.type,
          description: alert.message,
          location: alert.locationName,
          victimName: alert.victimName
        })
      });
      const data = await res.json();
      if (data && data.analysis) {
        setAiResult(data.analysis);
      }
    } catch (e) {
      console.error('Failed to run AI triage', e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleStatusChange = (newStatus: EmergencyStatus) => {
    if (newStatus === 'Resolved' && !confirmResolve) {
      setConfirmResolve(true);
      return;
    }
    updateEmergencyStatus(alert.id, newStatus, statusNote.trim() || undefined);
    setStatusNote('');
    setConfirmResolve(false);
  };

  const handleAssignTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) return;
    assignTeamToEmergency(alert.id, selectedTeamId);
    setSelectedTeamId('');
  };

  const availableTeams = teams.filter((t) => t.status === 'Available' || t.id === alert.assignedTeamId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Incident Dossier #{alert.id}
                </h2>
                {alert.isDemo && (
                  <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                    Alandi / Pune Demo
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Transmitted {alert.timestamp} · {alert.type} Emergency
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Dossier Details (7 cols) */}
          <div className="md:col-span-7 space-y-5">
            {/* Victim & Emergency Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Victim & Contact Information
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    alert.status === 'Pending'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : alert.status === 'In Progress'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {alert.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Reported By</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {alert.victimName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Phone</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {alert.phone || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Emergency Type</span>
                  <span className="font-semibold text-red-400 mt-0.5 block">{alert.type}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Triage Priority</span>
                  <span className="font-semibold text-amber-400 mt-0.5 block">{alert.priority}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Distress Message:
                </span>
                <p className="text-xs text-slate-200 bg-slate-900/80 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  "{alert.message}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-500 block mb-1">Geospatial Landmark:</span>
                <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>{alert.locationName}</span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate-400">
                  Coordinates: {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
                </div>
              </div>
            </div>

            {/* AI Emergency Triage Card (Powered by server-side Gemini API) */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Gemini AI Triage Assessment
                    </h3>
                    <span className="text-[10px] text-slate-400">
                      Automated threat severity analysis & resource allocation
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={runAiTriage}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-purple-300 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{aiResult ? 'Re-Analyze Triage' : 'Run AI Triage'}</span>
                    </>
                  )}
                </button>
              </div>

              {aiResult ? (
                <div className="pt-2 space-y-3 text-xs border-t border-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Assessed Triage
                      </span>
                      <span className="font-extrabold text-red-400 text-sm">
                        {aiResult.triageLevel} Priority
                      </span>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Recommended Team
                      </span>
                      <span className="font-bold text-blue-300 text-xs">
                        {aiResult.recommendedTeam}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Risk & Scene Hazard Assessment
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {aiResult.riskAssessment}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Tactical Immediate Actions
                    </span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {aiResult.immediateActions.map((action, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {aiResult.specializedEquipment && aiResult.specializedEquipment.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Critical Equipment Manifest
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiResult.specializedEquipment.map((eq, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-900 text-cyan-300 border border-slate-700/80 rounded text-[10px] font-mono"
                          >
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                  Click <strong>Run AI Triage</strong> to let Gemini evaluate incident severity, recommended responder units, and tactical gear using your configured API key.
                </div>
              )}
            </div>

            {/* Network Packet Telemetry (Data Communication Project Feature) */}
            {alert.networkMeta && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                    <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Data Communication Frame</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-semibold">{alert.networkMeta.packetId}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-500">Source IP:</span> {alert.networkMeta.ipAddress}
                  </div>
                  <div>
                    <span className="text-slate-500">Port Bind:</span> {alert.networkMeta.clientPort} → {alert.networkMeta.serverPort}
                  </div>
                  <div>
                    <span className="text-slate-500">Protocol:</span> {alert.networkMeta.protocol}
                  </div>
                  <div>
                    <span className="text-slate-500">Packet Size:</span> {alert.networkMeta.payloadSizeBytes} Bytes
                  </div>
                </div>
              </div>
            )}

            {/* Audit Trail & Event Timeline */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Incident Action Log</span>
              </h3>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {alert.history.map((log, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                      <span className="font-semibold text-slate-300">{log.author}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="text-slate-200 text-[11px]">{log.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Location Map & Actions (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            {/* Leaflet Map Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              <span className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Incident Location Map</span>
              </span>
              <EmergencyMap
                emergencies={[alert]}
                teams={teams.filter((t) => t.id === alert.assignedTeamId)}
                selectedId={alert.id}
                center={[alert.latitude, alert.longitude]}
                zoom={14}
                heightClass="h-[200px]"
              />
            </div>

            {/* Rescue Team Assignment Form */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Rescue Unit Allocation</span>
              </h3>

              {alert.assignedTeamName ? (
                <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-lg text-xs text-blue-200">
                  <span className="text-[10px] uppercase font-bold text-blue-400 block">
                    Currently Assigned
                  </span>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {alert.assignedTeamName}
                  </div>
                  <div className="text-[11px] text-blue-300 mt-1">
                    Lead: {teams.find((t) => t.id === alert.assignedTeamId)?.lead || 'Field Officer'}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAssignTeam} className="space-y-2">
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select available rescue team...</option>
                    {availableTeams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.specialization}) - {team.status}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={!selectedTeamId}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Selected Team</span>
                  </button>
                </form>
              )}
            </div>

            {/* Status Transition Control */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Update Status
              </h3>

              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Optional action note for audit log..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />

              {confirmResolve ? (
                <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 rounded-lg space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold">
                    <AlertTriangle className="w-4 h-4 text-emerald-400" />
                    <span>Confirm Resolution</span>
                  </div>
                  <p className="text-[11px] text-emerald-200">
                    Are you sure this emergency has been safely resolved? Any assigned rescue team will be set back to Available.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleStatusChange('Resolved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold cursor-pointer"
                    >
                      Yes, Mark Resolved
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmResolve(false)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange('Pending')}
                    disabled={alert.status === 'Pending'}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      alert.status === 'Pending'
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('In Progress')}
                    disabled={alert.status === 'In Progress'}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      alert.status === 'In Progress'
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('Resolved')}
                    disabled={alert.status === 'Resolved'}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      alert.status === 'Resolved'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
