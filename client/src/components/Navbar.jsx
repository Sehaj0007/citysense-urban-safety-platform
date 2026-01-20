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
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl tracking-wider">CITYSENSE</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-red-400 transition">Home</Link>

            <Link to="/map" className="flex items-center hover:text-red-400 transition">
              <Map className="w-4 h-4 mr-1" /> Map
            </Link>

            <Link to="/report" className="flex items-center hover:text-red-400 transition">
              <PlusCircle className="w-4 h-4 mr-1" /> Report
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center hover:text-red-400 transition"
                >
                  <User className="w-4 h-4 mr-1" /> Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center hover:text-red-400 transition"
                >
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:text-red-400 transition">Login</Link>
                <Link
                  to="/register"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-slate-700">Home</Link>
            <Link to="/map" className="block px-3 py-2 rounded-md hover:bg-slate-700">Map</Link>
            <Link to="/report" className="block px-3 py-2 rounded-md hover:bg-slate-700">
              Report Incident
            </Link>

            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="block px-3 py-2 rounded-md hover:bg-slate-700"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md hover:bg-slate-700">
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 rounded-md hover:bg-slate-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
