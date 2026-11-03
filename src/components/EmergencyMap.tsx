import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { EmergencyAlert, RescueTeam } from '../types/emergency';

interface EmergencyMapProps {
  emergencies?: EmergencyAlert[];
  teams?: RescueTeam[];
  selectedId?: string | null;
  onSelectEmergency?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  interactiveSelect?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  heightClass?: string;
}

export const EmergencyMap: React.FC<EmergencyMapProps> = ({
  emergencies = [],
  teams = [],
  selectedId,
  onSelectEmergency,
  center = [18.6750, 73.8900], // Default center around Alandi & North Pune
  zoom = 13,
  interactiveSelect = false,
  onLocationSelect,
  heightClass = 'h-[460px]'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userPinRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      attributionControl: false
    });

    // Dark styled OpenStreetMap / Carto tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Attribution
    L.control.attribution({ position: 'bottomright' })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors')
      .addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Handle map clicks for victim location selection
    if (interactiveSelect && onLocationSelect) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center if explicitly shifted
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (center && (!emergencies.length || interactiveSelect)) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, interactiveSelect]);

  // Render Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Custom DivIcon generator to avoid broken leaflet asset images
    const createMarkerIcon = (status: string, type: string, isSelected: boolean) => {
      let bg = '#ef4444'; // Red for Pending
      let pulse = 'beacon-active';
      if (status === 'In Progress') {
        bg = '#f59e0b'; // Amber
        pulse = '';
      } else if (status === 'Resolved') {
        bg = '#10b981'; // Green
        pulse = '';
      }

      const ring = isSelected ? 'ring-4 ring-white shadow-2xl scale-125 z-50' : 'ring-2 ring-slate-900 shadow-md';

      return L.divIcon({
        className: 'custom-emergency-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${pulse} ${ring}" style="background-color: ${bg}; transition: transform 0.2s;">
              ${type === 'Medical' ? '🚑' : type === 'Fire' ? '🔥' : type === 'Accident' ? '⚠️' : type === 'Natural Disaster' ? '🌊' : '🚨'}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });
    };

    const createTeamIcon = (teamName: string, status: string) => {
      return L.divIcon({
        className: 'custom-team-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="w-7 h-7 rounded-md bg-blue-600 border-2 border-white text-white flex items-center justify-center shadow-lg text-[10px] font-bold">
              🛡️
            </div>
            <div class="absolute -bottom-4 text-[9px] bg-slate-900/90 text-blue-200 px-1 rounded whitespace-nowrap border border-blue-500/30 font-mono">
              ${teamName.split(' ').slice(-1)[0]}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });
    };

    // Plot Emergencies
    const bounds = L.latLngBounds([]);

    emergencies.forEach((alert) => {
      if (!alert.latitude || !alert.longitude) return;

      const isSelected = alert.id === selectedId;
      const icon = createMarkerIcon(alert.status, alert.type, isSelected);
      const marker = L.marker([alert.latitude, alert.longitude], { icon });

      // Rich popup
      const statusBadge =
        alert.status === 'Pending'
          ? '<span style="color:#ef4444;font-weight:700;">● PENDING RESCUE</span>'
          : alert.status === 'In Progress'
          ? '<span style="color:#f59e0b;font-weight:700;">● IN PROGRESS</span>'
          : '<span style="color:#10b981;font-weight:700;">● RESOLVED</span>';

      const popupHtml = `
        <div style="min-width: 210px; font-family: inherit;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:11px;">
            <span style="font-family:monospace; color:#94a3b8; font-weight:600;">${alert.id}</span>
            ${statusBadge}
          </div>
          <div style="font-weight:700; font-size:14px; color:#f8fafc; margin-bottom:3px;">
            ${alert.victimName}
          </div>
          <div style="font-size:12px; color:#cbd5e1; margin-bottom:6px; line-height:1.3;">
            ${alert.type} Emergency · <span style="color:#94a3b8;">${alert.locationName}</span>
          </div>
          <div style="font-size:11px; color:#94a3b8; background:#1e293b; padding:6px; border-radius:4px; margin-bottom:8px; border:1px solid #334155;">
            "${alert.message.slice(0, 80)}${alert.message.length > 80 ? '...' : ''}"
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#94a3b8;">
            <span>${alert.timestamp.split(' ')[1] || alert.timestamp}</span>
            <button id="btn-popup-${alert.id}" style="background:#dc2626; color:#ffffff; border:none; padding:3px 8px; border-radius:4px; font-weight:600; cursor:pointer;">
              View Details
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        if (onSelectEmergency) {
          onSelectEmergency(alert.id);
        }
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${alert.id}`);
        if (btn && onSelectEmergency) {
          btn.onclick = () => onSelectEmergency(alert.id);
        }
      });

      marker.addTo(markersLayer);
      bounds.extend([alert.latitude, alert.longitude]);
    });

    // Plot Rescue Teams
    teams.forEach((team) => {
      if (!team.coordinates) return;
      const icon = createTeamIcon(team.name, team.status);
      const marker = L.marker(team.coordinates, { icon });

      const popupHtml = `
        <div style="min-width: 190px;">
          <div style="font-size:11px; color:#60a5fa; font-weight:700; text-transform:uppercase;">Rescue Unit</div>
          <div style="font-weight:700; font-size:13px; color:#f8fafc;">${team.name}</div>
          <div style="font-size:11px; color:#94a3b8; margin-top:2px;">Lead: ${team.lead}</div>
          <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">Status: <b style="color:${team.status === 'Available' ? '#10b981' : '#f59e0b'}">${team.status}</b></div>
          <div style="font-size:10px; color:#64748b; margin-top:4px; font-family:monospace;">${team.contact}</div>
        </div>
      `;
      marker.bindPopup(popupHtml);
      marker.addTo(markersLayer);
      bounds.extend(team.coordinates);
    });

    // Auto-fit if selected alert exists
    if (selectedId) {
      const selected = emergencies.find((e) => e.id === selectedId);
      if (selected) {
        map.setView([selected.latitude, selected.longitude], 15, { animate: true });
      }
    }
  }, [emergencies, teams, selectedId, onSelectEmergency]);

  // Interactive Pin for Victim SOS Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !interactiveSelect) return;

    if (userPinRef.current) {
      userPinRef.current.remove();
    }

    if (center && center[0] && center[1]) {
      const pinIcon = L.divIcon({
        className: 'user-sos-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-9 h-9 rounded-full bg-red-600 border-2 border-white shadow-2xl flex items-center justify-center text-white font-bold text-sm beacon-active">
              📍
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const pin = L.marker(center, {
        icon: pinIcon,
        draggable: true
      }).addTo(map);

      pin.on('dragend', () => {
        const pos = pin.getLatLng();
        if (onLocationSelect) {
          onLocationSelect(pos.lat, pos.lng);
        }
      });

      userPinRef.current = pin;
    }
  }, [center, interactiveSelect, onLocationSelect]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-xl">
      <div ref={mapContainerRef} className={`w-full ${heightClass}`} />
      
      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 shadow-lg flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-ping"></span>
          <span>Pending SOS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>Resolved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block"></span>
          <span>Rescue Unit</span>
        </div>
      </div>
    </div>
  );
};
