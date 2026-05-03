// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import TripForm from "@/components/TripForm";

// export default function Dashboard() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       window.location.href = "/login";
//       return;
//     }

//     setLoading(false);
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
//       <div className="p-6 max-w-6xl mx-auto">
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="p-6 max-w-6xl mx-auto">
        <TripForm />
      </div>
    </div>
  );
}
