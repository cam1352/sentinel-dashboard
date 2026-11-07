# PROJECT SENTINEL // Global RTCC & Threat Detection Simulator

An interactive Real-Time Operations Center (RTCC) simulator demonstrating how modern defense, municipal surveillance networks, and computer vision threat detection dashboards operate.

---

## Key Features

1. **Global Satellite Reconnaissance Layer**:
   - Integrates high-resolution **Esri World Imagery** satellite tiles.
   - Includes real-time Low Earth Orbit (LEO) satellite constellation trajectory with dynamic sensor ground footprint tracking.
   - Animated radar scanline sweep effect with layer toggles.

2. **Simulated City CCTV Camera Matrix**:
   - 8 active global metropolitan surveillance hubs (NYC Times Square, London Trafalgar, Tokyo Shibuya Crossing, Paris Champs-Élysées, Sydney Circular Quay, Singapore Marina Bay, Dubai, Berlin).
   - Interactive map pins with jurisdictional routing (NYPD RTCC, Met Police, Tokyo MPD, SPF, etc.).

3. **Computer Vision & Biometric AI Engine**:
   - Canvas-driven real-time tracking engine generating dynamic pedestrians, vehicles, and optical flow.
   - Dynamic Computer Vision bounding boxes (`HUMAN`, `VEHICLE`) with synthetic confidence scores.
   - Multi-mode optics: **Optical Standard**, **FLIR Thermal Infrared**, and **NVG Night Vision** filter simulations.

4. **Wanted / Interpol Red Notice Watchlist**:
   - Pre-loaded with international wanted profiles.
   - Interactive Target Injection modal allowing operators to register custom names and warrants into the active scanning matrix.

5. **Automated Incident & Authority Dispatch**:
   - Real-time facial recognition match alerts with audio alarms (synthesized via Web Audio API, zero audio file dependencies).
   - One-click **Dispatch Forces** protocol that transmits simulated tactical response notifications to local authorities.
   - Continuous telemetry stream logging detection batches, orbital passes, and dispatch actions.

---

## How to Run

Because this project is built with zero runtime build dependencies, you can run it immediately:

1. **Direct Browser**: Open [`index.html`](index.html) directly in Chrome, Edge, Firefox, or Safari.
2. **Local HTTP Server** (Optional):
   ```bash
   npx serve .
   # or
   python -m http.server 8080
   ```

---

## Open-Source Libraries Used

- [Leaflet.js](https://github.com/Leaflet/Leaflet) - Mobile-friendly interactive maps
- [Lucide Icons](https://github.com/lucide-icons/lucide) - Beautiful & consistent tactical iconography
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Esri World Imagery](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9) - Global satellite basemap
