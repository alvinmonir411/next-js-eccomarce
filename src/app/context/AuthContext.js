"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../lib/firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Attach token getter to Axios
      import("@/app/Utilitis/axiosInstance").then(({ attachTokenGetter }) => {
        attachTokenGetter(async () => {
          if (!currentUser) return null;
          return await currentUser.getIdToken();
        });
      });
    });

    return () => unsubscribe();
  }, []);

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  // Email login
  const emailLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      router.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Email register
  const emailRegister = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });

      // Save user in MongoDB
      await axios.post("/api/users", {
        name: name,
        role: "user",
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        createdAt: new Date(),
      });

      toast.success("Registered successfully!");
      router.push("/");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.info("User already exists!");
        router.push("/");
      } else {
        toast.error(err.message || "Something went wrong");
      }
    }
  };

  // Google login/register
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save in MongoDB
      await axios.post("/api/users", {
        name: user.displayName,
        role: "user",
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
      });

      toast.success("Logged in with Google!");
      router.push("/");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.info("Welcome back!");
        router.push("/");
      } else {
        toast.error(err.message || "Something went wrong");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, logout, emailLogin, emailRegister, googleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
