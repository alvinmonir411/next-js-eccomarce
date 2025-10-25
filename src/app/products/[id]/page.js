"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, Star, Truck, RefreshCw, Info } from "lucide-react";

// Assuming these components are styled appropriately for a premium feel
import QuantitySelector from "@/app/Utilitis/QuantitySelector";
import Addtocard from "@/app/Utilitis/Addtocard";
import Loader from "@/app/Utilitis/Loader";
import AddReviews from "@/app/lib/AddRiviews";

const PRIMARY_COLOR = "emerald-700";
const ACCENT_COLOR = "amber-500";

// A simple Tab component
const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`py-3 px-6 text-lg font-medium transition-all duration-300 border-b-2 ${
      active
        ? `border-${ACCENT_COLOR} text-${PRIMARY_COLOR} font-bold`
        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
    }`}
  >
    {label}
  </button>
);

// --- Main Component ---
export default function ProductDetails({ params }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // New state for tabs

  // Function to refetch product data (used after a new review is submitted)
  const refetchProductData = async () => {
    try {
      // Small visual loading indicator for a quick refresh
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        setActiveImage(data.images?.[0]);
      }
    } catch (err) {
      console.error("Failed to refetch product data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Simulate a slight premium loading delay for better UX feel
        await new Promise((resolve) => setTimeout(resolve, 500));
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setActiveImage(data.images?.[0]);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // --- Loading & Not Found States ---
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader />
        <p className="ml-4 text-xl text-gray-700">
          Loading exquisite details...
        </p>
      </div>
    );

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-2xl font-semibold bg-white p-8 rounded-xl shadow-lg m-10">
        <Info className="w-8 h-8 mr-3" /> Product not found. Please check the
        item ID.
      </div>
    );

  // --- Product Calculations ---
  const unitPrice = product.offerPrice || product.price;
  const totalPrice = unitPrice * quantity;
  const discountPercentage = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  // Simple review rating calculation
  const averageRating =
    product.reviews?.length > 0
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : "N/A";
  const totalReviews = product.reviews?.length || 0;

  // --- Tab Content Renderer ---
  const renderTabContent = () => {
    switch (activeTab) {
      case "specification":
        return (
          <div className="p-6 bg-white border border-gray-100 rounded-b-xl shadow-inner space-y-3 text-gray-700 transition duration-300">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Detailed Specifications
            </h3>

            <dl className="divide-y divide-gray-100">
              {/* Dynamically render specs */}
              {product.brand && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-gray-500">Brand</dt>
                  <dd className="font-semibold">{product.brand}</dd>
                </div>
              )}
              {product.sku && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-gray-500">SKU</dt>
                  <dd>{product.sku}</dd>
                </div>
              )}
              {product.category && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-gray-500">Category</dt>
                  <dd>{product.category}</dd>
                </div>
              )}
              {product.color && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-gray-500">Color</dt>
                  <dd>{product.color}</dd>
                </div>
              )}
              {product.materials?.length > 0 && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-gray-500">Materials</dt>
                  <dd>{product.materials.join(", ")}</dd>
                </div>
              )}
              {product.warranty && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-gray-500">Warranty</dt>
                  <dd>{product.warranty}</dd>
                </div>
              )}
              {product.weight && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-gray-500">Weight</dt>
                  <dd>{product.weight}</dd>
                </div>
              )}
              <div className="py-2 flex justify-between">
                <dt className="font-medium text-gray-500">Gift Wrapping</dt>
                <dd>
                  {product.giftWrappingAvailable
                    ? "✅ Available"
                    : "❌ Not Available"}
                </dd>
              </div>
            </dl>
          </div>
        );
      case "reviews":
        return (
          <div className="p-6 bg-white border border-gray-100 rounded-b-xl shadow-inner transition duration-300">
            {/* Reviews Summary */}
            <div className="flex items-center mb-6 border-b pb-4">
              <Star
                className={`w-8 h-8 text-${ACCENT_COLOR} fill-${ACCENT_COLOR}`}
              />
              <span className="text-3xl font-bold ml-2 text-gray-900">
                {averageRating}
              </span>
              <span className="text-xl text-gray-500 ml-2">
                ({totalReviews} Reviews)
              </span>
            </div>

            {/* List of Reviews */}
            {totalReviews > 0 ? (
              <div className="space-y-6 max-h-96 overflow-y-auto pr-2 mb-8">
                {product.reviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="pb-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div
                      className={`flex items-center gap-2 text-${ACCENT_COLOR} mb-1`}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? `fill-${ACCENT_COLOR}`
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm font-semibold text-gray-800 ml-2">
                        {review.reviewerName || "Anonymous"}
                      </span>
                    </div>
                    {/* 🛑 FIX APPLIED HERE: Using &quot; instead of " */}
                    <p className="text-gray-700 italic text-sm mt-1">
                      &quot;{review.comment}&quot;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-lg mb-8">
                Be the first to review this product. ⭐
              </p>
            )}

            {/* INTEGRATED: Add Reviews Component */}
            <div className="mt-8 border-t pt-6 border-gray-100">
              <AddReviews
                productId={id}
                onReviewSubmitted={refetchProductData}
              />
            </div>
          </div>
        );
      case "shipping":
        return (
          <div className="p-6 bg-white border border-gray-100 rounded-b-xl shadow-inner space-y-4 text-gray-700 transition duration-300">
            <div className="flex items-start">
              <Truck
                className={`w-6 h-6 mr-3 text-${PRIMARY_COLOR} flex-shrink-0`}
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Shipping Information
                </h3>
                <p className="text-base">
                  {product.shippingInfo ||
                    "Free standard shipping on all domestic orders."}
                </p>
              </div>
            </div>
            <div className="flex items-start pt-4 border-t border-gray-100">
              <RefreshCw
                className={`w-6 h-6 mr-3 text-${PRIMARY_COLOR} flex-shrink-0`}
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Return Policy
                </h3>
                <p className="text-base">
                  {product.returnPolicy ||
                    "30-day no-hassle returns. Item must be in original condition."}
                </p>
              </div>
            </div>
          </div>
        );
      case "description":
      default:
        return (
          <div className="p-6 bg-white border border-gray-100 rounded-b-xl shadow-inner text-lg text-gray-700 transition duration-300">
            <p className="whitespace-pre-wrap leading-relaxed">
              {product.description ||
                "A truly unique piece, crafted with the utmost attention to detail and quality. Experience the difference premium materials make."}
            </p>
          </div>
        );
    }
  };

  return (
    <section className="container mx-auto px-4 md:px-8 py-12 md:py-20 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
        {/* Left: Images */}
        <div className="md:col-span-5 md:sticky md:top-20">
          <div className="rounded-3xl overflow-hidden border border-gray-200 bg-gray-50 shadow-2xl hover:shadow-[0_15px_60px_rgba(0,0,0,0.1)] transition duration-700 transform hover:scale-[1.01]">
            <Image
              src={activeImage || "/placeholder.jpg"}
              alt={product.title}
              width={800}
              height={800}
              className="w-full h-auto object-cover aspect-square"
              priority
            />
          </div>

          <div className="flex gap-4 mt-4 justify-center flex-wrap">
            {product.images?.slice(0, 5).map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImage(img)}
                className={`cursor-pointer w-20 h-20 rounded-xl overflow-hidden border-2 p-1 ${
                  activeImage === img
                    ? `border-${ACCENT_COLOR} ring-2 ring-${ACCENT_COLOR}`
                    : "border-gray-200 opacity-80 hover:opacity-100"
                } bg-white shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="md:col-span-7 flex flex-col space-y-10">
          {/* Title & Price */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 space-y-4">
            <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-gray-900 leading-tight">
              {product.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-500 italic font-light">
              {product.subtitle}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 py-2 border-b border-gray-100">
              <div className={`flex items-center text-${ACCENT_COLOR}`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 md:w-5 h-4 md:h-5 ${
                      i < Math.round(averageRating)
                        ? `fill-${ACCENT_COLOR}`
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg md:text-xl font-semibold text-gray-700">
                {averageRating} / 5.0
              </span>
              <span className="text-md md:text-lg text-gray-500">
                ({totalReviews} Reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-4 my-4 md:my-6">
              <span
                className={`text-2xl md:text-4xl font-extrabold text-${PRIMARY_COLOR}`}
              >
                {product.currency} {totalPrice.toFixed(2)}
              </span>
              {product.offerPrice && (
                <>
                  <span className="text-gray-400 line-through text-lg md:text-2xl">
                    {product.currency} {(product.price * quantity).toFixed(2)}
                  </span>
                  <span
                    className={`text-sm md:text-lg font-bold bg-${ACCENT_COLOR} text-white px-2 py-1 rounded-full animate-pulse`}
                  >
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4 pt-4 sm:pt-6 border-t border-gray-100">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Addtocard
                product={product}
                quantity={quantity}
                buttonClass={`w-full py-3 sm:py-4 text-lg sm:text-xl font-semibold bg-${PRIMARY_COLOR} text-white rounded-xl shadow-lg hover:bg-opacity-90 transition transform hover:scale-[1.01] flex items-center justify-center`}
                icon={
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                }
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 md:mt-8">
            <div className="flex flex-wrap border-b border-gray-200 bg-gray-50 rounded-t-xl overflow-x-auto shadow-md">
              <TabButton
                label="Description"
                active={activeTab === "description"}
                onClick={() => setActiveTab("description")}
              />
              <TabButton
                label="Specifications"
                active={activeTab === "specification"}
                onClick={() => setActiveTab("specification")}
              />
              <TabButton
                label={`Reviews (${totalReviews})`}
                active={activeTab === "reviews"}
                onClick={() => setActiveTab("reviews")}
              />
              <TabButton
                label="Delivery"
                active={activeTab === "shipping"}
                onClick={() => setActiveTab("shipping")}
              />
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </div>
    </section>
  );
}
