import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  AlertTriangle, 
  MapPin, 
  Loader, 
  Navigation, 
  FileText, 
  Shield,
  CheckCircle2,
  Upload,
  X,
  Camera,
  Search
} from 'lucide-react';
import indianCity from '../assets/indian-city.jpg';
import api from '../services/api';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map center when state changes
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15);
  }, [center, map]);
  return null;
}

// Component to handle map clicks
function LocationMarker({ position, setPosition, setAddress }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      // Reverse geocode on click
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          setAddress(data.display_name);
        })
        .catch(() => setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`));
    },
  });

  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
          // Reverse geocode on drag end
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(res => res.json())
            .then(data => {
              setAddress(data.display_name);
            })
            .catch(() => setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`));
        }
      },
    }),
    [setPosition, setAddress],
  );

  return position === null ? null : (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup>Incident Location</Popup>
    </Marker>
  );
}

const ReportIncident = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    address: '', // Manual input or reverse geocoded
    imageFile: null,
    imagePreview: null,
    isAnonymous: false
  });
  
  // Separate state for map coordinates
  // Default to a central location (e.g., New Delhi) if no location found
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); 
  const [markerPosition, setMarkerPosition] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  // Initial geolocation on load (optional, maybe better to let user click)
  useEffect(() => {
    // navigator.geolocation.getCurrentPosition(...) 
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const newPos = [lat, lng];
          
          setMapCenter(newPos);
          setMarkerPosition(newPos);
          
          // Reverse geocoding
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(res => res.json())
            .then(data => {
              setFormData(prev => ({
                ...prev,
                address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
              }));
              setGeoLoading(false);
            })
            .catch(err => {
              console.error('Geocoding error:', err);
              setFormData(prev => ({
                ...prev,
                address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
              }));
              setGeoLoading(false);
            });
        },
        (err) => {
          console.error(err);
          setGeoLoading(false);
          alert('Could not get location. Please check your permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleAddressSearch = () => {
    if (!formData.address) return;
    
    setSearchLoading(true);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          const newPos = [lat, lng];
          
          setMapCenter(newPos);
          setMarkerPosition(newPos);
          // Update address to the official one from search (optional, helps standardize)
          // setFormData(prev => ({ ...prev, address: data[0].display_name }));
        } else {
          alert('Location not found. Please try a more specific address.');
        }
        setSearchLoading(false);
      })
      .catch(err => {
        console.error('Search error:', err);
        setSearchLoading(false);
        alert('Error searching for location.');
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.type) newErrors.type = 'Please select an incident type';
    if (!formData.description) newErrors.description = 'Please provide a description';
    if (!markerPosition) {
      newErrors.location = 'Please select a location on the map';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setServerError('');
    
    try {
      const payload = {
        type: formData.type,
        description: formData.description,
        latitude: markerPosition[0],
        longitude: markerPosition[1],
        address: formData.address,
        isAnonymous: formData.isAnonymous,
        // imageUrl: '' // Backend doesn't support file upload yet
      };

      const response = await api.post('/incidents', payload);
      
      console.log('Incident reported:', response.data);
      alert('Incident reported successfully!');
      navigate('/'); // Redirect to home/map
    } catch (error) {
      console.error('Error reporting incident:', error);
      setServerError(error.response?.data?.message || 'Failed to report incident. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: previewUrl
      }));
    }
  };

  const removeImage = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData(prev => ({
      ...prev,
      imageFile: null,
      imagePreview: null
    }));
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12 overflow-y-auto">
        <div className="max-w-xl w-full mx-auto animate-fadeIn">
          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20 transition-all duration-500 hover:shadow-3xl">
            {/* Header */}
            <div className="flex items-center justify-center mb-10 animate-slideDown">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg transform transition-transform hover:scale-110 duration-300">
                  <AlertTriangle className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="ml-5 text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Report an Incident
              </h2>
            </div>

            {serverError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-xl mb-6 flex items-center animate-slideDown shadow-sm">
                <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium">{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Incident Type */}
              <div className="animate-slideUp" style={{ animationDelay: '100ms' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5 flex items-center">
                  Incident Type
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <AlertTriangle className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'type' ? 'text-red-500' : 'text-slate-400'}`} />
                  </div>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('type')}
                    onBlur={() => setFocusedField('')}
                    className="block w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 outline-none appearance-none hover:border-slate-300 cursor-pointer font-medium text-slate-700"
                  >
                    <option value="">Select Type</option>
                    <option value="harassment">Harassment</option>
                    <option value="theft">Theft</option>
                    <option value="unsafe_lighting">Unsafe Lighting</option>
                    <option value="stalking">Stalking</option>
                    <option value="assault">Assault</option>
                    <option value="suspicious_activity">Suspicious Activity</option>
                    <option value="noise_complaint">Noise Complaint</option>
                    <option value="vandalism">Vandalism</option>
                    <option value="traffic_hazard">Traffic Hazard</option>
                    <option value="public_disturbance">Public Disturbance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {errors.type && <p className="text-red-500 text-xs mt-2">{errors.type}</p>}
              </div>

              {/* Description */}
              <div className="animate-slideUp" style={{ animationDelay: '200ms' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5 flex items-center">
                  Description
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative group">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => setFocusedField('')}
                    rows={4}
                    className="block w-full px-4 py-3.5 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 outline-none resize-none hover:border-slate-300 font-medium text-slate-700"
                    placeholder="Describe what happened..."
                  />
                  <div className={`absolute top-3.5 right-3.5 ${focusedField === 'description' ? 'text-red-500' : 'text-slate-400'}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
                {errors.description && <p className="text-red-500 text-xs mt-2">{errors.description}</p>}
              </div>

              {/* Location Section */}
              <div className="animate-slideUp" style={{ animationDelay: '300ms' }}>
                <div className="bg-slate-50/50 p-5 rounded-2xl border-2 border-slate-200 shadow-sm">
                  <label className="block text-sm font-semibold text-slate-700 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-red-500" />
                    Location Details
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  
                  {/* Address Input & Search */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address to search..."
                      className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddressSearch())}
                    />
                    <button
                      type="button"
                      onClick={handleAddressSearch}
                      disabled={searchLoading}
                      className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      {searchLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={geoLoading}
                    className="w-full flex items-center justify-center py-3 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 text-sm font-semibold shadow-md mb-4"
                  >
                    {geoLoading ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <Navigation className="w-5 h-5 mr-2" />}
                    Use My Current Location
                  </button>

                  {/* Map */}
                  <div className="h-64 w-full rounded-xl overflow-hidden border-2 border-slate-200 relative z-0">
                    <MapContainer 
                      center={mapCenter} 
                      zoom={13} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapUpdater center={mapCenter} />
                      <LocationMarker 
                        position={markerPosition} 
                        setPosition={(pos) => {
                          setMarkerPosition(pos);
                          setMapCenter(pos);
                        }}
                        setAddress={(addr) => setFormData(prev => ({ ...prev, address: addr }))}
                      />
                    </MapContainer>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Tap/Click on map or drag marker to refine location.
                  </p>
                  
                  {errors.location && <p className="text-red-500 text-xs mt-3 text-center">{errors.location}</p>}
                </div>
              </div>

              {/* Image Upload */}
              <div className="animate-slideUp" style={{ animationDelay: '400ms' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                  Upload Evidence Image (Optional)
                </label>
                
                {!formData.imagePreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="group relative block w-full p-8 bg-slate-50/50 border-2 border-dashed border-slate-300 rounded-xl hover:border-red-400 hover:bg-red-50/30 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-red-500 transition-colors" />
                        <p className="text-sm font-semibold text-slate-700">Click to upload or drag and drop</p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border-2 border-green-200 bg-green-50 p-3">
                    <img src={formData.imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed animate-slideUp"
                style={{ animationDelay: '600ms' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="w-6 h-6 mr-2 animate-spin" />
                    Submitting Report...
                  </span>
                ) : (
                  'Submit Report'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Info Section */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/40 z-10 backdrop-blur-[2px]"></div>
        <img 
          src={indianCity} 
          alt="City Safety" 
          className="absolute inset-0 w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-[20s] ease-in-out"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-start items-center px-12 pt-20 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent text-center">
          <div className="max-w-xl w-full">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
              Make Your City <br/>
              <span className="text-red-500">Safer</span> Together
            </h1>
            
            <p className="text-lg text-slate-200 leading-relaxed mb-10 max-w-lg mx-auto drop-shadow-lg font-medium">
              Your voice matters. Report incidents in real-time and help us build a secure environment for everyone. Community safety starts with you.
            </p>

            <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-12 text-left">
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center group hover:bg-white/10 transition-all duration-300">
                <div className="bg-red-500/20 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Anonymous</h3>
                  <p className="text-slate-300 text-xs">Protect your identity</p>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center group hover:bg-white/10 transition-all duration-300">
                <div className="bg-blue-500/20 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Real-time</h3>
                  <p className="text-slate-300 text-xs">Live map updates</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-8 max-w-lg mx-auto">
              <div>
                <h4 className="text-4xl font-bold text-white">24/7</h4>
                <p className="text-slate-300 text-sm mt-1 font-medium">Monitoring</p>
              </div>
              <div>
                <h4 className="text-4xl font-bold text-white">100%</h4>
                <p className="text-slate-300 text-sm mt-1 font-medium">Secure</p>
              </div>
              <div>
                <h4 className="text-4xl font-bold text-white">Fast</h4>
                <p className="text-slate-300 text-sm mt-1 font-medium">Response</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideRight {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes float {
        0%, 100% {
          transform: translate(0, 0) scale(1);
          opacity: 0.3;
        }
        33% {
          transform: translate(30px, -30px) scale(1.1);
          opacity: 0.5;
        }
        66% {
          transform: translate(-20px, 20px) scale(0.9);
          opacity: 0.4;
        }
      }

      @keyframes floatDelayed {
        0%, 100% {
          transform: translate(0, 0) scale(1);
          opacity: 0.25;
        }
        33% {
          transform: translate(-40px, 30px) scale(1.15);
          opacity: 0.45;
        }
        66% {
          transform: translate(25px, -25px) scale(0.95);
          opacity: 0.35;
        }
      }

      @keyframes floatSlow {
        0%, 100% {
          transform: translate(0, 0) scale(1);
          opacity: 0.2;
        }
        50% {
          transform: translate(20px, -40px) scale(1.05);
          opacity: 0.4;
        }
      }

      .animate-fadeIn {
        animation: fadeIn 0.8s ease-out forwards;
      }

      .animate-slideDown {
        animation: slideDown 0.6s ease-out forwards;
      }

      .animate-slideUp {
        animation: slideUp 0.6s ease-out forwards;
        opacity: 0;
      }

      .animate-slideRight {
        animation: slideRight 0.8s ease-out forwards;
        opacity: 0;
      }

      .animate-float {
        animation: float 8s ease-in-out infinite;
      }

      .animate-float-delayed {
        animation: floatDelayed 10s ease-in-out infinite;
      }

      .animate-float-slow {
        animation: floatSlow 12s ease-in-out infinite;
      }
    `}</style>
    </div>
  );
};

export default ReportIncident;
