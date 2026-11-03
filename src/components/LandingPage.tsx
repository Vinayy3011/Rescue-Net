import React from 'react';
import { useEmergency } from '../context/EmergencyContext';
import {
  ShieldAlert,
  Radio,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Zap,
  Users,
  CheckCircle2,
  Lock,
  ChevronRight,
  Server
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { emergencies, teams, setActiveTab } = useEmergency();

  const pendingCount = emergencies.filter((e) => e.status === 'Pending').length;
  const inProgressCount = emergencies.filter((e) => e.status === 'In Progress').length;
  const resolvedCount = emergencies.filter((e) => e.status === 'Resolved').length;

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-4xl mx-auto space-y-6">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-semibold">Next-Gen Incident Response & Tactical Coordination</span>
          </div>

          {/* Heading with text-wrap: balance */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl mx-auto text-balance">
            Every Second Matters.{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              Every Alert Counts.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Rescue-Net bridges citizens in acute distress with emergency command centers. Real-time GPS beaconing, sub-second WebSocket broadcast, and intelligent rescue fleet allocation for rapid life-saving action.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('victim')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-red-950/80 transition-all hover:scale-105 cursor-pointer beacon-active"
            >
              <Radio className="w-4 h-4 animate-spin" />
              <span>SEND SOS ALERT NOW</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Coordinator Dashboard</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Real-time Sector Banner */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Pilot Zone: Alandi & Northern Pune</span>
            </div>
            <div className="hidden sm:block text-slate-700">·</div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Full-Duplex WebSocket Sync</span>
            </div>
            <div className="hidden sm:block text-slate-700">·</div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{teams.length} Specialized Rescue Units Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Statistics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Live Incident Response Telemetry
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time operational metrics across Alandi and Pune emergency sectors.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>SYSTEM ONLINE · 100% OPERATIONAL</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-medium text-slate-400 block mb-1">Total Incidents</span>
              <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {emergencies.length}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Logged in system</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-red-900/40">
              <span className="text-xs font-semibold text-red-400 block mb-1">Pending Alerts</span>
              <div className="text-3xl font-extrabold text-red-500 font-mono tabular-nums">
                {pendingCount}
              </div>
              <span className="text-[11px] text-red-400/70 mt-1 block">Awaiting responder allocation</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-amber-900/40">
              <span className="text-xs font-semibold text-amber-400 block mb-1">In Progress</span>
              <div className="text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
                {inProgressCount}
              </div>
              <span className="text-[11px] text-amber-400/70 mt-1 block">Units actively mobilized</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/40">
              <span className="text-xs font-semibold text-emerald-400 block mb-1">Resolved Safely</span>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
                {resolvedCount}
              </div>
              <span className="text-[11px] text-emerald-400/70 mt-1 block">Victims secured</span>
            </div>
          </div>
        </div>
      </section>

      {/* How Rescue-Net Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-red-400">
            Rapid Response Workflow
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-1">
            How Rescue-Net Operates
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            A seamless three-step data communication pipeline from citizen distress beacon to boots on the ground.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-base mb-4 border border-red-500/30">
              01
            </div>
            <h3 className="text-base font-bold text-white mb-2">SOS Beacon Initiation</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Victim accesses the lightweight web portal, grants one-click browser GPS permission, selects the emergency category, and hits Broadcast.
            </p>
            <div className="text-[11px] text-slate-500 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              Payload: Lat/Lng + JSON Triage + Contact
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-base mb-4 border border-cyan-500/30">
              02
            </div>
            <h3 className="text-base font-bold text-white mb-2">Sub-Second Network Broadcast</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              FastAPI backend receives the REST packet on Port 8000 and fans out a WebSocket event to all connected coordinator monitoring consoles within 15 milliseconds.
            </p>
            <div className="text-[11px] text-slate-500 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              Protocol: RFC 6455 Duplex WebSocket Frame
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-base mb-4 border border-emerald-500/30">
              03
            </div>
            <h3 className="text-base font-bold text-white mb-2">Tactical Deployment</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Coordinators visualize the incident on Leaflet GIS maps, allocate the nearest specialized rescue unit, and stream live status updates back to the victim.
            </p>
            <div className="text-[11px] text-slate-500 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              Output: Unit Dispatch + Victim ETA Lock
            </div>
          </div>
        </div>
      </section>

      {/* Features & Technical Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Platform Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Engineered for Critical Reliability
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Combining resilient data transmission protocols with intuitive triage management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center mb-2">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Geospatial Leaflet GIS</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Color-coded map beacons render precise incident positions, nearby hospital access, and responder location vectors.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center mb-2">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Sub-Second Latency</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Persistent WebSocket connection removes HTTP roundtrip polling overhead, keeping network latency below 20ms.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Fleet & Roster Allocation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track readiness, gear manifests, and radio channels for Fire, Medical Trauma, Tactical, and Water Rescue teams.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Audit & Timeline Tracking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every action, status update, and note is preserved in an immutable chronologically ordered incident log.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center mb-2">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">OSI Packet Inspector</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built-in educational diagnostic view displaying socket port binds, TCP/IP handshakes, and raw JSON byte frames.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-2">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Safe Resolution Guard</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Two-step confirmation prevents accidental emergency closure and automatically frees dispatched units back to base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Project Information */}
      <footer className="border-t border-slate-800/80 bg-slate-950 pt-12 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-white">
                  Rescue<span className="text-red-500">-Net</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                Emergency Communication & Coordination Platform designed for real-time SOS broadcasting, geospatial routing, and emergency triage management.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-300 block">
                Academic Project Credentials
              </span>
              <p className="text-slate-400">
                <span className="text-slate-500">Student:</span>{' '}
                <strong className="text-slate-200">Vinay Kale (Roll 65)</strong>
              </p>
              <p className="text-slate-400">
                <span className="text-slate-500">Project Guide:</span>{' '}
                <strong className="text-slate-200">Mr. Shivaji Patil</strong>
              </p>
              <p className="text-slate-400">
                <span className="text-slate-500">Department:</span> Information Technology
              </p>
              <p className="text-slate-400">
                <span className="text-slate-500">Domain:</span> Data Communication
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-300 block">
                Platform Navigation
              </span>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button onClick={() => setActiveTab('victim')} className="hover:text-white transition-colors cursor-pointer">
                    Victim SOS Broadcast
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                    Coordinator Hub & GIS Map
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('teams')} className="hover:text-white transition-colors cursor-pointer">
                    Rescue Team Management
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('communication')} className="hover:text-white transition-colors cursor-pointer">
                    Data Communication Specs
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between text-xs text-slate-400">
            <div>
              © 2026 Rescue-Net · Emergency Communication and Coordination Platform
            </div>
            <div className="font-mono text-[11px]">
              Alandi & Pune Demonstration Build
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
