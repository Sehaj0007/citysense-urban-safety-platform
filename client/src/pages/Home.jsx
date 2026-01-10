import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, MapPin, Bell } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Make Your City <span className="text-red-500">Safer</span> Together
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Crowd-sourced safety intelligence. Report incidents anonymously, view risk heatmaps, and stay alerted in real-time.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/map" className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-semibold text-lg transition">
              View Safety Map
            </Link>
            <Link to="/report" className="bg-slate-700 hover:bg-slate-600 px-8 py-3 rounded-lg font-semibold text-lg transition">
              Report Incident
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Core Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Anonymous Reporting</h3>
            <p className="text-gray-600">Report safety concerns without revealing your identity. Help others stay safe.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Interactive Heatmaps</h3>
            <p className="text-gray-600">Visualize high-risk areas and safe zones with our real-time city map.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-time Alerts</h3>
            <p className="text-gray-600">Get instant notifications when entering areas with recent safety reports.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
