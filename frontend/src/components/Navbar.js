// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";

// export default function Navbar() {
//   const router = useRouter();

//   const [user, setUser] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [theme, setTheme] = useState("light");

//   // ✅ SINGLE SOURCE OF TRUTH
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") || "light";

//     setTheme(savedTheme);

//     if (savedTheme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }

//     const storedUser = localStorage.getItem("user");
//     if (storedUser && storedUser !== "undefined") {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // 🌗 TOGGLE
//   const toggleTheme = () => {
//     const isDark = document.documentElement.classList.contains("dark");

//     if (isDark) {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//       setTheme("light");
//     } else {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//       setTheme("dark");
//     }
//   };

//   // 🚪 LOGOUT
//   const logout = () => {
//     localStorage.clear();
//     toast.success("Logged out 👋");
//     router.push("/");
//   };

//   // ❌ CLOSE DROPDOWN ON CLICK OUTSIDE
//   useEffect(() => {
//     const close = () => setOpen(false);
//     window.addEventListener("click", close);
//     return () => window.removeEventListener("click", close);
//   }, []);

//   return (
//     <div className="w-full px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-lg bg-[var(--bg)] border-b border-[var(--border)]">
//       {/* LOGO */}
//       <h1
//         onClick={() => router.push("/")}
//         className="text-xl font-bold cursor-pointer text-[var(--text)]"
//       >
//         ✈️ AI Trip Planner
//       </h1>

//       {/* RIGHT */}
//       <div className="flex items-center gap-4">
//         {/* THEME */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             toggleTheme();
//           }}
//           className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800"
//         >
//           {theme === "dark" ? "☀️" : "🌙"}
//         </button>

//         {/* USER */}
//         {user ? (
//           <div className="relative">
//             <div
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setOpen(!open);
//               }}
//               className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 cursor-pointer"
//             >
//               <div className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-emerald-500 text-white">
//                 {user.name?.charAt(0).toUpperCase()}
//               </div>
//               <span>{user.name}</span>
//             </div>

//             {open && (
//               <div
//                 onClick={(e) => e.stopPropagation()}
//                 className="absolute right-0 mt-3 w-52 rounded-xl shadow-xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700"
//               >
//                 <button
//                   onClick={() => router.push("/dashboard")}
//                   className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
//                 >
//                   ✨ Generate Trip
//                 </button>

//                 <button
//                   onClick={() => router.push("/my-trips")}
//                   className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
//                 >
//                   🧳 My Trips
//                 </button>

//                 <button
//                   onClick={() => router.push("/profile")}
//                   className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
//                 >
//                   📄 Profile
//                 </button>
//                 <button
//                   onClick={() => router.push("/")}
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
//                 >
//                   🏠 Home
//                 </button>
//                 <button
//                   onClick={logout}
//                   className="block w-full px-4 py-2 text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
//                 >
//                   🚪 Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="flex gap-3">
//             <button
//               onClick={() => router.push("/login")}
//               className="text-center text-sm text-gray-500 dark:text-gray-400"
//             >
//               Login
//             </button>

//             <button
//               onClick={() => router.push("/register")}
//               className="text-center text-sm text-gray-500 dark:text-gray-400"
//             >
//               Register
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  // DOM se seedha read karo — layout.js script already set kar chuka hai class
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🌗 TOGGLE
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear();
    toast.success("Logged out 👋");
    router.push("/");
  };

  // ❌ CLOSE DROPDOWN ON CLICK OUTSIDE
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div className="w-full px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-lg bg-[var(--bg)] border-b border-[var(--border)]">
      {/* LOGO */}
      <h1
        onClick={() => router.push("/")}
        className="text-xl font-bold cursor-pointer text-[var(--text)]"
      >
        ✈️ AI Trip Planner
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* THEME */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTheme();
          }}
          className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* USER */}
        {user ? (
          <div className="relative">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 cursor-pointer"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-emerald-500 text-white">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span>{user.name}</span>
            </div>

            {open && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-3 w-52 rounded-xl shadow-xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700"
              >
                <button
                  onClick={() => router.push("/dashboard")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  ✨ Generate Trip
                </button>

                <button
                  onClick={() => router.push("/my-trips")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  🧳 My Trips
                </button>

                <button
                  onClick={() => router.push("/profile")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  📄 Profile
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  🏠 Home
                </button>
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/login")}
              className="text-center text-sm text-gray-500 dark:text-gray-400"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/register")}
              className="text-center text-sm text-gray-500 dark:text-gray-400"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
