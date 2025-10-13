"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../Utilitis/ProductCard";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-900">
        Featured Products
      </h1>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
    </section>
  );
}
