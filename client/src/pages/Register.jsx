import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, User, AlertTriangle, ArrowRight, UserPlus, X, FileText } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-scaleIn">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-red-500" />
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="prose prose-slate max-w-none">
            {children}
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors shadow-lg shadow-slate-200"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  
  // Modal States
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setServerError('');
    
    try {
      await register(formData);
      // Successful registration
      navigate('/');
    } catch (err) {
      setServerError(
        err.response?.data?.message || 
        err.message || 
        'Registration failed. Please try again.'
      );
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

  const handleSignIn = () => {
    navigate('/login');
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
                    <UserPlus className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Create Your Account
              </h2>
              <p className="text-slate-600 text-sm">Join CitySense and help make your city safer</p>
            </div>

            {serverError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-xl mb-6 flex items-center animate-slideDown shadow-sm">
                <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium">{serverError}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Name Field */}
              <div className="animate-slideUp" style={{ animationDelay: '100ms' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5 flex items-center">
                  Full Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300">
                    <User className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'name' ? 'text-red-500' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 outline-none hover:border-slate-300 font-medium text-slate-700"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-2 font-medium flex items-center animate-slideDown">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="animate-slideUp" style={{ animationDelay: '200ms' }}>
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
              <div className="animate-slideUp" style={{ animationDelay: '300ms' }}>
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
                    placeholder="Create a password (min. 6 characters)"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-2 font-medium flex items-center animate-slideDown">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start animate-slideUp" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded transition duration-300 cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm text-slate-700">
                  <label htmlFor="terms" className="cursor-pointer">
                    I agree to the{' '}
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowTerms(true)}
                    className="font-semibold text-red-600 hover:text-red-700 transition-colors duration-300"
                  >
                    Terms and Conditions
                  </button>
                  {' '}and{' '}
                  <button 
                    type="button" 
                    onClick={() => setShowPrivacy(true)}
                    className="font-semibold text-red-600 hover:text-red-700 transition-colors duration-300"
                  >
                    Privacy Policy
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="animate-slideUp" style={{ animationDelay: '500ms' }}>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center py-4 px-6 border-2 border-transparent rounded-2xl shadow-xl text-base font-bold text-white bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:via-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-500/50 disabled:opacity-70 disabled:cursor-not-allowed transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  {loading ? (
                    <span className="flex items-center relative z-10">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center relative z-10">
                      Sign Up
                      <UserPlus className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  )}
                </button>
              </div>

              {/* Sign In Link */}
              <div className="text-center animate-slideUp" style={{ animationDelay: '600ms' }}>
                <p className="text-sm text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="font-semibold text-red-600 hover:text-red-700 transition-colors duration-300 inline-flex items-center group"
                  >
                    Sign in
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center animate-slideUp" style={{ animationDelay: '700ms' }}>
            <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1.5 text-green-500" />
                100% Secure
              </div>
              <div className="h-4 w-px bg-slate-300"></div>
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-1.5 text-blue-500" />
                Data Encrypted
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
                <span className="text-red-400 font-semibold text-sm">Join Our Community</span>
              </div>
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold mb-6 leading-tight text-white animate-slideRight" style={{ animationDelay: '100ms' }}>
              Be Part of the
              <br/>
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Safety Movement
              </span>
            </h1>

            <p className="text-lg text-slate-300 mb-10 leading-relaxed animate-slideRight" style={{ animationDelay: '200ms' }}>
              Create your free account and join thousands of community members working together to make cities safer. Your voice matters in building a secure environment.
            </p>

            <div className="space-y-6 animate-slideRight" style={{ animationDelay: '300ms' }}>
              <div className="flex items-start space-x-4">
                <div className="bg-green-500/20 p-3 rounded-xl backdrop-blur-sm border border-green-500/30">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">Free Forever</h3>
                  <p className="text-slate-400 text-sm">No credit card required, completely free to use</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500/20 p-3 rounded-xl backdrop-blur-sm border border-blue-500/30">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">Complete Privacy</h3>
                  <p className="text-slate-400 text-sm">Your data is encrypted and never shared</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-500/20 p-3 rounded-xl backdrop-blur-sm border border-purple-500/30">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">Instant Access</h3>
                  <p className="text-slate-400 text-sm">Start reporting and viewing incidents immediately</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-700/50 animate-slideRight" style={{ animationDelay: '400ms' }}>
              <p className="text-slate-400 text-sm italic">
                "CitySense has helped our community become more aware and safer. Highly recommended!"
              </p>
              <div className="flex items-center mt-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-3">
                  <p className="text-white font-semibold text-sm">Sarah M.</p>
                  <p className="text-slate-500 text-xs">Community Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms and Conditions"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">1. Acceptance of Terms</h4>
            <p className="text-slate-600 leading-relaxed">By accessing and using CitySense, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">2. User Conduct</h4>
            <p className="text-slate-600 leading-relaxed">You agree to use the service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.</p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">3. Incident Reporting</h4>
            <p className="text-slate-600 leading-relaxed">Users are responsible for the accuracy of the incidents they report. False reporting may result in account suspension.</p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">4. Privacy</h4>
            <p className="text-slate-600 leading-relaxed">Your use of the site is also subject to our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.</p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">5. Disclaimer</h4>
            <p className="text-slate-600 leading-relaxed">CitySense is a community-driven platform. We do not guarantee the accuracy of user-reported incidents, though we strive to verify them where possible.</p>
          </div>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy Policy"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">1. Information We Collect</h4>
            <p className="text-slate-600 leading-relaxed">We collect information you provide directly to us, such as when you create an account, report an incident, or communicate with us.</p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">2. How We Use Your Information</h4>
            <p className="text-slate-600 leading-relaxed">We use the information we collect to provide, maintain, and improve our services, to verify incidents, and to communicate with you.</p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">3. Information Sharing</h4>
            <p className="text-slate-600 leading-relaxed">We do not share your personal information with third parties except as described in this policy or with your consent. Incident data is public but anonymized where appropriate.</p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">4. Data Security</h4>
            <p className="text-slate-600 leading-relaxed">We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          </div>
        </div>
      </Modal>

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

export default Register;