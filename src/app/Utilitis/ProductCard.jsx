"use client";
import React from "react";
import Image from "next/image";
import { Star, Heart, Eye, ShoppingCart } from "lucide-react";

import Link from "next/link";
import Addtocard from "./Addtocard";

const ProductCard = ({ product }) => {
  const discount =
    product.offerPrice && product.offerPrice < product.price
      ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
      : null;

  const mainImage =
    product?.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.png";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <div className="relative h-64 w-full bg-gray-50 flex items-center justify-center overflow-hidden group">
        <Image
          src={mainImage}
          alt={product?.title || "Product"}
          fill
          placeholder="blur"
          blurDataURL="/placeholder.png"
          className="object-contain p-4 transition-transform duration-500 ease-in-out group-hover:scale-105"
          priority
        />

        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30">
          {/* Quick View */}
          <Link
            href={`/products/${product._id}`}
            className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full shadow hover:bg-primary hover:text-white transition"
          >
            <Eye size={16} /> Quick View
          </Link>

          {/* Wishlist */}
          <button className="p-2 bg-white rounded-full shadow hover:bg-red-500 hover:text-white transition">
            <Heart size={16} />
          </button>
        </div>

        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
            -{discount}%
          </span>
        )}

        {/* Stock Badge */}
        {product?.stockQuantity >= 1 ? (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded shadow">
            In Stock
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-gray-400 text-white text-xs px-2 py-1 rounded shadow">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase mb-1">{product?.brand}</p>
        <h2 className="font-semibold text-lg line-clamp-1 mb-1 hover:text-primary cursor-pointer">
          {product?.title}
        </h2>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
          {product?.subtitle}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.round(product?.rating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            {product?.rating?.toFixed(1) || "0.0"}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product?.offerPrice ? (
            <>
              <p className="text-lg font-bold text-gray-900">
                {product.currency} {product.offerPrice}
              </p>
              <p className="text-sm text-gray-400 line-through">
                {product.currency} {product.price}
              </p>
            </>
          ) : (
            <p className="text-lg font-bold text-gray-900">
              {product.currency} {product.price}
            </p>
          )}
        </div>

        {/* Add to Cart Button (Always Visible like reference) */}
        <div
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            product.stockQuantity === 0 ? "" : ""
          }`}
          disabled={product.stockQuantity === 0}
        >
          {product.stockQuantity === 0 ? (
            "Out of Stock"
          ) : (
            <Addtocard product={product} quantity={1} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
