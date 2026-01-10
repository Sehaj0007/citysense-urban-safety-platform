import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Clock, MapPin } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyIncidents = async () => {
      try {
        const { data } = await api.get('/incidents/my');
        setIncidents(data);
      } catch (error) {
        console.error('Failed to fetch incidents', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyIncidents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-1">Manage your reports and account settings.</p>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Reported Incidents</h2>
        
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : incidents.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            You haven't reported any incidents yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {incidents.map((incident) => (
              <div key={incident._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${incident.type === 'harassment' ? 'bg-red-100 text-red-800' : 
                        incident.type === 'theft' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                      {incident.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(incident.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium mb-2 line-clamp-2">{incident.description}</p>
                  <div className="flex items-center text-gray-500 text-sm mt-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{incident.address || `${incident.location.coordinates[1].toFixed(4)}, ${incident.location.coordinates[0].toFixed(4)}`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
