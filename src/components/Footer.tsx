import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin, Linkedin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-300  via-rose-300 to-amber-300 text-gray-800 pt-12 pb-6 mt-10 border-t border-rose-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Description */}
        <div>
          <Link to="/" className="text-2xl font-bold text-rose-600 tracking-tight mb-2 block">
            Kyraa Jewelz
          </Link>
          <p className="text-gray-600 mb-4">
            Luxury jewelry for every occasion. Discover handcrafted pieces that shine as bright as you do.
          </p>
          <div className="flex gap-3 mt-2">
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="bg-white rounded-full p-2 shadow hover:bg-rose-100 transition">
              <Instagram className="w-5 h-5 text-rose-500" />
            </a>
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="bg-white rounded-full p-2 shadow hover:bg-amber-100 transition">
              <Facebook className="w-5 h-5 text-amber-500" />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="bg-white rounded-full p-2 shadow hover:bg-pink-100 transition">
              <Twitter className="w-5 h-5 text-pink-500" />
            </a>
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="bg-white rounded-full p-2 shadow hover:bg-green-100 transition">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="bg-white rounded-full p-2 shadow hover:bg-blue-100 transition">
              <Linkedin className="w-5 h-5 text-blue-600" />
            </a>
          </div>
        </div>
        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-700">
            <li>
              <Link to="/" className="hover:text-rose-600 transition">Home</Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-rose-600 transition">Shop</Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-rose-600 transition">Wishlist</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-rose-600 transition">Cart</Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-rose-600 transition">Profile</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-rose-600 transition">Contact</Link>
            </li>
          </ul>
        </div>
        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Customer Service</h4>
          <ul className="space-y-2 text-gray-700">
            <li>
              <Link to="/faq" className="hover:text-rose-600 transition">FAQ</Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-rose-600 transition">Returns & Exchanges</Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-rose-600 transition">Shipping Info</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-rose-600 transition">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-rose-600 transition">Terms of Service</Link>
            </li>
          </ul>
        </div>
        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Us</h4>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-600" />
              <span>+91 99999 99999</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-600" />
              <span>support@kyraajewelz.com</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-600" />
              <span>Mumbai, India</span>
            </li>
          </ul>
          <div className="mt-4 text-xs text-gray-500">
            <span className="block">Mon - Sat: 10:00am - 7:00pm</span>
            <span className="block">Sun: Closed</span>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-rose-200 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Kyraa Jewelz. All rights reserved. | Designed with <span className="text-rose-500">♥</span> in India.
      </div>
    </footer>
  );
}
