import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EmergencyAlert, EmergencyStatus, RescueTeam, PacketLog } from '../types/emergency';
import { INITIAL_EMERGENCIES, INITIAL_TEAMS } from '../data/mockData';

interface EmergencyContextType {
  emergencies: EmergencyAlert[];
  teams: RescueTeam[];
  activeTab: 'landing' | 'victim' | 'dashboard' | 'teams' | 'communication' | 'project';
  setActiveTab: (tab: 'landing' | 'victim' | 'dashboard' | 'teams' | 'communication' | 'project') => void;
  selectedEmergencyId: string | null;
  setSelectedEmergencyId: (id: string | null) => void;
  lastSubmittedAlert: EmergencyAlert | null;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  packetLogs: PacketLog[];
  addEmergency: (data: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status' | 'history' | 'networkMeta'>) => EmergencyAlert;
  updateEmergencyStatus: (id: string, status: EmergencyStatus, note?: string) => void;
  assignTeamToEmergency: (emergencyId: string, teamId: string) => void;
  simulateIncomingAlert: () => void;
  resetDemoData: () => void;
  playAlertSound: () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

const STORAGE_KEY_EMERGENCIES = 'rescuenet_emergencies_v1';
const STORAGE_KEY_TEAMS = 'rescuenet_teams_v1';

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emergencies, setEmergencies] = useState<EmergencyAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EMERGENCIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved emergencies', e);
    }
    return INITIAL_EMERGENCIES;
  });

  const [teams, setTeams] = useState<RescueTeam[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEAMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved teams', e);
    }
    return INITIAL_TEAMS;
  });

  const [activeTab, setActiveTab] = useState<'landing' | 'victim' | 'dashboard' | 'teams' | 'communication' | 'project'>('landing');
  const [selectedEmergencyId, setSelectedEmergencyId] = useState<string | null>(null);
  const [lastSubmittedAlert, setLastSubmittedAlert] = useState<EmergencyAlert | null>(() => emergencies[0] || null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [packetLogs, setPacketLogs] = useState<PacketLog[]>(() => [
    {
      id: 'pkt-init-1',
      timestamp: new Date().toLocaleTimeString(),
      stage: 'server',
      stageName: 'FastAPI Dispatch Server [Port 8000]',
      protocol: 'HTTP/1.1 REST + WSS',
      summary: 'Emergency channel initialized. Listening for SOS alerts on /api/v1/sos and WebSocket broadcast on /ws/alerts',
      payload: { status: 'ONLINE', port: 8000, listeners: 4 },
      latencyMs: 1.2
    }
  ]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EMERGENCIES, JSON.stringify(emergencies));
    } catch (e) {
      console.error('Storage write error', e);
    }
  }, [emergencies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
    } catch (e) {
      console.error('Storage write error', e);
    }
  }, [teams]);

  // Web Audio API emergency tone generator (synthesized, doesn't rely on external audio files)
  const playAlertSound = useCallback(() => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      // Alarm frequency alternating
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
      osc.frequency.setValueAtTime(880, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.45);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.52);
    } catch (err) {
      console.log('Web audio tone prevented by user gesture policy', err);
    }
  }, [audioEnabled]);

  // Function to add a packet log for demonstration
  const recordPacket = useCallback((stage: PacketLog['stage'], stageName: string, protocol: string, summary: string, payload: Record<string, unknown>, latencyMs: number) => {
    const newLog: PacketLog = {
      id: 'pkt-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      stage,
      stageName,
      protocol,
      summary,
      payload,
      latencyMs
    };
    setPacketLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  }, []);

  const addEmergency = useCallback((data: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status' | 'history' | 'networkMeta'>): EmergencyAlert => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newId = `RN-${randomSuffix}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const clientIp = `192.168.1.${Math.floor(100 + Math.random() * 90)}`;
    const packetId = `PKT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAlert: EmergencyAlert = {
      ...data,
      id: newId,
      timestamp,
      status: 'Pending',
      history: [
        {
          timestamp,
          status: 'Pending',
          note: `Emergency SOS submitted by ${data.victimName}. Lat: ${data.latitude.toFixed(4)}, Lng: ${data.longitude.toFixed(4)}`,
          author: `Victim Device [${clientIp}]`
        }
      ],
      networkMeta: {
        ipAddress: clientIp,
        clientPort: 5500,
        serverPort: 8000,
        protocol: 'HTTP/1.1 POST -> WSS Broadcast',
        transmissionMedium: 'Wi-Fi / 5G Broadband',
        latencyMs: 14 + Math.floor(Math.random() * 12),
        payloadSizeBytes: 580 + Math.floor(Math.random() * 120),
        packetId
      }
    };

    setEmergencies((prev) => [newAlert, ...prev]);
    setLastSubmittedAlert(newAlert);
    playAlertSound();

    // Log packet trace stages
    recordPacket('victim', 'Victim Client [Port 5500]', 'HTTP/1.1 POST', `SOS Payload compiled & serialized: ${newAlert.id}`, { id: newAlert.id, type: newAlert.type, victim: newAlert.victimName }, 2.1);
    recordPacket('server', 'FastAPI Backend [Port 8000]', 'TCP Handshake', `SOS Packet received at /api/v1/sos from ${clientIp}`, { packetId, status: '201 Created' }, 11.4);
    recordPacket('websocket', 'WebSocket Broadcast [ws://localhost:8000/ws/alerts]', 'RFC 6455 Frame', `Broadcasting emergency ${newAlert.id} to all connected coordinator dashboards`, { event: 'EMERGENCY_BROADCAST', alertId: newAlert.id }, 3.5);
    recordPacket('coordinator', 'Coordinator Dashboard', 'WebSocket Ingestion', `Live dispatch table & Leaflet map updated in real time`, { alertId: newAlert.id, status: 'Pending' }, 1.8);

    return newAlert;
  }, [playAlertSound, recordPacket]);

  const updateEmergencyStatus = useCallback((id: string, newStatus: EmergencyStatus, note?: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setEmergencies((prev) =>
      prev.map((alert) => {
        if (alert.id !== id) return alert;

        const updatedHistory = [
          ...alert.history,
          {
            timestamp,
            status: newStatus,
            note: note || `Status updated to ${newStatus}`,
            author: 'Coordinator Control Center'
          }
        ];

        return {
          ...alert,
          status: newStatus,
          history: updatedHistory
        };
      })
    );

    // If resolved, free up the assigned team
    if (newStatus === 'Resolved') {
      setTeams((prev) =>
        prev.map((team) => {
          if (team.currentEmergencyId === id) {
            return {
              ...team,
              status: 'Available',
              currentEmergencyId: undefined
            };
          }
          return team;
        })
      );
    }

    recordPacket('server', 'FastAPI Dispatch Server', 'HTTP/1.1 PATCH', `Emergency status updated to ${newStatus} for ${id}`, { id, newStatus, note }, 5.2);
    recordPacket('websocket', 'WebSocket Engine', 'WSS Alert Update', `Broadcasting status change: ${id} is now ${newStatus}`, { event: 'STATUS_UPDATE', id, newStatus }, 2.9);
  }, [recordPacket]);

  const assignTeamToEmergency = useCallback((emergencyId: string, teamId: string) => {
    const targetTeam = teams.find((t) => t.id === teamId);
    if (!targetTeam) return;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Update emergency
    setEmergencies((prev) =>
      prev.map((alert) => {
        if (alert.id !== emergencyId) return alert;

        const updatedHistory = [
          ...alert.history,
          {
            timestamp,
            status: 'In Progress' as EmergencyStatus,
            note: `Dispatched ${targetTeam.name} (Lead: ${targetTeam.lead}). Contact: ${targetTeam.contact}`,
            author: 'Dispatch Coordinator'
          }
        ];

        return {
          ...alert,
          status: 'In Progress' as EmergencyStatus,
          assignedTeamId: targetTeam.id,
          assignedTeamName: targetTeam.name,
          history: updatedHistory
        };
      })
    );

    // Update team status
    setTeams((prev) =>
      prev.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            status: 'Dispatched',
            currentEmergencyId: emergencyId
          };
        }
        return team;
      })
    );

    recordPacket('coordinator', 'Coordinator Dispatch Terminal', 'WSS Action', `Dispatched ${targetTeam.name} to Incident ${emergencyId}`, { emergencyId, teamId, lead: targetTeam.lead }, 4.1);
  }, [teams, recordPacket]);

  const simulateIncomingAlert = useCallback(() => {
    const locations = [
      { name: 'Moshi Toll Plaza, Pune-Nashik Expressway', lat: 18.6690, lng: 73.8655, type: 'Accident' as const, msg: 'Multi-vehicle collision on highway ramp. Fuel spillage, need trauma ambulance.' },
      { name: 'Charholi Budruk Road, near Indrayani Bridge, Pune', lat: 18.6420, lng: 73.9050, type: 'Medical' as const, msg: 'Severe electric shock in local workshop, victim unconscious with weak pulse.' },
      { name: 'Wadmukhwadi, Alandi Road', lat: 18.6380, lng: 73.8820, type: 'Fire' as const, msg: 'Residential cylinder leakage blaze. Smoke trapped occupants on 2nd floor balcony.' },
      { name: 'Kelgaon Village, near Alandi', lat: 18.6910, lng: 73.8920, type: 'Natural Disaster' as const, msg: 'Storm gale snapped high voltage transformer and caused rooftop collapse.' }
    ];

    const pick = locations[Math.floor(Math.random() * locations.length)];
    const names = ['Vikas Waghmare', 'Sunita Jagtap', 'Rahul Shirole', 'Mahesh Gaikwad'];
    const victimName = names[Math.floor(Math.random() * names.length)];

    addEmergency({
      victimName,
      phone: '+91 98' + Math.floor(10000000 + Math.random() * 89999999),
      type: pick.type,
      message: pick.msg,
      locationName: pick.name,
      latitude: pick.lat,
      longitude: pick.lng,
      priority: 'Critical',
      isDemo: true
    });
  }, [addEmergency]);

  const resetDemoData = useCallback(() => {
    setEmergencies(INITIAL_EMERGENCIES);
    setTeams(INITIAL_TEAMS);
    setLastSubmittedAlert(INITIAL_EMERGENCIES[0]);
    localStorage.removeItem(STORAGE_KEY_EMERGENCIES);
    localStorage.removeItem(STORAGE_KEY_TEAMS);
  }, []);

  return (
    <EmergencyContext.Provider
      value={{
        emergencies,
        teams,
        activeTab,
        setActiveTab,
        selectedEmergencyId,
        setSelectedEmergencyId,
        lastSubmittedAlert,
        audioEnabled,
        setAudioEnabled,
        packetLogs,
        addEmergency,
        updateEmergencyStatus,
        assignTeamToEmergency,
        simulateIncomingAlert,
        resetDemoData,
        playAlertSound
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
