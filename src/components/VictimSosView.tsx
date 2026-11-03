import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { EmergencyType } from '../types/emergency';
import { EmergencyMap } from './EmergencyMap';
import {
  MapPin,
  Crosshair,
  AlertTriangle,
  Phone,
  User,
  Radio,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export const VictimSosView: React.FC = () => {
  const { addEmergency, lastSubmittedAlert, setActiveTab, setSelectedEmergencyId } = useEmergency();

  // Form states
  const [victimName, setVictimName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyType, setEmergencyType] = useState<EmergencyType>('Medical');
  const [message, setMessage] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState<number>(18.6750);
  const [longitude, setLongitude] = useState<number>(73.8965);

  // GPS states
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsSuccess, setGpsSuccess] = useState(false);

  // Submission states
  const [submittedAlertId, setSubmittedAlertId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Request browser geolocation ONLY upon user click
  const handleGetLocation = () => {
    setGpsLoading(true);
    setGpsError(null);
    setGpsSuccess(false);

    if (!('geolocation' in navigator)) {
      setGpsError('Browser does not support Geolocation API. Please enter your location manually.');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setGpsSuccess(true);
        setGpsLoading(false);
        if (!locationName) {
          setLocationName(`GPS Fixed Location (±${Math.round(position.coords.accuracy)}m accuracy)`);
        }
      },
      (error) => {
        setGpsLoading(false);
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied by browser. Please type your location manually below.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information unavailable. Please select your location on the map or type it manually.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please enter manually.';
        }
        setGpsError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setLatitude(parseFloat(lat.toFixed(6)));
    setLongitude(parseFloat(lng.toFixed(6)));
    setGpsSuccess(true);
    if (!locationName || locationName.startsWith('GPS Fixed')) {
      setLocationName(`Custom Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  };

  const handlePresetLocation = (name: string, lat: number, lng: number) => {
    setLocationName(name);
    setLatitude(lat);
    setLongitude(lng);
    setGpsSuccess(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!victimName.trim()) {
      setValidationError('Please enter your full name so rescuers can identify you.');
      return;
    }

    if (!message.trim()) {
      setValidationError('Please provide a brief description of the emergency.');
      return;
    }

    if (!locationName.trim()) {
      setValidationError('Please provide your approximate location or landmark.');
      return;
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      setValidationError('Valid latitude and longitude coordinates are required for emergency dispatch.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const alert = addEmergency({
        victimName: victimName.trim(),
        phone: phone.trim() || 'Not specified',
        type: emergencyType,
        message: message.trim(),
        locationName: locationName.trim(),
        latitude,
        longitude,
        priority: emergencyType === 'Medical' || emergencyType === 'Fire' ? 'Critical' : 'High'
      });

      setSubmittedAlertId(alert.id);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Title & Mode Banner */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Victim Emergency Mode · Urgent Response Channel</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Emergency SOS Transmission
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Fill in your distress details. Your GPS coordinates and alert will be packet-streamed immediately to the centralized Coordinator Control Center and nearest rescue units.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <span>Go to Coordinator Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Emergency SOS Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500"></div>

          {validationError && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-100">Incomplete Form</p>
                <p className="text-xs text-red-300 mt-0.5">{validationError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Victim Name & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={victimName}
                    onChange={(e) => setVictimName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Contact Number <span className="text-slate-500">(Optional)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98220 12345"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Type Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Emergency Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { type: 'Medical' as EmergencyType, icon: '🚑', label: 'Medical' },
                  { type: 'Fire' as EmergencyType, icon: '🔥', label: 'Fire' },
                  { type: 'Accident' as EmergencyType, icon: '⚠️', label: 'Accident' },
                  { type: 'Natural Disaster' as EmergencyType, icon: '🌊', label: 'Natural Disaster' },
                  { type: 'Other' as EmergencyType, icon: '🚨', label: 'Other Hazard' }
                ].map((item) => {
                  const isSelected = emergencyType === item.type;
                  return (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => setEmergencyType(item.type)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-600/20 border-red-500 text-white shadow-sm shadow-red-950'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emergency Message */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Emergency Situation Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what is happening: Number of injured, immediate risks (smoke, collapsed structure, bleeding)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Location Section */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>Location & Coordinates</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click GPS to pinpoint your device, or drag the marker on the map.
                  </p>
                </div>

                {/* GPS Trigger Button */}
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gpsLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-600/50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
                  <span>{gpsLoading ? 'Locking Satellite...' : 'Get Current GPS'}</span>
                </button>
              </div>

              {gpsError && (
                <div className="text-xs text-amber-300 bg-amber-950/40 border border-amber-800/50 p-2.5 rounded-lg flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{gpsError}</span>
                </div>
              )}

              {gpsSuccess && (
                <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 p-2 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Coordinates synchronized: [{latitude.toFixed(5)}, {longitude.toFixed(5)}]</span>
                </div>
              )}

              {/* Landmark name */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Location / Address / Landmark
                </label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Near Indrayani River Ghat, Alandi / Pune Road"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Lat & Lng Input row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons for College Demo */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                  Quick Demo Locations (Alandi & Pune Sector):
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handlePresetLocation('MIT AOE Campus, Alandi', 18.6763, 73.8951)}
                    className="px-2 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded cursor-pointer"
                  >
                    MIT AOE Alandi
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetLocation('Indrayani River Ghat, Alandi', 18.6788, 73.8992)}
                    className="px-2 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded cursor-pointer"
                  >
                    Indrayani Ghat
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetLocation('Moshi Toll Plaza Junction', 18.6675, 73.8640)}
                    className="px-2 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded cursor-pointer"
                  >
                    Moshi Toll Chowk
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetLocation('Dighi Hills, Pune', 18.6186, 73.8732)}
                    className="px-2 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded cursor-pointer"
                  >
                    Dighi Sector
                  </button>
                </div>
              </div>
            </div>

            {/* Giant Broadcast SOS Alert Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-[0.99] text-white font-extrabold text-base tracking-wider uppercase transition-all shadow-xl shadow-red-950/80 flex items-center justify-center gap-3 cursor-pointer beacon-active disabled:opacity-60"
              >
                <Radio className="w-5 h-5 animate-spin" />
                <span>{isSubmitting ? 'ENCODING & TRANSMITTING SOS...' : 'BROADCAST SOS ALERT'}</span>
                <Send className="w-4 h-4 ml-1" />
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2 font-mono">
                TCP Packet will transmit to FastAPI Dispatch Server [Port 8000] via WebSocket broadcast.
              </p>
            </div>
          </form>
        </div>

        {/* Right Column: Location Map Preview & Active Alert Status (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Mini-Map Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Geospatial Pinpoint</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
              </span>
            </div>
            
            <EmergencyMap
              interactiveSelect={true}
              center={[latitude, longitude]}
              zoom={14}
              onLocationSelect={handleMapLocationSelect}
              heightClass="h-[280px]"
            />
            <p className="text-[11px] text-slate-400 mt-2">
              Tip: Click anywhere on the map or drag the red beacon to adjust your rescue location.
            </p>
          </div>

          {/* Victim Active Tracking Card */}
          {submittedAlertId || lastSubmittedAlert ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Live SOS Status Dossier</h3>
                </div>
                <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 border border-red-500/40 px-2 py-0.5 rounded">
                  {lastSubmittedAlert?.id || submittedAlertId}
                </span>
              </div>

              <div className="space-y-4">
                {/* Status indicator */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Current Status
                    </span>
                    <span
                      className={`text-sm font-extrabold ${
                        lastSubmittedAlert?.status === 'Pending'
                          ? 'text-red-400'
                          : lastSubmittedAlert?.status === 'In Progress'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      ● {lastSubmittedAlert?.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Assigned Team
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {lastSubmittedAlert?.assignedTeamName || 'Queued for Dispatch'}
                    </span>
                  </div>
                </div>

                {/* Victim Details Recap */}
                <div className="text-xs space-y-1.5 text-slate-300">
                  <p>
                    <span className="text-slate-500">Victim:</span>{' '}
                    <strong className="text-white">{lastSubmittedAlert?.victimName}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Emergency:</span>{' '}
                    <span className="font-semibold text-red-300">{lastSubmittedAlert?.type}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">Location:</span>{' '}
                    <span className="text-slate-300">{lastSubmittedAlert?.locationName}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    "{lastSubmittedAlert?.message}"
                  </p>
                </div>

                {/* Recent Status History Timeline */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Real-Time Audit Trail</span>
                  </span>
                  <div className="space-y-2 max-h-36 overflow-y-auto text-xs pr-1">
                    {lastSubmittedAlert?.history.map((h, i) => (
                      <div key={i} className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/60">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                          <span>{h.author}</span>
                          <span>{h.timestamp.split(' ')[1] || h.timestamp}</span>
                        </div>
                        <p className="text-slate-200 text-[11px]">{h.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* View on Coordinator Dashboard */}
                <button
                  type="button"
                  onClick={() => {
                    if (lastSubmittedAlert) {
                      setSelectedEmergencyId(lastSubmittedAlert.id);
                    }
                    setActiveTab('dashboard');
                  }}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Track Live on Coordinator Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center">
              <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-300">No Active Distress Signal</h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill the form on the left to transmit your live SOS beacon. Your emergency will appear here with instant tracking.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
