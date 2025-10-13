"use client";

import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useState } from "react";
import api from "@/app/Utilitis/axiosInstance";
import Loader from "@/app/Utilitis/Loader";

const page = () => {
  const { user, loading: userLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (userLoading || loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product._id.$oid}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                  {product.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-semibold">
                  {product.price.$numberInt} BDT
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {product.stockQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {product.purchaseCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-yellow-500 font-semibold">
                  ⭐ {product.rating}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
    </div>
  );
};

export default page;
