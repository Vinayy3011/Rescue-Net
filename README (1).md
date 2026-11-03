# Rescue-Net – Emergency Communication & Coordination Platform

> **Department of Information Technology · Data Communication Project**  
> **Developer:** Vinay Kale (Roll 65)  
> **Project Guide:** Mr. Shivaji Patil  

Rescue-Net is a full-stack, real-time emergency communication and tactical dispatch platform. It bridges citizens in distress with central emergency coordination centers using sub-second WebSocket broadcasting, browser-native GPS beaconing, and interactive Leaflet.js geospatial mapping.

---

## 📁 Project Directory Structure

```text
rescue-net/
├── backend/                  # Python FastAPI Backend (WebSocket & REST)
│   ├── main.py               # FastAPI server with WebSocket broadcast on port 8000
│   └── requirements.txt      # Python dependencies (fastapi, uvicorn, pydantic)
├── src/                      # React Frontend Source
│   ├── components/           # UI Components
│   │   ├── Navbar.tsx        # Top navigation with digital clock & audio toggle
│   │   ├── LandingPage.tsx   # Landing hero, stats & 3-step pipeline
│   │   ├── VictimSosView.tsx # Victim distress form with GPS & Leaflet mini-map
│   │   ├── CoordinatorDashboard.tsx # Incident triage table, stats & GIS map
│   │   ├── EmergencyMap.tsx  # Leaflet OpenStreetMap custom marker engine
│   │   ├── EmergencyDetailsModal.tsx # Incident dossier & AI Triage
│   │   ├── RescueTeamManagement.tsx # Fleet readiness & team deployment
│   │   ├── DataCommunicationView.tsx # TCP/IP animated packet simulator
│   │   └── ProjectInfoView.tsx # Project credentials & viva documentation
│   ├── context/
│   │   └── EmergencyContext.tsx # Central state, audio synth & localStorage sync
│   ├── data/
│   │   └── mockData.ts       # Realistic Alandi & Pune demo records
│   ├── types/
│   │   └── emergency.ts      # TypeScript interfaces & packet types
│   ├── App.tsx               # Main routing & broadcast ticker
│   ├── index.css             # Tailwind CSS & map animations
│   └── main.tsx              # React DOM mounting
├── index.html                # Entry HTML with Leaflet & Google Fonts
├── server.ts                 # Full-stack Node/Express server with Gemini AI proxy
├── package.json              # Node dependencies & npm scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript compiler settings
├── .env.example              # Environment variables template
└── README.md                 # Project documentation & run guide
```

---

## 🚀 How to Run in Visual Studio Code (Quick Start)

### Step 1: Open in VS Code
1. Open **Visual Studio Code**.
2. Click **File > Open Folder...** (or press `Ctrl + K, Ctrl + O`).
3. Select this `rescue-net` folder.
4. Open the integrated terminal in VS Code: **Terminal > New Terminal** (or press `` Ctrl + ` ``).

---

### Step 2: Install Node.js Dependencies
In the VS Code terminal, run:
```bash
npm install
```

---

### Step 3: Configure Environment Variables (Optional for Gemini AI)
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and paste your Gemini API key (optional):
   ```env
   GEMINI_API_KEY="AIzaSyYourActualKeyHere..."
   PORT=3000
   ```
   *(The app also works with automatic fallback triage if an API key is not supplied).*

---

### Step 4: Run the Application
Start the development server:
```bash
npm run dev
```
Open your browser at:
👉 **`http://localhost:3000`**

---

## 🐍 (Optional) Running the Python FastAPI Backend

If you wish to demonstrate the Python FastAPI server on **Port 8000** for your Data Communication viva:

1. Open a second terminal tab in VS Code.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Create and activate a Python virtual environment:
   ```bash
   # On macOS / Linux:
   python3 -m venv venv
   source venv/bin/activate

   # On Windows:
   python -m venv venv
   .\venv\Scripts\activate
   ```
4. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the FastAPI server:
   ```bash
   python main.py
   ```
   *(Or using uvicorn directly: `uvicorn main:app --reload --port 8000`)*

The FastAPI backend will run on:
- API Docs & Swagger UI: **`http://localhost:8000/docs`**
- WebSocket Alert Stream: **`ws://localhost:8000/ws/alerts`**

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons.
- **Mapping:** Leaflet.js with OpenStreetMap & CartoDB tiles.
- **Backend:** Node.js Express full-stack proxy (`server.ts`) + Python FastAPI (`backend/main.py`).
- **Protocols:** HTTP/1.1 REST, RFC 6455 Full-Duplex WebSockets, TCP/IP.
- **AI Triage:** Google `@google/genai` (`gemini-3.8-flash`) server-side integration.
