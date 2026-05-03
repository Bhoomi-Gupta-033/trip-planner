"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getPlaceImage } from "@/utils/getPlaceImage";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [savedTrips, setSavedTrips] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [images, setImages] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (storedUser && storedUser !== "undefined")
      setUser(JSON.parse(storedUser));

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

        // Fetch images for all trips
        const allTrips = [...tripRes.data, ...savedRes.data];
        const uniqueTrips = allTrips.filter(
          (t, i, arr) => arr.findIndex((x) => x._id === t._id) === i,
        );
        const imageResults = await Promise.all(
          uniqueTrips.map(async (trip) => {
            const url = await getPlaceImage(trip.destination);
            return [trip._id, url];
          }),
        );
        setImages(Object.fromEntries(imageResults));
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

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--bg)]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* HERO BANNER */}
      <div className="relative h-48 bg-gradient-to-r from-emerald-600 to-teal-500 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/globe2.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 flex items-end px-8 pb-0">
          {/* Avatar overlapping banner */}
          <div className="w-24 h-24 rounded-full bg-[var(--card)] border-4 border-[var(--bg)] flex items-center justify-center text-3xl font-bold text-emerald-500 translate-y-12 shadow-xl">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* PROFILE INFO */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between pt-16 pb-6 border-b border-[var(--border)]">
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {user.email}
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowSaved(true)}
              className="px-5 py-2 rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              Saved Trips ⭐
            </button>
            <button
              onClick={logout}
              className="px-5 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="flex gap-8 py-5 border-b border-[var(--border)]">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-500">
              {trips.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Trips Planned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-500">
              {savedTrips.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Saved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-500">🌍</p>
            <p className="text-xs text-gray-400 mt-1">Explorer</p>
          </div>
        </div>

        {/* MY TRIPS */}
        <div className="py-8">
          <h2 className="text-xl font-bold mb-6">Your Trips 🧳</h2>
          {trips.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🗺️</p>
              <p>
                No trips yet —{" "}
                <a href="/dashboard" className="text-emerald-500 underline">
                  generate one!
                </a>
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trips.map((trip) => (
                <a
                  key={trip._id}
                  href={`/trip/${trip._id}`}
                  className="group rounded-2xl overflow-hidden shadow-lg bg-[var(--card)] border border-[var(--border)] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-40 bg-[var(--card)] overflow-hidden">
                    {images[trip._id] ? (
                      <img
                        src={images[trip._id]}
                        alt={trip.destination}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🌍
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <p className="absolute bottom-3 left-4 text-white font-bold text-lg drop-shadow">
                      ✈️ {trip.destination}
                    </p>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span>🗓️ {trip.days} days</span>
                      <span>💰 {trip.budget}</span>
                    </div>
                    <a
                      href={`/trip/${trip._id}`}
                      className="text-emerald-500 text-sm mt-3 font-medium group-hover:underline"
                    >
                      View Details →
                    </a>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SAVED TRIPS MODAL */}
      {showSaved && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
          <div className="bg-[var(--card)] text-[var(--text)] w-full max-w-2xl rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden border border-[var(--border)] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold">Saved Trips ⭐</h2>
              <button
                onClick={() => setShowSaved(false)}
                className="text-gray-400 hover:text-red-500 text-xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4">
              {savedTrips.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No saved trips yet
                </p>
              ) : (
                savedTrips.map((trip) => (
                  <a
                    key={trip._id}
                    href={`/trip/${trip._id}`}
                    className="flex gap-4 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-emerald-500 transition-colors group"
                  >
                    <div className="w-20 h-16 rounded-lg overflow-hidden bg-[var(--card)] flex-shrink-0">
                      {images[trip._id] ? (
                        <img
                          src={images[trip._id]}
                          alt={trip.destination}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🌍
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold group-hover:text-emerald-500 transition-colors">
                        ✈️ {trip.destination}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {trip.days} days • {trip.budget}
                      </p>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
