"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/trip`,
          { headers: { Authorization: token } },
        );
        setTrips(res.data);
        setLoading(false);
      } catch {
        toast.error("Failed to load trips ❌");
      }
    };
    fetchTrips();
  }, []);

  const toggleSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trip/save/${id}`,
        {},
        { headers: { Authorization: token } },
      );
      toast.success(res.data.msg);
      setTrips((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, savedBy: t.savedBy?.length ? [] : ["me"] } : t,
        ),
      );
    } catch {
      toast.error("Error ❌");
    }
  };

  const deleteTrip = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/trip/${id}`, {
        headers: { Authorization: token },
      });
      setTrips((prev) => prev.filter((t) => t._id !== id));
      toast.success("Deleted 🗑️");
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  const downloadPDF = (trip) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Trip to ${trip.destination}`, 10, 10);
    let y = 20;
    trip.itinerary?.days?.forEach((day, index) => {
      doc.text(`Day ${index + 1}`, 10, y);
      y += 6;
      day.activities?.forEach((act) => {
        const text =
          typeof act === "object" ? act.name || JSON.stringify(act) : act;
        doc.text(`• ${text}`, 12, y);
        y += 5;
      });
      y += 5;
    });
    doc.save(`${trip.destination}.pdf`);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-[var(--bg)] text-[var(--text)]">
      <h1 className="text-3xl font-bold mb-8 text-center">My Trips 🧳</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : trips.length === 0 ? (
        <div className="text-center text-gray-400">
          <p>No trips yet 😢</p>
          <a
            href="/dashboard"
            className="text-blue-500 dark:text-green-400 underline"
          >
            Generate one →
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="p-6 rounded-2xl shadow-xl bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:scale-[1.03] transition-transform"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">✈️ {trip.destination}</h2>
                <button
                  onClick={() => toggleSave(trip._id)}
                  className="text-xl"
                >
                  {trip.savedBy?.length ? "⭐" : "☆"}
                </button>
              </div>

              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {trip.days} days • {trip.budget}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <a
                  href={`/trip/${trip._id}`}
                  className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  View →
                </a>
                <button
                  onClick={() => downloadPDF(trip)}
                  className="px-3 py-1 rounded bg-purple-500 text-white"
                >
                  PDF 📄
                </button>
                <button
                  onClick={() => deleteTrip(trip._id)}
                  className="px-3 py-1 rounded bg-red-500 text-white"
                >
                  Delete 🗑️
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-400 space-y-1">
                {trip.itinerary?.days?.[0]?.activities
                  ?.slice(0, 2)
                  .map((a, i) => (
                    <div key={i} className="px-2 py-1 rounded">
                      ✨{" "}
                      {typeof a === "object" ? a.name || JSON.stringify(a) : a}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
