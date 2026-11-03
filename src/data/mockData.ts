import { EmergencyAlert, RescueTeam } from '../types/emergency';

// Demo coordinates focused in Alandi & Pune region
export const INITIAL_EMERGENCIES: EmergencyAlert[] = [
  {
    id: 'RN-84102',
    victimName: 'Rameshwar Shinde',
    phone: '+91 98231 44521',
    type: 'Medical',
    message: 'Elderly cardiac patient in acute distress, fainting, oxygen level dropping rapidly. Need urgent paramedic support.',
    locationName: 'Near MIT Academy of Engineering, Dehu Phata, Alandi',
    latitude: 18.6763,
    longitude: 73.8951,
    timestamp: '2026-11-02 21:15:30',
    status: 'Pending',
    priority: 'Critical',
    isDemo: true,
    history: [
      {
        timestamp: '2026-11-02 21:15:30',
        status: 'Pending',
        note: 'SOS beacon initiated from smartphone via 4G LTE. Location locked by GPS.',
        author: 'Victim Device [192.168.1.104]'
      }
    ],
    networkMeta: {
      ipAddress: '192.168.1.104',
      clientPort: 5500,
      serverPort: 8000,
      protocol: 'HTTP/1.1 POST -> WSS Broadcast',
      transmissionMedium: 'Wi-Fi / 4G Cellular (TCP/IP)',
      latencyMs: 14,
      payloadSizeBytes: 542,
      packetId: 'PKT-9921-A'
    }
  },
  {
    id: 'RN-84103',
    victimName: 'Priya Kulkarni',
    phone: '+91 94220 18834',
    type: 'Accident',
    message: 'Two-wheeler and auto-rickshaw collision at junction. Multiple injuries, fluid leak on road.',
    locationName: 'Pune-Nashik Highway Crossroad, Moshi Toll Plaza near Alandi Phata',
    latitude: 18.6675,
    longitude: 73.8640,
    timestamp: '2026-11-02 20:45:10',
    status: 'In Progress',
    priority: 'High',
    assignedTeamId: 'team-alpha',
    assignedTeamName: 'Rescue Team Alpha',
    isDemo: true,
    history: [
      {
        timestamp: '2026-11-02 20:45:10',
        status: 'Pending',
        note: 'SOS broadcasted via web application.',
        author: 'Victim Device [192.168.1.112]'
      },
      {
        timestamp: '2026-11-02 20:47:05',
        status: 'In Progress',
        note: 'Coordinator assigned Rescue Team Alpha with rapid trauma vehicle.',
        author: 'Coordinator Desk (Vinay Kale)'
      }
    ],
    networkMeta: {
      ipAddress: '192.168.1.112',
      clientPort: 5500,
      serverPort: 8000,
      protocol: 'HTTP/1.1 POST',
      transmissionMedium: 'Cellular 5G Network',
      latencyMs: 22,
      payloadSizeBytes: 610,
      packetId: 'PKT-9922-B'
    }
  },
  {
    id: 'RN-84104',
    victimName: 'Ganesh More',
    phone: '+91 97654 32190',
    type: 'Fire',
    message: 'Electrical transformer sparking with fire spreading to adjoining warehouse shed. Thick black smoke rising.',
    locationName: 'Markal Industrial Area Road, Alandi Rural Sector',
    latitude: 18.6830,
    longitude: 73.9130,
    timestamp: '2026-11-02 21:02:18',
    status: 'Pending',
    priority: 'Critical',
    isDemo: true,
    history: [
      {
        timestamp: '2026-11-02 21:02:18',
        status: 'Pending',
        note: 'Automatic high-priority fire SOS triggered.',
        author: 'Victim Device [192.168.1.155]'
      }
    ],
    networkMeta: {
      ipAddress: '192.168.1.155',
      clientPort: 5500,
      serverPort: 8000,
      protocol: 'HTTP/1.1 POST -> WSS Broadcast',
      transmissionMedium: 'Wi-Fi / Fiber Gateway',
      latencyMs: 9,
      payloadSizeBytes: 588,
      packetId: 'PKT-9923-C'
    }
  },
  {
    id: 'RN-84105',
    victimName: 'Anand Jadhav',
    phone: '+91 98810 55412',
    type: 'Natural Disaster',
    message: 'Sudden Indrayani River swell submerged low-lying riverside steps; 4 pilgrims were trapped on isolated platform.',
    locationName: 'Indrayani River Ghat, Sant Dnyaneshwar Maharaj Samadhi Temple, Alandi',
    latitude: 18.6788,
    longitude: 73.8992,
    timestamp: '2026-11-02 18:30:00',
    status: 'Resolved',
    priority: 'High',
    assignedTeamId: 'team-taskforce',
    assignedTeamName: 'Disaster Taskforce',
    isDemo: true,
    history: [
      {
        timestamp: '2026-11-02 18:30:00',
        status: 'Pending',
        note: 'River flood alert registered.',
        author: 'River Ghat Security Officer'
      },
      {
        timestamp: '2026-11-02 18:34:10',
        status: 'In Progress',
        note: 'Disaster Taskforce mobilized with inflatable zodiac boats.',
        author: 'Coordinator Desk'
      },
      {
        timestamp: '2026-11-02 19:42:00',
        status: 'Resolved',
        note: 'All 4 pilgrims safely rescued and shifted to primary healthcare pavilion.',
        author: 'Inspector A. Kadam'
      }
    ],
    networkMeta: {
      ipAddress: '192.168.1.120',
      clientPort: 5500,
      serverPort: 8000,
      protocol: 'HTTP/1.1 POST',
      transmissionMedium: 'Local LAN Bridge',
      latencyMs: 16,
      payloadSizeBytes: 512,
      packetId: 'PKT-9924-D'
    }
  },
  {
    id: 'RN-84106',
    victimName: 'Sanjay Deshmukh',
    phone: '+91 99210 77341',
    type: 'Other',
    message: 'Heavy banyan tree branch snapped and brought down 11kV live power cable across access road, trapping school bus.',
    locationName: 'Dighi-Magazine Chowk Link Road, Northern Pune',
    latitude: 18.6186,
    longitude: 73.8732,
    timestamp: '2026-11-02 20:20:15',
    status: 'In Progress',
    priority: 'High',
    assignedTeamId: 'team-bravo',
    assignedTeamName: 'Rescue Team Bravo',
    isDemo: true,
    history: [
      {
        timestamp: '2026-11-02 20:20:15',
        status: 'Pending',
        note: 'Emergency distress call received.',
        author: 'Citizen Smartphone [192.168.1.189]'
      },
      {
        timestamp: '2026-11-02 20:23:40',
        status: 'In Progress',
        note: 'MSEDCL power grid cut coordinated; Team Bravo deployed with hydraulic cutters.',
        author: 'Coordinator Desk'
      }
    ],
    networkMeta: {
      ipAddress: '192.168.1.189',
      clientPort: 5500,
      serverPort: 8000,
      protocol: 'HTTP/1.1 POST -> WSS Broadcast',
      transmissionMedium: 'Cellular 4G LTE',
      latencyMs: 19,
      payloadSizeBytes: 672,
      packetId: 'PKT-9925-E'
    }
  }
];

