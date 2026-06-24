import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [actionLoading, setActionLoading] = useState(null);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/listings/admin/all');
      setListings(res.data);
    } catch {
      console.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchListings();
  }, [user, navigate]);

  const handleStatusChange = async (id, status) => {
    setActionLoading(id);
    try {
      const res = await axios.patch(`/api/listings/${id}/status`, { status });
      // Update local state
      setListings(listings.map(item => item._id === id ? res.data : item));
    } catch {
      alert('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you absolutely sure you want to delete this listing permanently?')) {
      setActionLoading(id);
      try {
        await axios.delete(`/api/listings/${id}`);
        setListings(listings.filter(item => item._id !== id));
      } catch {
        alert('Failed to delete listing');
      } finally {
        setActionLoading(null);
      }
    }
  };

  if (!user || !user.isAdmin) return null;

  // Stats calculation
  const stats = {
    total: listings.length,
    pending: listings.filter(l => l.status === 'pending').length,
    approved: listings.filter(l => l.status === 'approved').length,
    rejected: listings.filter(l => l.status === 'rejected').length
  };

  // Filtered listings
  const filteredListings = listings.filter(l => {
    if (filter === 'all') return true;
    return l.status === filter;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white py-12 px-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Admin Management Panel</h1>
              <p className="text-emerald-100 mt-2">Manage, approve, or reject user advertisements</p>
            </div>
            <button 
              onClick={fetchListings} 
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-5 rounded-xl border border-white/20 transition flex items-center gap-2"
            >
              🔄 Refresh List
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <p className="text-sm font-semibold text-gray-400 uppercase">Total Advertisements</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition border-l-4 border-amber-500">
            <p className="text-sm font-semibold text-amber-600 uppercase">Pending Approval</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.pending}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition border-l-4 border-emerald-500">
            <p className="text-sm font-semibold text-emerald-600 uppercase">Active Approved</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.approved}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition border-l-4 border-red-500">
            <p className="text-sm font-semibold text-red-600 uppercase">Rejected Posts</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.rejected}</h3>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex gap-2 p-1.5 bg-gray-200/50 backdrop-blur rounded-xl max-w-md mb-8 border border-gray-200">
          {['all', 'pending', 'approved', 'rejected'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex-1 text-center py-2 px-3 rounded-lg text-sm font-semibold capitalize transition ${
                filter === type 
                  ? 'bg-white text-emerald-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Listings Section */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></div>
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <div 
                key={listing._id} 
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition flex flex-col ${
                  actionLoading === listing._id ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {/* Image or Icon Container */}
                <div className="relative">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={`http://localhost:5001/uploads/${listing.images[0]}`} 
                      alt={listing.title} 
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-48 bg-gray-50 flex items-center justify-center text-6xl"
                      dangerouslySetInnerHTML={{ __html: listing.category?.icon || '🪑' }}
                    />
                  )}

                  {/* Status Indicator Badge */}
                  <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm uppercase ${
                    listing.status === 'approved' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : listing.status === 'rejected'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {listing.status}
                  </span>
                </div>

                {/* Details Body */}
                <div className="p-5 flex-grow">
                  <span className="text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-md">
                    {listing.category?.name || 'Furniture'}
                  </span>
                  <h3 className="font-bold text-gray-800 text-xl mt-3 line-clamp-1">{listing.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 mb-4 line-clamp-2">{listing.description}</p>

                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-2xl font-black text-emerald-800">৳{Number(listing.price).toLocaleString()}</span>
                    <span className="text-xs text-gray-400 font-semibold uppercase">Condition: {listing.condition}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Seller Details</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>👤 <span className="font-semibold text-gray-700">{listing.user?.name || 'Unknown User'}</span></p>
                      <p>📧 {listing.user?.email || 'N/A'}</p>
                      {listing.user?.phone && <p>📞 {listing.user.phone}</p>}
                      <p>📍 {listing.location}</p>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between">
                  <div className="flex gap-2">
                    {listing.status !== 'approved' && (
                      <button 
                        onClick={() => handleStatusChange(listing._id, 'approved')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition shadow-sm"
                      >
                        ✓ Approve
                      </button>
                    )}
                    {listing.status !== 'rejected' && (
                      <button 
                        onClick={() => handleStatusChange(listing._id, 'rejected')}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition shadow-sm"
                      >
                        ✕ Reject
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(listing._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold py-2 px-3 rounded-lg text-sm transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 max-w-lg mx-auto">
            <div className="text-7xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800">No advertisements found</h3>
            <p className="text-gray-500 mt-2">There are currently no listings under the "{filter}" category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
