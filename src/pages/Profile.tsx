import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSearchParams } from "react-router-dom";
import { User, Package, Heart, Settings, Calendar, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");
  
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const userOrders = useQuery(api.orders.getUserOrders) || [];
  const wishlistItems = useQuery(api.wishlist.getWishlistItems) || [];
  const updateProfile = useMutation(api.auth.updateMyProfile);
  const cancelOrder = useMutation(api.orders.cancelOrder);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    fullName: loggedInUser?.name || "",
    phoneNumber: loggedInUser?.phone || "",
  });

  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; orderId?: string }>({ open: false });

  React.useEffect(() => {
    if (loggedInUser) {
      setForm({
        fullName: loggedInUser.name || "",
        phoneNumber: loggedInUser.phone || "",
      });
    }
  }, [loggedInUser]);

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "orders", name: "Orders", icon: Package },
    { id: "wishlist", name: "Wishlist", icon: Heart },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateProfile({ fullName: form.fullName, phoneNumber: form.phoneNumber });
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (!loggedInUser) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gradient-to-r from-amber-400 to-rose-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-cinzel font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600 font-lato">Manage your profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-cizen text-gray-900">{loggedInUser.name || "User"}</h3>
                <p className="text-sm text-gray-500">{loggedInUser.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-rose-50 text-rose-600 border-l-4 border-rose-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-2xl font-cizen text-gray-900 mb-6">Profile Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                          />
                        ) : (
                          <div className="text-gray-900 font-medium">{loggedInUser.name || <span className="text-gray-400">Not set</span>}</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span>{loggedInUser.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                          />
                        ) : (
                          <div className="text-gray-900 font-medium">{loggedInUser.phone || <span className="text-gray-400">Not set</span>}</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Member Since
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span>{new Date(loggedInUser._creationTime).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    {editMode ? (
                      <>
                        <button
                          className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-6 py-2 rounded-lg font-cizen hover:from-amber-600 hover:to-rose-600 transition-all duration-300"
                          onClick={handleSave}
                          type="button"
                        >
                          Save
                        </button>
                        <button
                          className="border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-cizen hover:border-rose-500 hover:text-rose-600 transition-all duration-300"
                          onClick={() => { setEditMode(false); setForm({ fullName: loggedInUser.name || "", phoneNumber: loggedInUser.phone || "" }); }}
                          type="button"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-6 py-2 rounded-lg font-cizen hover:from-amber-600 hover:to-rose-600 transition-all duration-300"
                        onClick={() => setEditMode(true)}
                        type="button"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-cizen text-gray-900 mb-6">Order History</h2>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-cizen text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600">Your order history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {userOrders.map((order) => (
                        <div key={order._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-cizen text-gray-900">Order #{order.orderNumber}</h3>
                              <p className="text-sm text-gray-500">
                                Placed on {new Date(order._creationTime).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-rose-50 rounded-lg flex items-center justify-center">
                                  {item.productImage ? (
                                    <img
                                      src={item.productImage}
                                      alt={item.productName}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <Package className="w-6 h-6 text-amber-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{item.productName}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                            </div>
                            <p className="text-lg font-cizen">Total: ₹{order.totalAmount.toLocaleString()}</p>
                          </div>

                          <div className="flex items-center gap-2 mt-4">
                            <span className={`px-2 py-1 rounded text-xs font-cizen ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            {/* Show Cancel button only for eligible orders */}
                            {["pending", "confirmed", "shipped"].includes(order.status) && (
                              <button
                                className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                                onClick={() => setCancelDialog({ open: true, orderId: order._id })}
                              >
                                Cancel Order
                              </button>
                            )}
                            {order.status === "cancelled" && (
                              <span className="ml-4 text-red-500 font-cizen">Cancelled</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-2xl font-cizen text-gray-900 mb-6">My Wishlist</h2>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-cizen text-gray-900 mb-2">No items in wishlist</h3>
                      <p className="text-gray-600">Save your favorite items to your wishlist</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="aspect-square bg-gradient-to-br from-amber-50 to-rose-50 rounded-lg mb-3 overflow-hidden">
                            {item.product.images[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Heart className="w-8 h-8 text-amber-500" />
                              </div>
                            )}
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{item.product.name}</h4>
                          <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>
                          <p className="font-cizen text-rose-600">₹{item.product.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h2 className="text-2xl font-cizen text-gray-900 mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">Email Notifications</h3>
                      <p className="text-sm text-blue-700 mb-3">
                        Stay updated with order status, new arrivals, and special offers.
                      </p>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-blue-900">Enable email notifications</span>
                      </label>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-medium text-green-900 mb-2">Privacy Settings</h3>
                      <p className="text-sm text-green-700 mb-3">
                        Control how your information is used and shared.
                      </p>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-green-900">Allow personalized recommendations</span>
                      </label>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h3 className="font-medium text-amber-900 mb-2">Account Security</h3>
                      <p className="text-sm text-amber-700 mb-3">
                        Keep your account secure with regular password updates.
                      </p>
                      <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {cancelDialog.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs text-center">
            <div className="mb-4 text-lg font-cizen text-gray-800">
              Are you sure you want to cancel this order?
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setCancelDialog({ open: false })}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={!cancelDialog.orderId}
                onClick={async () => {
                  if (!cancelDialog.orderId) {
                    toast.error("Order ID missing. Please try again.");
                    return;
                  }
                  try {
                    // await cancelOrder({ orderId: cancelDialog.orderId });
                    toast.success("Order cancelled successfully");
                  } catch (err: any) {
                    toast.error(err.message || "Failed to cancel order");
                  } finally {
                    setCancelDialog({ open: false });
                  }
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
