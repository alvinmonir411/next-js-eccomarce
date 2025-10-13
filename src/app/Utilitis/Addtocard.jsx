"use client";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";

export default function Addtocard({ product, quantity = 1 }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await addToCart(product, quantity);
      Swal.fire(`${product.title} added to cart ✅`);
    } catch (err) {
      console.error("Add to cart failed:", err);
      Swal.fire("Failed to add to cart ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full flex items-center bg-accent text-accent-content justify-center  gap-2 px-4 py-2 rounded-lg font-semibold transition `}
    >
      <ShoppingCart size={16} />
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
