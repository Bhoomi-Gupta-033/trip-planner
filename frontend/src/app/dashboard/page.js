// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import TripForm from "@/components/TripForm";
// import toast from "react-hot-toast";

// export default function Dashboard() {
//   const [loading, setLoading] = useState(true);
//   const [trips, setTrips] = useState([]);

//   // ⭐ Save state per trip
//   const [saved, setSaved] = useState({});

//   // 🔐 Protect route + fetch trips
//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       window.location.href = "/login";
//       return;
//     }

//     const fetchTrips = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/trip", {
//           headers: { Authorization: token },
//         });

//         setTrips(res.data);
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       }
//     };

//     fetchTrips();
//   }, []);

//   // ⭐ TOGGLE SAVE
//   const toggleSave = async (tripId) => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.post(
//         `http://localhost:5000/api/trip/save/${tripId}`,
//         {},
//         { headers: { Authorization: token } },
//       );

//       // toggle UI state
//       setSaved((prev) => ({
//         ...prev,
//         [tripId]: !prev[tripId],
//       }));

//       toast.success(res.data.msg);
//     } catch {
//       toast.error("Error ❌");
//     }
//   };

//   return (
//     <div>
//       <div className="p-6 max-w-6xl mx-auto">
//         {/* Trip Form */}
//         <TripForm />
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TripForm from "@/components/TripForm";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <div className="p-6 max-w-6xl mx-auto">
        <TripForm />
      </div>
    </div>
  );
}
