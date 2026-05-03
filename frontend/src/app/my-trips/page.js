"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { getPlaceImage } from "@/utils/getPlaceImage";

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({});

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

        // Fetch images for all destinations in parallel
        const imageResults = await Promise.all(
          res.data.map(async (trip) => {
            const url = await getPlaceImage(trip.destination);
            return [trip._id, url];
          }),
        );
        setImages(Object.fromEntries(imageResults));
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
      <h1 className="text-3xl font-bold mb-2 text-center">My Trips 🧳</h1>
      <p className="text-center text-gray-400 mb-10">
        All your planned adventures
      </p>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-5xl mb-4">🗺️</p>
          <p className="text-xl mb-2">No trips yet</p>
          <a href="/dashboard" className="text-emerald-500 underline">
            Generate your first trip →
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="rounded-2xl overflow-hidden shadow-xl bg-[var(--card)] border border-[var(--border)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* IMAGE */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                {images[trip._id] ? (
                  <img
                    src={images[trip._id]}
                    alt={trip.destination}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    🌍
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Destination label on image */}
                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                  <h2 className="text-white font-bold text-xl drop-shadow">
                    ✈️ {trip.destination}
                  </h2>
                  <button
                    onClick={() => toggleSave(trip._id)}
                    className="text-2xl"
                  >
                    {trip.savedBy?.length ? "⭐" : "🤍"}
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col flex-1">
                {/* Stats */}
                <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    🗓️ {trip.days} days
                  </span>
                  <span className="flex items-center gap-1">
                    💰 {trip.budget}
                  </span>
                </div>

                {/* Activities preview */}
                <div className="flex-1 space-y-1 mb-4">
                  {trip.itinerary?.days?.[0]?.activities
                    ?.slice(0, 2)
                    .map((a, i) => (
                      <p
                        key={i}
                        className="text-sm text-gray-500 dark:text-gray-400 truncate"
                      >
                        ✨ {typeof a === "object" ? a.name : a}
                      </p>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`/trip/${trip._id}`}
                    className="flex-1 text-center px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
                  >
                    View Details →
                  </a>
                  <button
                    onClick={() => downloadPDF(trip)}
                    className="px-3 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm transition-colors"
                  >
                    PDF 📄
                  </button>
                  <button
                    onClick={() => deleteTrip(trip._id)}
                    className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==============================================================================================================

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import jsPDF from "jspdf";
// import { getPlaceImage } from "@/utils/getPlaceImage";

// export default function MyTripsPage() {
//   const [trips, setTrips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [images, setImages] = useState({});

//   useEffect(() => {
//     const fetchTrips = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/trip`,
//           { headers: { Authorization: token } },
//         );
//         setTrips(res.data);
//         setLoading(false);

//         // Fetch images for all destinations in parallel
//         const imageResults = await Promise.all(
//           res.data.map(async (trip) => {
//             const url = await getPlaceImage(trip.destination);
//             return [trip._id, url];
//           }),
//         );
//         setImages(Object.fromEntries(imageResults));
//       } catch {
//         toast.error("Failed to load trips ❌");
//       }
//     };
//     fetchTrips();
//   }, []);

//   const toggleSave = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/trip/save/${id}`,
//         {},
//         { headers: { Authorization: token } },
//       );
//       toast.success(res.data.msg);
//       setTrips((prev) =>
//         prev.map((t) =>
//           t._id === id ? { ...t, savedBy: t.savedBy?.length ? [] : ["me"] } : t,
//         ),
//       );
//     } catch {
//       toast.error("Error ❌");
//     }
//   };

//   const deleteTrip = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/trip/${id}`, {
//         headers: { Authorization: token },
//       });
//       setTrips((prev) => prev.filter((t) => t._id !== id));
//       toast.success("Deleted 🗑️");
//     } catch {
//       toast.error("Delete failed ❌");
//     }
//   };

//   const downloadPDF = (trip) => {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text(`Trip to ${trip.destination}`, 10, 10);
//     let y = 20;
//     trip.itinerary?.days?.forEach((day, index) => {
//       doc.text(`Day ${index + 1}`, 10, y);
//       y += 6;
//       day.activities?.forEach((act) => {
//         const text =
//           typeof act === "object" ? act.name || JSON.stringify(act) : act;
//         doc.text(`• ${text}`, 12, y);
//         y += 5;
//       });
//       y += 5;
//     });
//     doc.save(`${trip.destination}.pdf`);
//   };

//   return (
//     <div className="min-h-screen px-6 py-10 bg-[var(--bg)] text-[var(--text)]">
//       <h1 className="text-3xl font-bold mb-2 text-center">My Trips 🧳</h1>
//       <p className="text-center text-gray-400 mb-10">
//         All your planned adventures
//       </p>

//       {loading ? (
//         <div className="flex justify-center items-center h-60">
//           <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
//         </div>
//       ) : trips.length === 0 ? (
//         <div className="text-center text-gray-400 mt-20">
//           <p className="text-5xl mb-4">🗺️</p>
//           <p className="text-xl mb-2">No trips yet</p>
//           <a href="/dashboard" className="text-emerald-500 underline">
//             Generate your first trip →
//           </a>
//         </div>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
//           {trips.map((trip) => (
//             <div
//               key={trip._id}
//               className="rounded-2xl overflow-hidden shadow-xl bg-[var(--card)] border border-[var(--border)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
//             >
//               {/* IMAGE */}
//               <div className="relative h-48 w-full overflow-hidden bg-[var(--card)]">
//                 {images[trip._id] ? (
//                   <img
//                     src={images[trip._id]}
//                     alt={trip.destination}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-5xl">
//                     🌍
//                   </div>
//                 )}
//                 {/* Gradient overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
//                 {/* Destination label on image */}
//                 <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
//                   <h2 className="text-white font-bold text-xl drop-shadow">
//                     ✈️ {trip.destination}
//                   </h2>
//                   <button
//                     onClick={() => toggleSave(trip._id)}
//                     className="text-2xl"
//                   >
//                     {trip.savedBy?.length ? "⭐" : "🤍"}
//                   </button>
//                 </div>
//               </div>

//               {/* CONTENT */}
//               <div className="p-5 flex flex-col flex-1">
//                 {/* Stats */}
//                 <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
//                   <span className="flex items-center gap-1">
//                     🗓️ {trip.days} days
//                   </span>
//                   <span className="flex items-center gap-1">
//                     💰 {trip.budget}
//                   </span>
//                 </div>

//                 {/* Activities preview */}
//                 <div className="flex-1 space-y-1 mb-4">
//                   {trip.itinerary?.days?.[0]?.activities
//                     ?.slice(0, 2)
//                     .map((a, i) => (
//                       <p
//                         key={i}
//                         className="text-sm text-gray-500 dark:text-gray-400 truncate"
//                       >
//                         ✨ {typeof a === "object" ? a.name : a}
//                       </p>
//                     ))}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-2 flex-wrap">
//                   <a
//                     href={`/trip/${trip._id}`}
//                     className="flex-1 text-center px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
//                   >
//                     View Details →
//                   </a>
//                   <button
//                     onClick={() => downloadPDF(trip)}
//                     className="px-3 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm transition-colors"
//                   >
//                     PDF 📄
//                   </button>
//                   <button
//                     onClick={() => deleteTrip(trip._id)}
//                     className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors"
//                   >
//                     🗑️
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
