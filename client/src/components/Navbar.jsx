import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Map, PlusCircle, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/cctv-camera.png';

const Navbar = () => {
  // ✅ ALL HOOKS FIRST — ALWAYS
  const auth = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ SAFE GUARD AFTER HOOKS
  if (!auth) {
    return null;
  }

  const { user, logout } = auth;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl border-b-2 border-red-500/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-lg group-hover:bg-red-500/40 transition-all duration-300 rounded-full"></div>
                <img src={logo} alt="Logo" className="h-8 w-8 mr-2 relative group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="font-bold text-xl tracking-widest bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-red-300 transition-all duration-300">CITYSENSE</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                to="/" 
                className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium flex items-center space-x-1"
              >
                <span>Home</span>
              </Link>

              <Link 
                to="/map" 
                className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium flex items-center space-x-1 group"
              >
                <Map className="w-4 h-4 group-hover:text-red-400 transition-colors duration-300" />
                <span>Map</span>
              </Link>

              <Link 
                to="/report" 
                className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium flex items-center space-x-1 group"
              >
                <PlusCircle className="w-4 h-4 group-hover:text-red-400 transition-colors duration-300" />
                <span>Report</span>
              </Link>

              {user ? (
                <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-white/10">
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium flex items-center space-x-1 group"
                  >
                    <User className="w-4 h-4 group-hover:text-blue-400 transition-colors duration-300" />
                    <span>Dashboard</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium flex items-center space-x-1 group"
                  >
                    <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors duration-300" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-white/10">
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-5 py-2 rounded-lg font-bold text-white transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:scale-105 active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative">Sign Up</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gradient-to-br from-slate-900 to-slate-950 border-t border-red-500/30 animate-slideDown">
            <div className="px-2 pt-2 pb-4 space-y-2 sm:px-3">
              <Link 
                to="/" 
                className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium text-slate-300 hover:text-white"
              >
                Home
              </Link>
              <Link 
                to="/map" 
                className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium text-slate-300 hover:text-white"
              >
                Map
              </Link>
              <Link 
                to="/report" 
                className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium text-slate-300 hover:text-white"
              >
                Report Incident
              </Link>

              {user ? (
                <>
                  <div className="border-t border-white/10 my-2 pt-2">
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/dashboard'}
                      className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium text-slate-300 hover:text-white"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium text-slate-300 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-t border-white/10 my-2 pt-2">
                    <Link 
                      to="/login" 
                      className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium text-slate-300 hover:text-white"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="block px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold text-white mt-2"
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Navbar;
