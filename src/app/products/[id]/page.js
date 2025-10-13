"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import QuantitySelector from "@/app/Utilitis/QuantitySelector";
import Addtocard from "@/app/Utilitis/Addtocard";

export default function ProductDetails({ params }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 border-solid"></div>
      </div>
    );

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-xl font-semibold">
        Product not found ❌
      </div>
    );

  const unitPrice = product.offerPrice || product.price;
  const totalPrice = unitPrice * quantity;

  return (
    <section className="container   mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Sticky Images */}
        <div className="md:sticky md:top-20 ">
          <div className="rounded-3xl overflow-hidden border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition duration-500">
            <Image
              src={activeImage || "/placeholder.jpg"}
              alt={product.title}
              width={700}
              height={700}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
          <div className="flex gap-4 mt-4 justify-center flex-wrap">
            {product.images?.map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImage(img)}
                className={`cursor-pointer rounded-xl overflow-hidden border ${
                  activeImage === img
                    ? "border-yellow-500 ring-2 ring-yellow-400"
                    : "border-gray-200"
                } bg-white shadow-md hover:shadow-lg hover:scale-105 transition`}
              >
                <Image
                  src={img}
                  alt={`${product.title}-${i}`}
                  width={120}
                  height={120}
                  placeholder="blur"
                  blurDataURL="/placeholder.png"
                  priority
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Scrollable Info */}
        <div className="space-y-8">
          {/* Product Title & Price */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text">
              {product.title}
            </h1>
            <p className="text-lg text-gray-600 italic">{product.subtitle}</p>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl md:text-4xl font-bold text-yellow-600">
                {product.currency} {totalPrice}
              </span>
              {product.offerPrice && (
                <span className="text-gray-400 line-through text-lg">
                  {product.currency} {product.price * quantity}
                </span>
              )}
            </div>

            {/* Quantity selector */}
            <QuantitySelector value={quantity} onChange={setQuantity} />

            {/* Add to Cart */}

            <Addtocard product={product} quantity={quantity} />
          </div>

          {/* Product Full Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-2 text-gray-700">
            <p>
              <strong>Description:</strong> {product.description}
            </p>
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <p>
              <strong>SKU:</strong> {product.sku}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Dimensions:</strong> {product.height} x {product.width} x{" "}
              {product.length}
            </p>
            <p>
              <strong>Weight:</strong> {product.weight}
            </p>
            <p>
              <strong>Materials:</strong> {product.materials.join(", ")}
            </p>
            <p>
              <strong>Color:</strong> {product.color}
            </p>
            <p>
              <strong>Diamond Weight:</strong> {product.diamondWeight}
            </p>
            <p>
              <strong>Certification:</strong> {product.certification}
            </p>
            <p>
              <strong>Warranty:</strong> {product.warranty}
            </p>
            <p>
              <strong>Availability:</strong> {product.availability}
            </p>
            <p>
              <strong>Care Instructions:</strong> {product.careInstructions}
            </p>
            {product.customizationOptions?.length > 0 && (
              <p>
                <strong>Customization Options:</strong>{" "}
                {product.customizationOptions.join(", ")}
              </p>
            )}
            <p>
              <strong>Gift Wrapping Available:</strong>{" "}
              {product.giftWrappingAvailable ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Tags:</strong> {product.tags?.join(", ")}
            </p>
          </div>

          {/* Reviews */}
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold text-xl mb-4">
              Customer Reviews ({product.reviews?.length || 0})
            </h2>
            {product.reviews?.length > 0 ? (
              product.reviews.map((review, idx) => (
                <div key={idx} className="mb-4 border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-2 text-yellow-500 mb-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                    ))}
                    <span className="text-gray-600 ml-2">{review.rating}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>

          {/* Shipping & Returns */}
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold text-xl mb-4">Shipping & Returns</h2>
            <p className="mb-2">Shipping: ✅ {product.shippingInfo}</p>
            <p>Return Policy: ✅ {product.returnPolicy}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
