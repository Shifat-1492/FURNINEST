const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Listing = require('./models/Listing');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/furninest')
  .then(async () => {
    console.log('Connected to MongoDB for seeding listings...');
    
    try {
      // Create test user if doesn't exist
      let user = await User.findOne({ email: 'seller@test.com' });
      if (!user) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        user = await User.create({
          name: 'Test Seller',
          email: 'seller@test.com',
          password: hashedPassword
        });
        console.log('Created test user:', user.name);
      }

      // Get all categories
      const categories = await Category.find();
      console.log(`Found ${categories.length} categories`);

      if (categories.length === 0) {
        console.error('No categories found. Run seed.js first!');
        process.exit(1);
      }

      // Clear existing listings
      await Listing.deleteMany({});
      console.log('Cleared existing listings');

      // Create sample listings
      const listings = [
        {
          user: user._id,
          category: categories[0]._id, // Chair
          title: 'Comfortable Office Chair - Like New',
          description: 'Gently used office chair in excellent condition. Perfect for home office.',
          price: 5000,
          condition: 'used',
          location: 'Dhanmondi, Dhaka',
          material: 'Mesh Back, Foam Cushion',
          dimensions: '60x60x90 cm',
          status: 'approved'
        },
        {
          user: user._id,
          category: categories[0]._id, // Chair
          title: 'Wooden Dining Chair Set',
          description: 'Set of 4 wooden dining chairs. Sturdy and stylish.',
          price: 12000,
          condition: 'used',
          location: 'Gulshan, Dhaka',
          material: 'Solid Wood',
          dimensions: '45x45x85 cm',
          status: 'approved'
        },
        {
          user: user._id,
          category: categories[1]._id, // Bed
          title: 'Queen Size Bed Frame',
          description: 'Modern queen size bed frame with storage.',
          price: 25000,
          condition: 'new',
          location: 'Banani, Dhaka',
          material: 'Plywood and Metal',
          dimensions: '160x200 cm',
          status: 'approved'
        },
        {
          user: user._id,
          category: categories[2]._id, // Sofa
          title: 'L-Shaped Sofa Set',
          description: 'Comfortable L-shaped sofa for living room.',
          price: 45000,
          condition: 'used',
          location: 'Mirpur, Dhaka',
          material: 'Fabric',
          dimensions: '250x150 cm',
          status: 'approved'
        },
        {
          user: user._id,
          category: categories[6]._id, // Table
          title: 'Wooden Dining Table',
          description: 'Elegant wooden dining table for 6 people.',
          price: 18000,
          condition: 'used',
          location: 'Motijheel, Dhaka',
          material: 'Oak Wood',
          dimensions: '150x90x75 cm',
          status: 'approved'
        },
        {
          user: user._id,
          category: categories[3]._id, // Wardrobe
          title: 'Wooden Wardrobe',
          description: 'Large wooden wardrobe with 3 doors.',
          price: 35000,
          condition: 'used',
          location: 'Uttara, Dhaka',
          material: 'Chipboard',
          dimensions: '180x60x200 cm',
          status: 'approved'
        },
        {
          user: user._id,
          category: categories[4]._id, // Bookshelf
          title: 'Tall Bookshelf',
          description: 'Wooden bookshelf with 5 shelves.',
          price: 8000,
          condition: 'used',
          location: 'Mohakhali, Dhaka',
          material: 'Plywood',
          dimensions: '80x30x180 cm',
          status: 'approved'
        }
      ];

      await Listing.insertMany(listings);
      console.log(`✓ Created ${listings.length} sample listings`);
      console.log('\nListings by category:');
      
      for (const cat of categories) {
        const count = await Listing.countDocuments({ category: cat._id });
        console.log(`  ${cat.icon} ${cat.name}: ${count}`);
      }

      process.exit(0);
    } catch (err) {
      console.error('Error:', err);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
