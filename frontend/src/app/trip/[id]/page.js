// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import jsPDF from "jspdf";
// import toast from "react-hot-toast";
// import { getPlaceImage } from "@/utils/getPlaceImage";

// export default function TripPage() {
//   const { id } = useParams();
//   const [trip, setTrip] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showBudget, setShowBudget] = useState(false);
//   const [heroImage, setHeroImage] = useState(null);
//   const [dayImages, setDayImages] = useState({});

//   const extractNumber = (val) => {
//     if (!val) return 0;
//     const num = val.toString().match(/\d+/g);
//     return num ? parseInt(num.join("")) : 0;
//   };

//   const getText = (a) => (typeof a === "object" ? a?.name || "Activity" : a);
//   const getCost = (a) => (typeof a === "object" ? extractNumber(a?.cost) : 0);

//   useEffect(() => {
//     if (!id) return;
//     const fetchTrip = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/trip/${id}`,
//           { headers: { Authorization: token } },
//         );
//         setTrip(res.data);

//         // Hero image for destination
//         const hero = await getPlaceImage(res.data.destination);
//         setHeroImage(hero);

//         // Image for each day based on first activity
//         const days = res.data.itinerary?.days || [];
//         const dayImgResults = await Promise.all(
//           days.map(async (day, i) => {
//             const firstActivity = day.activities?.[0];
//             const query = firstActivity
//               ? `${res.data.destination} ${typeof firstActivity === "object" ? firstActivity.name : firstActivity}`
//               : res.data.destination;
//             const url = await getPlaceImage(query);
//             return [i, url];
//           }),
//         );
//         setDayImages(Object.fromEntries(dayImgResults));
//       } catch {
//         toast.error("Failed to load trip ❌");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTrip();
//   }, [id]);

//   const removeActivity = (d, i) => {
//     const updated = { ...trip };
//     updated.itinerary.days[d].activities.splice(i, 1);
//     setTrip({ ...updated });
//   };

//   const addActivity = (d) => {
//     const text = prompt("Enter activity");
//     if (!text) return;
//     const updated = { ...trip };
//     updated.itinerary.days[d].activities.push({ name: text, cost: "₹0" });
//     setTrip({ ...updated });
//   };

//   const saveTrip = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/trip/${id}`,
//         { itinerary: trip.itinerary },
//         { headers: { Authorization: token } },
//       );
//       toast.success("Trip saved ✅");
//     } catch {
//       toast.error("Save failed ❌");
//     }
//   };

//   const regenerateDay = async (day) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/trip/regenerate/${id}`,
//         { day, destination: trip.destination },
//         { headers: { Authorization: token } },
//       );
//       const updated = { ...trip };
//       updated.itinerary.days[day - 1] = res.data;
//       setTrip({ ...updated });
//       toast.success("Day regenerated 🔄");
//     } catch (err) {
//       alert(err.response?.data?.msg || "Failed ❌");
//     }
//   };

//   const getBudget = () => {
//     if (!trip?.itinerary?.budget) return null;
//     return {
//       flights: extractNumber(trip.itinerary.budget?.flights),
//       hotel: extractNumber(trip.itinerary.budget?.hotel),
//       food: extractNumber(trip.itinerary.budget?.food),
//       activities: extractNumber(trip.itinerary.budget?.activities),
//       total: extractNumber(trip.itinerary.budget?.total),
//     };
//   };

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text(`Trip to ${trip.destination}`, 10, 10);
//     let y = 20;
//     trip.itinerary.days.forEach((day, i) => {
//       doc.text(`Day ${i + 1}`, 10, y);
//       y += 6;
//       day.activities.forEach((a) => {
//         doc.text(`• ${getText(a)}`, 12, y);
//         y += 5;
//       });
//       y += 5;
//     });
//     doc.save(`${trip.destination}.pdf`);
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen bg-[var(--bg)]">
//         <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );

//   if (!trip || !trip.itinerary)
//     return <p className="text-center mt-20">No trip data</p>;

//   const budget = getBudget();

//   return (
//     <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
//       {/* HERO */}
//       <div className="relative h-72 md:h-96 overflow-hidden">
//         {heroImage ? (
//           <img
//             src={heroImage}
//             alt={trip.destination}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-400 flex items-center justify-center text-7xl">
//             🌍
//           </div>
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

//         {/* Hero content */}
//         <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
//           <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-2">
//             Your Trip
//           </p>
//           <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow">
//             ✈️ {trip.destination}
//           </h1>
//           <div className="flex gap-4 mt-3 text-white/80 text-sm">
//             {trip.days && <span>🗓️ {trip.days} days</span>}
//             {trip.budget && <span>💰 {trip.budget}</span>}
//           </div>
//         </div>

