"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(product?.images[0] || "");
  const [activeTab, setActiveTab] = useState("Details"); 

  if (!isOpen || !product) return null;

  const tabs = ["Details", "Reviews", "Shipping"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-6 relative h-[80vh] flex flex-col"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold"
            >
              &times;
            </button>

            <div className="flex flex-col md:flex-row gap-6 h-full">
              {/* Images */}
              <div className="md:w-1/2 flex flex-col gap-4">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-64 md:h-80 object-cover rounded-xl border border-gray-200"
                />
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`thumb-${idx}`}
                      className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${
                        selectedImage === img
                          ? "border-blue-600 ring-2 ring-blue-300"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedImage(img)}
                    />
                  ))}
                </div>
              </div>

              {/* Right: Product Info */}
              <div className="md:w-1/2 flex flex-col h-full">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {product.title}
                </h2>
                <p className="text-gray-600 mb-2">{product.subtitle}</p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-semibold text-gray-900">
                    {product.price.$numberInt} {product.currency}
                  </span>
                  {product.offerPrice && (
                    <span className="text-gray-400 line-through">
                      {product.offerPrice.$numberInt} {product.currency}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 mb-2">
                  Stock: {product.stockQuantity.$numberInt}
                </p>
                <p className="text-yellow-500 font-semibold mb-2">
                  ⭐ {product.rating.$numberDouble}
                </p>

                {/* Tabs */}
                <div className="mt-4 border-b border-gray-200">
                  <nav className="-mb-px flex gap-4">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 text-sm font-medium ${
                          activeTab === tab
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-4 flex-1 overflow-y-auto">
                  {activeTab === "Details" && (
                    <div className="space-y-2 text-gray-700 text-sm">
                      <p>{product.description}</p>
                      <ul className="list-disc pl-5">
                        <li>SKU: {product.sku}</li>
                        <li>Brand: {product.brand}</li>
                        <li>Category: {product.category}</li>
                        <li>Model: {product.model}</li>
                        <li>
                          Dimensions: {product.height} x {product.width} x{" "}
                          {product.length}
                        </li>
                        <li>Weight: {product.weight}</li>
                        <li>Materials: {product.materials.join(", ")}</li>
                        <li>Color: {product.color}</li>
                        <li>Diamond Weight: {product.diamondWeight}</li>
                        <li>Certification: {product.certification}</li>
                        <li>Warranty: {product.warranty}</li>
                        <li>Care: {product.careInstructions}</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === "Reviews" && (
                    <div className="space-y-2 text-gray-700 text-sm">
                      {product.reviews?.length > 0 ? (
                        product.reviews.map((rev, idx) => (
                          <div
                            key={idx}
                            className="border-b border-gray-200 pb-2"
                          >
                            <p className="font-medium">{rev.user}</p>
                            <p className="text-sm">{rev.comment}</p>
                            <p className="text-yellow-500">
                              ⭐ {rev.rating.$numberInt}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No reviews yet</p>
                      )}
                    </div>
                  )}

                  {activeTab === "Shipping" && (
                    <div className="text-gray-700 text-sm space-y-2">
                      <p>{product.shippingInfo}</p>
                      <p>{product.returnPolicy}</p>
                      <p>
                        Gift Wrapping:{" "}
                        {product.giftWrappingAvailable ? "Yes" : "No"}
                      </p>
                      {product.customizationOptions?.length > 0 && (
                        <p>
                          Customization:{" "}
                          {product.customizationOptions.join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={onClose}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
