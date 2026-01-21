import "leaflet/dist/leaflet.css";
import { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet.heat";
import { Layers, Filter, Calendar, MapPin, Flame, ChevronDown } from "lucide-react";
import api from "../services/api";

/* =======================
   Constants (North India)
======================= */
const DEFAULT_CENTER = [30.7333, 76.7794]; // Chandigarh / Mohali
const DEFAULT_ZOOM = 13;

/* =======================
   Custom Marker Icons
======================= */
const createMarkerIcon = (color) =>
  L.divIcon({
    className: "leaflet-marker-hover",
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24"
        fill="${color}" stroke="white" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10z"/>
        <circle cx="12" cy="11" r="2.8"/>
      </svg>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -36],
  });

const INCIDENT_ICONS = {
  harassment: createMarkerIcon("#dc2626"),          // red
  theft: createMarkerIcon("#0c4fea"),               // blue
  unsafe_lighting: createMarkerIcon("#f59e0b"),     // amber / warning
  stalking: createMarkerIcon("#9333ea"),            // purple
  assault: createMarkerIcon("#7f1d1d"),              // dark red
  suspicious_activity: createMarkerIcon("#0f766e"), // teal 
  noise_complaint : createMarkerIcon("#14b8a6"),    // cyan
  vandalism: createMarkerIcon("#b98c04ff"),       // yellow brown
  traffic_hazard: createMarkerIcon("#f97316"),     // orange
  public_disturbance: createMarkerIcon("#093101ff"), // dark green
  other: createMarkerIcon("#6b7280"),                // grey
  default: createMarkerIcon("#010914"),   
             // fallback
};

/* =======================
   Heatmap Layer Component
======================= */
const Heatmap = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    const heatLayer = L.heatLayer(
  points.map((p) => [p.lat, p.lng, p.intensity]),
  {
    radius: 28,
    blur: 18,
    maxZoom: 17,
    gradient: {
      0.2: "red",       // outer (low density)
      0.5: "yellow",    // mid density
      0.9: "red",   // high density (core)
    },
  }
);


    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

/* =======================
   Main Component
======================= */
const MapPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Filters
  const [viewMode, setViewMode] = useState("markers"); // markers | heatmap
  const [timeFilter, setTimeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  /* =======================
     Fetch Data + Geolocation
  ======================= */
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const { data } = await api.get("/incidents");
        setIncidents(data);
      } catch (error) {
        console.error("Failed to fetch incidents", error);
      }
    };

    fetchIncidents();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn("Geolocation permission denied")
      );
    }
  }, []);

  /* =======================
     Filtering Logic
  ======================= */
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      if (categoryFilter !== "all" && incident.type !== categoryFilter) {
        return false;
      }

      if (timeFilter !== "all") {
        const incidentDate = new Date(incident.createdAt);
        const now = new Date();
        const diffDays = Math.ceil(
          Math.abs(now - incidentDate) / (1000 * 60 * 60 * 24)
        );

        if (timeFilter === "24h" && diffDays > 1) return false;
        if (timeFilter === "7d" && diffDays > 7) return false;
        if (timeFilter === "30d" && diffDays > 30) return false;
      }

      return true;
    });
  }, [incidents, categoryFilter, timeFilter]);

  /* =======================
     Markers
  ======================= */
  const markers = useMemo(
    () =>
      filteredIncidents.map((incident) => {
        const icon =
          INCIDENT_ICONS[incident.type] || INCIDENT_ICONS.default;

        return (
          <Marker
            key={incident._id}
            position={[
              incident.location.coordinates[1],
              incident.location.coordinates[0],
            ]}
            icon={icon}
            eventHandlers={{
              click: () => setSelectedIncident(incident),
            }}
          />
        );
      }),
    [filteredIncidents]
  );

  /* =======================
     Heatmap Points
  ======================= */
  const heatmapPoints = useMemo(
    () =>
      filteredIncidents.map((incident) => ({
        lat: incident.location.coordinates[1],
        lng: incident.location.coordinates[0],
        intensity: 1,
      })),
    [filteredIncidents]
  );

  /* =======================
     Render
  ======================= */
  return (
    <div className="h-[calc(100vh-64px)] w-full relative">
      <MapContainer
        center={userLocation || DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ width: "100%", height: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {viewMode === "markers" && (
          <MarkerClusterGroup>{markers}</MarkerClusterGroup>
        )}

        {viewMode === "heatmap" && <Heatmap points={heatmapPoints} />}

        {selectedIncident && (
          <Popup
            position={[
              selectedIncident.location.coordinates[1],
              selectedIncident.location.coordinates[0],
            ]}
            onClose={() => setSelectedIncident(null)}
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg capitalize">
                {selectedIncident.type.replace("_", " ")}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {new Date(selectedIncident.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-800">
                {selectedIncident.description}
              </p>
              {selectedIncident.imageUrl && (
                <img
                  src={selectedIncident.imageUrl}
                  alt="Incident"
                  className="mt-2 rounded-md w-full h-32 object-cover"
                />
              )}
            </div>
          </Popup>
        )}
      </MapContainer>

      {/* =======================
         Controls Overlay
      ======================= */}
      <div className="absolute top-4 right-4 backdrop-blur-md bg-white/80 border border-white/50 shadow-xl rounded-2xl p-5 max-w-sm space-y-5 z-[1000] ring-1 ring-black/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-700" />
            <span className="font-semibold text-slate-800">Map Controls</span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {filteredIncidents.length} results
          </span>
        </div>
        <div className="border-t border-slate-200/60" />
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-600 mb-1">View Mode</div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("markers")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all shadow-sm ${
                viewMode === "markers"
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-200"
                  : "bg-white/70 text-slate-700 hover:bg-white"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Markers</span>
            </button>
            <button
              onClick={() => setViewMode("heatmap")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all shadow-sm ${
                viewMode === "heatmap"
                  ? "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-red-200"
                  : "bg-white/70 text-slate-700 hover:bg-white"
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Heatmap</span>
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-600 mb-1">Time Range</div>
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white/80 shadow-sm pl-3 pr-9 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-600 mb-1">Incident Type</div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white/80 shadow-sm pl-3 pr-9 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="harassment">Harassment</option>
              <option value="theft">Theft</option>
              <option value="assault">Assault</option>
              <option value="stalking">Stalking</option>
              <option value="unsafe_lighting">Unsafe Lighting</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* =======================
          Heatmap Legend
      ======================= */}
      {viewMode === "heatmap" && (
        <div
          className="absolute bottom-8 left-8 bg-white p-4 rounded-lg shadow-lg opacity-95 z-[1000]"
        >
          <h3 className="font-bold mb-3 text-sm">Heatmap Intensity</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center">
              <span
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: "red" }}
              ></span>
              High Density
            </div>
            <div className="flex items-center">
              <span
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: "yellow" }}
              ></span>
              Medium Density
            </div>
            <div className="flex items-center">
              <span
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: "skyblue" }}
              ></span>
              Low Density
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default MapPage;
