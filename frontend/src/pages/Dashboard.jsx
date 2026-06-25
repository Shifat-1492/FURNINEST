import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    axios.get('/api/listings/my')
      .then(res => {
        setListings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await axios.delete(`/api/listings/${id}`);
        setListings(listings.filter(l => l._id !== id));
      } catch {
        alert('Failed to delete listing');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500">Manage your furniture listings</p>
        </div>
        <Link to="/create-listing" className="btn btn-primary">➕ Post New Ad</Link>
      </div>

      {/* Admin Review Policy Guide banner */}
      <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl mb-8 flex items-start gap-4">
        <div className="text-3xl">📢</div>
        <div>
          <h4 className="font-bold text-emerald-900 mb-1">Advertise & Sell Your Furniture</h4>
          <p className="text-sm text-emerald-700 leading-relaxed">
            Want to sell your used or new furniture? Click on **Post New Ad** to list your item. All submitted listings are reviewed by the administrator before going live. Once approved, your ad will be visible to everyone browsing the marketplace!
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map(listing => (
            <div key={listing._id} className="listing-card relative overflow-hidden">
              {/* Status Badge */}
              <span className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-md text-xs font-bold uppercase shadow-sm ${
                listing.isSold
                  ? 'bg-gray-800 text-white border border-gray-900'
                  : listing.status === 'approved'
                  ? 'bg-green-100 text-green-850 border border-green-200'
                  : listing.status === 'rejected'
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {listing.isSold ? 'sold' : (listing.status || 'pending')}
              </span>

              {listing.images && listing.images.length > 0 ? (
                <img src={`${import.meta.env.VITE_API_URL || ''}/uploads/${listing.images[0]}`} alt={listing.title} className="w-full h-48 object-cover" />
              ) : (
                <div
                  className="w-full h-48 bg-gray-50 flex items-center justify-center text-5xl"
                  dangerouslySetInnerHTML={{ __html: listing.category?.icon || '🪑' }}
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">{listing.title}</h3>
                <div className="text-2xl font-bold mb-3 text-green-700">৳{Number(listing.price).toLocaleString()}</div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/listing/${listing._id}`)} className="flex-1 btn btn-outline py-2 text-sm">View</button>
                  <button onClick={() => handleDelete(listing._id)} className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold py-2 text-sm transition">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">No listings yet</h2>
          <p className="text-gray-500 mb-6">You haven't posted any furniture for sale.</p>
          <Link to="/create-listing" className="btn btn-primary">Post Your First Ad</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
