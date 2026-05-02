"use client";

import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import Itinerary from "./Itinerary";

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

  const interestsList = [
    "🏖️ Beaches",
    "🏔️ Mountains",
    "🍜 Food",
    "🏛️ Culture",
    "🎉 Nightlife",
    "🛍️ Shopping",
  ];

  // 📄 PDF
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
        const text = act?.name || "Activity";
        doc.text(`• ${text}`, 15, y);
        y += 5;
      });

      y += 5;
    });

    doc.save("trip.pdf");
  };

  const toggleInterest = (i) => {
    setData({
      ...data,
      interests: data.interests.includes(i)
        ? data.interests.filter((x) => x !== i)
        : [...data.interests, i],
    });
  };

  const addCustomInterest = () => {
    if (!customInterest.trim()) return;

    if (!data.interests.includes(customInterest)) {
      setData({
        ...data,
        interests: [...data.interests, customInterest],
      });
    }

    setCustomInterest("");
  };

  const removeInterest = (i) => {
    setData({
      ...data,
      interests: data.interests.filter((x) => x !== i),
    });
  };

  const submit = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trip/create`,
        data,
        { headers: { Authorization: token } },
      );

      setResult(res.data.itinerary);
      setGenerated(true);
    } catch {
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOADING SCREEN (NO FLICKER)
  if (loading && !generated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="animate-pulse">Generating your trip ✨</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* FORM */}
      {!generated && (
        <>
          <h2 className="text-3xl font-bold text-center mb-8">
            Plan Your Dream Trip 🌍
          </h2>

          {/* INPUT */}
          <input
            placeholder="Destination"
            className="w-full p-3 mb-3 rounded-xl border border-[var(--border)] bg-[var(--card)] outline-none"
            onChange={(e) => setData({ ...data, destination: e.target.value })}
          />

          <input
            type="number"
            min="1"
            placeholder="Days"
            className="w-full p-3 mb-3 rounded-xl border border-[var(--border)] bg-[var(--card)]"
            onChange={(e) => setData({ ...data, days: Number(e.target.value) })}
          />

          <select
            className="w-full p-3 mb-3 rounded-xl border border-[var(--border)] bg-[var(--card)]"
            onChange={(e) => setData({ ...data, budget: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            className="w-full p-3 mb-5 rounded-xl border border-[var(--border)] bg-[var(--card)]"
            onChange={(e) => setData({ ...data, language: e.target.value })}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>French</option>
            <option>Spanish</option>
          </select>

          {/* INTERESTS */}
          <div className="flex flex-wrap gap-2 mb-4">
            {interestsList.map((i) => (
              <button
                key={i}
                onClick={() => toggleInterest(i)}
                className={`px-3 py-1 rounded-full border transition ${
                  data.interests.includes(i)
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--card)]"
                }`}
              >
                {i}
              </button>
            ))}
          </div>

          {/* CUSTOM */}
          <div className="flex gap-2 mb-4">
            <input
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="Custom interest"
              className="flex-1 p-2 rounded-xl border border-[var(--border)] bg-[var(--card)]"
            />
            <button onClick={addCustomInterest} className="btn-primary">
              Add
            </button>
          </div>

          {/* SELECTED */}
          <div className="flex flex-wrap gap-2 mb-5">
            {data.interests.map((i) => (
              <div
                key={i}
                className="bg-[var(--primary)] text-white px-3 py-1 rounded-full flex gap-2"
              >
                {i}
                <button onClick={() => removeInterest(i)}>✕</button>
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <button onClick={submit} className="w-full btn-primary">
            Generate Trip 🚀
          </button>
        </>
      )}

      {/* RESULT */}
      {generated && result?.days && (
        <>
          <h2 className="text-xl font-bold text-center mb-4">
            Your Itinerary ✨
          </h2>

          <Itinerary data={result} />

          <button onClick={downloadPDF} className="w-full mt-4 btn-primary">
            Download PDF 📄
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full mt-3 btn-primary"
          >
            {loading ? "Regenerating..." : "Regenerate 🔄"}
          </button>
        </>
      )}
    </div>
  );
}
