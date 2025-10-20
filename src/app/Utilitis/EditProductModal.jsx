"use client";

import React from "react";
import { X } from "lucide-react";
import api from "@/app/Utilitis/axiosInstance";

const EditProductModal = ({ modalopen, product, closed, onUpdate }) => {
  if (!modalopen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      const res = await api.patch(`/api/products/${product._id}`, payload);
      if (onUpdate) onUpdate(res.data);
      closed();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed, check console");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4 overflow-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
          <button
            onClick={closed}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 grid grid-cols-2 gap-4"
        >
          {/** Title */}
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              name="title"
              defaultValue={product.title}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Subtitle */}
          <div>
            <label className="block text-sm font-semibold mb-1">Subtitle</label>
            <input
              name="subtitle"
              defaultValue={product.subtitle}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Description */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={product.description}
              rows={3}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Price */}
          <div>
            <label className="block text-sm font-semibold mb-1">Price</label>
            <input
              name="price"
              defaultValue={product.price}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Offer Price */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Offer Price
            </label>
            <input
              name="offerPrice"
              defaultValue={product.offerPrice}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Currency */}
          <div>
            <label className="block text-sm font-semibold mb-1">Currency</label>
            <input
              name="currency"
              defaultValue={product.currency}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** SKU */}
          <div>
            <label className="block text-sm font-semibold mb-1">SKU</label>
            <input
              name="sku"
              defaultValue={product.sku}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Category */}
          <div>
            <label className="block text-sm font-semibold mb-1">Category</label>
            <input
              name="category"
              defaultValue={product.category}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Brand */}
          <div>
            <label className="block text-sm font-semibold mb-1">Brand</label>
            <input
              name="brand"
              defaultValue={product.brand}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Model */}
          <div>
            <label className="block text-sm font-semibold mb-1">Model</label>
            <input
              name="model"
              defaultValue={product.model}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Height */}
          <div>
            <label className="block text-sm font-semibold mb-1">Height</label>
            <input
              name="height"
              defaultValue={product.height}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Width */}
          <div>
            <label className="block text-sm font-semibold mb-1">Width</label>
            <input
              name="width"
              defaultValue={product.width}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Length */}
          <div>
            <label className="block text-sm font-semibold mb-1">Length</label>
            <input
              name="length"
              defaultValue={product.length}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Weight */}
          <div>
            <label className="block text-sm font-semibold mb-1">Weight</label>
            <input
              name="weight"
              defaultValue={product.weight}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Gender */}
          <div>
            <label className="block text-sm font-semibold mb-1">Gender</label>
            <input
              name="gender"
              defaultValue={product.gender}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Materials */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Materials (comma-separated)
            </label>
            <input
              name="materials"
              defaultValue={product.materials?.join(", ")}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Color */}
          <div>
            <label className="block text-sm font-semibold mb-1">Color</label>
            <input
              name="color"
              defaultValue={product.color}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Diamond Weight */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Diamond Weight
            </label>
            <input
              name="diamondWeight"
              defaultValue={product.diamondWeight}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Certification */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Certification
            </label>
            <input
              name="certification"
              defaultValue={product.certification}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Warranty */}
          <div>
            <label className="block text-sm font-semibold mb-1">Warranty</label>
            <input
              name="warranty"
              defaultValue={product.warranty}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Availability */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Availability
            </label>
            <input
              name="availability"
              defaultValue={product.availability}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Stock Quantity */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Stock Quantity
            </label>
            <input
              name="stockQuantity"
              defaultValue={product.stockQuantity}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Purchase Count */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Purchase Count
            </label>
            <input
              name="purchaseCount"
              defaultValue={product.purchaseCount}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Care Instructions */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Care Instructions
            </label>
            <textarea
              name="careInstructions"
              defaultValue={product.careInstructions}
              rows={3}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Images */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Images (comma-separated URLs)
            </label>
            <input
              name="images"
              defaultValue={product.images?.join(", ")}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Tags */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Tags (comma-separated)
            </label>
            <input
              name="tags"
              defaultValue={product.tags?.join(", ")}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Rating */}
          <div>
            <label className="block text-sm font-semibold mb-1">Rating</label>
            <input
              name="rating"
              defaultValue={product.rating?.$numberDouble}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Shipping Info */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Shipping Info
            </label>
            <textarea
              name="shippingInfo"
              defaultValue={product.shippingInfo}
              rows={2}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Return Policy */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Return Policy
            </label>
            <textarea
              name="returnPolicy"
              defaultValue={product.returnPolicy}
              rows={2}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Customization Options */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Customization Options (comma-separated)
            </label>
            <input
              name="customizationOptions"
              defaultValue={product.customizationOptions?.join(", ")}
              className="border p-2 w-full rounded"
            />
          </div>

          {/** Checkboxes */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="giftWrappingAvailable"
                defaultChecked={product.giftWrappingAvailable}
              />{" "}
              Gift Wrapping
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={product.isFeatured}
              />{" "}
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isTrending"
                defaultChecked={product.isTrending}
              />{" "}
              Trending
            </label>
          </div>

          {/* Footer */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={closed}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
