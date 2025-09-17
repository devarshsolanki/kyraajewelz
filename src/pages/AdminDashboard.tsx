import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  Eye,
  IndianRupee
} from "lucide-react";
import { toast } from "sonner";
import React from "react";
import axios from "axios";
import AdminOverview from "../components/admin/AdminOverview";
import AdminProducts from "../components/admin/AdminProducts";
import AdminCategories from "../components/admin/AdminCategories";
import AdminOrders from "../components/admin/AdminOrders";

// Cloudinary config
const uploadToCloudinary = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", "my_preset"); // Replace "YOUR_UPLOAD_PRESET" with your Cloudinary upload preset

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/dt3dtekuh/image/upload`, // Replace "dt3dtekuh" with your Cloudinary cloud name if different
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    images: [""],
    categoryId: "",
    material: "",
    stock: 0,
    isFeatured: false,
  });
  
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [showViewProduct, setShowViewProduct] = useState(false);
  const [viewProduct, setViewProduct] = useState<any>(null);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Add state for editing category
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);

  const loggedInUser = useQuery(api.auth.loggedInUser);
  const products = useQuery(api.products.getProducts, {}) || [];
  const categories = useQuery(api.categories.getCategories) || [];
  const orders = useQuery(api.orders.getAllOrders, {}) || [];
  
  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const deleteProduct = useMutation(api.products.deleteProduct);
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
  const createCategory = useMutation(api.categories.createCategory);
  const deleteCategory = useMutation(api.categories.deleteCategory);
  // Add updateCategory mutation
  const updateCategory = useMutation(api.categories.updateCategory);

  // Check if user is admin
  if (!loggedInUser || loggedInUser.email !== "admin@kyraajewelz.com") {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-cinzel font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }


  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        originalPrice: newProduct.originalPrice || undefined,
        images: newProduct.images.filter((img) => img.trim() !== ""),
        categoryId: newProduct.categoryId,
        material: newProduct.material,
        stock: Number(newProduct.stock) || 0,
        isFeatured: !!newProduct.isFeatured,
      };

      await createProduct(productData as any);
      
      toast.success("Product created successfully!");
      
      // Reset form
      setShowAddProduct(false);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        originalPrice: 0,
        images: [""],
        categoryId: "",
        material: "",
        stock: 0,
        isFeatured: false,
      });
      setUploadedImages([]);
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.message || "Failed to create product. Please check the console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus({ orderId: orderId as any, status });
      toast.success("Order status updated!");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory({
        name: newCategory.name,
        description: newCategory.description,
        image: newCategory.image || undefined,
      });
      toast.success("Category created successfully!");
      setShowAddCategory(false);
      setNewCategory({ name: "", description: "", image: "" });
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory({ id: categoryId as any });
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  // Edit Category submit handler
  const handleEditCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCategory({
        id: editCategory._id,
        name: editCategory.name,
        description: editCategory.description,
        image: editCategory.image || undefined,
      });
      toast.success("Category updated successfully!");
      setShowEditCategory(false);
      setEditCategory(null);
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.filter(order => order.status !== "cancelled").reduce((sum, order) => sum + order.totalAmount, 0),
    pendingOrders: orders.filter(order => order.status === "pending").length,
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: TrendingUp },
    { id: "products", name: "Products", icon: Package },
    { id: "categories", name: "Categories", icon: Package },
    { id: "orders", name: "Orders", icon: ShoppingBag },
    // { id: "customers", name: "Customers", icon: Users },
  ];

  // Add image field handlers for Add Product
  const handleAddImageField = () => {
    setNewProduct({ ...newProduct, images: [...newProduct.images, ""] });
  };
  const handleRemoveImageField = (idx: number) => {
    setNewProduct({
      ...newProduct,
      images: newProduct.images.filter((_, i) => i !== idx),
    });
  };
  const handleImageChange = (idx: number, value: string) => {
    const updated = [...newProduct.images];
    updated[idx] = value;
    setNewProduct({ ...newProduct, images: updated });
  };

  // Add image field handlers for Edit Product
  const handleEditAddImageField = () => {
    setEditProduct({ ...editProduct, images: [...editProduct.images, ""] });
  };
  const handleEditRemoveImageField = (idx: number) => {
    setEditProduct({
      ...editProduct,
      images: editProduct.images.filter((_: any, i: number) => i !== idx),
    });
  };
  const handleEditImageChange = (idx: number, value: string) => {
    const updated = [...editProduct.images];
    updated[idx] = value;
    setEditProduct({ ...editProduct, images: updated });
  };

  // Handle Edit Product submit
  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    
    try {
      // Prepare the update data with proper formatting
      const updateData: any = {
        id: editProduct._id,
        name: editProduct.name,
        description: editProduct.description,
        price: Number(editProduct.price),
        originalPrice: editProduct.originalPrice || editProduct.price,
        images: editProduct.images.filter((img: string) => img.trim() !== ""),
        categoryId: editProduct.categoryId,
        material: editProduct.material,
        stock: Number(editProduct.stock),
        isFeatured: !!editProduct.isFeatured,
      };

      // Add optional fields if they exist
      // No optional fields remaining after removal of occasion, tags, weight, dimensions, availableSizes

      await updateProduct(updateData);
      toast.success("Product updated successfully!");
      setShowEditProduct(false);
      setEditProduct(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct({ id: productId as any });
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // 2. Add Product: handle file input change (multiple files)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setUploading(true);

    const uploadedUrls: string[] = [];
    try {
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
      }
      setUploadedImages(uploadedUrls);
      setNewProduct((prev) => ({
        ...prev,
        images: uploadedUrls,
      }));
      toast.success("Images uploaded!");
    } catch (err: any) {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Remove image from uploadedImages and newProduct.images
  const handleRemoveUploadedImg = (idx: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // 3. Edit Product: handle file input change (single file)
  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setEditProduct((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), url],
      }));
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Remove image from editProduct.images
  const handleRemoveEditImg = (idx: number) => {
    setEditProduct((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== idx),
    }));
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-cinzel font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 font-lato">Manage your jewelry store</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
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
          <div className="lg:col-span-4">
            {activeTab === "overview" && (
              <AdminOverview stats={stats} orders={orders} />
            )}

            {activeTab === "products" && (
              <AdminProducts
                products={products}
                handleDeleteProduct={handleDeleteProduct}
                setViewProduct={setViewProduct}
                setShowViewProduct={setShowViewProduct}
                setEditProduct={setEditProduct}
                setShowEditProduct={setShowEditProduct}
                setShowAddProduct={setShowAddProduct}
              />
            )}

            {activeTab === "categories" && (
              <AdminCategories categories={categories} handleDeleteCategory={handleDeleteCategory} setEditCategory={setEditCategory} setShowEditCategory={setShowEditCategory} setShowAddCategory={setShowAddCategory} />
            )}

            {activeTab === "orders" && (
              <AdminOrders
                orders={orders}
                handleUpdateOrderStatus={handleUpdateOrderStatus}
              />
            )}
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Product</h3>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={newProduct.categoryId}
                        onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                      <input
                        type="number"
                        value={newProduct.originalPrice}
                        onChange={(e) => setNewProduct({...newProduct, originalPrice: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                      <input
                        type="text"
                        value={newProduct.material}
                        onChange={(e) => setNewProduct({...newProduct, material: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                        required
                      />
                    </div>
                  </div>


                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newProduct.isFeatured}
                        onChange={(e) => setNewProduct({...newProduct, isFeatured: e.target.checked})}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                    </label>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {uploading && <div className="text-amber-600 mt-2">Uploading images...</div>}
                    {/* Preview grid */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Product ${idx + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveUploadedImg(idx)}
                            className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:bg-red-100 transition"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:border-rose-500 hover:text-rose-600 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white py-3 rounded-full font-semibold hover:from-amber-600 hover:to-rose-600 transition-all duration-300"
                    >
                      Create Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Category Modal */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Category</h3>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                      rows={2}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                      type="text"
                      value={newCategory.image}
                      onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowAddCategory(false)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:border-rose-500 hover:text-rose-600 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white py-3 rounded-full font-semibold hover:from-amber-600 hover:to-rose-600 transition-all duration-300"
                    >
                      Create Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* View Product Modal */}
        {showViewProduct && viewProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{viewProduct.name}</h3>
                <div className="mb-4">
                  <div className="flex gap-2 overflow-x-auto mb-2">
                    {viewProduct.images && viewProduct.images.length > 0 ? (
                      viewProduct.images.map((img: string, idx: number) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Product Image ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                      ))
                    ) : (
                      <span className="text-gray-400">No images</span>
                    )}
                  </div>
                  <div className="text-gray-700 mb-2">{viewProduct.description}</div>
                  <div className="mb-2">
                    <span className="font-medium">Category:</span> {viewProduct.category}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Material:</span> {viewProduct.material}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Price:</span> ₹{viewProduct.price?.toLocaleString()}
                    {viewProduct.originalPrice && (
                      <span className="ml-2 text-gray-500 line-through">
                        ₹{viewProduct.originalPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Stock:</span> {viewProduct.stock}
                  </div>
                </div>
                <button
                  className="w-full mt-2 border-2 border-gray-300 text-gray-700 py-2 rounded-full font-semibold hover:border-rose-500 hover:text-rose-600 transition-all duration-300"
                  onClick={() => setShowViewProduct(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditProduct && editProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Product</h3>
                <form onSubmit={handleEditProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={editProduct.name}
                        onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={editProduct.categoryId}
                        onChange={e => setEditProduct({ ...editProduct, categoryId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={editProduct.description}
                      onChange={e => setEditProduct({ ...editProduct, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                      rows={3}
                      required
                    />
                  </div>
                  {/* Image URLs */}
                  <div>
                    <label className="block font-medium mb-1">Product Images</label>
                    <div className="space-y-2">
                      {/* Existing images as URL inputs */}
                      {editProduct.images.map((img: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={img}
                            onChange={e => {
                              const imgs = [...editProduct.images];
                              imgs[idx] = e.target.value;
                              setEditProduct({ ...editProduct, images: imgs });
                            }}
                            className="flex-1 border px-2 py-1 rounded"
                          />
                          <button
                            type="button"
                            className="text-red-500"
                            onClick={() => handleRemoveEditImg(idx)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      {/* Add new image by URL */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Paste image URL"
                          value={editProduct.newImageUrl || ""}
                          onChange={e => setEditProduct({ ...editProduct, newImageUrl: e.target.value })}
                          className="flex-1 border px-2 py-1 rounded"
                        />
                        <button
                          type="button"
                          className="bg-rose-500 text-white px-3 py-1 rounded"
                          onClick={() => {
                            if (editProduct.newImageUrl) {
                              setEditProduct({
                                ...editProduct,
                                images: [...editProduct.images, editProduct.newImageUrl],
                                newImageUrl: "",
                              });
                            }
                          }}
                        >
                          Add URL
                        </button>
                      </div>

                      {/* Add new image by file upload */}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditFileChange}
                        />
                        {uploading && <div className="text-amber-600 mt-2">Uploading image...</div>}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <input
                        type="number"
                        value={editProduct.price}
                        onChange={e => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                      <input
                        type="number"
                        value={editProduct.originalPrice}
                        onChange={e => setEditProduct({ ...editProduct, originalPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                      <input
                        type="number"
                        value={editProduct.stock}
                        onChange={e => setEditProduct({ ...editProduct, stock: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                    <input
                      type="text"
                      value={editProduct.material}
                      onChange={e => setEditProduct({ ...editProduct, material: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!!editProduct.isFeatured}
                        onChange={e => setEditProduct({ ...editProduct, isFeatured: e.target.checked })}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowEditProduct(false)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:border-rose-500 hover:text-rose-600 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white py-3 rounded-full font-semibold hover:from-amber-600 hover:to-rose-600 transition-all duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditCategory && editCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Category</h3>
                <form onSubmit={handleEditCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={editCategory.name}
                      onChange={e => setEditCategory({ ...editCategory, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={editCategory.description}
                      onChange={e => setEditCategory({ ...editCategory, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                      rows={2}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                      type="text"
                      value={editCategory.image}
                      onChange={e => setEditCategory({ ...editCategory, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowEditCategory(false)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:border-rose-500 hover:text-rose-600 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white py-3 rounded-full font-semibold hover:from-amber-600 hover:to-rose-600 transition-all duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
