"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useRole } from "../Utilitis/roleCheck";
import Loader from "../Utilitis/Loader";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleloading } = useRole();
  const router = useRouter();
 
  // combine both loading states
  const isLoading = loading || roleloading;

  useEffect(() => {
    // Wait until both are done loading
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [isLoading, user, router]);

  // step 1: if loading — show loader (no early redirects)
  if (isLoading) return <Loader />;

  // step 2: if done loading but no user — redirect (handled by useEffect)
  // step 3: if user and role exist — show protected content
  if (user && role) {
    return <>{children}</>;
  }

  // fallback in case user or role didn't resolve properly
  return <Loader />;
};

export default Protected;
