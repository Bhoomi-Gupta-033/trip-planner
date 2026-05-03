"use client";

import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { getPlaceImage } from "@/utils/getPlaceImage";

const interestsList = [
  { label: "Beaches", emoji: "🏖️" },
  { label: "Mountains", emoji: "🏔️" },
  { label: "Food", emoji: "🍜" },
  { label: "Culture", emoji: "🏛️" },
  { label: "Nightlife", emoji: "🎉" },
  { label: "Shopping", emoji: "🛍️" },
  { label: "Adventure", emoji: "🧗" },
  { label: "Wildlife", emoji: "🦁" },
];

export default function TripForm() {
  const [data, setData] = useState({
    destination: "",
    days: 1,
    budget: "Low",
    interests: [],
    language: "English",
  });
  const [customInterest, setCustomInterest] = useState("");
  const [result, setResult] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [heroImage, setHeroImage] = useState(null);
  const [dayImages, setDayImages] = useState({});

  const toggleInterest = (label) => {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(label)
        ? prev.interests.filter((x) => x !== label)
        : [...prev.interests, label],
    }));
  };

  const addCustomInterest = () => {
    if (!customInterest.trim()) return;
    if (!data.interests.includes(customInterest)) {
      setData((prev) => ({
        ...prev,
        interests: [...prev.interests, customInterest],
      }));
    }
    setCustomInterest("");
  };

  const removeInterest = (i) => {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.filter((x) => x !== i),
    }));
  };

  const submit = async () => {
    if (!data.destination.trim()) {
      alert("Please enter a destination");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trip/create`,
        data,
        { headers: { Authorization: token } },
      );
      const itinerary = res.data.itinerary;
      setResult(itinerary);
      setGenerated(true);

      // Fetch hero + day images
      const hero = await getPlaceImage(data.destination);
      setHeroImage(hero);

      const days = itinerary?.days || [];
      const dayImgResults = await Promise.all(
        days.map(async (day, i) => {
          const firstAct = day.activities?.[0];
          const query = firstAct
            ? `${data.destination} ${typeof firstAct === "object" ? firstAct.name : firstAct}`
            : data.destination;
          const url = await getPlaceImage(query);
          return [i, url];
        }),
      );
      setDayImages(Object.fromEntries(dayImgResults));
    } catch {
      alert("Error generating trip ❌");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    let y = 10;
    doc.text(`${data.destination} ✈️`, 10, y);
    y += 10;
    result.days?.forEach((day) => {
      doc.text(`Day ${day.day}`, 10, y);
      y += 6;
      day.activities?.forEach((act) => {
        doc.text(`• ${act?.name || act}`, 15, y);
        y += 5;
      });
      y += 5;
    });
    doc.save("trip.pdf");
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="relative w-20 h-20">
          <div className="w-20 h-20 border-4 border-emerald-500/30 rounded-full" />
          <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            ✈️
          </div>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold">
            Planning your trip to {data.destination}...
          </p>
          <p className="text-gray-400 mt-2 text-sm">
            AI is crafting your perfect itinerary
          </p>
        </div>
        <div className="flex gap-2">
          {[
            "Researching places",
            "Building itinerary",
            "Estimating budget",
          ].map((step, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // FORM
  if (!generated) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-3">Plan Your Dream Trip 🌍</h2>
          <p className="text-gray-400">
            Tell us about your trip and AI will create a perfect itinerary
          </p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 space-y-6 shadow-xl">
          {/* Destination */}
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              📍 Destination
            </label>
            <input
              placeholder="e.g. Goa, Paris, Bali..."
              className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              value={data.destination}
              onChange={(e) =>
                setData({ ...data, destination: e.target.value })
              }
            />
          </div>

          {/* Days + Budget row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                🗓️ Duration
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={data.days}
                className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-emerald-500"
                onChange={(e) =>
                  setData({ ...data, days: Number(e.target.value) })
                }
              />
              <p className="text-xs text-gray-400 mt-1">days</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                💰 Budget
              </label>
              <div className="flex gap-2">
                {["Low", "Medium", "High"].map((b) => (
                  <button
                    key={b}
                    onClick={() => setData({ ...data, budget: b })}
                    className={`flex-1 py-4 rounded-xl border text-sm font-medium transition-all ${
                      data.budget === b
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-emerald-500"
                    }`}
                  >
                    {b === "Low" ? "🪙" : b === "Medium" ? "💵" : "💎"} {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              🌐 Language
            </label>
            <select
              className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-emerald-500"
              value={data.language}
              onChange={(e) => setData({ ...data, language: e.target.value })}
            >
              {[
                "English",
                "Hindi",
                "French",
                "Spanish",
                "German",
                "Japanese",
              ].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Interests */}
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
              🎯 Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {interestsList.map(({ label, emoji }) => (
                <button
                  key={label}
                  onClick={() => toggleInterest(label)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    data.interests.includes(label)
                      ? "bg-emerald-500 border-emerald-500 text-white scale-105"
                      : "border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-emerald-500"
                  }`}
                >
                  {emoji} {label}
                </button>
              ))}
            </div>

            {/* Custom interest */}
            <div className="flex gap-2 mt-3">
              <input
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomInterest()}
                placeholder="Add custom interest..."
                className="flex-1 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <button
                onClick={addCustomInterest}
                className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>

            {/* Selected custom interests */}
            {data.interests.filter(
              (i) => !interestsList.map((x) => x.label).includes(i),
            ).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.interests
                  .filter((i) => !interestsList.map((x) => x.label).includes(i))
                  .map((i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm"
                    >
                      {i}
                      <button
                        onClick={() => removeInterest(i)}
                        className="hover:text-red-500"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={submit}
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            Generate My Trip ✨
          </button>
        </div>
      </div>
    );
  }

  // RESULT
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8 shadow-2xl">
        {heroImage ? (
          <img
            src={heroImage}
            alt={data.destination}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-400 flex items-center justify-center text-7xl">
            🌍
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-1">
            Your AI Itinerary
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            ✈️ {data.destination}
          </h1>
          <div className="flex gap-4 mt-2 text-white/70 text-sm">
            <span>🗓️ {data.days} days</span>
            <span>💰 {data.budget} budget</span>
            {data.interests.length > 0 && (
              <span>🎯 {data.interests.slice(0, 2).join(", ")}</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={downloadPDF}
            className="px-3 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium shadow-lg transition-colors"
          >
            PDF 📄
          </button>
          <button
            onClick={() => {
              setGenerated(false);
              setResult(null);
              setHeroImage(null);
              setDayImages({});
            }}
            className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm backdrop-blur transition-colors"
          >
            ← New Trip
          </button>
        </div>
      </div>

      {/* Budget Summary */}
      {result?.budget && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Flights", val: result.budget.flights, icon: "✈️" },
            { label: "Hotel", val: result.budget.hotel, icon: "🏨" },
            { label: "Food", val: result.budget.food, icon: "🍜" },
            { label: "Activities", val: result.budget.activities, icon: "🎯" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center"
            >
              <p className="text-2xl mb-1">{item.icon}</p>
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="font-bold text-sm">{item.val}</p>
            </div>
          ))}
          <div className="col-span-2 md:col-span-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center">
            <span className="font-semibold text-gray-500">
              Total Estimated Budget
            </span>
            <span className="text-2xl font-bold text-emerald-500">
              {result.budget.total}
            </span>
          </div>
        </div>
      )}

      {/* Days */}
      <h2 className="text-2xl font-bold mb-5">📅 Day-by-Day Itinerary</h2>
      <div className="space-y-5">
        {result?.days?.map((day, dIndex) => (
          <div
            key={dIndex}
            className="rounded-2xl overflow-hidden shadow-lg bg-[var(--card)] border border-[var(--border)]"
          >
            {/* Day image */}
            <div className="relative h-36 overflow-hidden">
              {dayImages[dIndex] ? (
                <img
                  src={dayImages[dIndex]}
                  alt={`Day ${day.day}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-4xl">
                  🗺️
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
                  Day {day.day}
                </span>
                <p className="text-white font-bold text-lg leading-tight">
                  {typeof day.activities?.[0] === "object"
                    ? day.activities?.[0]?.name
                    : day.activities?.[0] || "Explore"}
                </p>
              </div>
            </div>

            {/* Activities */}
            <div className="p-5 space-y-2">
              {day.activities?.map((act, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">
                      {typeof act === "object" ? act.name : act}
                    </span>
                  </div>
                  {typeof act === "object" && act.cost && (
                    <span className="text-emerald-500 text-sm font-semibold flex-shrink-0">
                      {act.cost}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Hotels */}
      {result?.hotels?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-5">🏨 Recommended Hotels</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {result.hotels.map((hotel, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-emerald-500/50 transition-colors"
              >
                <p className="font-bold">🏨 {hotel.name || hotel}</p>
                {hotel.type && (
                  <p className="text-sm text-gray-500 mt-1">{hotel.type}</p>
                )}
                {hotel.price && (
                  <p className="text-sm text-emerald-500 mt-1">{hotel.price}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={submit}
          className="flex-1 py-3 rounded-xl border-2 border-emerald-500 text-emerald-500 font-semibold hover:bg-emerald-500 hover:text-white transition-all"
        >
          🔄 Regenerate
        </button>
        <a
          href="/my-trips"
          className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-center transition-colors"
        >
          View All Trips →
        </a>
      </div>
    </div>
  );
}
