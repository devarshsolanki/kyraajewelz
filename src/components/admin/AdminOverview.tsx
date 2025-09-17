import React from "react";
import { Package, ShoppingBag, Users, TrendingUp, IndianRupee } from "lucide-react";

interface AdminOverviewProps {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
  };
  orders: any[]; // Consider defining a more specific type for order
}

export default function AdminOverview({ stats, orders }: AdminOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <IndianRupee className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-rose-500" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Orders</h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">Order #{order.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order._creationTime).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{order.totalAmount.toLocaleString()}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  order.status === "confirmed" ? "bg-blue-100 text-blue-800" :
                  order.status === "shipped" ? "bg-purple-100 text-purple-800" :
                  order.status === "delivered" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}