import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, MapPin, Bell, ArrowRight, Users, TrendingUp, Clock } from 'lucide-react';

const Home = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const navigate = useNavigate();

  const handleMapClick = () => {
    navigate('/map');
  };

  const handleReportClick = () => {
    navigate('/report');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center animate-fadeIn">
            <div className="inline-block mb-6 animate-slideDown">
              <div className="flex items-center justify-center space-x-2 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-full px-5 py-2">
                <Shield className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-semibold text-sm">Community-Powered Safety Platform</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slideUp" style={{ animationDelay: '100ms' }}>
              <span className="text-white">Make Your City</span>
              <br/>
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-pink-500 bg-clip-text text-transparent">Safer</span>
              <span className="text-white"> Together</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-slideUp" style={{ animationDelay: '200ms' }}>
              Crowd-sourced safety intelligence. Report incidents anonymously, view risk heatmaps, and stay alerted in real-time.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5 animate-slideUp" style={{ animationDelay: '300ms' }}>
              <button 
                onClick={handleMapClick}
                className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center">
                  View Safety Map
                  <MapPin className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
              
              <button 
                onClick={handleReportClick}
                className="group bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
              >
                <span className="flex items-center justify-center">
                  Report Incident
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-slideUp" style={{ animationDelay: '400ms' }}>
              <div className="text-center group cursor-pointer">
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Monitoring</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Anonymous</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">Real-time</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Updates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(248, 250, 252)"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Core Features
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Powerful tools designed to keep you and your community safe
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div 
            className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-2 border-slate-100 hover:border-red-200 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 cursor-pointer animate-slideUp overflow-hidden"
            style={{ animationDelay: '100ms' }}
            onMouseEnter={() => setHoveredFeature(1)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <div className="relative mb-6 inline-block">
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full group-hover:bg-red-500/30 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-slate-800 group-hover:text-red-600 transition-colors duration-300">
                Anonymous Reporting
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Report safety concerns without revealing your identity. Your privacy is our priority while helping others stay safe.
              </p>
              
              <div className={`mt-4 flex items-center text-red-600 font-semibold transition-all duration-300 ${hoveredFeature === 1 ? 'translate-x-2' : ''}`}>
                Learn more
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div 
            className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-2 border-slate-100 hover:border-blue-200 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 cursor-pointer animate-slideUp overflow-hidden"
            style={{ animationDelay: '200ms' }}
            onMouseEnter={() => setHoveredFeature(2)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <div className="relative mb-6 inline-block">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <MapPin className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                Interactive Heatmaps
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Visualize high-risk areas and safe zones with our real-time city map powered by community data.
              </p>
              
              <div className={`mt-4 flex items-center text-blue-600 font-semibold transition-all duration-300 ${hoveredFeature === 2 ? 'translate-x-2' : ''}`}>
                Learn more
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div 
            className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-2 border-slate-100 hover:border-green-200 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 cursor-pointer animate-slideUp overflow-hidden"
            style={{ animationDelay: '300ms' }}
            onMouseEnter={() => setHoveredFeature(3)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <div className="relative mb-6 inline-block">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full group-hover:bg-green-500/30 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Bell className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-slate-800 group-hover:text-green-600 transition-colors duration-300">
                Real-time Alerts
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Get instant notifications when entering areas with recent safety reports. Stay informed, stay safe.
              </p>
              
              <div className={`mt-4 flex items-center text-green-600 font-semibold transition-all duration-300 ${hoveredFeature === 3 ? 'translate-x-2' : ''}`}>
                Learn more
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Features / Why Choose Us */}
      <div className="bg-gradient-to-br from-slate-100 to-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Why Choose CitySense?
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Built by the community, for the community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group animate-slideUp" style={{ animationDelay: '100ms' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">Community Driven</h3>
              <p className="text-slate-600">Powered by thousands of users contributing to safer neighborhoods</p>
            </div>

            <div className="text-center group animate-slideUp" style={{ animationDelay: '200ms' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">Data Analytics</h3>
              <p className="text-slate-600">Advanced algorithms identify patterns and predict potential risks</p>
            </div>

            <div className="text-center group animate-slideUp" style={{ animationDelay: '300ms' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">Instant Updates</h3>
              <p className="text-slate-600">Lightning-fast incident reporting and notification system</p>
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

export default Home;