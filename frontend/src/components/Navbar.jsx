import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <div className="bg-green-800 text-white text-sm py-2">
<div className="container mx-auto px-4 flex justify-between items-center">
           <div>📞 Contact: 01761647173</div>
           <div>📧 ahmmedshifat64649@gmail.com</div>
         </div>
      </div>
      
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
            <span className="text-3xl">🪑</span> FurniNest
          </Link>
          
          <div className="hidden md:flex items-center gap-6 font-semibold">
            <Link to="/" className="text-gray-700 hover:text-green-800 transition">Home</Link>
            <Link to="/browse" className="text-gray-700 hover:text-green-800 transition">Browse</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-green-800 transition">Dashboard</Link>
                <Link to="/create-listing" className="btn btn-primary">Post</Link>
                {user.isAdmin && (
                  <Link to="/admin-dashboard" className="text-amber-700 hover:text-amber-800 font-bold transition">Admin Panel</Link>
                )}
                <Link to="/messages" className="text-gray-700 hover:text-green-800 transition">Messages</Link>
                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
                  <span className="text-sm text-gray-500">Hi, {user.name?.split(' ')[0]}</span>
                  <button onClick={logout} className="btn btn-outline text-sm py-1 px-3">Logout</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-green-800 transition">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
