"use client";

import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useState } from "react";
import api from "@/app/Utilitis/axiosInstance";
import Loader from "@/app/Utilitis/Loader";
import ProductViewModal from "@/app/Utilitis/ProductViewModal";

const page = () => {
  const { user, loading: userLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleView = (product) => {
    setSelectedProduct(product); // ✅ Set the clicked product
    setShowModal(true); // ✅ Open modal
  };

  const closeModal = () => {
    setSelectedProduct(null); // ✅ Clear selected product
    setShowModal(false); // ✅ Close modal
  };

  if (userLoading || loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sold</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product._id.$oid}
                className="hover:bg-gray-50 transition"
              >
                <td>
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td>{product.title}</td>
                <td>{product.category}</td>
                <td>{product.price.$numberInt} BDT</td>
                <td>{product.stockQuantity}</td>
                <td>{product.purchaseCount}</td>
                <td>⭐ {product.rating}</td>
                <td>
                  <button
                    onClick={() => handleView(product)} // ✅ Here’s the magic
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition mr-2"
                  >
                    View
                  </button>
                  <button className="bg-gray-900 text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition mr-2">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal Component */}
      <ProductViewModal
        product={selectedProduct}
        isOpen={showModal}
        onClose={closeModal}
      />
    </div>
  );
};

export default page;
