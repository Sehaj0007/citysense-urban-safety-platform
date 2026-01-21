import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { MapPin, Calendar, AlertTriangle, ArrowLeft, Loader, Phone, Mail } from 'lucide-react';

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine which dashboard to navigate back to
  const getBackPath = () => {
    return user?.role === 'admin' ? '/admin' : '/dashboard';
  };

  useEffect(() => {
    const fetchIncidentDetail = async () => {
      try {
        const { data } = await api.get(`/incidents/${id}`);
        setIncident(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch incident details', err);
        setError('Failed to load incident details');
        setLoading(false);
      }
    };

    fetchIncidentDetail();
  }, [id]);

  const getIncidentColor = (type) => {
    const colors = {
      harassment: 'bg-red-100 text-red-800 border-red-200',
      theft: 'bg-orange-100 text-orange-800 border-orange-200',
      unsafe_lighting: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      stalking: 'bg-purple-100 text-purple-800 border-purple-200',
      assault: 'bg-red-100 text-red-800 border-red-200',
      suspicious_activity: 'bg-blue-100 text-blue-800 border-blue-200',
      noise_complaint: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      vandalism: 'bg-pink-100 text-pink-800 border-pink-200',
      traffic_hazard: 'bg-amber-100 text-amber-800 border-amber-200',
      public_disturbance: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || colors.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-red-500 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Loading incident details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(getBackPath())}
            className="flex items-center text-red-600 hover:text-red-700 font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
            <p className="text-red-700">{error || 'Incident not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(getBackPath())}
          className="flex items-center text-red-600 hover:text-red-700 font-semibold mb-6 transition-colors hover:gap-3"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform" />
          Back to Dashboard
        </button>

        {/* Main Detail Card */}
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20 mb-6 animate-slideDown">
          {/* Header with Type and Date */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 pb-6 border-b border-slate-200">
            <div>
              <span className={`inline-block px-4 py-2 text-sm font-bold rounded-xl border-2 mb-4 ${getIncidentColor(incident.type)}`}>
                {incident.type.replace('_', ' ').toUpperCase()}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Incident Details</h1>
              <p className="text-slate-600">ID: {incident._id}</p>
            </div>
            <div className="flex items-center text-slate-600 bg-slate-50 px-4 py-2 rounded-lg mt-4 md:mt-0">
              <Calendar className="w-5 h-5 mr-2 text-red-500" />
              <div>
                <div className="text-sm font-medium">Reported</div>
                <div className="font-semibold">{new Date(incident.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
              <div className="w-1 h-6 bg-red-500 rounded-full mr-3"></div>
              Description
            </h2>
            <p className="text-slate-700 text-lg leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-200">
              {incident.description}
            </p>
          </div>

          {/* Image Section */}
          {incident.imageUrl && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                <div className="w-1 h-6 bg-red-500 rounded-full mr-3"></div>
                Evidence Image
              </h2>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-hidden">
                <img 
                  src={incident.imageUrl} 
                  alt="Incident Evidence" 
                  className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Location Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-500" />
              Location
            </h2>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              {incident.address && (
                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-1">Address</p>
                  <p className="text-lg font-semibold text-slate-800">{incident.address}</p>
                </div>
              )}
              {incident.location && incident.location.coordinates && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Coordinates</p>
                  <p className="text-base font-mono text-slate-800 bg-white px-3 py-2 rounded border border-slate-200">
                    {incident.location.coordinates[1].toFixed(6)}, {incident.location.coordinates[0].toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Status Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              Status
            </h2>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-4 py-2 bg-green-50 border-2 border-green-200 text-green-800 font-semibold rounded-lg">
                <span className="w-2.5 h-2.5 bg-green-600 rounded-full mr-2 inline-block"></span>
                Submitted
              </span>
              <span className="text-slate-600">Submitted on {new Date(incident.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Reporter Info Section */}
          {incident.reportedBy && (
            <div className="mb-8 pb-8 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                <div className="w-1 h-6 bg-slate-400 rounded-full mr-3"></div>
                Reporter Information
              </h2>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <p className="text-slate-700 mb-2"><span className="font-semibold">Name:</span> {incident.reportedBy.name || 'Anonymous'}</p>
                {incident.reportedBy.email && (
                  <p className="text-slate-700 flex items-center mb-2">
                    <Mail className="w-4 h-4 mr-2 text-slate-500" />
                    <span>{incident.reportedBy.email}</span>
                  </p>
                )}
                {incident.reportedBy.phone && (
                  <p className="text-slate-700 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-slate-500" />
                    <span>{incident.reportedBy.phone}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(getBackPath())}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => window.open(`https://maps.google.com/?q=${incident.location?.coordinates[1]},${incident.location?.coordinates[0]}`, '_blank')}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View on Map
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        .animate-slideDown {
          animation: slideDown 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default IncidentDetail;
