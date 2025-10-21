"use client";
import React, { useState, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import api from "@/app/Utilitis/axiosInstance";
import Swal from "sweetalert2"; // Capital 'S' for correct usage

// --- 1. INITIAL STATE CONSTANT ---
// এটি ফর্ম রিসেট করার জন্য ব্যবহার করা হবে।
const INITIAL_FORM_STATE = {
  title: "",
  subtitle: "",
  description: "",
  price: "",
  offerPrice: "",
  currency: "BDT",
  sku: "",
  brand: "",
  category: "",
  model: "",
  length: "",
  weight: "",
  gender: "Unisex",
  materials: "",
  color: "",
  diamondWeight: "",
  certification: "",
  warranty: "",
  availability: "In Stock",
  stockQuantity: "",
  careInstructions: "",
  tags: "",
  rating: "",
  shippingInfo: "",
  returnPolicy: "",
  customizationOptions: "",
  giftWrappingAvailable: false,
  isFeatured: false,
  isTrending: false,
  images: [], // Holds { url: blobURL, file: FileObject }
};

// --- Helper component for Image Preview with Delete functionality ---
const ImagePreview = React.memo(({ src, index, onDelete }) => (
  <div className="relative w-24 h-24">
    <img
      src={src}
      alt={`Product preview ${index + 1}`}
      className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
    />
    <button
      type="button"
      onClick={() => onDelete(index)}
      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-10"
      aria-label="Delete image"
    >
      <XMarkIcon className="w-4 h-4" />
    </button>
  </div>
));

// --- CORE COMPONENT ---
const AddProductForm = () => {
  const IMGBB_API_KEY = "99a1393c27c5acdc966af1fdf14d60a9";

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // --- 2. RESET FORM FUNCTION (with memory cleanup) ---
  const resetForm = useCallback(() => {
    // Crucial: Revoke all object URLs to free up memory used by image previews
    formData.images.forEach((img) => URL.revokeObjectURL(img.url));

    // Reset the state to initial values
    setFormData(INITIAL_FORM_STATE);
    setError(null);
  }, [formData.images]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    e.target.value = null;
  };

  const handleImageDelete = (indexToDelete) => {
    setFormData((prev) => {
      // Clean up the memory for the deleted image
      URL.revokeObjectURL(prev.images[indexToDelete].url);
      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== indexToDelete),
      };
    });
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const uploadToImgBB = async (base64Image) => {
    const data = new FormData();
    data.append("image", base64Image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: data,
      }
    );

    if (!response.ok) {
      // ImgBB API usually returns a JSON error, but we handle the status first
      throw new Error(`ImgBB upload failed with status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      return result.data.url;
    } else {
      throw new Error(result.error.message || "Unknown ImgBB error");
    }
  };

  // --- 3. HANDLE SUBMIT FUNCTION (with fixes) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. --- UPLOAD ALL IMAGES TO IMGBB ---
      if (formData.images.length === 0) {
        throw new Error("Please upload at least one product image.");
      }

      const uploadPromises = formData.images.map(async (image) => {
        const base64 = await convertFileToBase64(image.file);
        return uploadToImgBB(base64);
      });

      const imgbbUrls = await Promise.all(uploadPromises);

      // 2. --- PREPARE DATA FOR MONGODB ---
      const dataToSend = {
        ...formData,
        materials: formData.materials
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
        tags: formData.tags
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
        customizationOptions: formData.customizationOptions
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),

        price: parseFloat(formData.price) || 0,
        offerPrice: parseFloat(formData.offerPrice) || 0,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        rating: parseFloat(formData.rating) || null,

        // Replace local file objects with live ImgBB URLs
        images: imgbbUrls,
      };

      // 3. --- SEND FINAL DATA TO EXPRESS/MONGODB API (Fixes implemented) ---
      const backendResponse = await api.post(`/api/products`, dataToSend);

      // FIX 1: Using Axios response properties (.status and .data) instead of .json()
      if (backendResponse.status < 200 || backendResponse.status >= 300) {
        const errorData = backendResponse.data;
        throw new Error(
          errorData.message || "Failed to save product to database."
        );
      }

      const result = backendResponse.data;
      Swal.fire(
        `Product added successfully! ID: ${result.insertedId || result._id}`
      );

      // **********************************
      // *** SUCCESSFUL RESET FORM CALL ***
      // **********************************
      resetForm();
    } catch (err) {
      console.error("Submission Error:", err);
      setError(err.message || "An unknown error occurred during submission.");

      // FIX 2: Use Capital 'Swal'
      Swal.fire(`Error: ${err.message || "An unknown error occurred."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputClass =
    "w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-150";

  // --- 4. JSX RETURN (The Form Structure) ---
  return (
    <div className="max-w-7xl mx-auto bg-white shadow-3xl rounded-3xl p-10 my-12 border border-gray-100">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
        💎 Premium Product Listing (ImgBB Integration)
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* -------------------- SECTION 1: CORE PRODUCT INFO -------------------- */}
        <div className="p-6 bg-indigo-50/50 rounded-2xl border-2 border-indigo-100/70 shadow-inner">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-6 border-b pb-2">
            Primary Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="title"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Pearl Diamond Necklace"
                value={formData.title}
                onChange={handleChange}
                className={InputClass}
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="subtitle"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Subtitle
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                placeholder="Short, catchy description"
                value={formData.subtitle}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Full Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Detailed product description..."
                value={formData.description}
                onChange={handleChange}
                className={InputClass}
                rows="4"
                required
              ></textarea>
            </div>
          </div>
        </div>

        {/* --- */}

        {/* -------------------- SECTION 2: PRICING & INVENTORY -------------------- */}
        <div className="p-6 bg-yellow-50/50 rounded-2xl border-2 border-yellow-100/70 shadow-inner">
          <h3 className="text-2xl font-semibold text-yellow-700 mb-6 border-b pb-2">
            Pricing & Inventory
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="price"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Base Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="60000"
                value={formData.price}
                onChange={handleChange}
                className={InputClass}
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="offerPrice"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Offer Price (Sale)
              </label>
              <input
                type="number"
                id="offerPrice"
                name="offerPrice"
                placeholder="56999 (optional)"
                value={formData.offerPrice}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="currency"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className={InputClass + " appearance-none cursor-pointer"}
              >
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="sku"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                SKU (Stock Unit)
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                placeholder="NK404-PRLDM"
                value={formData.sku}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="availability"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Availability Status
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className={InputClass + " appearance-none cursor-pointer"}
              >
                <option value="In Stock">In Stock</option>
                <option value="Limited Stock">Limited Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Pre-order">Pre-order</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="stockQuantity"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Stock Quantity
              </label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                placeholder="7"
                value={formData.stockQuantity}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="tags"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Product Tags (Comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                placeholder="Luxury, Pearl, Bridal"
                value={formData.tags}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="rating"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Average Rating (0.0 - 5.0)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                placeholder="4.9"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
          </div>
        </div>

        {/* --- */}

        {/* -------------------- SECTION 3: SPECIFICATIONS & FEATURES -------------------- */}
        <div className="p-6 bg-blue-50/50 rounded-2xl border-2 border-blue-100/70 shadow-inner">
          <h3 className="text-2xl font-semibold text-blue-700 mb-6 border-b pb-2">
            Specifications & Materials
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="brand"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                placeholder="Alvin Jewelers"
                value={formData.brand}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="category"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                placeholder="Necklace"
                value={formData.category}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="model"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Model Number
              </label>
              <input
                type="text"
                id="model"
                name="model"
                placeholder="NK404"
                value={formData.model}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="gender"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Gender/Target Audience
              </label>
              <input
                type="text"
                id="gender"
                name="gender"
                placeholder="Female"
                value={formData.gender}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="col-span-2 flex flex-col">
              <label
                htmlFor="materials"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Materials (Comma separated)
              </label>
              <input
                type="text"
                id="materials"
                name="materials"
                placeholder="Pearl, Diamond, 18k Gold"
                value={formData.materials}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="color"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Color
              </label>
              <input
                type="text"
                id="color"
                name="color"
                placeholder="White"
                value={formData.color}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="diamondWeight"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Diamond Weight
              </label>
              <input
                type="text"
                id="diamondWeight"
                name="diamondWeight"
                placeholder="0.7 cts"
                value={formData.diamondWeight}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="length"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Length/Dimensions
              </label>
              <input
                type="text"
                id="length"
                name="length"
                placeholder="450 mm"
                value={formData.length}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="weight"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Weight
              </label>
              <input
                type="text"
                id="weight"
                name="weight"
                placeholder="20 g"
                value={formData.weight}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
          </div>
        </div>

        {/* --- */}

        {/* -------------------- SECTION 4: LOGISTICS & POLICY -------------------- */}
        <div className="p-6 bg-green-50/50 rounded-2xl border-2 border-green-100/70 shadow-inner">
          <h3 className="text-2xl font-semibold text-green-700 mb-6 border-b pb-2">
            Logistics & Policies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="warranty"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Warranty Info
              </label>
              <input
                type="text"
                id="warranty"
                name="warranty"
                placeholder="1 Year Warranty"
                value={formData.warranty}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="certification"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Certification
              </label>
              <input
                type="text"
                id="certification"
                name="certification"
                placeholder="IGI Certified Diamonds"
                value={formData.certification}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="careInstructions"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Care Instructions
              </label>
              <input
                type="text"
                id="careInstructions"
                name="careInstructions"
                placeholder="Wipe with a soft cloth..."
                value={formData.careInstructions}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="shippingInfo"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Shipping Information
              </label>
              <input
                type="text"
                id="shippingInfo"
                name="shippingInfo"
                placeholder="Delivery within 5 business days"
                value={formData.shippingInfo}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="returnPolicy"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Return Policy
              </label>
              <input
                type="text"
                id="returnPolicy"
                name="returnPolicy"
                placeholder="7 Days Return Policy"
                value={formData.returnPolicy}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="customizationOptions"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Customization Options (Comma separated)
              </label>
              <input
                type="text"
                id="customizationOptions"
                name="customizationOptions"
                placeholder="Chain Length, Gold Type"
                value={formData.customizationOptions}
                onChange={handleChange}
                className={InputClass}
              />
            </div>
          </div>
        </div>

        {/* --- */}

        {/* -------------------- SECTION 5: MEDIA & FLAGS -------------------- */}
        <div className="p-6 bg-purple-50/50 rounded-2xl border-2 border-purple-100/70 shadow-inner">
          <h3 className="text-2xl font-semibold text-purple-700 mb-6 border-b pb-2">
            Media & Visibility
          </h3>

          {/* Image Upload & Preview */}
          <div className="mb-8">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Product Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              required={formData.images.length === 0}
            />

            <div className="mt-4 flex flex-wrap gap-4">
              {formData.images.map((img, i) => (
                <ImagePreview
                  key={img.url}
                  src={img.url}
                  index={i}
                  onDelete={handleImageDelete}
                />
              ))}
            </div>
          </div>

          {/* Feature Checkboxes */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t border-purple-200">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
              />
              ⭐ Featured Product
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
              <input
                type="checkbox"
                name="isTrending"
                checked={formData.isTrending}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
              />
              🔥 Trending Now
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
              <input
                type="checkbox"
                name="giftWrappingAvailable"
                checked={formData.giftWrappingAvailable}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
              />
              🎁 Gift Wrapping Available
            </label>
          </div>
        </div>

        {error && (
          <p className="text-red-600 font-medium text-center bg-red-100 p-3 rounded-xl border border-red-300">
            Error: {error}
          </p>
        )}

        {/* --- */}

        {/* -------------------- SUBMIT BUTTON -------------------- */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full max-w-lg py-4 rounded-xl font-extrabold text-xl shadow-lg transition-all duration-300 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/50 transform hover:scale-[1.01]"
            }`}
          >
            {isSubmitting
              ? "Uploading Images & Submitting..."
              : "Add Product to Catalog 🚀"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
