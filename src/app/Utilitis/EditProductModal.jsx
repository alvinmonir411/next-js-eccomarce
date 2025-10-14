"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditProductModal = ({ modalopen, product, closed }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        subtitle: product.subtitle || "",
        description: product.description || "",
        price: product.price?.$numberInt || "",
        offerPrice: product.offerPrice?.$numberInt || "",
        currency: product.currency || "",
        sku: product.sku || "",
        brand: product.brand || "",
        category: product.category || "",
        model: product.model || "",
        height: product.height || "",
        width: product.width || "",
        length: product.length || "",
        weight: product.weight || "",
        gender: product.gender || "",
        materials: product.materials?.join(", ") || "",
        color: product.color || "",
        diamondWeight: product.diamondWeight || "",
        certification: product.certification || "",
        warranty: product.warranty || "",
        availability: product.availability || "",
        stockQuantity: product.stockQuantity?.$numberInt || "",
        purchaseCount: product.purchaseCount?.$numberInt || "",
        careInstructions: product.careInstructions || "",
        images: product.images?.join(", ") || "",
        tags: product.tags?.join(", ") || "",
        rating: product.rating?.$numberDouble || "",
        shippingInfo: product.shippingInfo || "",
        returnPolicy: product.returnPolicy || "",
        customizationOptions: product.customizationOptions?.join(", ") || "",
        giftWrappingAvailable: product.giftWrappingAvailable ? "Yes" : "No",
        isFeatured: product.isFeatured ? "Yes" : "No",
        isTrending: product.isTrending ? "Yes" : "No",
      });
    }
  }, [product]);

  if (!modalopen || !product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Product Data:", formData);
    closed();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Product Details
          </h2>
          <button
            onClick={closed}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-6 py-4 grid grid-cols-2 gap-4 flex-1"
        >
          {Object.keys(formData).map((key) => (
            <div key={key} className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>

              {/* Description, care instructions, etc. as textarea */}
              {[
                "description",
                "careInstructions",
                "returnPolicy",
                "shippingInfo",
              ].includes(key) ? (
                <textarea
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
                />
              ) : (
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              )}
            </div>
          ))}
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={closed}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
