import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Cart() {
  const cartItems = useQuery(api.cart.getCartItems) || [];
  const updateCartItem = useMutation(api.cart.updateCartItem);
  const removeFromCart = useMutation(api.cart.removeFromCart);

  const handleUpdateQuantity = async (itemId: any, newQuantity: number) => {
    try {
      if (newQuantity < 1) return; // prevent 0 or negative
      await updateCartItem({ itemId: itemId as any, quantity: newQuantity });
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: any) => {
    try {
      await removeFromCart({ itemId: itemId as any });
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 2000 ? 0 : 200;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-cinzel font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 font-lato">
              Discover our beautiful jewelry collection and add some items to
              your cart.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-gradient-to-r from-amber-500 to-rose-500 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
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
          <h1 className="text-3xl font-bold font-cinzel text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 font-lato">
            {cartItems.length} items in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                {/* Responsive Flex */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  {/* Product Image */}
                  <div className="w-full sm:w-24 h-40 sm:h-24 rounded-lg overflow-hidden bg-gradient-to-br from-amber-50 to-rose-50 flex-shrink-0">
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-amber-500" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      to={`/product/${item.product._id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-rose-600 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.product.category}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      ₹{item.product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-cinzel font-bold text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-lato">Subtotal</span>
                  <span className="font-medium">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-lato">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-green-600 font-lato">
                    🎉 You qualify for free shipping!
                  </p>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-gradient-to-r from-amber-500 to-rose-500 text-white py-4 rounded-full font-semibold hover:from-amber-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/shop"
                className="w-full mt-4 border-2 border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:border-rose-500 hover:text-rose-600 transition-all duration-300 flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
