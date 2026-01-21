import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, AlertTriangle, ArrowRight, LogIn } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setServerError('');
    
    try {
      await login(formData);
      navigate('/');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-md w-full mx-auto animate-fadeIn">
          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20 transition-all duration-500 hover:shadow-3xl">
            {/* Header */}
            <div className="text-center mb-10 animate-slideDown">
              <div className="inline-block mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg">
                    <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-600 text-sm">Sign in to continue to CitySense</p>
            </div>

            {serverError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-xl mb-6 flex items-center animate-slideDown shadow-sm">
                <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium">{serverError}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Email Field */}
              <div className="animate-slideUp" style={{ animationDelay: '100ms' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5 flex items-center">
                  Email Address
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300">
                    <Mail className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-red-500' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 outline-none hover:border-slate-300 font-medium text-slate-700"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 font-medium flex items-center animate-slideDown">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="animate-slideUp" style={{ animationDelay: '200ms' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5 flex items-center">
                  Password
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300">
                    <Lock className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-red-500' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 outline-none hover:border-slate-300 font-medium text-slate-700"
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-2 font-medium flex items-center animate-slideDown">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between animate-slideUp" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded transition duration-300 cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <button type="button" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-300">
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <div className="animate-slideUp" style={{ animationDelay: '400ms' }}>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center py-4 px-6 border-2 border-transparent rounded-2xl shadow-xl text-base font-bold text-white bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:via-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-500/50 disabled:opacity-70 disabled:cursor-not-allowed transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  {loading ? (
                    <span className="flex items-center relative z-10">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center relative z-10">
                      Sign In
                      <LogIn className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  )}
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center animate-slideUp" style={{ animationDelay: '500ms' }}>
                <p className="text-sm text-slate-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={handleSignUp}
                    className="font-semibold text-red-600 hover:text-red-700 transition-colors duration-300 inline-flex items-center group"
                  >
                    Sign up
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center animate-slideUp" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1.5 text-green-500" />
                Secure Login
              </div>
              <div className="h-4 w-px bg-slate-300"></div>
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-1.5 text-blue-500" />
                Encrypted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 h-full">
          <div className="max-w-xl animate-fadeIn">
            <div className="mb-8 animate-slideRight">
              <div className="inline-block bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-full px-5 py-2">
                <span className="text-red-400 font-semibold text-sm">Community Safety Platform</span>
              </div>
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold mb-6 leading-tight text-white animate-slideRight" style={{ animationDelay: '100ms' }}>
              Keep Your City
              <br/>
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Safe & Secure
              </span>
            </h1>

            <p className="text-lg text-slate-300 mb-10 leading-relaxed animate-slideRight" style={{ animationDelay: '200ms' }}>
              Join thousands of community members working together to make our cities safer. Report incidents, stay informed, and contribute to a secure environment.
            </p>

            <div className="grid grid-cols-1 gap-6 animate-slideRight" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Anonymous Reporting</h3>
                  <p className="text-slate-400 text-sm">Your identity stays protected</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Real-time Updates</h3>
                  <p className="text-slate-400 text-sm">Stay informed instantly</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Community Powered</h3>
                  <p className="text-slate-400 text-sm">Thousands of active members</p>
                </div>
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

export default Login;