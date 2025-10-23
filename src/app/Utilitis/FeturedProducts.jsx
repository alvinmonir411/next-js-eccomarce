"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get("/api/feturedProducts");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching featured products:", err);
      }
    };

    fetchFeatured();
  }, []);
  console.log(products);
  return (
    <div className="mt-10 bg-gray-100">
      <h1 className="py-10 text-xl md:text-4xl lg:text-6xl font-bold text-center">
        Featured Products
      </h1>

      <div className="container mx-auto grid gap-6  md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="relative group rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            {/* Product Card */}
            <ProductCard product={product} />

            {/* Overlay Icons */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
