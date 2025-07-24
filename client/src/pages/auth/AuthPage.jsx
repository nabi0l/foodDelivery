import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthPage = ({ initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const location = useLocation();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update the form mode when the URL changes
    setIsLogin(location.pathname === '/login' || location.pathname === '/auth');
    setError('');
  }, [location.pathname]);

  const toggleAuthMode = (mode) => {
    if (mode === 'login') {
      navigate('/login');
    } else {
      navigate('/signup');
    }
    setIsLogin(mode === 'login');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    try {
      if (isLogin) {
        // Login logic
        console.log('Attempting login with:', { email, password });
        const response = await axios.post('http://localhost:5000/api/user/login', 
          { email, password },
          { 
            headers: { 'Content-Type': 'application/json' },
            validateStatus: (status) => status < 500 // Resolve promise for all status codes < 500
          }
        );
        
        console.log('Login response:', response);
        
        if (response.status !== 200) {
          throw new Error(response.data?.message || 'Login failed');
        }
        
        const { token, user } = response.data;
        
        // Store user data in local storage
        localStorage.setItem('token', token);
        if (user) {
          localStorage.setItem('userId', user._id || user.id);
          if (user.role) {
            localStorage.setItem('role', user.role);
          }
          if (user.restaurantId) {
            localStorage.setItem('restaurantId', user.restaurantId);
          }
        }
        
        // Handle redirection based on user role
        const role = user?.role;
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'restaurant_owner') {
          const restaurantId = user?.restaurantId;
          if (restaurantId) {
            navigate(`/restaurant-dashboard/${restaurantId}`);
          } else {
            navigate('/restaurant-dashboard/home');
          }
        } else {
          // For regular users, check if they were redirected from checkout
          const fromCheckout = localStorage.getItem('fromCheckout');
          if (fromCheckout) {
            localStorage.removeItem('fromCheckout');
            navigate('/checkout');
          } else {
            navigate('/');
          }
        }
      } else {
        // Signup logic
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const registerResponse = await axios.post('http://localhost:5000/api/user/register', 
          { name, email, password, address: 'Default address' },
          { 
            headers: { 'Content-Type': 'application/json' },
            validateStatus: (status) => status < 500
          }
        );
        
        if (registerResponse.status !== 201) {
          throw new Error(registerResponse.data?.message || 'Registration failed');
        }
        navigate('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        if (error.response.status === 400) {
          setError(error.response.data?.message || (isLogin ? 'Invalid email or password' : 'Registration failed'));
        } else if (error.response.status === 401) {
          setError('Unauthorized. Please check your credentials.');
        } else if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(error.response.data?.message || `An error occurred during ${isLogin ? 'login' : 'registration'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
        setError(`Error setting up ${isLogin ? 'login' : 'registration'} request. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl border border-red-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-700 mb-2">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to continue to FoodDelivery' : 'Join us today to start ordering'}
          </p>
        </div>
        
        <div className="flex space-x-1 bg-red-50 p-1 rounded-lg mb-8">
          <button 
            type="button"
            onClick={() => toggleAuthMode('login')}
            className={`flex-1 py-3 rounded-md font-medium transition-all ${
              isLogin 
                ? 'bg-white text-red-600 shadow-sm' 
                : 'text-gray-500 hover:text-red-600'
            }`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => toggleAuthMode('signup')}
            className={`flex-1 py-3 rounded-md font-medium transition-all ${
              !isLogin 
                ? 'bg-white text-red-600 shadow-sm' 
                : 'text-gray-500 hover:text-red-600'
            }`}
          >
            Create Account
          </button>
        </div>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all"
                autoComplete="new-password"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all"
              autoComplete="username"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Password</label>
              {isLogin && (
                <a href="#" className="text-xs text-red-600 hover:underline">
                  Forgot password?
                </a>
              )}
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          
          {error && <p className="text-red-600 text-center">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-all font-medium text-lg shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
              </svg>
              Google
            </button>
            <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd"/>
              </svg>
              Facebook
            </button>
          </div>
        </div>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => toggleAuthMode(isLogin ? 'signup' : 'login')}
            className="text-red-600 font-medium hover:underline"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
