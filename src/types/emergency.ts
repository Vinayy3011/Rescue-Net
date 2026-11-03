export type EmergencyType = 'Medical' | 'Fire' | 'Accident' | 'Natural Disaster' | 'Other';

export type EmergencyStatus = 'Pending' | 'In Progress' | 'Resolved';

export type EmergencyPriority = 'Critical' | 'High' | 'Medium';

export interface AuditLog {
  timestamp: string;
  status: EmergencyStatus;
  note: string;
  author: string;
}

export interface NetworkMeta {
  ipAddress: string;
  clientPort: number;
  serverPort: number;
  protocol: string;
  transmissionMedium: string;
  latencyMs: number;
  payloadSizeBytes: number;
  packetId: string;
}

export interface EmergencyAlert {
  id: string;
  victimName: string;
  phone?: string;
  type: EmergencyType;
  message: string;
  locationName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  status: EmergencyStatus;
  priority: EmergencyPriority;
  assignedTeamId?: string;
  assignedTeamName?: string;
  isDemo?: boolean;
  history: AuditLog[];
  networkMeta?: NetworkMeta;
}

export interface RescueTeam {
  id: string;
  name: string;
  lead: string;
  specialization: 'Medical Trauma' | 'Urban Fire & Hazmat' | 'Tactical & Evac' | 'Water Rescue' | 'General Support';
  membersCount: number;
  members: string[];
  contact: string;
  status: 'Available' | 'Dispatched' | 'Standby';
  currentEmergencyId?: string;
  baseLocation: string;
  equipment: string[];
  coordinates: [number, number];
}

export interface PacketLog {
  id: string;
  timestamp: string;
  stage: 'victim' | 'network' | 'server' | 'websocket' | 'coordinator' | 'rescue';
  stageName: string;
  protocol: string;
  summary: string;
  payload: Record<string, unknown>;
  latencyMs: number;
}
