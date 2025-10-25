"use client";

import Image from "next/image";
import { useCart } from "../context/CartContext";
import QuantitySelector from "../Utilitis/QuantitySelector";
import { X, ShoppingBag } from "lucide-react";

const BRAND_GOLD = "text-amber-500";
const CTA_BG = "bg-amber-500 hover:bg-amber-600";

export default function CartPage() {
  const { cartItems, removeFromCart, addToCart, loading } = useCart();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl font-serif text-gray-700">Loading cart...</p>
      </div>
    );

  if (!cartItems.length)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-gray-600 text-3xl font-serif mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-gray-500 text-lg">
          Time to find some exquisite pieces!
        </p>
      </div>
    );

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <section className="container mx-auto px-4 py-16 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-serif font-bold mb-12 text-center text-gray-900">
        Your Shopping Bag
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-2xl"
            >
              <div className="flex gap-6">
                <div className="relative w-28 h-28 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    fill
                    sizes="100px"
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="flex flex-col justify-between py-1">
                  <h2 className="text-xl font-serif font-semibold text-gray-800 line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-lg font-medium text-gray-900">
                    {formatPrice(item.price)}
                  </p>

                  <QuantitySelector
                    value={item.quantity}
                    onChange={(newQty) => addToCart(item, newQty)}
                  />
                </div>
              </div>

              <div className="flex flex-col items-end justify-between py-1">
                <button
                  onClick={() => removeFromCart(item._id)}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-red-50"
                >
                  <X className="w-5 h-5" />
                </button>

                <p className="text-xl font-bold font-sans text-gray-900 mt-auto">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-2xl space-y-6 self-start sticky top-10 border border-amber-500/20">
          <h2 className="text-3xl font-serif font-bold border-b pb-4 text-gray-900">
            Order Summary
          </h2>

          <div className="flex justify-between text-xl font-medium text-gray-700">
            <span>Subtotal ({cartItems.length} items):</span>
            <span className={BRAND_GOLD}>{formatPrice(totalPrice)}</span>
          </div>

          <div className="flex justify-between text-lg text-gray-600 border-b pb-4">
            <span>Estimated Shipping:</span>
            <span className="font-semibold text-green-600">Free</span>
          </div>

          <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2">
            <span>Order Total:</span>
            <span className={`text-3xl font-serif ${BRAND_GOLD}`}>
              {formatPrice(totalPrice)}
            </span>
          </div>

          <button
            className={`w-full ${CTA_BG} text-white py-4 rounded-xl text-lg font-bold transition duration-300 transform hover:scale-[1.01] shadow-lg`}
          >
            Proceed to Checkout
          </button>

          <p className="text-sm text-center text-gray-500 pt-2">
            Shipping and taxes calculated at checkout.
          </p>
        </div>
      </div>
    </section>
  );
}
