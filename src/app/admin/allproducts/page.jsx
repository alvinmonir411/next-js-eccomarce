"use client";
import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useState } from "react";
import api from "@/app/Utilitis/axiosInstance";
import Loader from "@/app/Utilitis/Loader";
import ProductViewModal from "@/app/Utilitis/ProductViewModal";
import EditProductModal from "@/app/Utilitis/EditProductModal";
import Swal from "sweetalert2";

// Helper function to safely get the product ID (added for robustness, though not strictly required by original logic)
const getProductId = (product) => product._id?.$oid || product._id;

const AdminProductPage = () => {
  // Renamed 'Page' for better context
  const { user, loading: userLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For viewing modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // For editing modal
  const [editProduct, setEditProduct] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // --- LOGIC SECTION (UNCHANGED) ---

  useEffect(() => {
    if (!user?.email) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/allproducts", {
          params: { email: user.email },
        });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleEdit = (product) => {
    setEditProduct(product);
    setEditModalOpen(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleUpdate = (updatedProduct) => {
    // ✅ update it everywhere locally
    setProducts((prev) =>
      prev.map((p) => (p._id.$oid === updatedProduct._id ? updatedProduct : p))
    );
  };

  // handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444", // Tailwind red-500
      cancelButtonColor: "#6B7280", // Tailwind gray-500
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/api/products/${id}`);
        if (res.data) {
          // Remove the deleted product from state
          setProducts((prev) => prev.filter((p) => p._id !== id));
          Swal.fire("Deleted!", "Successfully deleted item ✅", "success");
        }
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error!", "Something went wrong 😢", "error");
      }
    }
  };

  const toggleFeatured = async (id, isFeatured) => {
    const res = await api.post(`/admin/featured?id=${id}`);
    if (res.data.success) {
      setProducts((prev) =>
        prev.map((p) =>
          getProductId(p) === id ? { ...p, isFeatured: res.data.newValue } : p
        )
      );

      Swal.fire(
        res.data.newValue
          ? "🌟 Product marked as Featured!"
          : "❌ Product removed from Featured list.",
        "",
        "success"
      );
    }
  };

  const toggleTrending = async (id, isTrending) => {
    try {
      const res = await api.post(`/admin/trending?id=${id}`);
      console.log(res.data); // prints { success: true, isTrending: true/false, message: "..." }

      if (res.data.success) {
        // Update local state
        setProducts((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, isTrending: res.data.isTrending } : p
          )
        );

        // ✅ SweetAlert notification
        Swal.fire({
          title: res.data.isTrending ? "🔥 Trending!" : "🚫 Not Trending",
          text: res.data.message,
          icon: res.data.isTrending ? "success" : "info",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // if success is false but backend responded
        Swal.fire({
          title: "Oops!",
          text: res.data.message || "Could not update trending status",
          icon: "error",
        });
      }
    } catch (err) {
      console.error("Toggle trending failed:", err);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while toggling trending 😢",
        icon: "error",
      });
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  if (userLoading || loading) return <Loader />;
  if (error)
    return (
      <p className="text-xl text-red-600 text-center mt-12 p-4 bg-red-50 rounded-lg shadow-md max-w-lg mx-auto">
        {error}
      </p>
    );

  // --- PREMIUM DESIGN SECTION ---

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 border-b-4 border-indigo-600 pb-2 inline-block">
          Product Management Dashboard 📊
        </h1>

        {/* Product Table Container */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header (Premium Dark Style) */}
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-xl">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Sold
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider rounded-tr-xl">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={getProductId(product)}
                  className="hover:bg-indigo-50/20 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-4">
                    <div className="w-12 h-12 flex-shrink-0">
                      <img
                        src={product.images?.[0] || "placeholder.jpg"} // Safely access image
                        alt={product.title}
                        className="w-full h-full object-cover rounded-md shadow-sm border border-gray-200"
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {product.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.category}
                  </td>

                  {/* Price with Green Emphasis */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    {/* Using safe access for price number, defaulting to 0 */}$
                    {product.price?.$numberInt || product.price || 0}
                  </td>

                  {/* Stock Quantity with Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                        product.stockQuantity > 10
                          ? "bg-green-100 text-green-800"
                          : product.stockQuantity > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stockQuantity}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.purchaseCount || 0}
                  </td>

                  {/* Rating with Star Icon */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                    <span className="text-amber-500">★</span>{" "}
                    {product.rating || "N/A"}
                  </td>

                  {/* Actions Column (Condensed and Modern) */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex flex-wrap justify-center gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => handleView(product)}
                        title="View Details"
                        className="p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition shadow-md"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          ></path>
                        </svg>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(product)}
                        title="Edit Product"
                        className="p-2 rounded-full text-white bg-gray-700 hover:bg-gray-900 transition shadow-md"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          ></path>
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(getProductId(product))} // Use getProductId for safety
                        title="Delete Product"
                        className="p-2 rounded-full text-white bg-red-600 hover:bg-red-700 transition shadow-md"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>

                      {/* Feature Toggle */}
                      <button
                        onClick={() =>
                          toggleFeatured(
                            getProductId(product),
                            product.isFeatured
                          )
                        }
                        title={
                          product.isFeatured ? "Unfeature" : "Feature Product"
                        }
                        className={`text-xs px-2 py-1 rounded-full transition shadow-sm ${
                          product.isFeatured
                            ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                        }`}
                      >
                        {product.isFeatured ? "Unfeature" : "Feature"}
                      </button>

                      {/* Trending Toggle */}
                      <button
                        onClick={() =>
                          toggleTrending(
                            getProductId(product),
                            product.isTrending
                          )
                        }
                        title={product.isTrending ? "Untrend" : "Set Trending"}
                        className={`text-xs px-2 py-1 rounded-full transition shadow-sm ${
                          product.isTrending
                            ? "bg-pink-500 text-white hover:bg-pink-600"
                            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                        }`}
                      >
                        {product.isTrending ? "Untrend" : "Trending"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal (Unchanged) */}
      <ProductViewModal
        product={selectedProduct}
        isOpen={showModal}
        onClose={closeModal}
      />

      {/* Edit Modal (Unchanged) */}
      <EditProductModal
        modalopen={editModalOpen}
        product={editProduct}
        closed={() => setEditModalOpen(false)}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default AdminProductPage;