export const INITIAL_TEAMS: RescueTeam[] = [
  {
    id: 'team-alpha',
    name: 'Rescue Team Alpha',
    lead: 'Capt. R. Deshmukh',
    specialization: 'Tactical & Evac',
    membersCount: 6,
    members: ['Capt. R. Deshmukh', 'Sgt. V. Jadhav', 'Paramedic P. Joshi', 'Tech N. Kale', 'Rescuer M. Patil', 'Driver S. Gawade'],
    contact: 'VHF Ch-4 / +91 98221 00101',
    status: 'Dispatched',
    currentEmergencyId: 'RN-84103',
    baseLocation: 'Moshi Central Fire & Rescue Post',
    equipment: ['Hydraulic Extrication Spreader', 'Rapid First Aid Trauma Kit', 'Stretcher System', 'Drone Spotter v2'],
    coordinates: [18.6675, 73.8640]
  },
  {
    id: 'team-bravo',
    name: 'Rescue Team Bravo',
    lead: 'Officer K. Sharma',
    specialization: 'General Support',
    membersCount: 5,
    members: ['Officer K. Sharma', 'Rescuer D. Pawar', 'Tech T. Bhosale', 'Paramedic R. Mehta', 'Driver A. Shinde'],
    contact: 'VHF Ch-2 / +91 98221 00102',
    status: 'Dispatched',
    currentEmergencyId: 'RN-84106',
    baseLocation: 'Dighi Ward Emergency Depot, Pune',
    equipment: ['Hydraulic Tree Cutters', 'Insulated Wire Shears', 'Winch Crane Truck', 'Traffic Safety Flares'],
    coordinates: [18.6186, 73.8732]
  },
  {
    id: 'team-medical',
    name: 'Medical Response Team',
    lead: 'Dr. Sneha Patil (MD EM)',
    specialization: 'Medical Trauma',
    membersCount: 4,
    members: ['Dr. Sneha Patil', 'Paramedic Anita Roy', 'Nurse Sachin Ghadge', 'EMT Tanaji More'],
    contact: 'Direct Hotline: 108 / Ext 44',
    status: 'Available',
    baseLocation: 'Alandi Rural Hospital Emergency Wing',
    equipment: ['Advanced Cardiac Defibrillator (AED)', 'Portable Ventilator & O2 Cylinders', 'IV Fluids & Epinephrine', 'Mobile Tele-ECG'],
    coordinates: [18.6750, 73.8965]
  },
  {
    id: 'team-fire',
    name: 'Fire Rescue Team',
    lead: 'Chief Fire Marshal V. Shinde',
    specialization: 'Urban Fire & Hazmat',
    membersCount: 8,
    members: ['Chief V. Shinde', 'Sub-Officer B. Thorat', '6 Firefighter Crew'],
    contact: 'Emergency 101 / VHF Ch-1',
    status: 'Available',
    baseLocation: 'PCMC Fire Station Moshi-Alandi Circle',
    equipment: ['Multi-Purpose Foam Tender', 'Thermal Imaging Camera (FLIR)', 'Chemical Hazmat Suits Level B', 'Heavy Duty Water Cannon'],
    coordinates: [18.6720, 73.8780]
  },
  {
    id: 'team-taskforce',
    name: 'Disaster Taskforce',
    lead: 'Inspector A. Kadam',
    specialization: 'Water Rescue',
    membersCount: 10,
    members: ['Inspector A. Kadam', 'Sub-Insp S. Rane', '8 NDRF/SDRF Certified Divers'],
    contact: 'State Disaster Line / VHF Ch-9',
    status: 'Standby',
    baseLocation: 'Indrayani Flood Defense Base Station, Alandi',
    equipment: ['Inflatable Motorized Gemini Boats', 'Life Jackets & Throw Bags', 'High-Output Submersible Pumps', 'Night Floodlight Mast'],
    coordinates: [18.6795, 73.9010]
  }
];

