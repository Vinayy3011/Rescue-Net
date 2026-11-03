import React, { useState, useEffect } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { ShieldAlert, Radio, Volume2, VolumeX, Clock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, audioEnabled, setAudioEnabled, emergencies } = useEmergency();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingCount = emergencies.filter((e) => e.status === 'Pending').length;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 text-left text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-950/50 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Rescue<span className="text-red-500 font-extrabold">-Net</span>
          </span>
        </button>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('landing')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeTab === 'landing' ? 'text-white font-semibold underline underline-offset-8 decoration-red-500 decoration-2' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('victim')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-red-400 cursor-pointer ${
              activeTab === 'victim' ? 'text-red-400 font-semibold underline underline-offset-8 decoration-red-500 decoration-2' : ''
            }`}
          >
            <span>Victim SOS</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeTab === 'dashboard' ? 'text-white font-semibold underline underline-offset-8 decoration-red-500 decoration-2' : ''
            }`}
          >
            <span>Coordinator Hub</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeTab === 'teams' ? 'text-white font-semibold underline underline-offset-8 decoration-red-500 decoration-2' : ''
            }`}
          >
            Rescue Teams
          </button>
          <button
            onClick={() => setActiveTab('communication')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeTab === 'communication' ? 'text-white font-semibold underline underline-offset-8 decoration-red-500 decoration-2' : ''
            }`}
          >
            Data Architecture
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeTab === 'project' ? 'text-white font-semibold underline underline-offset-8 decoration-red-500 decoration-2' : ''
            }`}
          >
            Project Dossier
          </button>
        </nav>

        {/* Zone 3: 1 primary action with live digital clock & audio toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live Digital Clock */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono tabular-nums text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-md">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeStr || '21:52:41'}</span>
          </div>

          {/* Audio siren toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? 'Siren tone enabled' : 'Siren tone muted'}
            aria-label="Toggle Alert Audio"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors border border-slate-800 cursor-pointer"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Primary Action Button */}
          {activeTab !== 'victim' ? (
            <button
              onClick={() => setActiveTab('victim')}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-900/40 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>SEND SOS ALERT</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Coordinator Hub
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-2 text-xs bg-slate-950 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('landing')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'landing' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('victim')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'victim' ? 'bg-red-600 text-white font-bold' : 'text-red-400 font-semibold'}`}
        >
          SOS Alert
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'}`}
        >
          Dashboard ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'teams' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'}`}
        >
          Teams
        </button>
        <button
          onClick={() => setActiveTab('communication')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'communication' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'}`}
        >
          Data Comm
        </button>
        <button
          onClick={() => setActiveTab('project')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'project' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'}`}
        >
          Info
        </button>
      </div>
    </header>
  );
};
