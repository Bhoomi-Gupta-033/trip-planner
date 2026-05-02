// "use client";

// import { useState } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";
// import Itinerary from "./Itinerary";

// export default function TripForm() {
//   const [data, setData] = useState({
//     destination: "",
//     days: 1,
//     budget: "Low",
//     interests: [],
//     language: "English",
//   });

//   const [customInterest, setCustomInterest] = useState("");
//   const [result, setResult] = useState(null);
//   const [generated, setGenerated] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const interestsList = [
//     "🏖️ Beaches",
//     "🏔️ Mountains",
//     "🍜 Food",
//     "🏛️ Culture",
//     "🎉 Nightlife",
//     "🛍️ Shopping",
//   ];

//   const downloadPDF = () => {
//     if (!result) return;

//     const doc = new jsPDF();
//     let y = 10;

//     doc.setFontSize(16);
//     doc.text(`${data.destination} ✈️`, 10, y);
//     y += 10;

//     result.days.forEach((day) => {
//       doc.setFontSize(14);
//       doc.text(`Day ${day.day}`, 10, y);
//       y += 6;

//       doc.setFontSize(11);
//       day.activities.forEach((act) => {
//         const text =
//           typeof act === "string"
//             ? act
//             : act.name || act.title || JSON.stringify(act);

//         doc.text(`• ${text}`, 15, y);
//         y += 5;
//       });

//       y += 5;
//     });

//     doc.save("trip.pdf");
//   };

//   const toggleInterest = (i) => {
//     setData({
//       ...data,
//       interests: data.interests.includes(i)
//         ? data.interests.filter((x) => x !== i)
//         : [...data.interests, i],
//     });
//   };

//   const addCustomInterest = () => {
//     if (!customInterest.trim()) return;

//     if (!data.interests.includes(customInterest)) {
//       setData({
//         ...data,
//         interests: [...data.interests, customInterest],
//       });
//     }

//     setCustomInterest("");
//   };

//   const removeInterest = (i) => {
//     setData({
//       ...data,
//       interests: data.interests.filter((x) => x !== i),
//     });
//   };

//   const submit = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await axios.post(
//         "http://localhost:5000/api/trip/create",
//         data,
//         { headers: { Authorization: token } },
//       );

//       setResult(res.data.itinerary);
//       setGenerated(true);
//     } catch {
//       alert("Error ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className=" bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
//       {/* TITLE */}
//       {!generated && (
//         <>
//           <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800 dark:text-white">
//             Plan Your Dream Trip 🌍
//           </h2>

//           {/* DESTINATION */}
//           <input
//             placeholder="Enter Destination"
//             className="w-full p-3 rounded-xl mb-3
//             border border-gray-300 dark:border-green-500/30
//             bg-white dark:bg-black
//             focus:ring-2 focus:ring-blue-400 dark:focus:ring-green-400
//             outline-none transition"
//             onChange={(e) => setData({ ...data, destination: e.target.value })}
//           />

//           {/* DAYS */}
//           <input
//             type="number"
//             min="1"
//             placeholder="Enter Number of Days"
//             className="w-full p-3 rounded-xl mb-3
//             border border-gray-300 dark:border-green-500/30

//             focus:ring-2 focus:ring-blue-400 dark:focus:ring-green-400
//             outline-none transition"
//             onChange={(e) => setData({ ...data, days: Number(e.target.value) })}
//           />

//           {/* BUDGET */}
//           <select
//             className="w-full p-3 rounded-xl mb-3
//             border border-gray-300 dark:border-green-500/30

//             focus:ring-2 focus:ring-blue-400 dark:focus:ring-green-400
//             outline-none transition"
//             onChange={(e) => setData({ ...data, budget: e.target.value })}
//           >
//             <option>Low</option>
//             <option>Medium</option>
//             <option>High</option>
//           </select>

//           {/* LANGUAGE */}
//           <select
//             className="w-full p-3 rounded-xl mb-5
//             border border-gray-300 dark:border-green-500/30
//             "
//             onChange={(e) => setData({ ...data, language: e.target.value })}
//           >
//             <option>English</option>
//             <option>Hindi</option>
//             <option>French</option>
//             <option>Spanish</option>
//           </select>

//           {/* INTERESTS */}
//           <p className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
//             Select Interests:
//           </p>

//           <div className="flex flex-wrap gap-2 mb-4">
//             {interestsList.map((i) => (
//               <button
//                 key={i}
//                 onClick={() => toggleInterest(i)}
//                 className={`px-3 py-1 rounded-full text-sm transition-all duration-200 border
//                 ${
//                   data.interests.includes(i)
//                     ? "bg-green-500 text-white border-green-600 scale-105"
//                     : "bg-gray-100 dark:bg-black border-gray-300 dark:border-green-500/30 hover:scale-105"
//                 }`}
//               >
//                 {i}
//               </button>
//             ))}
//           </div>

//           {/* CUSTOM INTEREST */}
//           <div className="flex gap-2 mb-4">
//             <input
//               value={customInterest}
//               onChange={(e) => setCustomInterest(e.target.value)}
//               placeholder="Add custom interest"
//               className="flex-1 px-3 py-2 rounded-xl
//               border border-gray-300 dark:border-green-500/30
//               dark:bg-black
//               focus:ring-2 focus:ring-blue-400 outline-none"
//             />

//             <button
//               onClick={addCustomInterest}
//               className="px-4 py-2 rounded-xl  text-white
//                dark:bg-green-500 dark:hover:bg-green-600
//               transition"
//             >
//               Add
//             </button>
//           </div>

//           {/* SELECTED INTERESTS */}
//           {data.interests.length > 0 && (
//             <div className="flex flex-wrap gap-2 mb-5">
//               {data.interests.map((i) => (
//                 <div
//                   key={i}
//                   className="bg-purple-600 text-white px-3 py-1 rounded-full flex items-center gap-2"
//                 >
//                   {i}
//                   <button onClick={() => removeInterest(i)}>✕</button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* SUBMIT */}
//           <button
//             onClick={submit}
//             className="w-full py-3 rounded-xl font-semibold
//             bg-gradient-to-r from-blue-500 to-purple-600
//             hover:scale-[1.02] transition
//             text-white shadow-lg"
//           >
//             Generate Trip 🚀
//           </button>
//         </>
//       )}

//       {/* RESULT */}
//       {generated && result?.days && (
//         <>
//           <h2 className="text-xl font-bold text-center text-white mb-4">
//             Your Itinerary ✨
//           </h2>

//           <Itinerary data={result} />

//           <button
//             onClick={downloadPDF}
//             className=" gap-2.5 w-full mt-4 py-2 bg-green-600 rounded hover:bg-green-700 text-white transition"
//           >
//             Download PDF 📄
//           </button>

//           {/* GENERATE BUTTON 🔥 */}
//           <button
//             onClick={submit}
//             disabled={loading}
//             className={` gap-2.5 w-full py-3 rounded-xl font-semibold text-white transition
//               ${
//                 loading
//                   ? "bg-gray-500 cursor-not-allowed"
//                   : "bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02]"
//               }`}
//           >
//             {loading ? "Generating Trip..." : "Generate Trip 🚀"}
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

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
        "http://localhost:5000/api/trip/create",
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
