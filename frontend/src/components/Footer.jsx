import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🪑</span> FurniNest
          </h3>
          <p className="mb-4">Premium furniture marketplace for buying and selling quality pre-owned and new furniture.</p>
        </div>
        
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/browse" className="hover:text-green-500 transition">Browse Furniture</Link></li>
            <li><Link to="/login" className="hover:text-green-500 transition">Sell Furniture</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Support</h4>
          <ul className="space-y-2">
            <li><a href="mailto:ahmmedshifat64649@gmail.com" className="hover:text-green-500 transition">📧 ahmmedshifat64649@gmail.com</a></li>
            <li><a href="tel:+8801761647173" className="hover:text-green-500 transition">📱 01761647173</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Newsletter</h4>
          <p className="mb-4">Subscribe to get the latest deals and updates.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Your email" className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500 text-white" />
            <button className="btn btn-primary whitespace-nowrap">Subscribe</button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} FurniNest. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
