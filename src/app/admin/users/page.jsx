"use client";

import { useAuth } from "@/app/context/AuthContext";
import api from "@/app/Utilitis/axiosInstance";
import { useEffect, useState } from "react";
import { Loader2, Users, LogOut, ShieldCheck } from "lucide-react";
// import AdminLayout from "../Adminlayout";

const page = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/allusers", {
          params: { email: user.email },
        });

        // ✅ Safely handle different API response structures
        const userList = Array.isArray(res.data)
          ? res.data
          : res.data?.users || [];

        setUsers(userList);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-700" size={24} />
            <h1 className="text-2xl font-bold text-emerald-700">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">{user?.email}</span>
            <button
              disabled
              className="flex items-center gap-2 bg-red-400 text-white px-3 py-1.5 rounded-md text-sm font-medium opacity-60 cursor-not-allowed"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 p-6">
          {loading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <Loader2 className="animate-spin text-emerald-600" size={36} />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 font-medium mt-10">
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-emerald-700 mb-4">
                <Users size={22} /> Registered Users
              </h2>

              {users.length === 0 ? (
                <div className="text-center py-10 text-gray-500 italic">
                  No users found yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-emerald-600 text-white text-sm">
                      <tr>
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">Role</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                      {users.map((u, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-emerald-50 transition-colors duration-200"
                        >
                          <td className="py-2 px-4 font-medium">
                            {u.name || "—"}
                          </td>
                          <td className="py-2 px-4">{u.email}</td>
                          <td className="py-2 px-4 capitalize">
                            {u.role || "user"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-gray-500 text-sm border-t bg-white">
          © {new Date().getFullYear()} Betting on Recovery — Admin Portal
        </footer>
      </div>
    </div>
  );
};

export default page;
