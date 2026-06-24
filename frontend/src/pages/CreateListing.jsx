import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'used',
    location: '',
    material: '',
    dimensions: ''
  });
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    axios.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(() => console.error('Failed to load categories'));
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    if (images) {
      for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]);
      }
    }

    try {
      await axios.post('/api/listings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Post a New Ad</h1>
      
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">Title *</label>
            <input 
              type="text" name="title" required value={formData.title} onChange={handleChange}
              placeholder="e.g. Vintage Oak Dining Table"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Price (৳) *</label>
            <input 
              type="number" name="price" required value={formData.price} onChange={handleChange}
              placeholder="e.g. 5000" min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Category *</label>
            <select 
              name="category" required value={formData.category} onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 bg-white"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Condition *</label>
            <select 
              name="condition" required value={formData.condition} onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 bg-white"
            >
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Location *</label>
            <input 
              type="text" name="location" required value={formData.location} onChange={handleChange}
              placeholder="e.g. Dhanmondi, Dhaka"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Material</label>
            <input 
              type="text" name="material" value={formData.material} onChange={handleChange}
              placeholder="e.g. Solid Oak"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Dimensions</label>
            <input 
              type="text" name="dimensions" value={formData.dimensions} onChange={handleChange}
              placeholder="e.g. 120x60x75 cm"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">Description *</label>
            <textarea 
              name="description" required value={formData.description} onChange={handleChange}
              placeholder="Describe the furniture, its condition, and any other details..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">Images</label>
            <input 
              type="file" multiple accept="image/*" onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <p className="text-sm text-gray-500 mt-2">You can upload multiple images (max 5MB each).</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6 mb-4">
          ℹ️ Note: Your ad will be sent to the administrator for review and will be published once approved.
        </p>

        <button type="submit" disabled={loading} className="btn btn-primary w-full py-4 text-lg">
          {loading ? 'Posting...' : 'Post Ad'}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
