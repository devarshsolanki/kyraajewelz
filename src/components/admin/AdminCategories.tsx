import React from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

interface AdminCategoriesProps {
  categories: any[]; // Consider defining a more specific type for category
  handleDeleteCategory: (categoryId: string) => Promise<void>;
  setEditCategory: (category: any) => void;
  setShowEditCategory: (show: boolean) => void;
  setShowAddCategory: (show: boolean) => void;
}

export default function AdminCategories({
  categories,
  handleDeleteCategory,
  setEditCategory,
  setShowEditCategory,
  setShowAddCategory,
}: AdminCategoriesProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Categories</h3>
        <button
          onClick={() => setShowAddCategory(true)}
          className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-rose-600 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Description</th>
              <th className="text-left py-3 px-4">Image</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">{cat.name}</td>
                <td className="py-3 px-4">{cat.description}</td>
                <td className="py-3 px-4">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    cat.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {cat.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                      onClick={() => {
                        setEditCategory({ ...cat });
                        setShowEditCategory(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      onClick={() => handleDeleteCategory(cat._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="text-center text-gray-500 py-8">No categories found.</div>
        )}
      </div>
    </div>
  );
}