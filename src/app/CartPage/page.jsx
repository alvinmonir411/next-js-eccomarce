"use client";

import Image from "next/image";
import { useCart } from "../context/CartContext";
import QuantitySelector from "../Utilitis/QuantitySelector";

export default function CartPage() {
  const { cartItems, removeFromCart, addToCart, loading } = useCart();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-medium">Loading cart...</p>
      </div>
    );

  if (!cartItems.length)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-xl">Your cart is empty 🛒</p>
      </div>
    );

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="md:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white p-4 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  width={100}
                  height={100}
                  placeholder="blur"
                  blurDataURL="/placeholder.png"
                  priority
                  className="rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold line-clamp-1">
                    {item.title}
                  </h2>
                  <p className="text-gray-500">
                    Price: {item.price} × {item.quantity} ={" "}
                    <span className="font-bold">
                      {item.price * item.quantity}
                    </span>
                  </p>

                  {/* Quantity Selector */}
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(newQty) => addToCart(item, newQty)}
                  />
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>{totalPrice}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span>{totalPrice}</span>
          </div>
          <button className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold hover:bg-yellow-600 transition">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
}
