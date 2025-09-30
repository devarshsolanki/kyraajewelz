import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import { toast } from "sonner";

export default function ReviewPrompt() {
  const pending = useQuery(api.reviews.getPendingReviewItems) || [];
  const [visibleItems, setVisibleItems] = useState<any[]>([]);
  const createReview = useMutation(api.reviews.createReview);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!pending) return;

    const dismissedJson = localStorage.getItem("dismissedPendingReviews");
    const dismissed: string[] = dismissedJson ? JSON.parse(dismissedJson) : [];

    const filtered = pending.filter(
      (p: any) => !dismissed.includes(String(p.productId))
    );

    setVisibleItems((prev) => {
      const prevIds = prev.map((p) => String(p.productId)).join(",");
      const nextIds = filtered.map((p) => String(p.productId)).join(",");
      return prevIds === nextIds ? prev : filtered;
    });
  }, [pending]);

  const first = visibleItems.length > 0 ? visibleItems[0] : null;

  // Reset form when the item to review changes
  useEffect(() => {
    setRating(0);
    setComment("");
    setIsSubmitting(false);
  }, [first?.productId]);

  const dismiss = (productId: any) => {
    const key = "dismissedPendingReviews";
    const dismissedJson = localStorage.getItem(key);
    const dismissed: string[] = dismissedJson ? JSON.parse(dismissedJson) : [];
    dismissed.push(String(productId));
    localStorage.setItem(key, JSON.stringify(dismissed));

    setVisibleItems((v) =>
      v.filter((it) => String(it.productId) !== String(productId))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!first || rating === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createReview({
        productId: first.productId,
        rating,
        comment,
      });
      toast.success("Thank you for your review!");
      // Dismiss after successful submission
      dismiss(first.productId);
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      toast.error(error.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!first) return null;

  return (
    <AnimatePresence>
      {first && (
        <motion.div
          key={first.productId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 w-full max-w-md relative"
          >
            <button
              onClick={() => dismiss(first.productId)}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            <h3 className="font-semibold text-gray-900 text-xl text-center mb-2">
              How was your order?
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              Your feedback helps us improve!
            </p>

            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg mb-4">
              <img
                src={first.product?.images?.[0] || "/"}
                alt={first.product?.name || "Product"}
                className="w-16 h-16 object-cover rounded-lg border"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {first.product?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {first.quantity} item{first.quantity > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-2 my-4">
                {[...Array(5)].map((_, i) => {
                  const ratingValue = i + 1;
                  return (
                    <Star
                      key={i}
                      size={32}
                      className={`cursor-pointer transition-colors ${
                        ratingValue <= rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setRating(ratingValue)}
                    />
                  );
                })}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us more about your experience..."
                className="w-full p-2 border rounded-lg h-24 text-sm focus:ring-amber-500 focus:border-amber-500 transition mb-4"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-full font-semibold transition hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
