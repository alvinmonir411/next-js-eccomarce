"use client";
import React from "react";
import Protected from "../Components/Protected";
import { useRole } from "../Utilitis/roleCheck";
import AdminLayout from "../admin/layout";
import Loader from "../Utilitis/Loader";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Userlayout from "../user/layout";

export default function Page() {
  const { logout } = useAuth();
  const { role, roleloading } = useRole();

  if (roleloading) return <Loader />;

  return (
    <Protected>
      {role === "admin" ? (
        <AdminLayout>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </AdminLayout>
      ) : (
        <div className="p-8">
          <Userlayout />
        </div>
      )}
    </Protected>
  );
}
