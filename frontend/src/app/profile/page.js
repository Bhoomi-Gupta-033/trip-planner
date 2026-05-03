"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [savedTrips, setSavedTrips] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        const [tripRes, savedRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/trip`, {
            headers: { Authorization: token },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/trip/saved`, {
            headers: { Authorization: token },
          }),
        ]);
        setTrips(tripRes.data);
        setSavedTrips(savedRes.data);
      } catch {
        toast.error("Error loading data ❌");
      }
    };

    fetchData();
  }, []);

  const logout = () => {
    localStorage.clear();
    toast.success("Logged out 👋");
    setTimeout(() => {
      window.location.href = "/login";
    }, 800);
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen px-6 py-10 bg-[var(--bg)] text-[var(--text)]">
      {/* PROFILE HEADER CARD */}
      <div className="max-w-5xl mx-auto p-6 rounded-2xl shadow-xl bg-[var(--card)] text-[var(--text)] border border-[var(--border)] flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-emerald-500 text-white text-3xl font-bold">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">{user.email}</p>

          <div className="flex justify-center md:justify-start gap-6 mt-4">
            <div>
              <p className="text-lg font-bold">{trips.length}</p>
              <p className="text-gray-400 text-sm">Trips</p>
            </div>
            <div>
              <p className="text-lg font-bold">{savedTrips.length}</p>
              <p className="text-gray-400 text-sm">Saved</p>
            </div>
            <div>
              <p className="text-lg font-bold">🌍</p>
              <p className="text-gray-400 text-sm">Places</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowSaved(true)}
            className="px-5 py-2 rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
          >
            Saved Trips ⭐
          </button>
          <button
            onClick={logout}
            className="px-5 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MY TRIPS */}
      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Trips 🧳</h2>

        {trips.length === 0 ? (
          <p className="text-gray-400">No trips yet</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="p-5 rounded-xl shadow-lg bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:scale-105 transition-transform"
              >
                <h3 className="text-lg font-bold">✈️ {trip.destination}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {trip.days} days • {trip.budget}
                </p>
                <a
                  href={`/trip/${trip._id}`}
                  className="inline-block mt-3 text-emerald-500 hover:underline"
                >
                  View Details →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SAVED TRIPS MODAL */}
      {showSaved && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-[var(--card)] text-[var(--text)] w-full max-w-2xl p-6 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto border border-[var(--border)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Saved Trips ⭐</h2>
              <button
                onClick={() => setShowSaved(false)}
                className="text-red-500 text-lg"
              >
                ✕
              </button>
            </div>

            {savedTrips.length === 0 ? (
              <p className="text-gray-400">No saved trips</p>
            ) : (
              savedTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="p-4 mb-3 rounded-lg bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]"
                >
                  <h3 className="font-bold">{trip.destination}</h3>
                  <p className="text-sm text-gray-500">
                    {trip.days} days • {trip.budget}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
