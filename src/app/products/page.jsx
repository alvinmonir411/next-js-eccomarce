"use client";
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../Utilitis/ProductCard";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch products safely
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);
        // Handle if API returns object or array
        const productsArray = Array.isArray(data) ? data : data.products || [];
        setProducts(productsArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  // Compute unique categories for filter buttons
  const uniqueCategories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const categories = products.map((p) => p.category).filter(Boolean); // remove undefined/null
    return ["all", ...new Set(categories)];
  }, [products]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center animate-pulse">
          <p className="text-xl md:text-2xl font-semibold text-gray-800">
            Loading products...
          </p>
          <div className="mt-4 w-16 h-16 border-4 border-t-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="mt-5 px-4 py-12 min-h-screen">
      {/* Category Filter Buttons */}
      <div className="flex justify-center gap-3 flex-wrap mb-6">
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === cat
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="relative group rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
