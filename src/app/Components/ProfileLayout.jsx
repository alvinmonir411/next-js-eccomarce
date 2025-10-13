"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRole } from "../Utilitis/roleCheck";
import {
  ShoppingCart,
  Package,
  Users,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import Loader from "../Utilitis/Loader";
import { useRouter } from "next/navigation";

const ProfileLayout = ({ children }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { role, roleloading } = useRole();
  if (roleloading) return <Loader />;
  if (!user && !role) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-base-100">
      {/* Sidebar */}
      <aside className="w-72 h-full bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-xl flex flex-col justify-between">
        {/* 🔹 Top user info */}
        <div>
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl text-center font-bold">
              {user?.displayName || "User"}
            </h2>
            <p className="text-sm text-center opacity-80">{user?.email}</p>
            <span className="text-xs text-center bg-white/20 px-2 py-1 rounded mt-2 inline-block">
              {role?.toUpperCase()}
            </span>
          </div>

          {/* 🔹 Navigation Links */}
          <nav className="mt-6 px-4 flex flex-col gap-2">
            {role === "admin" ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  <LayoutDashboard size={18} /> Admin Dashboard
                </Link>
                <Link
                  href="/admin/add-product"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  <Package size={18} /> Add Product
                </Link>
                <Link
                  href="/admin/all-products"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  <ShoppingCart size={18} /> All Products
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  <Users size={18} /> Manage Users
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/user/dashboard"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  <LayoutDashboard size={18} /> My Dashboard
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  <ShoppingCart size={18} /> My Orders
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  <Settings size={18} /> Settings
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* 🔹 Logout at bottom */}
        <div className="p-6 border-t border-white/20">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default ProfileLayout;