//         {/* Action buttons on hero */}
//         <div className="absolute top-4 right-4 flex gap-2">
//           <button
//             onClick={saveTrip}
//             className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium shadow-lg backdrop-blur transition-colors"
//           >
//             Save 💾
//           </button>
//           <button
//             onClick={downloadPDF}
//             className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium shadow-lg transition-colors"
//           >
//             PDF 📄
//           </button>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
//         {/* BUDGET CARD */}
//         {budget && (
//           <div
//             onClick={() => setShowBudget(true)}
//             className="cursor-pointer p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 hover:border-emerald-500 transition-colors flex justify-between items-center"
//           >
//             <div>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Estimated Total Budget
//               </p>
//               <p className="text-3xl font-bold text-emerald-500 mt-1">
//                 ₹{budget.total.toLocaleString()}
//               </p>
//             </div>
//             <div className="text-right">
//               <p className="text-xs text-gray-400">Click for breakdown</p>
//               <p className="text-3xl mt-1">💰</p>
//             </div>
//           </div>
//         )}

//         {/* ITINERARY */}
//         <div>
//           <h2 className="text-2xl font-bold mb-6">📅 Day-by-Day Itinerary</h2>
//           <div className="space-y-6">
//             {trip.itinerary.days.map((day, dIndex) => (
//               <div
//                 key={dIndex}
//                 className="rounded-2xl overflow-hidden shadow-lg bg-[var(--card)] border border-[var(--border)]"
//               >
//                 {/* Day image header */}
//                 <div className="relative h-40 overflow-hidden">
//                   {dayImages[dIndex] ? (
//                     <img
//                       src={dayImages[dIndex]}
//                       alt={`Day ${day.day}`}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-4xl">
//                       🗺️
//                     </div>
//                   )}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
//                   <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
//                     <div>
//                       <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
//                         Day {day.day}
//                       </span>
//                       <h3 className="text-white text-xl font-bold">
//                         {typeof day.activities?.[0] === "object"
//                           ? day.activities?.[0]?.name
//                           : day.activities?.[0] || "Explore"}
//                       </h3>
//                     </div>
//                     <button
//                       onClick={() => regenerateDay(day.day)}
//                       className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-emerald-500 text-white text-xs backdrop-blur transition-colors"
//                     >
//                       🔄 Regenerate
//                     </button>
//                   </div>
//                 </div>

//                 {/* Activities */}
//                 <div className="p-5 space-y-3">
//                   {day.activities.map((a, i) => (
//                     <div
//                       key={i}
//                       className="flex justify-between items-center p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-sm font-bold flex-shrink-0">
//                           {i + 1}
//                         </div>
//                         <div>
//                           <p className="font-medium text-sm">{getText(a)}</p>
//                           {getCost(a) > 0 && (
//                             <p className="text-xs text-gray-500">
//                               ₹{getCost(a)}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => removeActivity(dIndex, i)}
//                         className="text-gray-400 hover:text-red-500 transition-colors text-lg px-2"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   ))}

//                   <button
//                     onClick={() => addActivity(dIndex)}
//                     className="w-full py-2.5 rounded-xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 text-emerald-500 text-sm font-medium transition-colors hover:bg-emerald-500/5"
//                   >
//                     + Add Activity
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* HOTELS */}
//         {trip.itinerary.hotels?.length > 0 && (
//           <div>
//             <h2 className="text-2xl font-bold mb-6">🏨 Recommended Hotels</h2>
//             <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {trip.itinerary.hotels.map((h, i) => (
//                 <div
//                   key={i}
//                   className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-emerald-500/50 transition-colors"
//                 >
//                   <p className="font-semibold">
//                     🏨 {typeof h === "object" ? h.name : h}
//                   </p>
//                   {h.type && (
//                     <p className="text-sm text-gray-500 mt-1">{h.type}</p>
//                   )}
//                   {h.price && (
//                     <p className="text-sm text-emerald-500 mt-1">{h.price}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* BUDGET POPUP */}
//       {showBudget && budget && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
//           <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl w-full max-w-sm shadow-2xl">
//             <h2 className="text-xl font-bold mb-5">💰 Budget Breakdown</h2>
//             <div className="space-y-3">
//               {[
//                 { label: "✈️ Flights", val: budget.flights },
//                 { label: "🏨 Hotel", val: budget.hotel },
//                 { label: "🍜 Food", val: budget.food },
//                 { label: "🎯 Activities", val: budget.activities },
//               ].map((item) => (
//                 <div
//                   key={item.label}
//                   className="flex justify-between items-center py-2 border-b border-[var(--border)]"
//                 >
//                   <span className="text-gray-500">{item.label}</span>
//                   <span className="font-semibold">
//                     ₹{item.val.toLocaleString()}
//                   </span>
//                 </div>
//               ))}
//               <div className="flex justify-between items-center pt-2">
//                 <span className="font-bold text-lg">Total</span>
//                 <span className="font-bold text-xl text-emerald-500">
//                   ₹{budget.total.toLocaleString()}
//                 </span>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowBudget(false)}
//               className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// ===============================================================================================================

