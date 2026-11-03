import React, { useState, useEffect } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { DATA_COMM_SPECS } from '../data/mockData';
import {
  Smartphone,
  Wifi,
  Server,
  Radio,
  Monitor,
  Shield,
  Play,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Code2,
  Network,
  RefreshCw
} from 'lucide-react';

export const DataCommunicationView: React.FC = () => {
  const { packetLogs, lastSubmittedAlert } = useEmergency();

  // Animation simulation state
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'headers' | 'websocket'>('json');

  const pipelineStages = [
    {
      id: 1,
      title: "1. Victim's Smartphone",
      sub: "Sender Node",
      port: "Port 5500 / 3000",
      ip: "192.168.1.104",
      icon: Smartphone,
      tech: "HTML5 Geolocation API, Client REST Dispatch",
      color: "border-red-500 text-red-400 bg-red-950/30"
    },
    {
      id: 2,
      title: "2. Transmission Medium",
      sub: "Wi-Fi / 4G-5G Radio",
      port: "802.11ax / TCP/IP",
      ip: "Gateway: 192.168.1.1",
      icon: Wifi,
      tech: "Unshielded Wireless RF, TCP 3-Way Handshake",
      color: "border-cyan-500 text-cyan-400 bg-cyan-950/30"
    },
    {
      id: 3,
      title: "3. FastAPI Dispatch Server",
      sub: "Backend Broker",
      port: "Port 8000 (Python / Node)",
      ip: "192.168.1.200",
      icon: Server,
      tech: "Uvicorn / ASGI, Endpoint: POST /api/v1/sos",
      color: "border-amber-500 text-amber-400 bg-amber-950/30"
    },
    {
      id: 4,
      title: "4. Full-Duplex WebSocket Broadcast",
      sub: "RFC 6455 Channel",
      port: "ws://localhost:8000/ws/alerts",
      ip: "Multiplexed TCP Stream",
      icon: Radio,
      tech: "Low-latency JSON Event Fan-Out (<5ms)",
      color: "border-purple-500 text-purple-400 bg-purple-950/30"
    },
    {
      id: 5,
      title: "5. Coordinator Dashboard",
      sub: "Receiver Station",
      port: "Browser Client Ingestion",
      ip: "192.168.1.150",
      icon: Monitor,
      tech: "Leaflet GIS Render, Dispatch Queue Ingestion",
      color: "border-emerald-500 text-emerald-400 bg-emerald-950/30"
    },
    {
      id: 6,
      title: "6. Rescue Team Assignment",
      sub: "Target Responder Node",
      port: "VHF Radio / Mobile Push",
      ip: "Rescue Unit Alpha",
      icon: Shield,
      tech: "GPS Waypoint Navigation, Team Dispatch Lock",
      color: "border-blue-500 text-blue-400 bg-blue-950/30"
    }
  ];

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(1);

    const stepTime = 1100;
    for (let i = 1; i <= 6; i++) {
      setTimeout(() => {
        setActiveStep(i);
        if (i === 6) {
          setTimeout(() => {
            setIsSimulating(false);
          }, 1200);
        }
      }, (i - 1) * stepTime);
    }
  };

  const sampleJsonPayload = JSON.stringify(
    {
      header: {
        protocol: "HTTP/1.1",
        method: "POST",
        endpoint: "/api/v1/sos",
        timestamp: "2026-11-02T21:52:41.000Z",
        client_ip: "192.168.1.104",
        client_port: 5500,
        server_port: 8000
      },
      payload: {
        emergency_id: lastSubmittedAlert?.id || "RN-84102",
        victim_name: lastSubmittedAlert?.victimName || "Rameshwar Shinde",
        phone: lastSubmittedAlert?.phone || "+91 98231 44521",
        type: lastSubmittedAlert?.type || "Medical",
        priority: "CRITICAL",
        coordinates: {
          latitude: lastSubmittedAlert?.latitude || 18.6763,
          longitude: lastSubmittedAlert?.longitude || 73.8951,
          accuracy_meters: 8.4
        },
        location_descriptor: lastSubmittedAlert?.locationName || "Near MIT Academy of Engineering, Alandi",
        message: lastSubmittedAlert?.message || "Acute cardiac distress, need immediate paramedic ambulance.",
        checksum_crc32: "0x89F12A0C"
      }
    },
    null,
    2
  );

  const sampleHttpHeaders = `POST /api/v1/sos HTTP/1.1
Host: 192.168.1.200:8000
User-Agent: RescueNet-Mobile/1.0 (Android; Geolocation/W3C)
Content-Type: application/json; charset=utf-8
Content-Length: ${sampleJsonPayload.length}
Origin: http://192.168.1.104:5500
X-Transmission-Medium: IEEE 802.11ax (Wi-Fi 6)
Connection: keep-alive
Authorization: Bearer RN_TOKEN_DEMO_HASH_99`;

  const sampleWebSocketFrame = `FIN: 1 | RSV: 000 | OPCODE: 0x1 (Text Frame)
MASK: 1 | PAYLOAD_LEN: 384 Bytes
Masking-Key: 0x37fa21b9
Event: "EMERGENCY_DISPATCH_BROADCAST"
Payload:
{
  "event": "NEW_ALERT",
  "id": "${lastSubmittedAlert?.id || 'RN-84102'}",
  "type": "${lastSubmittedAlert?.type || 'Medical'}",
  "status": "Pending",
  "coords": [${lastSubmittedAlert?.latitude || 18.6763}, ${lastSubmittedAlert?.longitude || 73.8951}],
  "broadcast_epoch": 1793664761000
}`;

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Network className="w-4 h-4" />
            <span>Academic Curriculum Demonstration · Data Communication Domain</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Data Communication Architecture & Flow
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Interactive breakdown of the OSI / TCP-IP network protocol stack, socket binding, transmission media, and packet routing governing the Rescue-Net emergency broadcast pipeline.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/60 transition-all cursor-pointer"
        >
          {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{isSimulating ? 'Propagating Packet...' : 'Simulate SOS Packet Transmission'}</span>
        </button>
      </div>

      {/* Animated Data-Flow Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>End-to-End Transmission Pipeline</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {isSimulating ? `Active Stage: ${activeStep} of 6` : 'Status: Ready for Packet Burst'}
          </span>
        </div>

        {/* Pipeline Stage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
          {pipelineStages.map((stg) => {
            const Icon = stg.icon;
            const isCurrent = activeStep === stg.id;
            const isPast = activeStep > stg.id;

            return (
              <div
                key={stg.id}
                className={`p-4 rounded-xl border transition-all duration-300 relative ${
                  isCurrent
                    ? `${stg.color} ring-2 ring-white/40 shadow-xl scale-[1.02]`
                    : isPast
                    ? 'border-emerald-600/40 bg-slate-950/80 text-slate-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isCurrent
                          ? 'bg-white text-slate-900'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : stg.id}
                    </div>
                    <span className="text-xs font-mono uppercase font-bold text-slate-300">
                      {stg.sub}
                    </span>
                  </div>
                  <Icon className={`w-5 h-5 ${isCurrent ? 'animate-bounce' : ''}`} />
                </div>

                <h3 className="text-sm font-bold text-white mt-1">{stg.title}</h3>

                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Port / Protocol:</span>
                    <span className="font-mono text-slate-300">{stg.port}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Node IP:</span>
                    <span className="font-mono text-cyan-400">{stg.ip}</span>
                  </div>
                  <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
                    {stg.tech}
                  </div>
                </div>

                {isCurrent && (
                  <div className="mt-3 pt-2 text-[10px] font-mono text-amber-300 flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Processing & serializing byte payload...</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Transmission Parameters Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Frontend Node</span>
            <span className="text-xs font-mono font-bold text-slate-200">Port 5500 (HTTP)</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">FastAPI Server</span>
            <span className="text-xs font-mono font-bold text-slate-200">Port 8000 (ASGI)</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Duplex Channel</span>
            <span className="text-xs font-mono font-bold text-cyan-400">WebSocket /ws/alerts</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Average Latency</span>
            <span className="text-xs font-mono font-bold text-emerald-400">14.2 ms</span>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Protocol Inspection & OSI Model Mapping */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Live Packet & Header Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>Protocol Frame & Packet Inspector</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect raw serializations for HTTP requests and WebSocket broadcast frames.
              </p>
            </div>

            {/* Format toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedFormat('json')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  selectedFormat === 'json' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                JSON Payload
              </button>
              <button
                onClick={() => setSelectedFormat('headers')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  selectedFormat === 'headers' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                HTTP Header
              </button>
              <button
                onClick={() => setSelectedFormat('websocket')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  selectedFormat === 'websocket' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                WS Frame
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative">
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-cyan-300 overflow-x-auto max-h-96 leading-relaxed">
              {selectedFormat === 'json' && sampleJsonPayload}
              {selectedFormat === 'headers' && sampleHttpHeaders}
              {selectedFormat === 'websocket' && sampleWebSocketFrame}
            </pre>
          </div>

          {/* Recent Transmission Audit Log */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-400 block mb-2">
              Recent Socket Packet Activity:
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[11px] pr-1">
              {packetLogs.map((pkt) => (
                <div key={pkt.id} className="p-2 bg-slate-950/70 border border-slate-800/60 rounded flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-cyan-400 font-bold">[{pkt.protocol}]</span>
                    <span className="text-slate-300 truncate">{pkt.summary}</span>
                  </div>
                  <div className="text-slate-500 whitespace-nowrap text-[10px]">
                    {pkt.timestamp} · {pkt.latencyMs}ms
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: TCP/IP & OSI 4-Layer Specification (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>TCP/IP Stack In Emergency Broadcast</span>
            </h2>

            <div className="space-y-3">
              {DATA_COMM_SPECS.architecture.map((layer, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{layer.layer}</span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                      {layer.protocols}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {layer.description}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-1">
                    {layer.ports}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Viva Questions Helper */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Data Communication Viva Summary
            </h3>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
              <li>
                <strong className="text-slate-200">Why WebSocket over HTTP Polling?</strong> WebSocket maintains an open full-duplex TCP stream without HTTP header overhead, reducing alert delivery latency from seconds to under 20 milliseconds.
              </li>
              <li>
                <strong className="text-slate-200">Transport Reliability:</strong> TCP ensures zero loss of emergency SOS packets via sequence ACK numbers and checksum verification.
              </li>
              <li>
                <strong className="text-slate-200">Geospatial Payload:</strong> W3C Geolocation coordinates are encoded in JSON WGS84 format (Decimal Degrees).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
