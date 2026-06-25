import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [sending, setSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    axios.get(`/api/listings/${id}`)
      .then(res => { setListing(res.data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setSending(true);
    try {
      await axios.post('/api/messages', {
        listing: listing._id,
        receiver: listing.user._id,
        body: messageBody
      });
      setMessageSent(true);
      setShowMessageForm(false);
      setMessageBody('');
    } catch {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96 text-gray-400">
      <div className="text-center">
        <div className="text-6xl mb-4">⏳</div>
        <p>Loading listing...</p>
      </div>
    </div>
  );

  if (!listing) return (
    <div className="flex items-center justify-center h-96 text-gray-400">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-semibold mb-4">Listing not found</h2>
        <button onClick={() => navigate('/browse')} className="btn btn-primary">Browse All Listings</button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Link to="/browse" className="text-green-700 hover:underline flex items-center gap-1">
          ← Back to Browse
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Section */}
        <div>
{listing.images && listing.images.length > 0 ? (
              <>
                <img
                  src={`${import.meta.env.VITE_API_URL || ''}/uploads/${listing.images[activeImage]}`}
                  alt={listing.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-md mb-4"
                />
              {listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {listing.images.map((img, i) => (
                    <img
                      key={i}
                      src={`${import.meta.env.VITE_API_URL || ''}/uploads/${img}`}
                      alt=""
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${activeImage === i ? 'border-green-700' : 'border-transparent'}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div
              className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-9xl shadow-md"
              dangerouslySetInnerHTML={{ __html: listing.category?.icon || '🪑' }}
            />
          )}
        </div>

        {/* Details Section */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">{listing.condition}</span>
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">{listing.category?.name}</span>
          </div>

                  {listing.isSold && (
                    <div className="mb-4">
                      <span className="inline-block bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold">SOLD</span>
                    </div>
                  )}

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{listing.title}</h1>
          <div className="text-4xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>
            ৳{Number(listing.price).toLocaleString()}
          </div>

          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-gray-100 p-4 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Location</p>
              <p className="font-semibold text-gray-700">📍 {listing.location}</p>
            </div>
            {listing.material && (
              <div className="bg-white border border-gray-100 p-4 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Material</p>
                <p className="font-semibold text-gray-700">🪵 {listing.material}</p>
              </div>
            )}
            {listing.dimensions && (
              <div className="bg-white border border-gray-100 p-4 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Dimensions</p>
                <p className="font-semibold text-gray-700">📐 {listing.dimensions}</p>
              </div>
            )}
            <div className="bg-white border border-gray-100 p-4 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Posted</p>
              <p className="font-semibold text-gray-700">📅 {new Date(listing.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Seller Info */}
          {listing.user && (
            <div className="bg-green-50 border border-green-100 p-5 rounded-xl mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Seller Information</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {listing.user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{listing.user.name}</p>
                  <p className="text-sm text-gray-500">{listing.user.email}</p>
                </div>
              </div>
            </div>
          )}

          {messageSent ? (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg font-semibold text-center border border-green-200">
              ✅ Message sent successfully! The seller will reply to your inbox.
            </div>
          ) : showMessageForm ? (
            <form onSubmit={handleSendMessage} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
              <h4 className="font-bold text-gray-800 mb-2">Message {listing.user?.name}</h4>
              <textarea
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 mb-3"
                placeholder="Hi, is this still available?"
                value={messageBody}
                onChange={e => setMessageBody(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="submit" disabled={sending} className="btn btn-primary flex-1">
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
                <button type="button" onClick={() => setShowMessageForm(false)} className="btn btn-outline px-4">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="flex gap-3">
              <button 
                className="btn btn-primary flex-1 py-3"
                onClick={() => {
                  if (!user) navigate('/login');
                  else setShowMessageForm(true);
                }}
                disabled={listing.isSold}
              >
                {listing.isSold ? 'This item is sold' : '📞 Contact Seller'}
              </button>
              <button className="btn btn-outline px-5 py-3">💾 Save</button>
            </div>
          )}

          {/* Owner/Admin: Mark as sold */}
          {user && (user.isAdmin || listing.user?._id === user._id || listing.user?._id === user.id) && (
            <div className="mt-4">
              <button
                onClick={async () => {
                  try {
const res = await axios.patch(`/api/listings/${listing._id}/mark-sold`, {});
                     setListing(res.data);
                   } catch {
                     alert('Failed to update sold status');
                  }
                }}
                className="btn btn-secondary"
              >
                {listing.isSold ? 'Unmark Sold' : 'Mark as Sold'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
