import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const fallbackCategories = [
  { _id: '1', name: 'Chair', icon: '🪑' },
  { _id: '2', name: 'Table', icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 1em; height: 1em; display: inline-block; vertical-align: middle;"><path d="M2 8L4.5 4H19.5L22 8H2Z" fill="#F59E0B" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/><rect x="3.5" y="8" width="2" height="12" fill="#9CA3AF" stroke="#000" stroke-width="1.5"/><rect x="18.5" y="8" width="2" height="12" fill="#9CA3AF" stroke="#000" stroke-width="1.5"/><rect x="7.5" y="8" width="1.5" height="8" fill="#6B7280" stroke="#000" stroke-width="1.5"/><rect x="15" y="8" width="1.5" height="8" fill="#6B7280" stroke="#000" stroke-width="1.5"/></svg>' },
  { _id: '3', name: 'Bed', icon: '🛏️' },
  { _id: '4', name: 'Sofa', icon: '🛋️' },
  { _id: '5', name: 'Wardrobe', icon: '🚪' },
  { _id: '6', name: 'Bookshelf', icon: '📚' },
  { _id: '7', name: 'Others', icon: '📦' }
];

const Browse = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [condition, setCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');

  // Watch URL params and update filter state
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setCategory(searchParams.get('category') || '');
    setCondition('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  }, [searchParams]);

  useEffect(() => {
    axios.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(() => setCategories(fallbackCategories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (category) params.append('category', category);
    if (condition) params.append('condition', condition);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);
    if (sort) params.append('sort', sort);

    axios.get(`/api/listings?${params}`)
      .then(res => { setListings(res.data); setLoading(false); })
      .catch(() => { setListings([]); setLoading(false); });
  }, [keyword, category, condition, minPrice, maxPrice, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (category) params.append('category', category);
    if (condition) params.append('condition', condition);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);
    if (sort) params.append('sort', sort);

    axios.get(`/api/listings?${params}`)
      .then(res => { setListings(res.data); setLoading(false); })
      .catch(() => { setListings([]); setLoading(false); });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Browse Furniture</h1>
          <p className="text-green-100">Find your perfect piece from our collection</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 -mt-8 relative z-10">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-600"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-600 bg-white"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-600 bg-white"
                value={condition}
                onChange={e => setCondition(e.target.value)}
              >
                <option value="">Any Condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
              <input
                type="number"
                placeholder="Min Price ৳"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-600"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max Price ৳"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-600"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1">Search</button>
                <button type="button" onClick={() => { setKeyword(''); setCategory(''); setCondition(''); setMinPrice(''); setMaxPrice(''); }} className="btn btn-outline px-3">✕</button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">{listings.length} listings found</p>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-green-600"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">⏳</div>
            <p>Loading listings...</p>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map(listing => (
              <div key={listing._id} className="listing-card">
                {listing.isSold ? (
                  <span className="listing-badge" style={{ background: '#111827', color: '#fff' }}>sold</span>
                ) : (
                  <span className="listing-badge">{listing.condition}</span>
                )}
                {listing.images && listing.images.length > 0 ? (
                  <img src={`${import.meta.env.VITE_API_URL || ''}/uploads/${listing.images[0]}`} alt={listing.title} className="w-full h-52 object-cover" />
                ) : (
                  <div
                    className="w-full h-52 bg-gray-50 flex items-center justify-center text-5xl"
                    dangerouslySetInnerHTML={{ __html: listing.category?.icon || '🪑' }}
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">{listing.title}</h3>
                  <div className="text-2xl font-bold mb-3" style={{ color: 'var(--color-primary)' }}>৳{Number(listing.price).toLocaleString()}</div>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>📍 {listing.location}</span>
                    <span>{listing.category?.name}</span>
                  </div>
                  <button onClick={() => navigate(`/listing/${listing._id}`)} className="btn btn-outline w-full text-center">View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">No listings found</h2>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
