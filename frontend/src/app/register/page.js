"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};
    if (!data.name || data.name.length < 5)
      err.name = "Name should be at least 5 characters";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email))
      err.email = "Enter valid email (example@gmail.com)";
    if (!data.password || data.password.length < 6)
      err.password = "Password must be at least 6 characters";
    if (!/(?=.*[A-Z])(?=.*[0-9])/.test(data.password))
      err.password = "Must contain 1 uppercase & 1 number";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        data,
      );
      toast.success("Registered successfully 🎉");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)] text-[var(--text)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-[var(--card)] text-[var(--text)] border border-[var(--border)] backdrop-blur space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Create Account ✨</h2>

        <div>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-emerald-400"
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-emerald-400"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-emerald-400"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:scale-105 transition-transform"
        >
          Register 🚀
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-emerald-500 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
