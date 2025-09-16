import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Wishlist() {
  const wishlistItems = useQuery(api.wishlist.getWishlistItems) || [];
  const removeFromWishlist = useMutation(api.wishlist.removeFromWishlist);
  const addToCart = useMutation(api.cart.addToCart);

  const handleRemoveFromWishlist = async (productId: any) => {
    try {
      await removeFromWishlist({ productId: productId as any });
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (productId: any) => {
    try {
      await addToCart({ productId: productId as any, quantity: 1 });
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-cinzel font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 forn-lato">
              Save your favorite jewelry pieces to your wishlist for easy access later.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-gradient-to-r from-amber-500 to-rose-500 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl  font-cinzelfont-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600 font-lato">{wishlistItems.length} items saved</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Link to={`/product/${item.product._id}`}>
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-rose-50">
                  {item.product.images[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-16 h-16 text-amber-500" />
                    </div>
                  )}
                  
                  {/* Discount Badge */}
                  {item.product.originalPrice && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      -{Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}%
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveFromWishlist(item.product._id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Link>

              <div className="p-6">
                <div className="text-sm text-gray-500 mb-1">{item.product.category}</div>
                <Link
                  to={`/product/${item.product._id}`}
                  className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-rose-600 transition-colors block"
                >
                  {item.product.name}
                </Link>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{item.product.price.toLocaleString()}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item.product._id)}
                    disabled={item.product.stock === 0}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white py-2 px-4 rounded-full font-semibold hover:from-amber-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {item.product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                  
                  <button
                    onClick={() => handleRemoveFromWishlist(item.product._id)}
                    className="p-2 border-2 border-gray-300 text-gray-700 rounded-full hover:border-red-500 hover:text-red-600 transition-all duration-300"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
