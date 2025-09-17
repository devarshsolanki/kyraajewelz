import React from "react";

interface AdminOrdersProps {
  orders: any[]; // Consider defining a more specific type for order
  handleUpdateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

export default function AdminOrders({ orders, handleUpdateOrderStatus }: AdminOrdersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
        Orders
      </h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-lg p-4 sm:p-6"
          >
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-base sm:text-lg">
                  Order #{order.orderNumber}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500">
                  {new Date(order._creationTime).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleUpdateOrderStatus(order._id, e.target.value)
                  }
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm w-full sm:w-auto"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <span className="font-semibold text-sm sm:text-base">
                  ₹{order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <p className="font-medium mb-2">Products:</p>
              <div className="space-y-2">
                {order.items.map((item: any, itemIdx: number) => (
                  <div key={itemIdx} className="flex items-center gap-3 text-sm">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-gray-600">
                        Quantity: {item.quantity} x ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div>
                <p className="font-medium mb-1">Customer:</p>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Shipping Address:</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Payment Status:</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                  order.paymentStatus === "paid" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}