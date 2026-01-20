import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Users, FileText } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/admin/analytics');
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;
  if (!analytics) return <div className="p-8 text-center text-red-500">Failed to load analytics</div>;

  const chartData = {
    labels: analytics.incidentsByType.map(item => item._id.replace('_', ' ')),
    datasets: [
      {
        label: 'Number of Incidents',
        data: analytics.incidentsByType.map(item => item.count),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Incidents by Type',
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="p-4 bg-blue-100 rounded-full mr-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Incidents</p>
              <h3 className="text-3xl font-bold">{analytics.totalIncidents}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="p-4 bg-green-100 rounded-full mr-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-3xl font-bold">{analytics.totalUsers}</h3>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <Bar options={options} data={chartData} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {analytics.recentIncidents.map((incident) => (
              <li 
                key={incident._id} 
                className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => navigate(`/incident/${incident._id}`)}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{incident.type.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-500 truncate max-w-md">{incident.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(incident.createdAt).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
