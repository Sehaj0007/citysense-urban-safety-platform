import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Clock, MapPin, AlertTriangle, Calendar, Loader } from 'lucide-react';

const UserDashboard = () => {
  // Simulated user data - replace with actual useAuth() hook
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call - replace with actual api.get('/incidents/my')
    const fetchMyIncidents = async () => {
      try {
        const { data } = await api.get('/incidents/my');
        setIncidents(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch incidents', error);
        setLoading(false);
      }
    };

    fetchMyIncidents();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 mb-8 border border-white/20 animate-slideDown">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Welcome, {user?.name}
              </h1>
              <p className="text-slate-600 text-lg">Manage your reports and account settings.</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{incidents.length}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Total Reports</div>
            </div>
            <div className="text-center border-l border-r border-slate-200">
              <div className="text-2xl font-bold text-green-600">Active</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">100%</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Privacy</div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-6 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full mr-3"></div>
            Your Reported Incidents
          </h2>
          <p className="text-slate-600 ml-7 mt-1">Track and manage all your incident reports</p>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
            <Loader className="w-12 h-12 text-red-500 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Loading your incidents...</p>
          </div>
        ) : incidents.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-xl text-center border border-white/20 animate-slideUp" style={{ animationDelay: '200ms' }}>
            <div className="inline-block bg-slate-100 p-6 rounded-full mb-6">
              <AlertTriangle className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Incidents Reported Yet</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              You haven't reported any incidents yet. Help make your community safer by reporting incidents when you see them.
            </p>
            <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Report an Incident
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {incidents.map((incident, index) => (
              <div 
                key={incident._id} 
                className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-red-200 transform hover:scale-105 animate-slideUp"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-xl border-2 ${getIncidentColor(incident.type)} transition-all duration-300 group-hover:scale-105`}>
                      {incident.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <div className="flex items-center text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {new Date(incident.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-slate-800 font-medium mb-4 line-clamp-3 leading-relaxed">
                    {incident.description}
                  </p>
                  
                  {/* Location */}
                  <div className="flex items-start text-slate-600 text-sm mt-4 pt-4 border-t border-slate-100">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
                    <span className="line-clamp-2">
                      {incident.address || `${incident.location.coordinates[1].toFixed(4)}, ${incident.location.coordinates[0].toFixed(4)}`}
                    </span>
                  </div>
                  
                  {/* Footer Badge */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      ✓ Submitted
                    </span>
                    <button 
                      onClick={() => navigate(`/incident/${incident._id}`)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors duration-300 hover:gap-1.5"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;