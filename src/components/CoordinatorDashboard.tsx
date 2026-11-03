import React, { useState, useMemo } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { EmergencyType, EmergencyStatus } from '../types/emergency';
import { EmergencyMap } from './EmergencyMap';
import { EmergencyDetailsModal } from './EmergencyDetailsModal';
import {
  ShieldAlert,
  Search,
  Filter,
  PlusCircle,
  RotateCcw,
  Eye,
  CheckCircle2,
  Clock,
  Radio,
  Users,
  AlertCircle
} from 'lucide-react';

export const CoordinatorDashboard: React.FC = () => {
  const {
    emergencies,
    teams,
    selectedEmergencyId,
    setSelectedEmergencyId,
    updateEmergencyStatus,
    assignTeamToEmergency,
    simulateIncomingAlert,
    resetDemoData,
    setActiveTab
  } = useEmergency();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | EmergencyStatus>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | EmergencyType>('All');
  const [quickAssignTarget, setQuickAssignTarget] = useState<string | null>(null);

  // Statistics calculation
  const totalCount = emergencies.length;
  const pendingCount = emergencies.filter((e) => e.status === 'Pending').length;
  const inProgressCount = emergencies.filter((e) => e.status === 'In Progress').length;
  const resolvedCount = emergencies.filter((e) => e.status === 'Resolved').length;
  const activeTeamsCount = teams.filter((t) => t.status === 'Dispatched').length;

  // Filtered emergencies list
  const filteredEmergencies = useMemo(() => {
    return emergencies.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.victimName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesType = typeFilter === 'All' || item.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [emergencies, searchTerm, statusFilter, typeFilter]);

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Operational Center · Alandi / Pune Sector Dispatch</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Coordinator Incident Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time emergency monitoring, geospatial telemetry, rapid team allocation, and resolution management.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={simulateIncomingAlert}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-lg shadow-red-950/60 transition-colors cursor-pointer"
            title="Simulate a live distress signal sent from victim smartphone"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Simulate Incoming SOS</span>
          </button>

          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Reset to default Alandi & Pune demo emergencies"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Emergencies */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Total Alerts</span>
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            All logged incidents across sector
          </div>
        </div>

        {/* Pending Alerts */}
        <div className="bg-slate-900 border border-red-900/40 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-red-400 text-xs font-medium mb-2">
            <span className="font-semibold">Pending Alerts</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          </div>
          <div className="text-3xl font-extrabold text-red-500 font-mono tabular-nums">
            {pendingCount}
          </div>
          <div className="text-[11px] text-red-400/80 mt-1">
            Immediate dispatch required
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-slate-900 border border-amber-900/40 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-amber-400 text-xs font-medium mb-2">
            <span className="font-semibold">In Progress</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
            {inProgressCount}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">
            {activeTeamsCount} rescue teams mobilized
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-slate-900 border border-emerald-900/40 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-medium mb-2">
            <span className="font-semibold">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
            {resolvedCount}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            Secured & victims stabilized
          </div>
        </div>
      </div>

      {/* Live Geospatial Operations Map */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>Live Emergency GIS Map (Alandi / North Pune)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive Leaflet.js OpenStreetMap stream. Click on any pin to view victim details or dispatch assistance.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Active Pins: <span className="text-white font-bold">{emergencies.length}</span> · Units: <span className="text-blue-400 font-bold">{teams.length}</span>
          </div>
        </div>

        <EmergencyMap
          emergencies={emergencies}
          teams={teams}
          selectedId={selectedEmergencyId}
          onSelectEmergency={(id) => setSelectedEmergencyId(id)}
          heightClass="h-[420px]"
        />
      </div>

      {/* Emergency Dispatch Table & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Table Filter & Search Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, victim name, location..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Select */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'All' | EmergencyStatus)}
                aria-label="Filter by Status"
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900">All Statuses</option>
                <option value="Pending" className="bg-slate-900">Pending</option>
                <option value="In Progress" className="bg-slate-900">In Progress</option>
                <option value="Resolved" className="bg-slate-900">Resolved</option>
              </select>
            </div>

            {/* Type Select */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-slate-400 font-medium">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'All' | EmergencyType)}
                aria-label="Filter by Emergency Type"
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900">All Types</option>
                <option value="Medical" className="bg-slate-900">Medical</option>
                <option value="Fire" className="bg-slate-900">Fire</option>
                <option value="Accident" className="bg-slate-900">Accident</option>
                <option value="Natural Disaster" className="bg-slate-900">Natural Disaster</option>
                <option value="Other" className="bg-slate-900">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* The Dispatch Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Emergency ID</th>
                <th className="py-3 px-4">Victim Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Team</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
              {filteredEmergencies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold">No emergency incidents found</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Adjust your search query or status filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEmergencies.map((alert) => {
                  const isSelected = alert.id === selectedEmergencyId;
                  return (
                    <tr
                      key={alert.id}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-slate-800/80 border-l-2 border-red-500' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                        {alert.id}
                      </td>

                      {/* Victim */}
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div>{alert.victimName}</div>
                        {alert.phone && (
                          <div className="text-[11px] font-mono text-slate-400">{alert.phone}</div>
                        )}
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-300">
                          {alert.type === 'Medical' && '🚑 Medical'}
                          {alert.type === 'Fire' && '🔥 Fire'}
                          {alert.type === 'Accident' && '⚠️ Accident'}
                          {alert.type === 'Natural Disaster' && '🌊 Disaster'}
                          {alert.type === 'Other' && '🚨 Hazard'}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="truncate text-slate-300" title={alert.locationName}>
                          {alert.locationName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                        </div>
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {alert.timestamp.split(' ')[1] || alert.timestamp}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 font-bold text-[11px] px-2.5 py-0.5 rounded-full ${
                            alert.status === 'Pending'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : alert.status === 'In Progress'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </td>

                      {/* Assigned Team */}
                      <td className="py-3.5 px-4">
                        {alert.assignedTeamName ? (
                          <span className="text-blue-300 font-medium text-xs flex items-center gap-1">
                            <Users className="w-3 h-3 text-blue-400" />
                            <span>{alert.assignedTeamName}</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedEmergencyId(alert.id)}
                            className="text-[11px] text-slate-400 hover:text-blue-400 underline decoration-slate-600 hover:decoration-blue-400 cursor-pointer"
                          >
                            + Assign Team
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedEmergencyId(alert.id)}
                            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/80 rounded-lg transition-colors cursor-pointer"
                            title="View Incident Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Mark In Progress */}
                          {alert.status === 'Pending' && (
                            <button
                              onClick={() => updateEmergencyStatus(alert.id, 'In Progress', 'Quick coordinator escalation')}
                              className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Mark In Progress"
                            >
                              Dispatch
                            </button>
                          )}

                          {/* Quick Mark Resolved */}
                          {alert.status !== 'Resolved' && (
                            <button
                              onClick={() => setSelectedEmergencyId(alert.id)}
                              className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Review & Resolve"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Details Dossier Modal */}
      {selectedEmergencyId && (
        <EmergencyDetailsModal
          emergencyId={selectedEmergencyId}
          onClose={() => setSelectedEmergencyId(null)}
        />
      )}
    </div>
  );
};
