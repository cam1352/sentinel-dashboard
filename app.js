// PROJECT SENTINEL // Real-Time Operations & Threat Detection Simulator

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Tactical Audio Synthesizer (Web Audio API - zero external sound files needed)
  class TacticalAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
    }

    playBlip(freq = 880, duration = 0.06) {
      if (!this.enabled) return;
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    }

    playAlert() {
      if (!this.enabled) return;
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.linearRampToValueAtTime(950, now + 0.15);
      osc.frequency.linearRampToValueAtTime(650, now + 0.3);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.35);
    }

    playDispatch() {
      if (!this.enabled) return;
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + (i * 0.08));
        gain.gain.setValueAtTime(0.09, now + (i * 0.08));
        gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.08) + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + (i * 0.08));
        osc.stop(now + (i * 0.08) + 0.15);
      });
    }
  }

  const sound = new TacticalAudio();

  // DOM Elements
  const simClock = document.getElementById('sim-clock');
  const toggleAudioBtn = document.getElementById('toggle-audio-btn');
  const triggerSimThreatBtn = document.getElementById('trigger-sim-threat-btn');
  const telemetryLogs = document.getElementById('telemetry-logs');
  const clearLogsBtn = document.getElementById('clear-logs-btn');
  const cameraCanvas = document.getElementById('camera-canvas');
  const activeCamTitle = document.getElementById('active-cam-title');
  const camFps = document.getElementById('cam-fps');
  const camMatchBadge = document.getElementById('cam-match-badge');
  const camObjectCount = document.getElementById('cam-object-count');
  const camBiometricScore = document.getElementById('cam-biometric-score');
  const btnVisionMode = document.getElementById('btn-vision-mode');
  const btnBboxToggle = document.getElementById('btn-bbox-toggle');
  const btnThreatsOnly = document.getElementById('btn-threats-only');
  const cameraNodeList = document.getElementById('camera-node-list');
  const alertFeedContainer = document.getElementById('alert-feed-container');
  const alertCounter = document.getElementById('alert-counter');
  const watchlistContainer = document.getElementById('watchlist-container');
  const btnAddSuspect = document.getElementById('btn-add-suspect');
  const suspectModal = document.getElementById('suspect-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-modal-btn');
  const saveSuspectBtn = document.getElementById('save-suspect-btn');
  const targetNameInput = document.getElementById('target-name');
  const targetCrimeInput = document.getElementById('target-crime');
  const targetThreatInput = document.getElementById('target-threat');
  const dispatchModal = document.getElementById('dispatch-modal');
  const dispatchModalMsg = document.getElementById('dispatch-modal-msg');
  const radarScanner = document.getElementById('radar-scanner');
  const toggleRadar = document.getElementById('toggle-radar');
  const toggleOrbit = document.getElementById('toggle-orbit');
  const layerSatellite = document.getElementById('layer-satellite');
  const layerTactical = document.getElementById('layer-tactical');

  // Camera Network Dataset
  const cameraNodes = [
    {
      id: 'CAM-NYC-01',
      title: 'NYC // Times Sq Central',
      city: 'New York, USA',
      coords: [40.7580, -73.9855],
      authority: 'NYPD RTCC & 10th Precinct',
      status: 'ONLINE',
      threatAlert: false,
      resolution: '4K / 30FPS'
    },
    {
      id: 'CAM-LON-02',
      title: 'LDN // Trafalgar Sq & Whitehall',
      city: 'London, UK',
      coords: [51.5080, -0.1281],
      authority: 'Metropolitan Police Service',
      status: 'ONLINE',
      threatAlert: false,
      resolution: '1080P / 60FPS'
    },
    {
      id: 'CAM-TKY-03',
      title: 'TKY // Shibuya Crossing',
      city: 'Tokyo, Japan',
      coords: [35.6595, 139.7005],
      authority: 'Tokyo Metropolitan Police Dept',
      status: 'ONLINE',
      threatAlert: false,
      resolution: '4K / 30FPS'
    },
    {
      id: 'CAM-PAR-04',
      title: 'PAR // Champs-Élysées Arc',
      city: 'Paris, France',
      coords: [48.8698, 2.3075],
      authority: 'Préfecture de Police de Paris',
      status: 'ONLINE',
      threatAlert: false,
      resolution: '1080P / 30FPS'
    },
    {
      id: 'CAM-SYD-05',
      title: 'SYD // Circular Quay Terminal',
      city: 'Sydney, Australia',
      coords: [-33.8615, 151.2107],
      authority: 'NSW Police Command',
      status: 'ONLINE',
      threatAlert: false,
      resolution: '1080P / 30FPS'
    },
    {
      id: 'CAM-SGP-06',
      title: 'SGP // Marina Bay Promenade',
      city: 'Singapore',
      coords: [1.2838, 103.8591],
      authority: 'Singapore Police Force (SPF)',
      status: 'ONLINE',
      threatAlert: false,
      resolution: '4K / 60FPS'
    },
    {
      id: 'CAM-DXB-07',
      title: 'DXB // Sheikh Zayed Central',
      city: 'Dubai, UAE',
      coords: [25.2048, 55.2708],
      authority: 'Dubai Police General HQ',
      status: 'ONLINE',
      threatAlert: false,
      resolution: '4K / 30FPS'
    },
    {
      id: 'CAM-BER-08',
      title: 'BER // Alexanderplatz Hub',
      city: 'Berlin, Germany',
      coords: [52.5219, 13.4132],
      authority: 'Polizei Berlin Direktion 5',
      status: 'ONLINE',
      threatAlert: false,
      resolution: '1080P / 30FPS'
    }
  ];

  let activeCamera = cameraNodes[0];

  // Watchlist Database
  let watchlist = [
    {
      id: 'RN-9041',
      name: 'Viktor Vance',
      crime: 'Interpol Red Notice - Global Ransomware & Financial Fraud',
      threat: 'CRITICAL',
      lastSeen: 'Eastern Europe',
      photoId: 'VV'
    },
    {
      id: 'RN-3819',
      name: 'Elena Rostov',
      crime: 'Interpol Red Notice - Critical Infrastructure Sabotage',
      threat: 'HIGH',
      lastSeen: 'Western Europe',
      photoId: 'ER'
    },
    {
      id: 'RN-5542',
      name: 'Marcus Chen',
      crime: 'International Arms Trafficking & Contraband Transit',
      threat: 'CRITICAL',
      lastSeen: 'East Asia',
      photoId: 'MC'
    }
  ];

  let activeAlerts = [];
  let visionMode = 'optical'; // optical | thermal | nvg
  let showBBoxes = true;
  let threatsOnly = false;

  // Initialize Map
  const map = L.map('map', {
    center: [25, 10],
    zoom: 3,
    minZoom: 2,
    maxZoom: 18,
    zoomControl: true,
    attributionControl: false
  });

  // Tile Layers
  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19
  }).addTo(map);

  const tacticalLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19
  });

  // Layer Switchers
  layerSatellite.addEventListener('click', () => {
    map.removeLayer(tacticalLayer);
    map.addLayer(satelliteLayer);
    layerSatellite.className = 'px-2 py-1 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-600 font-semibold text-[10px]';
    layerTactical.className = 'px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 text-[10px]';
    sound.playBlip(700);
  });

  layerTactical.addEventListener('click', () => {
    map.removeLayer(satelliteLayer);
    map.addLayer(tacticalLayer);
    layerTactical.className = 'px-2 py-1 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-600 font-semibold text-[10px]';
    layerSatellite.className = 'px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 text-[10px]';
    sound.playBlip(700);
  });

  // Add Camera Markers to Map
  const markers = {};

  function renderCameraMarkers() {
    cameraNodes.forEach(node => {
      const isAlert = node.threatAlert;
      const customIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div class="pulse-marker ${isAlert ? 'pulse-marker-alert' : ''}" id="marker-${node.id}">
            <div class="pulse-marker-core"></div>
            <div class="pulse-marker-ring"></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      if (markers[node.id]) {
        markers[node.id].setIcon(customIcon);
      } else {
        const marker = L.marker(node.coords, { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div class="space-y-1">
            <div class="font-bold text-cyan-400 text-xs">${node.title}</div>
            <div class="text-[10px] text-slate-300">${node.city}</div>
            <div class="text-[9px] text-slate-400">Jurisdiction: <span class="text-white">${node.authority}</span></div>
            <div class="text-[9px] text-slate-400">Status: <span class="${node.threatAlert ? 'text-rose-400 font-bold' : 'text-emerald-400'}">${node.threatAlert ? 'THREAT DETECTED' : 'SECURE / SCANNING'}</span></div>
            <button onclick="window.selectCamera('${node.id}')" class="mt-2 w-full py-1 bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-600 rounded text-[10px] font-bold">
              SWITCH LIVE FEED
            </button>
          </div>
        `);
        markers[node.id] = marker;
      }
    });
  }
  renderCameraMarkers();

  // Satellite Orbit Track Simulation
  const orbitCoordinates = [
    [-55, -170], [-40, -140], [-10, -100], [20, -70], [50, -40], [65, 0], [45, 40], [10, 70], [-25, 100], [-55, 130], [-60, 180]
  ];

  let orbitLine = L.polyline(orbitCoordinates, {
    color: '#00f0ff',
    weight: 1.5,
    dashArray: '4, 8',
    opacity: 0.6
  }).addTo(map);

  // Satellite Icon on Orbit
  const satIcon = L.divIcon({
    className: 'custom-sat-icon',
    html: `
      <div class="satellite-icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 7 9 3 5 7l4 4"/><path d="m17 11 4 4-4 4-4-4"/><path d="m8 12 4 4 6-6-4-4Z"/><path d="m16 8 3-3"/><path d="M9 21a6 6 0 0 0-6-6"/>
        </svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  const satMarker = L.marker([20, -70], { icon: satIcon }).addTo(map);
  satMarker.bindPopup('<div class="font-bold text-cyan-400">SENTINEL-7A (LEO)</div><div class="text-[10px] text-slate-300">Alt: 480km | Velocity: 7.6 km/s | Sensor: Multi-Spectral Optical</div>');

  // Ground Coverage Cone Circle
  const satCone = L.circle([20, -70], {
    radius: 700000,
    color: '#00f0ff',
    weight: 1,
    fillColor: '#00f0ff',
    fillOpacity: 0.08
  }).addTo(map);

  // Animate Satellite Orbit
  let satStep = 0;
  setInterval(() => {
    satStep = (satStep + 0.002) % 1;
    const totalPoints = orbitCoordinates.length - 1;
    const pos = satStep * totalPoints;
    const index = Math.floor(pos);
    const remainder = pos - index;

    if (index < totalPoints) {
      const p1 = orbitCoordinates[index];
      const p2 = orbitCoordinates[index + 1];
      const lat = p1[0] + (p2[0] - p1[0]) * remainder;
      const lng = p1[1] + (p2[1] - p1[1]) * remainder;
      satMarker.setLatLng([lat, lng]);
      satCone.setLatLng([lat, lng]);
    }
  }, 100);

  // Global Function for camera selection
  window.selectCamera = function(nodeId) {
    const cam = cameraNodes.find(c => c.id === nodeId);
    if (!cam) return;
    activeCamera = cam;
    activeCamTitle.textContent = `${cam.id}: ${cam.city.toUpperCase()}`;
    map.flyTo(cam.coords, 14, { duration: 1.5 });
    sound.playBlip(1200);
    renderSidebarCameraList();
    addLog(`Operator switched focus to ${cam.id} (${cam.title}).`);
  };

  // Render Camera Node List in Left Sidebar
  function renderSidebarCameraList() {
    cameraNodeList.innerHTML = '';
    cameraNodes.forEach(cam => {
      const isSelected = activeCamera.id === cam.id;
      const div = document.createElement('div');
      div.className = `p-2 rounded border transition cursor-pointer flex items-center justify-between ${
        isSelected
          ? 'bg-cyan-950/50 border-cyan-500 text-white'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
      } ${cam.threatAlert ? 'border-rose-600 bg-rose-950/30' : ''}`;

      div.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full ${cam.threatAlert ? 'bg-rose-500 animate-ping' : isSelected ? 'bg-cyan-400' : 'bg-slate-500'}"></span>
          <div>
            <div class="font-bold text-[11px] flex items-center gap-1.5">
              ${cam.id}
              ${cam.threatAlert ? '<span class="text-[9px] bg-rose-900 text-rose-300 px-1 rounded font-normal">ALERT</span>' : ''}
            </div>
            <div class="text-[9px] text-slate-400">${cam.title}</div>
          </div>
        </div>
        <div class="text-[9px] text-right text-slate-400">
          <div>${cam.resolution}</div>
          <div class="${cam.threatAlert ? 'text-rose-400 font-bold' : 'text-emerald-400'}">${cam.threatAlert ? 'MATCH DETECTED' : 'OK'}</div>
        </div>
      `;

      div.onclick = () => window.selectCamera(cam.id);
      cameraNodeList.appendChild(div);
    });
  }
  renderSidebarCameraList();

  // Watchlist Rendering
  function renderWatchlist() {
    watchlistContainer.innerHTML = '';
    watchlist.forEach(suspect => {
      const div = document.createElement('div');
      div.className = 'bg-slate-900/80 p-2.5 rounded border border-slate-800 hover:border-slate-700 text-[10px] space-y-1.5';
      div.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="font-bold text-slate-100 flex items-center gap-1.5">
            <span class="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] text-cyan-400 font-bold">
              ${suspect.photoId}
            </span>
            <span>${suspect.name}</span>
          </div>
          <span class="px-1.5 py-0.5 rounded text-[8px] font-bold ${
            suspect.threat === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
          }">${suspect.threat}</span>
        </div>
        <div class="text-[9px] text-slate-400 leading-tight">${suspect.crime}</div>
        <div class="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-800/60">
          <span>ID: <b class="text-slate-300">${suspect.id}</b></span>
          <button onclick="window.triggerTargetMatch('${suspect.id}')" class="text-cyan-400 hover:text-cyan-300 font-bold">
            [SIMULATE SCAN]
          </button>
        </div>
      `;
      watchlistContainer.appendChild(div);
    });
  }
  renderWatchlist();

  // Synthetic Video & CV Canvas Engine
  const ctx = cameraCanvas.getContext('2d');
  cameraCanvas.width = 640;
  cameraCanvas.height = 360;

  // Virtual Pedestrians and Vehicles in Current Feed
  const entities = [];
  for (let i = 0; i < 12; i++) {
    entities.push({
      x: 50 + Math.random() * 540,
      y: 120 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 0.4,
      width: 14 + Math.random() * 8,
      height: 34 + Math.random() * 14,
      type: 'HUMAN',
      confidence: (0.91 + Math.random() * 0.08).toFixed(2),
      id: `OBJ-${1000 + i}`,
      isMatch: false,
      matchTarget: null
    });
  }

  // Add 3 vehicles
  for (let i = 0; i < 3; i++) {
    entities.push({
      x: 40 + Math.random() * 560,
      y: 200 + Math.random() * 120,
      vx: (Math.random() > 0.5 ? 1 : -1) * (1.8 + Math.random() * 1.5),
      vy: 0,
      width: 50 + Math.random() * 25,
      height: 25 + Math.random() * 10,
      type: 'VEHICLE',
      confidence: (0.93 + Math.random() * 0.06).toFixed(2),
      id: `VEH-${2000 + i}`,
      isMatch: false,
      matchTarget: null
    });
  }

  let frameCount = 0;
  let lastFpsUpdate = Date.now();

  function renderVideoFrame() {
    frameCount++;
    if (Date.now() - lastFpsUpdate >= 1000) {
      camFps.textContent = (frameCount * 1).toFixed(1);
      frameCount = 0;
      lastFpsUpdate = Date.now();
    }

    // 1. Draw Simulated Background (Dark city street perspective)
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, 640, 360);

    // City Perspective Lines
    ctx.strokeStyle = '#101c33';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Sidewalk & Road Horizon
    ctx.moveTo(0, 140);
    ctx.lineTo(640, 140);
    ctx.moveTo(100, 140);
    ctx.lineTo(0, 360);
    ctx.moveTo(540, 140);
    ctx.lineTo(640, 360);
    // Center road dash lines
    ctx.moveTo(320, 140);
    ctx.lineTo(320, 360);
    ctx.stroke();

    // Road Texture
    ctx.fillStyle = '#0c1322';
    ctx.fillRect(0, 160, 640, 200);

    // 2. Render & Update Entities
    let humanCount = 0;
    let vehicleCount = 0;
    let matchDetected = false;
    let highestSim = 0;

    entities.forEach(e => {
      // Move entity
      e.x += e.vx;
      e.y += e.vy;

      // Bounce/wrap borders
      if (e.x < 10) { e.x = 10; e.vx *= -1; }
      if (e.x > 620) { e.x = 620; e.vx *= -1; }
      if (e.y < 120) { e.y = 120; e.vy *= -1; }
      if (e.y > 330) { e.y = 330; e.vy *= -1; }

      if (e.type === 'HUMAN') humanCount++;
      if (e.type === 'VEHICLE') vehicleCount++;

      // Draw entity silhouette
      if (e.type === 'HUMAN') {
        ctx.fillStyle = e.isMatch ? '#ff2a5f' : '#334155';
        ctx.fillRect(e.x + 3, e.y + 10, e.width - 6, e.height - 10); // Body
        ctx.beginPath();
        ctx.arc(e.x + e.width / 2, e.y + 6, 5, 0, Math.PI * 2); // Head
        ctx.fill();
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(e.x, e.y, e.width, e.height);
        // Vehicle lights
        ctx.fillStyle = e.vx > 0 ? '#f59e0b' : '#ff4444';
        ctx.fillRect(e.vx > 0 ? e.x + e.width - 3 : e.x, e.y + 4, 3, 4);
      }

      // Computer Vision Bounding Box Overlay
      if (showBBoxes) {
        if (e.isMatch) {
          matchDetected = true;
          highestSim = 0.994;

          // Glowing critical box
          ctx.strokeStyle = '#ff2a5f';
          ctx.lineWidth = 2;
          ctx.strokeRect(e.x - 2, e.y - 2, e.width + 4, e.height + 4);

          // Face reticle
          ctx.strokeStyle = '#ff2a5f';
          ctx.beginPath();
          ctx.arc(e.x + e.width / 2, e.y + 6, 9, 0, Math.PI * 2);
          ctx.stroke();

          // Label
          ctx.fillStyle = '#ff2a5f';
          ctx.fillRect(e.x - 2, e.y - 18, 120, 14);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`MATCH: ${e.matchTarget ? e.matchTarget.name.toUpperCase() : 'TARGET'} [99.4%]`, e.x, e.y - 8);
        } else if (!threatsOnly) {
          ctx.strokeStyle = e.type === 'HUMAN' ? '#00f0ff' : '#f59e0b';
          ctx.lineWidth = 1;
          ctx.strokeRect(e.x, e.y, e.width, e.height);

          // Corner brackets
          const cl = 4;
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(e.x, e.y + cl); ctx.lineTo(e.x, e.y); ctx.lineTo(e.x + cl, e.y);
          ctx.moveTo(e.x + e.width - cl, e.y); ctx.lineTo(e.x + e.width, e.y); ctx.lineTo(e.x + e.width, e.y + cl);
          ctx.stroke();

          // Label
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(e.x, e.y - 12, 68, 10);
          ctx.fillStyle = e.type === 'HUMAN' ? '#00f0ff' : '#f59e0b';
          ctx.font = '8px monospace';
          ctx.fillText(`${e.type} ${(e.confidence * 100).toFixed(0)}%`, e.x + 2, e.y - 4);
        }
      }
    });

    // Update Live HUD telemetry numbers
    if (threatsOnly) {
      camObjectCount.textContent = matchDetected ? '1 WANTED TARGET (CRITICAL)' : '0 THREATS (FILTERED)';
    } else {
      camObjectCount.textContent = `${humanCount + vehicleCount} (${humanCount} HUMANS, ${vehicleCount} VEHICLES)`;
    }
    if (matchDetected) {
      camMatchBadge.textContent = 'ALERT: TARGET CONFIRMED';
      camMatchBadge.className = 'absolute bottom-2 right-2 text-[10px] text-white font-bold bg-rose-600 px-2 py-0.5 rounded border border-rose-400 animate-pulse';
      camBiometricScore.textContent = '99.4% (CRITICAL MATCH)';
      camBiometricScore.className = 'text-sm font-bold text-rose-400 animate-pulse';
    } else {
      camMatchBadge.textContent = 'NO MATCH DETECTED';
      camMatchBadge.className = 'absolute bottom-2 right-2 text-[10px] text-emerald-400 font-bold bg-black/80 px-1.5 py-0.5 rounded border border-emerald-900/60';
      camBiometricScore.textContent = `${(Math.random() * 40 + 20).toFixed(1)}% (BASELINE)`;
      camBiometricScore.className = 'text-sm font-bold text-slate-300';
    }

    requestAnimationFrame(renderVideoFrame);
  }
  requestAnimationFrame(renderVideoFrame);

  // Vision Filter Modes
  btnVisionMode.addEventListener('click', () => {
    if (visionMode === 'optical') {
      visionMode = 'nvg';
      cameraCanvas.className = 'w-full h-full block vision-nvg';
      btnVisionMode.textContent = 'FILTER: NVG NIGHT VISION';
    } else if (visionMode === 'nvg') {
      visionMode = 'thermal';
      cameraCanvas.className = 'w-full h-full block vision-thermal';
      btnVisionMode.textContent = 'FILTER: FLIR THERMAL';
    } else {
      visionMode = 'optical';
      cameraCanvas.className = 'w-full h-full block';
      btnVisionMode.textContent = 'FILTER: OPTICAL';
    }
    sound.playBlip(950);
  });

  // Bounding Box Toggle
  btnBboxToggle.addEventListener('click', () => {
    showBBoxes = !showBBoxes;
    btnBboxToggle.textContent = showBBoxes ? 'B-BOX: ON' : 'B-BOX: OFF';
    btnBboxToggle.className = showBBoxes 
      ? 'px-2 py-0.5 rounded text-[9px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700' 
      : 'px-2 py-0.5 rounded text-[9px] bg-rose-950 text-rose-300 border border-rose-700';
    sound.playBlip(750);
  });

  // Threats Only Toggle
  btnThreatsOnly.addEventListener('click', () => {
    threatsOnly = !threatsOnly;
    btnThreatsOnly.textContent = threatsOnly ? 'THREATS ONLY: ON' : 'THREATS ONLY: OFF';
    btnThreatsOnly.className = threatsOnly 
      ? 'px-2 py-0.5 rounded text-[9px] bg-rose-900 text-rose-100 border border-rose-500 font-bold shadow-[0_0_8px_rgba(244,63,94,0.4)]' 
      : 'px-2 py-0.5 rounded text-[9px] bg-slate-900 hover:bg-rose-950 text-slate-400 border border-slate-700 hover:border-rose-700 transition';
    sound.playBlip(threatsOnly ? 1100 : 700);
    addLog(threatsOnly ? 'Display filtered: Showing critical wanted threats and warrants only.' : 'Display reset: Showing all optical telemetry.');
  });

  // Logging utility
  function addLog(message, type = 'INFO') {
    const time = new Date().toISOString().substring(11, 19);
    const line = document.createElement('div');
    line.className = 'flex items-start gap-2';

    let badge = '<span class="text-cyan-400 font-bold">[SYS]</span>';
    if (type === 'ALERT') badge = '<span class="text-rose-500 font-bold animate-pulse">[ALERT]</span>';
    if (type === 'DISPATCH') badge = '<span class="text-amber-400 font-bold">[DISPATCH]</span>';
    if (type === 'ORBIT') badge = '<span class="text-purple-400 font-bold">[ORBIT]</span>';

    line.innerHTML = `<span class="text-slate-500 font-mono">${time}</span> ${badge} <span>${message}</span>`;
    telemetryLogs.appendChild(line);
    telemetryLogs.scrollTop = telemetryLogs.scrollHeight;
  }

  // Clear Terminal
  clearLogsBtn.addEventListener('click', () => {
    telemetryLogs.innerHTML = '';
    addLog('Terminal buffer cleared by operator.');
  });

  // Trigger Target Match in Current Camera
  window.triggerTargetMatch = function(suspectId) {
    const suspect = watchlist.find(s => s.id === suspectId) || watchlist[0];
    sound.playAlert();

    // Mark current camera as threat
    activeCamera.threatAlert = true;
    renderCameraMarkers();
    renderSidebarCameraList();

    // Attach to entity in video frame
    const targetEntity = entities.find(e => e.type === 'HUMAN') || entities[0];
    targetEntity.isMatch = true;
    targetEntity.matchTarget = suspect;

    // Create Alert Object
    const alertId = `ALT-${Date.now().toString().slice(-4)}`;
    const newAlert = {
      id: alertId,
      suspect: suspect,
      camera: activeCamera,
      timestamp: new Date().toLocaleTimeString(),
      dispatched: false
    };

    activeAlerts.unshift(newAlert);
    renderAlertFeed();

    addLog(`FACIAL RECOGNITION MATCH CONFIRMED: Target ${suspect.name} (${suspect.id}) detected at ${activeCamera.title}. Similarity: 99.4%`, 'ALERT');

    // Reset match on entity after 18 seconds
    setTimeout(() => {
      targetEntity.isMatch = false;
      targetEntity.matchTarget = null;
      activeCamera.threatAlert = false;
      renderCameraMarkers();
      renderSidebarCameraList();
    }, 18000);
  };

  // Render Alert Feed
  function renderAlertFeed() {
    alertCounter.textContent = `${activeAlerts.length} ACTIVE`;
    if (activeAlerts.length === 0) {
      alertFeedContainer.innerHTML = `
        <div class="text-center py-8 text-slate-500 italic text-[11px]">
          No active critical threat alerts.<br>Monitoring global sensors...
        </div>
      `;
      return;
    }

    alertFeedContainer.innerHTML = '';
    activeAlerts.forEach(alt => {
      const card = document.createElement('div');
      card.className = `p-2.5 rounded border text-[10px] space-y-1.5 transition ${
        alt.dispatched ? 'bg-slate-900/60 border-slate-700' : 'bg-rose-950/40 border-rose-600 shadow-[0_0_10px_rgba(255,42,95,0.2)]'
      }`;

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-rose-400 flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            ${alt.id} // MATCH: ${alt.suspect.name.toUpperCase()}
          </span>
          <span class="text-slate-400 text-[9px]">${alt.timestamp}</span>
        </div>
        <div class="text-slate-300 text-[9px]">Location: <b class="text-cyan-300">${alt.camera.title}</b></div>
        <div class="text-slate-400 text-[9px]">Authority: <b class="text-slate-200">${alt.camera.authority}</b></div>
        
        <div class="pt-1.5 border-t border-slate-800 flex justify-between items-center">
          <span class="text-[9px] ${alt.dispatched ? 'text-emerald-400 font-bold' : 'text-amber-400'}">
            ${alt.dispatched ? '✓ AUTHORITIES DISPATCHED' : 'PENDING ACTION'}
          </span>
          ${
            !alt.dispatched
              ? `<button onclick="window.dispatchAuthority('${alt.id}')" class="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[9px] shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                  DISPATCH FORCES
                </button>`
              : ''
          }
        </div>
      `;
      alertFeedContainer.appendChild(card);
    });
  }

  // Dispatch Authority Action
  window.dispatchAuthority = function(alertId) {
    const alert = activeAlerts.find(a => a.id === alertId);
    if (!alert) return;

    alert.dispatched = true;
    renderAlertFeed();
    sound.playDispatch();

    // Show popup modal notification
    dispatchModalMsg.innerHTML = `
      Immediate priority dispatch transmitted to <b>${alert.camera.authority}</b>.<br>
      Target: <b>${alert.suspect.name}</b> (${alert.suspect.id}).<br>
      GPS: ${alert.camera.coords[0].toFixed(4)}, ${alert.camera.coords[1].toFixed(4)}. Tactical intercept in progress.
    `;
    dispatchModal.classList.remove('hidden');

    setTimeout(() => {
      dispatchModal.classList.add('hidden');
    }, 4500);

    addLog(`AUTOMATED DISPATCH TRANSMITTED: Local authorities notified at ${alert.camera.authority}. Tactical units deployed to Sector.`, 'DISPATCH');
  };

  // Test Alert Button in Header
  triggerSimThreatBtn.addEventListener('click', () => {
    const randomSuspect = watchlist[Math.floor(Math.random() * watchlist.length)];
    window.triggerTargetMatch(randomSuspect.id);
  });

  // Modal Handlers: Add Custom Suspect
  btnAddSuspect.addEventListener('click', () => {
    suspectModal.classList.remove('hidden');
    targetNameInput.value = '';
    targetCrimeInput.value = '';
    targetNameInput.focus();
  });

  closeModalBtn.addEventListener('click', () => suspectModal.classList.add('hidden'));
  cancelModalBtn.addEventListener('click', () => suspectModal.classList.add('hidden'));

  saveSuspectBtn.addEventListener('click', () => {
    const name = targetNameInput.value.trim();
    const crime = targetCrimeInput.value.trim();
    const threat = targetThreatInput.value;

    if (!name || !crime) {
      alert('Please enter both name and offense.');
      return;
    }

    const initials = name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'TG';
    const newSuspect = {
      id: `RN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name,
      crime: crime,
      threat: threat,
      lastSeen: 'Unknown',
      photoId: initials
    };

    watchlist.unshift(newSuspect);
    renderWatchlist();
    suspectModal.classList.add('hidden');
    sound.playBlip(1100);
    addLog(`Operator registered new POI to Sentinel global database: ${newSuspect.name} (${newSuspect.id}).`);
  });

  // Audio Toggle Button
  toggleAudioBtn.addEventListener('click', () => {
    sound.enabled = !sound.enabled;
    toggleAudioBtn.innerHTML = sound.enabled
      ? '<i data-lucide="volume-2" class="w-4 h-4 text-cyan-400"></i>'
      : '<i data-lucide="volume-x" class="w-4 h-4 text-slate-500"></i>';
    if (window.lucide) lucide.createIcons();
    if (sound.enabled) sound.playBlip(880);
  });

  // Radar effect toggle
  toggleRadar.addEventListener('change', (e) => {
    radarScanner.style.display = e.target.checked ? 'block' : 'none';
  });

  // Orbit line toggle
  toggleOrbit.addEventListener('change', (e) => {
    if (e.target.checked) {
      map.addLayer(orbitLine);
      map.addLayer(satMarker);
      map.addLayer(satCone);
    } else {
      map.removeLayer(orbitLine);
      map.removeLayer(satMarker);
      map.removeLayer(satCone);
    }
  });

  // Clock Update & Continuous Simulated Telemetry
  setInterval(() => {
    const now = new Date();
    simClock.textContent = now.toUTCString().split(' ')[4] + ' UTC';
  }, 1000);

  // Periodic Tactical Logs
  const periodicLogs = [
    { msg: 'SENTINEL-7A completed LEO optical sweep of Sector 4. Resolution: 30cm/pixel.', type: 'ORBIT' },
    { msg: 'Syncing Interpol Red Notice database delta. 14 new warrants indexed.', type: 'INFO' },
    { msg: 'Shibuya Crossing feed telemetry: Optical flow density at 78% capacity.', type: 'INFO' },
    { msg: 'ArcFace neural inference worker node #4: 12ms average latency.', type: 'INFO' },
    { msg: 'Automated ALPR license plate scanner matched 4,120 plates/min in Sector 1.', type: 'INFO' }
  ];

  let logIdx = 0;
  setInterval(() => {
    const item = periodicLogs[logIdx % periodicLogs.length];
    addLog(item.msg, item.type);
    logIdx++;
  }, 8500);

  // Initial Welcome Logs
  addLog('PROJECT SENTINEL // Command Center Initialized.');
  addLog('Esri High-Resolution Satellite World Imagery connected.');
  addLog('8 Global Metro Camera Networks streaming.');
  addLog('AI Biometric Identification & Automated Dispatch Engine active.');
});
