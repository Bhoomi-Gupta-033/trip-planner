"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

export default function TripPage() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBudget, setShowBudget] = useState(false);

  // ✅ NUMBER EXTRACTOR
  const extractNumber = (val) => {
    if (!val) return 0;
    const num = val.toString().match(/\d+/g);
    return num ? parseInt(num.join("")) : 0;
  };

  // ✅ SAFE HELPERS
  const getText = (a) => (typeof a === "object" ? a?.name || "Activity" : a);

  const getCost = (a) => (typeof a === "object" ? extractNumber(a?.cost) : 0);

  // ✅ FETCH TRIP
  useEffect(() => {
    if (!id) return;

    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`http://localhost:5000/api/trip/${id}`, {
          headers: { Authorization: token },
        });

        setTrip(res.data);
      } catch {
        toast.error("Failed to load trip ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  // ✅ REMOVE ACTIVITY
  const removeActivity = (d, i) => {
    const updated = { ...trip };
    updated.itinerary.days[d].activities.splice(i, 1);
    setTrip(updated);
  };

  // ✅ ADD ACTIVITY
  const addActivity = (d) => {
    const text = prompt("Enter activity");
    if (!text) return;

    const updated = { ...trip };

    updated.itinerary.days[d].activities.push({
      name: text,
      cost: "₹0",
    });

    setTrip(updated);
  };

  // ✅ SAVE TRIP
  const saveTrip = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/trip/${id}`,
        { itinerary: trip.itinerary },
        { headers: { Authorization: token } },
      );

      toast.success("Trip saved ✅");
    } catch {
      toast.error("Save failed ❌");
    }
  };

  // ✅ REGENERATE DAY
  const regenerateDay = async (day) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/api/trip/regenerate/${id}`,
        { day, destination: trip.destination },
        { headers: { Authorization: token } },
      );

      const updated = { ...trip };
      updated.itinerary.days[day - 1] = res.data;

      setTrip(updated);

      toast.success("Day regenerated 🔄");
    } catch (err) {
      console.log("REGENERATE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed ❌");
    }
  };

  // ✅ GET BUDGET FROM AI
  const getBudget = () => {
    if (!trip?.itinerary?.budget) return null;

    return {
      flights: extractNumber(trip.itinerary.budget?.flights),
      hotel: extractNumber(trip.itinerary.budget?.hotel),
      food: extractNumber(trip.itinerary.budget?.food),
      activities: extractNumber(trip.itinerary.budget?.activities),
      total: extractNumber(trip.itinerary.budget?.total),
    };
  };

  const budget = getBudget();

  // ✅ PDF DOWNLOAD
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Trip to ${trip.destination}`, 10, 10);

    let y = 20;

    trip.itinerary.days.forEach((day, i) => {
      doc.text(`Day ${i + 1}`, 10, y);
      y += 6;

      day.activities.forEach((a) => {
        doc.text(`• ${getText(a)}`, 12, y);
        y += 5;
      });

      y += 5;
    });

    doc.save(`${trip.destination}.pdf`);
  };

  // ✅ LOADING
  if (loading) return <p className="text-center mt-20">Loading...</p>;

  if (!trip || !trip.itinerary)
    return <p className="text-center mt-20">No trip data</p>;

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">✈️ {trip.destination}</h1>

        <div className="flex gap-3">
          <button
            onClick={saveTrip}
            className="px-4 py-2 rounded bg-blue-500 text-white dark:bg-green-500"
          >
            Save 💾
          </button>

          <button
            onClick={downloadPDF}
            className="px-4 py-2 rounded bg-purple-500 text-white"
          >
            PDF 📄
          </button>
        </div>
      </div>

      {/* BUDGET */}
      {budget && (
        <div
          onClick={() => setShowBudget(true)}
          className="p-6 rounded-xl cursor-pointer mb-8
          bg-blue-100 dark:bg-green-900
          hover:scale-105 transition"
        >
          <h2 className="text-lg font-semibold">Total Budget 💰</h2>
          <p className="text-2xl font-bold mt-2">₹{budget.total}</p>
        </div>
      )}

      {/* DAYS */}
      <div className="space-y-6">
        {trip.itinerary.days.map((day, dIndex) => (
          <div
            key={dIndex}
            className="p-5 rounded-2xl shadow-lg
            bg-gray-100 dark:bg-[#111]
            hover:scale-[1.02] transition"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Day {day.day}</h2>

              <button
                onClick={() => regenerateDay(day.day)}
                className="px-3 py-1 rounded bg-blue-500 text-white dark:bg-green-500"
              >
                🔄 Regenerate
              </button>
            </div>

            <div className="space-y-3">
              {day.activities.map((a, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 rounded-lg 
                  bg-white dark:bg-[#1a1a1a]"
                >
                  <div>
                    <p className="font-medium">{getText(a)}</p>
                    <p className="text-sm text-gray-500">₹{getCost(a)}</p>
                  </div>

                  <button
                    onClick={() => removeActivity(dIndex, i)}
                    className="px-3 py-1 rounded bg-blue-500 text-white dark:bg-green-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => addActivity(dIndex)}
              className="px-3 py-1 rounded bg-blue-500 text-white dark:bg-green-500"
            >
              + Add Activity
            </button>
          </div>
        ))}
      </div>

      {/* HOTELS */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">🏨 Hotels</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {trip.itinerary.hotels?.map((h, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-100 dark:bg-[#111]">
              <p className="font-semibold">
                {typeof h === "object" ? h.name : h}
              </p>

              {h.type && <p className="text-sm text-gray-500">{h.type}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* BUDGET POPUP */}
      {showBudget && budget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-black p-6 rounded-xl w-[300px]">
            <h2 className="text-xl font-bold mb-4">Budget Breakdown</h2>

            <p>✈ Flights: ₹{budget.flights}</p>
            <p>🏨 Hotel: ₹{budget.hotel}</p>
            <p>🍜 Food: ₹{budget.food}</p>
            <p>🎯 Activities: ₹{budget.activities}</p>

            <hr className="my-3" />

            <p className="font-bold text-lg">Total: ₹{budget.total}</p>

            <button
              onClick={() => setShowBudget(false)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
