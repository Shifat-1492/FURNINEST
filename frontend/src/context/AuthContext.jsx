import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      
      // Need a route to get current user info if needed, for now we will just decode or store user
      // Actually, let's assume login returns { token, user: {id, name, email} }
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      setToken(res.data.token);
      setUser(res.data); // backend returns {_id, name, email} at top level now, not in res.data.user
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'Registration failed' };
    }
  };

  const googleLogin = async (credential, clientId) => {
    try {
      const res = await axios.post('/api/auth/google', { credential, clientId });
      setToken(res.data.token);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'Google login failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, googleLogin, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
