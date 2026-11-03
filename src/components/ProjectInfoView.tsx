import React, { useState } from 'react';
import {
  GraduationCap,
  FileText,
  User,
  Award,
  Terminal,
  Server,
  Layers,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  BookOpen
} from 'lucide-react';

export const ProjectInfoView: React.FC = () => {
  const [copiedFastApi, setCopiedFastApi] = useState(false);
  const [copiedFrontend, setCopiedFrontend] = useState(false);

  const copyCode = (text: string, type: 'fastapi' | 'frontend') => {
    navigator.clipboard.writeText(text);
    if (type === 'fastapi') {
      setCopiedFastApi(true);
      setTimeout(() => setCopiedFastApi(false), 2000);
    } else {
      setCopiedFrontend(true);
      setTimeout(() => setCopiedFrontend(false), 2000);
    }
  };

  const fastApiCode = `# ===============================================================
# Rescue-Net: Emergency Communication Platform - FastAPI Backend
# Department of Information Technology - Data Communication Project
# Student: Vinay Kale (Roll 65) | Guide: Mr. Shivaji Patil
# ===============================================================

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import datetime
import uvicorn
import json

app = FastAPI(
    title="Rescue-Net Emergency Dispatch API",
    description="Full-duplex emergency SOS and coordinator dispatch server",
    version="1.0.0"
)

# CORS Configuration for local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active WebSocket connections pool
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_text(json.dumps(message))

manager = ConnectionManager()

# Data Models
class SOSAlertCreate(BaseModel):
    victim_name: str
    phone: Optional[str] = "N/A"
    emergency_type: str  # Medical, Fire, Accident, Natural Disaster, Other
    message: str
    location_name: str
    latitude: float
    longitude: float
    priority: str = "High"

# In-Memory DB (Can be hooked to MongoDB)
emergencies_db = []

@app.post("/api/v1/sos", status_code=201)
async def broadcast_sos(alert: SOSAlertCreate):
    emergency_id = f"RN-{len(emergencies_db) + 84100}"
    timestamp = datetime.datetime.utcnow().isoformat()
    record = {
        "id": emergency_id,
        "timestamp": timestamp,
        "status": "Pending",
        **alert.dict()
    }
    emergencies_db.append(record)

    # Broadcast to all connected coordinator dashboards via WebSocket
    await manager.broadcast({
        "event": "NEW_EMERGENCY_ALERT",
        "data": record
    })
    return {"status": "SUCCESS", "emergency_id": emergency_id, "data": record}

@app.get("/api/v1/emergencies")
async def list_emergencies():
    return {"count": len(emergencies_db), "records": emergencies_db}

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep alive and listen for client-initiated ping/acks
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    # Runs on Port 8000 as defined in Data Comm Architecture
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)`;

  const localRunSteps = `# 1. Clone repository
git clone https://github.com/vinaykale/rescue-net.git
cd rescue-net

# 2. Install Frontend Dependencies (Port 3000 / 5500)
npm install
npm run dev

# 3. Optional: Run Python FastAPI Backend (Port 8000)
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pydantic
python main.py`;

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* Dossier Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-600/40 text-blue-300 text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>Department of Information Technology</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Rescue-Net
            </h1>
            <p className="text-base text-slate-300 font-medium">
              Emergency Communication and Coordination Platform
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              Engineered as a full-stack Data Communication platform showcasing the operational transition from HTTP client request to persistent WebSocket broadcast, geospatial GIS routing with Leaflet, and tactical rescue fleet dispatch.
            </p>
          </div>

          {/* Project Credentials Badge */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 space-y-4 min-w-[280px]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                Project Developer
              </span>
              <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                <User className="w-4 h-4 text-red-500" />
                <span>Vinay Kale</span>
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Roll No: 65
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                Project Guide & Mentor
              </span>
              <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Mr. Shivaji Patil</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <div>
                <span className="text-slate-500">Domain:</span>{' '}
                <strong className="text-slate-200">Data Communication</strong>
              </div>
              <div>
                <span className="text-slate-500">Focus:</span> TCP/IP, Full-Duplex WebSockets, GIS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack & Integration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Frontend Architecture</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Built using modern React, TypeScript, Tailwind CSS, and Vite. Features high-contrast dark navy mode, responsive layouts, audio synthesized alert cues, and dynamic client-side filtering.
          </p>
          <div className="text-[11px] font-mono text-slate-500 pt-1">
            Stack: React 19, TypeScript, Lucide, Tailwind CSS
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Backend & Communication</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Python FastAPI with Uvicorn ASGI server and RFC 6455 WebSockets. Provides REST endpoints for alert creation and event broadcasting with structured JSON packets.
          </p>
          <div className="text-[11px] font-mono text-slate-500 pt-1">
            Stack: FastAPI, WebSocket Protocol, JSON Data Serialization
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Geospatial Mapping</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Integrated Leaflet.js with OpenStreetMap. Supports interactive beacon placement, status-coded styling (Red, Amber, Green), popup dossiers, and draggable victim location pins.
          </p>
          <div className="text-[11px] font-mono text-slate-500 pt-1">
            Engine: Leaflet 1.9, OpenStreetMap, CartoDB Tiles
          </div>
        </div>
      </div>

      {/* Python FastAPI Implementation Reference */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-400" />
              <span>Python FastAPI WebSocket Server Code (`main.py`)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Reference implementation matching the Data Communication architecture specifications.
            </p>
          </div>

          <button
            onClick={() => copyCode(fastApiCode, 'fastapi')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            {copiedFastApi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFastApi ? 'Copied Python Code' : 'Copy main.py'}</span>
          </button>
        </div>

        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-96 leading-relaxed">
          {fastApiCode}
        </pre>
      </div>

      {/* Local Execution & Deployment Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Local Deployment & Presentation Guide</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Commands to run and demonstrate the project locally during project evaluation.
            </p>
          </div>

          <button
            onClick={() => copyCode(localRunSteps, 'frontend')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            {copiedFrontend ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFrontend ? 'Copied Run Commands' : 'Copy Commands'}</span>
          </button>
        </div>

        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
          {localRunSteps}
        </pre>
      </div>

      {/* Simulation vs Production Distinction Note */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
        <div className="font-bold text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Real Integration & Simulation Notice</span>
        </div>
        <p>
          • <strong>Browser GPS:</strong> Uses the genuine W3C Geolocation API (<code className="text-slate-300 font-mono">navigator.geolocation</code>) triggered strictly on user consent.
        </p>
        <p>
          • <strong>Mapping:</strong> Real interactive Leaflet rendering with live OpenStreetMap raster tiles, coordinates, and custom markers.
        </p>
        <p>
          • <strong>Emergency Telemetry:</strong> Sample incidents centered around Alandi and Pune are realistic demonstration records clearly labeled for college evaluation and review.
        </p>
      </div>
    </div>
  );
};
