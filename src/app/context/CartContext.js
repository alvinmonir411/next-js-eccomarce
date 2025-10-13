"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // ✅ Load cart from DB on first load
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.uid) return;
      try {
        const res = await axios.get(`/api/addTocard?userId=${user.uid}`);
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user?.uid]);

  // ✅ Add item to cart
  const addToCart = async (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        // যদি item already থাকে → quantity update
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // নতুন item add
        return [...prev, { ...product, quantity }];
      }
    });

    try {
      await axios.post("/api/addTocard", {
        userId: user?.uid,
        productId: product._id,
        title: product.title,
        price: product.offerPrice || product.price,
        image: product.images?.[0],
        quantity,
      });
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  // ✅ Remove item from cart
  const removeFromCart = async (cartId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== cartId));
    try {
      await axios.delete(`/api/addTocard?cartId=${cartId}`);
    } catch (err) {
      console.error("Remove from cart failed:", err);
      alert("Failed to remove item from cart");
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, loading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