export const DATA_COMM_SPECS = {
  projectTitle: 'Rescue-Net Emergency Communication & Coordination Platform',
  department: 'Department of Information Technology',
  domain: 'Data Communication & Computer Networks',
  studentName: 'Vinay Kale',
  rollNumber: '65',
  guideName: 'Mr. Shivaji Patil',
  architecture: [
    {
      layer: 'Application Layer',
      protocols: 'HTTP/1.1 (REST API) & WebSocket (RFC 6455)',
      description: 'Provides RESTful endpoints for SOS emergency reporting (`POST /api/v1/sos`) and persistent bidirectional full-duplex WebSocket connection (`ws://localhost:8000/ws/alerts`) for live broadcast to coordinators.',
      ports: 'Frontend Client: Port 5500 / 3000 | FastAPI Backend: Port 8000'
    },
    {
      layer: 'Transport Layer',
      protocols: 'TCP (Transmission Control Protocol)',
      description: 'Ensures reliable, ordered, error-checked delivery of emergency packets using TCP 3-way handshake (SYN, SYN-ACK, ACK) and automatic packet retransmission.',
      ports: 'Source Ephemeral Ports (e.g. 52410) -> Target Server Port 8000'
    },
    {
      layer: 'Internet / Network Layer',
      protocols: 'IPv4 / IPv6, ICMP, ARP',
      description: 'Handles packet routing between victim device IP (e.g. 192.168.1.104), default gateway router, and FastAPI server IP (192.168.1.200 / 127.0.0.1).',
      ports: 'IP Header: 20 bytes, TTL: 64, Checksum verification'
    },
    {
      layer: 'Data Link & Physical Layer',
      protocols: 'IEEE 802.11 (Wi-Fi 6) / IEEE 802.3 (Ethernet) / 4G LTE-A & 5G NR',
      description: 'Physical transmission medium: Radio Frequency (2.4GHz / 5GHz Wi-Fi spectrum, sub-6GHz Cellular) with framing, MAC addressing, and CRC cyclic redundancy check.',
      ports: 'Medium: Unshielded Twisted Pair (Cat6) & Wireless RF'
    }
  ]
};
