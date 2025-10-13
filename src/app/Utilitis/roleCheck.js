// utils/useRole.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const useRole = () => {
  const { user, loading: authLoading } = useAuth(); // include auth loading
  const [role, setRole] = useState(null);
  const [roleloading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // wait until auth finishes

    if (!user?.uid) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const res = await axios.get(`/api/users?uid=${user.uid}`);
        if (res.data?.role) {
          setRole(res.data.role);
        } else {
          setRole("user"); // default role
        }
      } catch (err) {
        console.error("Failed to fetch role:", err);
        setRole("user"); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user, authLoading]);

  return { role, roleloading };
};
