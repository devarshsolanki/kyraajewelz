import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Id } from "../../convex/_generated/dataModel";

interface Product {
  _id: Id<"products">;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useMutation(api.cart.addToCart);
  const addToWishlist = useMutation(api.wishlist.addToWishlist);
  const removeFromWishlist = useMutation(api.wishlist.removeFromWishlist);
  const isInWishlist = useQuery(api.wishlist.isInWishlist, { productId: product._id });
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!loggedInUser) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    try {
      await addToCart({ productId: product._id, quantity: 1 });
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!loggedInUser) {
      toast.error("Please sign in to add items to wishlist");
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist({ productId: product._id });
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist({ productId: product._id });
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <motion.div
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.2 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/product/${product._id}`}>
        <div>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-rose-50">
          {product.images[0] ? (
            <motion.img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              -{discountPercentage}%
            </div>
          )}

         {/* Wishlist Button (only visible on mobile) */}
<button
  onClick={handleWishlistToggle}
  className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-all duration-200 sm:hidden
    ${isInWishlist ? "bg-red-500 text-white" : "bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white"}`}
>
  <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
</button>


          {/* Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                Out of Stock
              </span>
            </div>
          )}

          {/* Hover Actions (desktop only) */}
          <div className="hidden sm:flex absolute inset-0 bg-black/20 items-center justify-center gap-3 
                          transition-all duration-300 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-full transition-all duration-200 ${
                isInWishlist 
                  ? "bg-red-500 text-white" 
                  : "bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white"
              }`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
            </button>
            
            <Link
              to={`/product/${product._id}`}
              className="p-3 bg-white/90 text-gray-700 rounded-full hover:bg-amber-500 hover:text-white transition-all duration-200"
            >
              <Eye className="w-5 h-5" />
            </Link>
            
            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="p-3 bg-white/90 text-gray-700 rounded-full hover:bg-rose-500 hover:text-white transition-all duration-200"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="text-sm text-gray-500 mb-1">{product.category}</div>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
            ))}
            <span className="text-sm text-gray-500 ml-2">(4.8)</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-xs text-orange-600 font-medium">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>
        </div>
      </Link>

      {/* Add to Cart Button (always visible below card) */}
      <div className="flex justify-center mb-3 px-4">
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto px-12 py-3 font-lato rounded-lg bg-rose-500 text-white 
                       hover:bg-rose-600 hover:text-white transition-all duration-200 
                       max-w-sm"
          >
            Add to Cart
          </button>
        )}
      </div>
    </motion.div>
  );
}
