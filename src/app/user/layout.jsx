"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  Heart,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import { useRole } from "../Utilitis/roleCheck";
import Loader from "../Utilitis/Loader";

export default function Userlayout({ children }) {
  const { user, logout } = useAuth();
  const { role, roleloading } = useRole();

  if (roleloading) return <Loader />;

  const navLinks = [
    { href: "/user/dashboard", label: "My Dashboard", icon: LayoutDashboard },
    { href: "/user/orders", label: "My Orders", icon: ShoppingCart },
    { href: "/user/favorites", label: "Favorites", icon: Heart },
    { href: "/user/messages", label: "Messages", icon: MessageSquare },
    { href: "/user/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-gray-100 via-gray-200 to-gray-300 text-gray-800">
      {/* Sidebar */}
      <aside className="w-72 h-full bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white shadow-2xl flex flex-col justify-between rounded-r-3xl overflow-hidden">
        {/* Top Section */}
        <div>
          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border-b border-white/10 backdrop-blur-md bg-white/5"
          >
            <h2 className="text-2xl text-center font-extrabold tracking-wide">
              {user?.displayName || "User"}
            </h2>
            <p className="text-sm text-center opacity-80 mt-1">{user?.email}</p>
            <div className="flex justify-center mt-3">
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full tracking-wider">
                {role?.toUpperCase()}
              </span>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="mt-6 px-4 flex flex-col gap-2">
            {navLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className="group flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 hover:bg-white/20 hover:translate-x-1 active:scale-95"
                >
                  <Icon
                    size={20}
                    className="opacity-80 group-hover:opacity-100 transition duration-300"
                  />
                  <span className="font-medium tracking-wide">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-md"
        >
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-red-700/30 active:scale-95"
          >
            <LogOut size={18} /> Logout
          </button>
        </motion.div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
