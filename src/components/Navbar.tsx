import { useState, useEffect } from "react"; 
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignOutButton } from "../SignOutButton";
import { ShoppingBag, Heart, User, Menu, X, Search } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import logo from "../img/bglogo.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const loggedInUser = useQuery(api.auth.loggedInUser);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const categories = useQuery(api.categories.getCategories);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome
          ? isScrolled
            ? "bg-gradient-to-r from-pink-300 via-rose-300 to-amber-300 py-1 shadow-lg"
            : "bg-transparent py-1"
          : "bg-gradient-to-r from-pink-300 via-rose-300 to-amber-300 py-1 shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Kyraa Jewelz Logo" className="w-[80px] md:w-[100px] object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-cinzel font-bold text-base px-2 py-1 transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "text-rose-600"
                    : isScrolled
                    ? "text-gray-100 hover:text-rose-600"
                    : "text-gray-100 hover:text-rose-600"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {categories?.map((category) => (
              <Link
                key={category._id}
                to={`/shop?category=${category._id}`}
                className={`font-cinzel font-bold text-base px-2 py-1 transition-colors duration-200 ${
                  location.search.includes(category._id)
                    ? "text-rose-600"
                    : isScrolled
                    ? "text-gray-100 hover:text-rose-600"
                    : "text-gray-100 hover:text-rose-600"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {loggedInUser ? (
              <>
                <Link to="/wishlist" className="relative p-2 hover:bg-pink-400 hover:text-gray-100 rounded-full transition-colors">
                  <Heart className={`w-6 h-6 ${location.pathname === "/wishlist" ? "text-rose-600 fill-current" : isScrolled ? "text-gray-100" : "text-gray-100"}`} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link to="/cart" className="relative p-2 hover:bg-pink-400 rounded-full transition-colors">
                  <ShoppingBag className={`w-6 h-6 ${location.pathname === "/cart" ? "text-rose-600" : isScrolled ? "text-gray-100" : "text-gray-100"}`} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="p-2 hover:bg-pink-400 rounded-full transition-colors">
                    <User className={`w-6 h-6 ${isScrolled ? "text-gray-100" : "text-gray-100"}`} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-pink-100 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    {loggedInUser.email === "admin@kyraajewelz.com" && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="px-4 py-2">
                      <SignOutButton />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-6 py-2 rounded-full font-medium hover:from-amber-600 hover:to-rose-600 transition-all duration-200"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-pink-400 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X className={`w-6 h-6 ${isScrolled ? "text-gray-700" : "text-gray-100"}`} /> : <Menu className={`w-6 h-6 ${isScrolled ? "text-gray-100" : "text-gray-100"}`} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 pb-2 border-t border-gray-200 bg-pink-100 rounded-b-lg shadow-lg">
            <div className="flex flex-col space-y-1 mt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    location.pathname === link.path ? "text-rose-600 bg-rose-50" : "text-gray-700 hover:text-rose-600 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {categories?.map((category) => (
                <Link
                  key={category._id}
                  to={`/shop?category=${category._id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    location.search.includes(category._id) ? "text-rose-600 bg-rose-50" : "text-gray-700 hover:text-rose-600 hover:bg-gray-50"
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
