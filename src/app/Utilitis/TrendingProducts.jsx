"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get("/api/TrendingProducts");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching trending products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-600">
        Loading trending products...
      </p>
    );
  }

  if (!products || products.length === 0) {
    return (
      <p className="text-center py-10 text-red-500 font-semibold text-xl">
        No trending products found 😢
      </p>
    );
  }

  return (
    <div className="mt-10">
      <h1 className="py-10 text-xl md:text-4xl lg:text-6xl font-bold text-center">
        <span className="text-secondary">Trending</span> Products
      </h1>

      <div className="container mx-auto py-10 grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id.$oid || product._id} // safe key
            className="relative group rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;
