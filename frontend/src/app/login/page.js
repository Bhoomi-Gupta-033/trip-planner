"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ VALIDATION
  const validate = () => {
    let err = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email)) {
      err.email = "Enter valid email";
    }

    if (!data.password || data.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ✅ LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        data,
      );

      // 🔐 SAVE USER + TOKEN
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Welcome back 👋");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed ❌");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
     bg-[var(--bg)] text-[var(--text)]  transition-all duration-500"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl
       bg-[var(--bg)] text-[var(--text)] 
        backdrop-blur space-y-5 transition"
      >
        <h2 className="text-2xl font-bold text-center">Welcome Back 👋</h2>

        {/* EMAIL */}
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border
            bg-transparent outline-none
            focus:ring-2 focus:ring-blue-400
            dark:focus:ring-green-400"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border
            bg-transparent outline-none
            focus:ring-2 focus:ring-blue-400
            dark:focus:ring-green-400"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="
          w-full py-3 rounded-lg font-semibold
          hover:bg-blue-600
          dark:bg-green-500 dark:hover:bg-green-600
          transition-all duration-300 shadow-lg hover:scale-105"
        >
          Login 🚀
        </button>

        {/* REGISTER LINK */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-500 dark:text-green-400 font-semibold"
          >
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
