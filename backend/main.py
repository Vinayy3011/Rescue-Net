"""
Rescue-Net: Emergency Communication and Coordination Platform
Backend: Python FastAPI with WebSockets
Department: Information Technology | Domain: Data Communication
Student: Vinay Kale (Roll 65) | Guide: Mr. Shivaji Patil
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import datetime
import uvicorn
import json

app = FastAPI(
    title="Rescue-Net Emergency Dispatch API",
    description="Real-time emergency communication and coordination engine with WebSocket broadcast",
    version="1.0.0"
)

# CORS setup for frontend (VS Code / Localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket Connection Manager for real-time dispatch fanout
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"[WebSocket] Coordinator connected. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"[WebSocket] Coordinator disconnected. Remaining: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        message_text = json.dumps(message)
        for connection in self.active_connections:
            try:
                await connection.send_text(message_text)
            except Exception as e:
                print(f"[WebSocket] Error broadcasting to client: {e}")

manager = ConnectionManager()

# Data Models
class SOSAlertCreate(BaseModel):
    victim_name: str
    phone: Optional[str] = "N/A"
    emergency_type: str = Field(..., description="Medical, Fire, Accident, Natural Disaster, Other")
    message: str
    location_name: str
    latitude: float
    longitude: float
    priority: Optional[str] = "High"

# In-Memory Storage initialized with Alandi & Pune regional demonstration data
emergencies_db: List[Dict[str, Any]] = [
    {
        "id": "RN-84102",
        "victim_name": "Rameshwar Shinde",
        "phone": "+91 98231 44521",
        "emergency_type": "Medical",
        "message": "Elderly cardiac patient in acute distress, oxygen level dropping rapidly.",
        "location_name": "Near MIT Academy of Engineering, Dehu Phata, Alandi",
        "latitude": 18.6763,
        "longitude": 73.8951,
        "timestamp": "2026-11-02 21:15:30",
        "status": "Pending",
        "priority": "Critical",
        "assigned_team": None
    },
    {
        "id": "RN-84103",
        "victim_name": "Priya Kulkarni",
        "phone": "+91 94220 18834",
        "emergency_type": "Accident",
        "message": "Two-wheeler collision at junction. Multiple injuries, fluid leak on road.",
        "location_name": "Pune-Nashik Highway Crossroad, Moshi Toll Plaza near Alandi Phata",
        "latitude": 18.6675,
        "longitude": 73.8640,
        "timestamp": "2026-11-02 20:45:10",
        "status": "In Progress",
        "priority": "High",
        "assigned_team": "Rescue Team Alpha"
    }
]

@app.get("/")
def root():
    return {
        "platform": "Rescue-Net Emergency Communication System",
        "status": "ONLINE",
        "port": 8000,
        "protocol": "HTTP/1.1 REST + RFC 6455 WebSocket",
        "endpoints": {
            "create_sos": "POST /api/v1/sos",
            "list_emergencies": "GET /api/v1/emergencies",
            "websocket_channel": "ws://localhost:8000/ws/alerts"
        }
    }

@app.post("/api/v1/sos", status_code=201)
async def broadcast_sos(alert: SOSAlertCreate):
    emergency_id = f"RN-{len(emergencies_db) + 84105}"
    timestamp = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    
    record = {
        "id": emergency_id,
        "timestamp": timestamp,
        "status": "Pending",
        "victim_name": alert.victim_name,
        "phone": alert.phone,
        "emergency_type": alert.emergency_type,
        "message": alert.message,
        "location_name": alert.location_name,
        "latitude": alert.latitude,
        "longitude": alert.longitude,
        "priority": alert.priority,
        "assigned_team": None
    }
    
    emergencies_db.insert(0, record)

    # Full-duplex WebSocket broadcast to all active coordinator dashboards
    await manager.broadcast({
        "event": "NEW_EMERGENCY_BROADCAST",
        "alert": record,
        "server_time": timestamp
    })

    return {
        "status": "SUCCESS",
        "emergency_id": emergency_id,
        "data": record
    }

@app.get("/api/v1/emergencies")
def list_emergencies():
    return {
        "total": len(emergencies_db),
        "emergencies": emergencies_db
    }

@app.patch("/api/v1/emergencies/{emergency_id}/status")
async def update_status(emergency_id: str, payload: Dict[str, str]):
    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required")

    found = None
    for em in emergencies_db:
        if em["id"] == emergency_id:
            em["status"] = new_status
            if "assigned_team" in payload:
                em["assigned_team"] = payload["assigned_team"]
            found = em
            break

    if not found:
        raise HTTPException(status_code=404, detail="Emergency not found")

    await manager.broadcast({
        "event": "STATUS_UPDATE",
        "emergency_id": emergency_id,
        "status": new_status,
        "assigned_team": found.get("assigned_team")
    })

    return {"status": "UPDATED", "emergency": found}

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection open and await ping/heartbeat from clients
            data = await websocket.receive_text()
            # Echo heartbeat ACK
            await websocket.send_text(json.dumps({"type": "PONG", "received": data}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    print("[Rescue-Net] Starting FastAPI Server on http://0.0.0.0:8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
