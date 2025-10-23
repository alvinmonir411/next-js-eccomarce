"use client";

import React, { useState } from "react";
import { Star, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// Define colors for consistency with the premium design
const PRIMARY_COLOR = "emerald-700";
const ACCENT_COLOR = "amber-500";

export default function AddReviews({ productId, onReviewSubmitted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle star click to set rating
  const handleRatingClick = (newRating) => {
    setRating(newRating);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (rating === 0 || comment.trim() === "" || name.trim() === "") {
      setError(
        "Please provide a rating, your name, and a comment before submitting."
      );
      return;
    }

    setIsSubmitting(true);

    const reviewData = {
      productId,
      rating,
      comment: comment.trim(),
      reviewerName: name.trim(),
    };

    try {
      // --- Replace with your actual API endpoint and logic ---
      /*
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit review.");
      }
      */

      // Simulate API success
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset form on success
      setRating(0);
      setComment("");
      setName("");
      setSuccess(true);

      // Notify parent component (e.g., to refresh the review list)
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mt-10">
      <h2 className={`text-3xl font-bold text-gray-900 mb-6 border-b pb-3`}>
        Share Your Experience
      </h2>

      {/* Success/Error Messages */}
      {error && (
        <div
          className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg"
          role="alert"
        >
          <strong>Error:</strong> {error}
        </div>
      )}
      {success && (
        <div
          className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg"
          role="alert"
        >
          <strong>Thank you!</strong> Your review has been submitted
          successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Section */}
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-3">
            Your Rating <span className={`text-${ACCENT_COLOR}`}>*</span>
          </label>
          <div className="flex space-x-1">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
              <Star
                key={star}
                className={`w-10 h-10 cursor-pointer transition-all duration-200 ${
                  star <= rating
                    ? `text-${ACCENT_COLOR} fill-${ACCENT_COLOR} transform scale-110`
                    : "text-gray-300 hover:text-gray-400"
                }`}
                onClick={() => handleRatingClick(star)}
              />
            ))}
          </div>
        </div>

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-xl font-medium text-gray-700 mb-2"
          >
            Name
            <span className={`text-${ACCENT_COLOR}`}>*</span>
          </label>
          <input
            id="name"
            type="text"
            value={user.name || user.displayName}
            readOnly
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-${PRIMARY_COLOR} focus:border-${PRIMARY_COLOR} text-lg transition duration-300"
            placeholder="e.g., Jane Doe"
            disabled={isSubmitting}
          />
        </div>

        {/* Comment Textarea */}
        <div>
          <label
            htmlFor="comment"
            className="block text-xl font-medium text-gray-700 mb-2"
          >
            Your Review <span className={`text-${ACCENT_COLOR}`}>*</span>
          </label>
          <textarea
            id="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-${PRIMARY_COLOR} focus:border-${PRIMARY_COLOR} text-lg transition duration-300"
            placeholder="Tell us what you loved (or didn't love) about the product..."
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-${PRIMARY_COLOR} focus:ring-opacity-50 transition duration-300 transform hover:scale-[1.01] disabled:bg-gray-400`}
        >
          {isSubmitting ? (
            <div
              className={`animate-spin rounded-full h-6 w-6 border-t-2 border-white mr-3`}
            ></div>
          ) : (
            <Send className="w-5 h-5 mr-3" />
          )}
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
