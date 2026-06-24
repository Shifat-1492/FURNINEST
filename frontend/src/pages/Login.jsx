import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    const result = await googleLogin(credentialResponse.credential, credentialResponse.clientId);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8">Sign in to continue to Furninest.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
        
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign in failed')}
            useOneTap
            shape="rectangular"
            theme="outline"
            text="continue_with"
            size="large"
          />
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email Address"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-green-900 hover:bg-green-800 text-white font-medium py-3 rounded-lg transition shadow-md">
            Login
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-green-800 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
