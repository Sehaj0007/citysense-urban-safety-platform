import { useState, useEffect, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, ScaleControl, GeolocateControl, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertTriangle, MapPin, Layers, Filter, Calendar } from 'lucide-react';
import api from '../services/api';

// Fallback to a warning if no token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 12
  });

  // Filter States
  const [viewMode, setViewMode] = useState('markers'); // 'markers' | 'heatmap'
  const [timeFilter, setTimeFilter] = useState('all'); // 'all' | '24h' | '7d' | '30d'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'harassment' | 'theft' | 'violence' | 'other'

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const { data } = await api.get('/incidents');
        setIncidents(data);
      } catch (error) {
        console.error('Failed to fetch incidents', error);
      }
    };

    fetchIncidents();
    
    // Attempt to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setViewState({
          ...viewState,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          zoom: 14
        });
      });
    }
  }, []);

  // Filter Logic
  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      // Category Filter
      if (categoryFilter !== 'all' && incident.type !== categoryFilter) return false;

      // Time Filter
      if (timeFilter !== 'all') {
        const incidentDate = new Date(incident.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - incidentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (timeFilter === '24h' && diffDays > 1) return false;
        if (timeFilter === '7d' && diffDays > 7) return false;
        if (timeFilter === '30d' && diffDays > 30) return false;
      }

      return true;
    });
  }, [incidents, categoryFilter, timeFilter]);

  // Heatmap Data Source
  const heatmapData = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: filteredIncidents.map(incident => ({
        type: 'Feature',
        properties: { mag: 1 }, // Magnitude for heatmap weight
        geometry: {
          type: 'Point',
          coordinates: incident.location.coordinates
        }
      }))
    };
  }, [filteredIncidents]);

  const pins = useMemo(
    () =>
      filteredIncidents.map((incident, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={incident.location.coordinates[0]}
          latitude={incident.location.coordinates[1]}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            setSelectedIncident(incident);
          }}
        >
          <MapPin className={`w-8 h-8 ${incident.type === 'harassment' ? 'text-red-600' : incident.type === 'theft' ? 'text-orange-600' : 'text-blue-600'} hover:scale-110 transition cursor-pointer drop-shadow-lg`} fill="currentColor" />
        </Marker>
      )),
    [filteredIncidents]
  );

  const heatmapLayer = {
    id: 'heatmap',
    type: 'heatmap',
    paint: {
      // Increase the heatmap weight based on frequency and property magnitude
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', 'mag'],
        0, 0,
        6, 1
      ],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      'heatmap-intensity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0, 1,
        9, 3
      ],
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(33,102,172,0)',
        0.2, 'rgb(103,169,207)',
        0.4, 'rgb(209,229,240)',
        0.6, 'rgb(253,219,199)',
        0.8, 'rgb(239,138,98)',
        1, 'rgb(178,24,43)'
      ],
      // Adjust the heatmap radius by zoom level
      'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0, 2,
        9, 20
      ],
      // Transition from heatmap to circle layer by zoom level
      'heatmap-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        7, 1,
        15, 0.5
      ]
    }
  };

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes('placeholder')) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-slate-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Mapbox Token Required</h2>
          <p className="text-gray-600 mb-4">
            Please add a valid Mapbox token to the <code>.env</code> file in the client directory to view the map.
          </p>
          <p className="text-sm text-gray-500">
            Variable: <code>VITE_MAPBOX_TOKEN</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] w-full relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{width: '100%', height: '100%'}}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {viewMode === 'markers' && pins}
        
        {viewMode === 'heatmap' && (
          <Source type="geojson" data={heatmapData}>
            <Layer {...heatmapLayer} />
          </Source>
        )}

        {viewMode === 'markers' && selectedIncident && (
          <Popup
            anchor="top"
            longitude={selectedIncident.location.coordinates[0]}
            latitude={selectedIncident.location.coordinates[1]}
            onClose={() => setSelectedIncident(null)}
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg capitalize">{selectedIncident.type.replace('_', ' ')}</h3>
              <p className="text-gray-600 text-sm mb-2">{new Date(selectedIncident.createdAt).toLocaleString()}</p>
              <p className="text-gray-800">{selectedIncident.description}</p>
              {selectedIncident.imageUrl && (
                <img src={selectedIncident.imageUrl} alt="Incident" className="mt-2 rounded-md w-full h-32 object-cover" />
              )}
            </div>
          </Popup>
        )}
      </Map>
      
      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg opacity-95 max-w-xs space-y-4">
        {/* View Mode Toggle */}
        <div>
          <h3 className="font-bold mb-2 flex items-center text-sm"><Layers className="w-4 h-4 mr-2"/> View Mode</h3>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('markers')}
              className={`flex-1 py-1 text-sm rounded-md transition ${viewMode === 'markers' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Markers
            </button>
            <button 
              onClick={() => setViewMode('heatmap')}
              className={`flex-1 py-1 text-sm rounded-md transition ${viewMode === 'heatmap' ? 'bg-white shadow text-red-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Heatmap
            </button>
          </div>
        </div>

        {/* Time Filter */}
        <div>
          <h3 className="font-bold mb-2 flex items-center text-sm"><Calendar className="w-4 h-4 mr-2"/> Time Range</h3>
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="font-bold mb-2 flex items-center text-sm"><Filter className="w-4 h-4 mr-2"/> Incident Type</h3>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="harassment">Harassment</option>
            <option value="theft">Theft</option>
            <option value="violence">Violence</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Legend / Overlay */}
      {viewMode === 'markers' && (
        <div className="absolute bottom-8 left-8 bg-white p-4 rounded-lg shadow-lg opacity-90">
          <h3 className="font-bold mb-2 text-sm">Incident Types</h3>
          <div className="space-y-2 text-xs">
              <div className="flex items-center"><span className="w-3 h-3 bg-red-600 rounded-full mr-2"></span> Harassment</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-orange-600 rounded-full mr-2"></span> Theft</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span> Other</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
