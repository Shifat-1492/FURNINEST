import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import ListingDetails from './pages/ListingDetails';
import Dashboard from './pages/Dashboard';
import CreateListing from './pages/CreateListing';
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/listing/:id" element={<ListingDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
