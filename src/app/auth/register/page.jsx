"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";

export default function RegisterPage() {
  const { emailRegister, googleLogin } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await emailRegister(name, email, password);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 p-6 rounded shadow-md flex flex-col gap-4 w-80"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full"
          required
        />

        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
        >
          Register
        </button>

        <button
          type="button"
          onClick={googleLogin}
          className={`btn btn-error w-full ${loading ? "loading" : ""}`}
        >
          Continue with Google
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <a href="/auth/login" className="text-primary">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
