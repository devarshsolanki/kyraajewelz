import { useState, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import ProductCard from "../components/ProductCard";
import { Id } from "../../convex/_generated/dataModel";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = id! as Id<"products">;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const product = useQuery(api.products.getProduct, { id: productId });
  const relatedProducts = useQuery(api.products.getProducts, {
    categoryId: product?.categoryId,
    limit: 4,
  });
  const isInWishlist = useQuery(api.wishlist.isInWishlist, {
    productId: productId,
  });
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const { averageRating, reviewCount } =
    useQuery(api.reviews.getAverageRating, { productId: productId }) || {
      averageRating: 0,
      reviewCount: 0,
    };
  const reviews = useQuery(api.reviews.getReviewsForProduct, {
    productId: productId,
  });
  const canReview = useQuery(api.reviews.canUserReviewProduct, {
    productId: productId,
  });

  const addToCart = useMutation(api.cart.addToCart);
  const addToWishlist = useMutation(api.wishlist.addToWishlist);
  const removeFromWishlist = useMutation(api.wishlist.removeFromWishlist);
  const createReview = useMutation(api.reviews.createReview);

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gradient-to-r from-amber-400 to-rose-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!loggedInUser) {
      toast.error("Please sign in to add items to cart");
      return;
    }
    try {
      await addToCart({ productId: product._id, quantity });
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleWishlistToggle = async () => {
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
      console.error("Failed to update wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const nextImage = () =>
    setSelectedImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  const prevImage = () =>
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!loggedInUser) {
      toast.error("Please sign in to submit a review.");
      return;
    }
    if (rating === 0) {
      toast.error("Please provide a rating.");
      return;
    }
    try {
      await createReview({ productId: productId, rating, comment });
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      toast.error(error.message || "Failed to submit review.");
    }
  };

  return (
    <>
      <div className="min-h-screen pt-20 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-rose-600">
                Home
              </Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-rose-600">
                Shop
              </Link>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </div>
          </nav>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* ---------- LEFT: IMAGES ---------- */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                {product.images.length > 0 ? (
                  <>
                    <img
                      src={product.images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {discountPercentage > 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{discountPercentage}% OFF
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-rose-100">
                    <Heart className="w-20 h-20 text-amber-500" />
                  </div>
                )}
              </div>
            </div>

            {/* ---------- RIGHT: INFO ---------- */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {/* Average Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= averageRating
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="p-2 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-8 py-4 rounded-full"
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 ${
                    isInWishlist
                      ? "bg-red-500 text-white"
                      : "border-2 border-gray-300 text-gray-700"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`}
                  />
                  {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>

         

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts
                  .filter((p: any) => p._id !== product._id)
                  .slice(0, 4)
                  .map((relatedProduct: any) => (
                    <ProductCard
                      key={relatedProduct._id}
                      product={relatedProduct}
                    />
                  ))}
              </div>
            </div>
          )}

           {/* Reviews Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews ({reviewCount})
            </h2>

            {/* Review Submission Form */}
            {loggedInUser && canReview && (
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Write a Review
                </h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 cursor-pointer ${
                            star <= rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Your Comment
                    </label>
                    <textarea
                      id="comment"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-rose-600 transition"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}

            {/* Display Reviews */}
            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id.toString()}
                    className="bg-white p-6 rounded-2xl shadow-lg"
                  >
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-3 text-gray-800 font-semibold">
                        {review.userName}
                      </span>
                      <span className="ml-2 text-gray-500 text-sm">
                        {new Date(review._creationTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No reviews yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
