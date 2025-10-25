"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/featuredProducts`,
          {
            cache: "no-store",
          }
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading featured products...</p>;
  }

  if (!products || products.length === 0) {
    return (
      <p className="text-center py-10 text-red-500 font-semibold text-xl">
        No featured products found 😢
      </p>
    );
  }

  return (
    <div className="mt-10 bg-gray-100">
      <h1 className="py-10 text-xl md:text-4xl lg:text-6xl font-bold text-center">
        <span className="text-secondary">Featured</span> Products
      </h1>

      <div className="container py-10 mx-auto grid gap-6 md:grid-cols-3 lg:grid-cols-4">
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

export default FeaturedProducts;