"use client";
import DestinationCarousel from "@/components/DestinationCarousel";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const [user, setUser] = useState(null);

  const loadData = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error loading user from localStorage:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const router = useRouter();
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {/* 🌍 BACKGROUND GLOBE */}
      <div
        className="
        fixed inset-0
        bg-[url('/globe2.jpg')]
        bg-cover bg-center bg-no-repeat bg-fixed
        opacity-10
        dark:opacity-20
        pointer-events-none
      "
      />

      {/* 🎨 THEME OVERLAY */}
      <div
        className="
        fixed inset-0
        bg-gradient-to-br
        from-transparent via-transparent to-transparent
        dark:from-green-900/40 dark:to-green-700/20
        pointer-events-none
      "
      />

      {/* CONTENT */}
      <div className="relative z-10">
        {/* HERO */}
        <section className="text-center px-6 py-24">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Plan Your Dream Trip with{" "}
            <span
              className="
            bg-gradient-to-r 
            from-blue-500 to-blue-700 
            dark:from-green-400 dark:to-emerald-500
            bg-clip-text text-transparent
            animate-pulse
            "
            >
              AI ✨
            </span>
          </h1>

          <p className="mt-6 max-w-xl mx-auto text-gray-600 dark:text-gray-300">
            Smart itinerary, budget planning, hotels, maps — everything in one
            place 🌍
          </p>

          {user ? (
            <a
              href="/my-trips"
              className="
            mt-10 inline-block px-10 py-4 rounded-xl font-semibold
             hover:bg-blue-600
            dark:bg-emerald-500 dark:hover:bg-emerald-600
            text-white
            shadow-lg hover:shadow-xl
            transition-all duration-300
            animate-bounce
            "
            >
              View My Trips 🚀
            </a>
          ) : (
            <a
              href="/login"
              className="
            mt-10 inline-block px-10 py-4 rounded-xl font-semibold
           -500 hover:bg-blue-600
            dark:bg-emerald-500 dark:hover:bg-emerald-600
            text-white
            shadow-lg hover:shadow-xl
            transition-all duration-300
            animate-bounce
            "
            >
              Start Planning 🚀
            </a>
          )}
        </section>

        {/* destination Carousel */}

        <section className="py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Explore Top Destinations 🌍
          </h2>

          <DestinationCarousel />
        </section>

        {/* FEATURES */}
        <section className="px-6 py-16 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "AI Generated Trips 🤖",
              desc: "Get day-wise itinerary instantly",
            },
            {
              title: "Smart Budget 💰",
              desc: "Budget-friendly hotels & plans",
            },
            {
              title: "Editable Plans ✏️",
              desc: "Modify & regenerate anytime",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="
  p-6 rounded-2xl shadow-lg
  bg-[var(--card)]
  border border-[var(--border)]
  hover:scale-105
  hover:shadow-blue-200
  dark:hover:shadow-green-500/20
  transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-blue-600 dark:text-emerald-400">
                {f.title}
              </h3>

              <p className="mt-2 text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </section>
        {/* Popular trips */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Destinations 🌍
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Goa", img: "/goa.png" },
              { name: "Manali", img: "/manali.jpg" },
              { name: "Paris", img: "/paris.jpg" },
            ].map((place, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden shadow-lg group"
              >
                <img
                  src={place.img}
                  className="w-full h-60 object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute bottom-0 w-full p-4 bg-black/50 text-white">
                  {place.name}
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* CTA */}
        <section className="text-center py-20 px-6">
          <h2 className="text-3xl font-bold">Ready to explore the world? 🌍</h2>

          {user ? (
            <a
              href="/dashboard"
              className="
            mt-10 inline-block px-10 py-4 rounded-xl font-semibold
            hover:bg-blue-600
            dark:bg-emerald-500 dark:hover:bg-emerald-600
            text-white
            shadow-lg hover:shadow-xl
            transition-all duration-300
            animate-bounce
            "
            >
              Generate Trip 🚀
            </a>
          ) : (
            <a
              href="/login"
              className="
            mt-10 inline-block px-10 py-4 rounded-xl font-semibold
            bg-emerald-500 hover:bg-emerald-600
            dark:bg-emerald-500 dark:hover:bg-emerald-600
            text-white
            shadow-lg hover:shadow-xl
            transition-all duration-300
            animate-bounce
            "
            >
              Generate Trip 🚀
            </a>
          )}
        </section>

        {/* FOOTER */}
        <footer
          className="
        mt-20 px-6 py-10 text-center
        border-t border-[var(--border)]
        text-gray-500 dark:text-gray-400
        "
        >
          <h3 className="text-lg font-semibold">AI Trip Planner ✈️</h3>

          <p className="mt-2">Built with ❤️ for travelers</p>

          <div className="flex justify-center gap-6 mt-4 text-sm">
            <a
              href="#"
              className="hover:text-blue-500 dark:hover:text-emerald-400"
            >
              About
            </a>
            <a
              href="#"
              className="hover:text-blue-500 dark:hover:text-emerald-400"
            >
              Contact
            </a>
            <a
              href="#"
              className="hover:text-blue-500 dark:hover:text-emerald-400"
            >
              Privacy
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
