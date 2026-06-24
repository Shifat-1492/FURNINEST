const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

dotenv.config();

const categories = [
  { name: 'Chair', slug: 'chair', icon: '🪑' },
  { name: 'Bed', slug: 'bed', icon: '🛏️' },
  { name: 'Sofa', slug: 'sofa', icon: '🛋️' },
  { name: 'Wardrobe', slug: 'wardrobe', icon: '🚪' },
  { name: 'Bookshelf', slug: 'bookshelf', icon: '📚' },
  { name: 'Others', slug: 'others', icon: '📦' },
  { 
    name: 'Table', 
    slug: 'table', 
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 1em; height: 1em; display: inline-block; vertical-align: middle;"><path d="M2 8L4.5 4H19.5L22 8H2Z" fill="#F59E0B" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/><rect x="3.5" y="8" width="2" height="12" fill="#9CA3AF" stroke="#000" stroke-width="1.5"/><rect x="18.5" y="8" width="2" height="12" fill="#9CA3AF" stroke="#000" stroke-width="1.5"/><rect x="7.5" y="8" width="1.5" height="8" fill="#6B7280" stroke="#000" stroke-width="1.5"/><rect x="15" y="8" width="1.5" height="8" fill="#6B7280" stroke="#000" stroke-width="1.5"/></svg>' 
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/furninest')
  .then(async () => {
    console.log('Connected to MongoDB for Seeding...');
    await Category.deleteMany({});
    console.log('Deleted old categories');
    
    await Category.insertMany(categories);
    console.log('Successfully seeded categories!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
