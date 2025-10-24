"use client";
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../Utilitis/ProductCard";
import { Search as SearchIcon, X } from "lucide-react";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // 1️⃣ Fetch products safely
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
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

  // 2️⃣ Filtered products by category + search
  const filteredProducts = useMemo(() => {
    let tempProducts = products;

    if (selectedCategory !== "all") {
      tempProducts = tempProducts.filter(
        (p) => p.category === selectedCategory
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      tempProducts = tempProducts.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.title?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    return tempProducts;
  }, [products, selectedCategory, searchTerm]);

  // 3️⃣ Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = products.reduce((acc, product) => {
      if (!product.category) return acc;
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    return counts;
  }, [products]);

  // 4️⃣ Unique categories array including "all"
  const uniqueCategories = useMemo(() => {
    const categories = Object.keys(categoryCounts);
    return ["all", ...categories];
  }, [categoryCounts]);

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
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Explore Our Products
        </h1>

        {/* --- Search + Filter Panel --- */}
        <div className="mb-10 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
          {/* Search bar */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-150"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category buttons with counts */}
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {uniqueCategories.map((cat) => {
              const count =
                cat === "all" ? products.length : categoryCounts[cat] || 0;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 shadow-sm whitespace-nowrap capitalize ${
                    selectedCategory === cat
                      ? "bg-primary text-white shadow-md transform scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="relative group rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-xl text-gray-500 py-10">
              No products found matching the current filters. 😔
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
