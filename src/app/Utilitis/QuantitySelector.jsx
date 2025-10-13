"use client";
import { useState } from "react";

export default function QuantitySelector({ value = 1, onChange }) {
  const [quantity, setQuantity] = useState(value);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newValue = quantity - 1;
      setQuantity(newValue);
      onChange?.(newValue);
    }
  };

  const handleIncrease = () => {
    const newValue = quantity + 1;
    setQuantity(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleDecrease}
        className="px-3 py-1 bg-gray-200 rounded text-lg font-bold"
      >
        -
      </button>
      <span className="text-lg font-semibold">{quantity}</span>
      <button
        onClick={handleIncrease}
        className="px-3 py-1 bg-gray-200 rounded text-lg font-bold"
      >
        +
      </button>
    </div>
  );
}
