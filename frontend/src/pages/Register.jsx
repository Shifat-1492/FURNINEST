import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const { register, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const result = await register(name, email, password);
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
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">Join Furninest to start buying and selling.</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign up failed')}
            useOneTap
            shape="rectangular"
            theme="outline"
            text="signup_with"
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
            type="text"
            placeholder="Full Name"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min. 6 characters)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Confirm Password field */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition pr-12 ${
                confirmPassword && password !== confirmPassword
                  ? 'border-red-400 bg-red-50'
                  : confirmPassword && password === confirmPassword
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300'
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
            >
              {showConfirm ? '🙈' : '👁️'}
            </button>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1 ml-1">Passwords do not match</p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className="text-green-600 text-xs mt-1 ml-1">✓ Passwords match</p>
            )}
          </div>

          <button type="submit" className="w-full bg-green-900 hover:bg-green-800 text-white font-medium py-3 rounded-lg transition shadow-md">
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-green-800 font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
