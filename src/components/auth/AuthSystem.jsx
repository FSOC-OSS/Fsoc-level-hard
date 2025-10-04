import React, { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome, MessageSquare, CheckCircle, XCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Toast = ({ type, message }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColors[type]} shadow-lg animate-slideInRight`}>
      {icons[type]}
      <span className="text-sm font-medium text-gray-800">{message}</span>
    </div>
  );
};

const PasswordStrengthIndicator = ({ password, getPasswordStrength, validatePassword }) => {
  if (!password) return null;
  const strength = getPasswordStrength(password);
  const checks = validatePassword(password);

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }} />
        </div>
        <span className="text-xs font-medium text-gray-300">{strength.label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {Object.entries({
          'length': '8+ characters',
          'uppercase': 'Uppercase letter',
          'lowercase': 'Lowercase letter',
          'number': 'Number',
          'special': 'Special character'
        }).map(([key, label]) => (
          <div key={key} className={`flex items-center gap-1 ${checks[key] ? 'text-green-400' : 'text-gray-500'}`}>
            {checks[key] ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SocialButtons = ({ showToast }) => {
  const renderSocialButton = (Icon, label) => (
    <button
      key={label}
      type="button"
      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white hover:bg-slate-700/50 transition-colors"
      onClick={() => showToast('info', `${label} login coming soon!`)}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="grid grid-cols-3 gap-3">
      {renderSocialButton(Chrome, 'Google')}
      {renderSocialButton(Github, 'GitHub')}
      {renderSocialButton(MessageSquare, 'Discord')}
    </div>
  );
};

const AuthSystem = ({ onSuccess }) => {
  const { login } = useAuth();
  const [currentView, setCurrentView] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [signUpStep, setSignUpStep] = useState(1);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    firstName: '', lastName: '', email: '', username: '',
    password: '', confirmPassword: '', acceptTerms: false,
    preferences: { emailNotifications: true, quizReminders: false }
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe') === 'true';
    setRememberMe(remembered);
    if (remembered) {
      const savedEmail = localStorage.getItem('savedEmail');
      if (savedEmail) setSignInData(prev => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const validateEmail = useCallback((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), []);

  const validatePassword = useCallback((password) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }), []);

  const getPasswordStrength = useCallback((password) => {
    const checks = validatePassword(password);
    const score = Object.values(checks).filter(Boolean).length;
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (score <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  }, [validatePassword]);

  const validateUsername = useCallback(async (username) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const taken = ['admin', 'user', 'test'];
    return !taken.includes(username.toLowerCase());
  }, []);

  const handleSignInEmailChange = useCallback((e) => {
    setSignInData(prev => ({ ...prev, email: e.target.value }));
    setErrors(prev => ({ ...prev, email: null }));
  }, []);

  const handleSignInPasswordChange = useCallback((e) => {
    setSignInData(prev => ({ ...prev, password: e.target.value }));
    setErrors(prev => ({ ...prev, password: null }));
  }, []);

  const handleSignUpFirstNameChange = useCallback((e) => {
    setSignUpData(prev => ({ ...prev, firstName: e.target.value }));
    setErrors(prev => ({ ...prev, firstName: null }));
  }, []);

  const handleSignUpLastNameChange = useCallback((e) => {
    setSignUpData(prev => ({ ...prev, lastName: e.target.value }));
    setErrors(prev => ({ ...prev, lastName: null }));
  }, []);

  const handleSignUpEmailChange = useCallback((e) => {
    setSignUpData(prev => ({ ...prev, email: e.target.value }));
    setErrors(prev => ({ ...prev, email: null }));
  }, []);

  const handleSignUpUsernameChange = useCallback((e) => {
    setSignUpData(prev => ({ ...prev, username: e.target.value }));
    setErrors(prev => ({ ...prev, username: null }));
  }, []);

  const handleSignUpPasswordChange = useCallback((e) => {
    setSignUpData(prev => ({ ...prev, password: e.target.value }));
    setErrors(prev => ({ ...prev, password: null }));
  }, []);

  const handleSignUpConfirmPasswordChange = useCallback((e) => {
    setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }));
    setErrors(prev => ({ ...prev, confirmPassword: null }));
  }, []);

  const handleSignUpAcceptTermsChange = useCallback((e) => {
    setSignUpData(prev => ({ ...prev, acceptTerms: e.target.checked }));
    setErrors(prev => ({ ...prev, acceptTerms: null }));
  }, []);

  const handleEmailNotificationsChange = useCallback((e) => {
    setSignUpData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, emailNotifications: e.target.checked }
    }));
  }, []);

  const handleQuizRemindersChange = useCallback((e) => {
    setSignUpData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, quizReminders: e.target.checked }
    }));
  }, []);

  const handleForgotEmailChange = useCallback((e) => {
    setForgotEmail(e.target.value);
    setErrors(prev => ({ ...prev, forgotEmail: null }));
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(signInData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!signInData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (signInData.email === 'user@example.com' && signInData.password === 'Password123!') {
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedEmail', signInData.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedEmail');
      }
      
      const userData = {
        email: signInData.email,
        username: 'DemoUser',
        firstName: 'Demo',
        lastName: 'User'
      };
      
      login(userData);
      showToast('success', 'Welcome back! Sign in successful.');
      setIsLoading(false);
      if (onSuccess) onSuccess();
    } else {
      setIsLoading(false);
      showToast('error', 'Invalid email or password. Try user@example.com / Password123!');
    }
  };

  const handleSignUpStep1 = () => {
    const newErrors = {};
    
    if (!signUpData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!signUpData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!validateEmail(signUpData.email)) newErrors.email = 'Invalid email address';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSignUpStep(2);
  };

  const handleSignUpStep2 = async () => {
    const newErrors = {};
    
    if (signUpData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else {
      const available = await validateUsername(signUpData.username);
      if (!available) newErrors.username = 'Username is already taken';
    }

    const passChecks = validatePassword(signUpData.password);
    if (!Object.values(passChecks).every(Boolean)) {
      newErrors.password = 'Password does not meet all requirements';
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!signUpData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSignUpStep(3);
  };

  const handleSignUpComplete = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const userData = {
      email: signUpData.email,
      username: signUpData.username,
      firstName: signUpData.firstName,
      lastName: signUpData.lastName,
      preferences: signUpData.preferences
    };
    
    login(userData);
    setIsLoading(false);
    showToast('success', 'Account created! Welcome to the quiz app.');
    if (onSuccess) onSuccess();
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateEmail(forgotEmail)) {
      setErrors({ forgotEmail: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    showToast('success', 'Password reset link sent to your email!');
    setShowForgotModal(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {toast && <Toast type={toast.type} message={toast.message} />}
      
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-purple-500/30 rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-2">Reset Password</h2>
            <p className="text-gray-300 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={handleForgotEmailChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border ${errors.forgotEmail ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.forgotEmail && <p className="mt-1 text-sm text-red-500">{errors.forgotEmail}</p>}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotEmail('');
                    setErrors({});
                  }}
                  className="flex-1 bg-slate-700/50 text-gray-300 py-2.5 rounded-lg font-medium hover:bg-slate-600/50 border border-purple-500/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-6xl">
        {currentView === 'signin' ? (
          <div className="w-full max-w-md mx-auto p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-purple-400 mb-2">Welcome Back</h1>
              <p className="text-gray-300">Sign in to continue your learning journey</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={signInData.email}
                    onChange={handleSignInEmailChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border ${errors.email ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInData.password}
                    onChange={handleSignInPasswordChange}
                    className={`w-full pl-10 pr-12 py-2.5 bg-slate-900/50 border ${errors.password ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-purple-400 hover:text-purple-300 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-purple-500/30" />
              <span className="text-sm text-gray-400">Or continue with</span>
              <div className="flex-1 h-px bg-purple-500/30" />
            </div>

            <SocialButtons showToast={showToast} />

            <p className="mt-6 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentView('signup')}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-purple-400 mb-2">Create Account</h1>
              <p className="text-gray-300">Join us and start your learning adventure</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {['Personal Info', 'Account Details', 'Preferences'].map((step, idx) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-medium ${
                      signUpStep > idx + 1 ? 'bg-green-500 text-white' :
                      signUpStep === idx + 1 ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white' :
                      'bg-slate-700/50 text-gray-400'
                    }`}>
                      {signUpStep > idx + 1 ? <CheckCircle className="w-6 h-6" /> : idx + 1}
                    </div>
                    {idx < 2 && (
                      <div className={`flex-1 h-1 mx-2 ${signUpStep > idx + 1 ? 'bg-green-500' : 'bg-slate-700/50'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Personal Info</span>
                <span>Account Details</span>
                <span>Preferences</span>
              </div>
            </div>

            {signUpStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                    <input
                      type="text"
                      value={signUpData.firstName}
                      onChange={handleSignUpFirstNameChange}
                      className={`w-full px-4 py-2.5 bg-slate-900/50 border ${errors.firstName ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={signUpData.lastName}
                      onChange={handleSignUpLastNameChange}
                      className={`w-full px-4 py-2.5 bg-slate-900/50 border ${errors.lastName ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={signUpData.email}
                      onChange={handleSignUpEmailChange}
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border ${errors.email ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleSignUpStep1}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 flex items-center justify-center gap-2"
                >
                  Next Step
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {signUpStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={signUpData.username}
                      onChange={handleSignUpUsernameChange}
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border ${errors.username ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                      placeholder="johndoe123"
                    />
                  </div>
                  {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signUpData.password}
                      onChange={handleSignUpPasswordChange}
                      className={`w-full pl-10 pr-12 py-2.5 bg-slate-900/50 border ${errors.password ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                  <PasswordStrengthIndicator password={signUpData.password} getPasswordStrength={getPasswordStrength} validatePassword={validatePassword} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signUpData.confirmPassword}
                      onChange={handleSignUpConfirmPasswordChange}
                      className={`w-full pl-10 pr-12 py-2.5 bg-slate-900/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>

                <div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={signUpData.acceptTerms}
                      onChange={handleSignUpAcceptTermsChange}
                      className={`mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 ${errors.acceptTerms ? 'border-red-500' : ''}`}
                    />
                    <span className="text-sm text-gray-300">
                      I agree to the <button type="button" className="text-purple-400 hover:underline">Terms and Conditions</button> and <button type="button" className="text-purple-400 hover:underline">Privacy Policy</button>
                    </span>
                  </label>
                  {errors.acceptTerms && <p className="mt-1 text-sm text-red-500">{errors.acceptTerms}</p>}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSignUpStep(1)}
                    className="flex-1 bg-slate-700/50 text-gray-300 py-2.5 rounded-lg font-medium hover:bg-slate-600/50 border border-purple-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSignUpStep2}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 flex items-center justify-center gap-2"
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {signUpStep === 3 && (
              <div className="space-y-6">
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
                  <h3 className="font-medium text-purple-300 mb-2">Almost there!</h3>
                  <p className="text-sm text-gray-400">Customize your learning experience with these preferences.</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-slate-800/30 border border-purple-500/20 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                    <div>
                      <div className="font-medium text-white">Email Notifications</div>
                      <div className="text-sm text-gray-400">Receive updates about new quizzes and features</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={signUpData.preferences.emailNotifications}
                      onChange={handleEmailNotificationsChange}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-slate-800/30 border border-purple-500/20 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                    <div>
                      <div className="font-medium text-white">Quiz Reminders</div>
                      <div className="text-sm text-gray-400">Get reminded to practice regularly</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={signUpData.preferences.quizReminders}
                      onChange={handleQuizRemindersChange}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSignUpStep(2)}
                    className="flex-1 bg-slate-700/50 text-gray-300 py-2.5 rounded-lg font-medium hover:bg-slate-600/50 border border-purple-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSignUpComplete}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Account
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-purple-500/30" />
              <span className="text-sm text-gray-400">Or sign up with</span>
              <div className="flex-1 h-px bg-purple-500/30" />
            </div>

            <SocialButtons showToast={showToast} />

            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setCurrentView('signin');
                  setSignUpStep(1);
                }}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthSystem;