import React from "react";
import { Package, Plus, Edit, Trash2, Eye } from "lucide-react";



interface AdminProductsProps {
  products: any[]; // Consider defining a more specific type for product
  handleDeleteProduct: (productId: string) => Promise<void>;
  setViewProduct: (product: any) => void;
  setShowViewProduct: (show: boolean) => void;
  setEditProduct: (product: any) => void;
  setShowEditProduct: (show: boolean) => void;
  setShowAddProduct: (show: boolean) => void;
}

export default function AdminProducts({
  products,
  handleDeleteProduct,
  setViewProduct,
  setShowViewProduct,
  setEditProduct,
  setShowEditProduct,
  setShowAddProduct,
}: AdminProductsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Products</h3>
        <button
          onClick={() => setShowAddProduct(true)}
          className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-rose-600 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Product</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Price</th>
              <th className="text-left py-3 px-4">Stock</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-rose-50 rounded-lg overflow-hidden">
                      {product.images ? (
                        <img
                          src={product.images}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-amber-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.material}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{product.category}</td>
                <td className="py-3 px-4">₹{product.price.toLocaleString()}</td>
                <td className="py-3 px-4">{product.stock}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => {
                        setViewProduct(product);
                        setShowViewProduct(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                      onClick={() => {
                        setEditProduct({
                          ...product,
                          images: Array.isArray(product.images) && product.images.length > 0 
                            ? [...product.images] 
                            : [""],
                          originalPrice: product.originalPrice || 0,
                        });
                        setShowEditProduct(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}