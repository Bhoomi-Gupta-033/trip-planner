// "use client";

// import { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// export default function Register() {
//   const [data, setData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});

//   // ✅ VALIDATION
//   const validate = () => {
//     let err = {};

//     if (!data.name || data.name.length < 5) {
//       err.name = "Name should be at least 5 characters";
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(data.email)) {
//       err.email = "Enter valid email (example@gmail.com)";
//     }

//     if (!data.password || data.password.length < 6) {
//       err.password = "Password must be at least 6 characters";
//     }

//     if (!/(?=.*[A-Z])(?=.*[0-9])/.test(data.password)) {
//       err.password = "Must contain 1 uppercase & 1 number";
//     }

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   // ✅ SUBMIT
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate()) return;

//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
//         data,
//       );

//       toast.success("Registered successfully 🎉");

//       setTimeout(() => {
//         window.location.href = "/login";
//       }, 1000);
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Something went wrong ❌");
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center px-4
//      bg-[var(--bg)] text-[var(--text)] -white transition-all duration-500"
//     >
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md p-8 rounded-2xl shadow-xl
//        bg-[var(--bg)] text-[var(--text)]
//         backdrop-blur space-y-5 transition"
//       >
//         <h2 className="text-2xl font-bold text-center">Create Account ✨</h2>

//         {/* NAME */}
//         <div>
//           <input
//             type="text"
//             placeholder="Full Name"
//             className="w-full p-3 rounded-lg border
//             bg-transparent outline-none
//             focus:ring-2 focus:ring-blue-400
//             dark:focus:ring-green-400"
//             onChange={(e) => setData({ ...data, name: e.target.value })}
//           />
//           {errors.name && (
//             <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//           )}
//         </div>

//         {/* EMAIL */}
//         <div>
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full p-3 rounded-lg border
//             bg-transparent outline-none
//             focus:ring-2 focus:ring-blue-400
//             dark:focus:ring-green-400"
//             onChange={(e) => setData({ ...data, email: e.target.value })}
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//           )}
//         </div>

//         {/* PASSWORD */}
//         <div>
//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full p-3 rounded-lg border
//             bg-transparent outline-none
//             focus:ring-2 focus:ring-blue-400
//             dark:focus:ring-green-400"
//             onChange={(e) => setData({ ...data, password: e.target.value })}
//           />
//           {errors.password && (
//             <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//           )}
//         </div>

//         {/* BUTTON */}
//         <button
//           type="submit"
//           className="
//           w-full py-3 rounded-lg font-semibold
//          bg-[var(--bg)] text-[var(--text)]
//           dark:bg-green-500 dark:hover:bg-green-600
//           transition-all duration-300 shadow-lg hover:scale-105"
//         >
//           Register 🚀
//         </button>

//         {/* LOGIN LINK */}
//         <p className="text-center text-sm text-gray-500 dark:text-gray-400">
//           Already have an account?{" "}
//           <a
//             href="/login"
//             className="text-blue-500 dark:text-green-400 font-semibold"
//           >
//             Login
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ VALIDATION
  const validate = () => {
    let err = {};

    if (!data.name || data.name.length < 5) {
      err.name = "Name should be at least 5 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      err.email = "Enter valid email (example@gmail.com)";
    }

    if (!data.password || data.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    if (!/(?=.*[A-Z])(?=.*[0-9])/.test(data.password)) {
      err.password = "Must contain 1 uppercase & 1 number";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        data,
      );

      toast.success("Registered successfully 🎉");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)] text-[var(--text)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl
       bg-[var(--bg)] text-[var(--text)] 
        backdrop-blur space-y-5 transition"
      >
        <h2 className="text-2xl font-bold text-center">Create Account ✨</h2>

        {/* NAME */}
        <div>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg border
            bg-transparent outline-none
            focus:ring-2 focus:ring-blue-400
            dark:focus:ring-green-400"
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border
            bg-transparent outline-none
            focus:ring-2 focus:ring-blue-400
            dark:focus:ring-green-400"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border
            bg-transparent outline-none
            focus:ring-2 focus:ring-blue-400
            dark:focus:ring-green-400"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="
          w-full py-3 rounded-lg font-semibold
         bg-[var(--bg)] text-[var(--text)] 
          dark:bg-green-500 dark:hover:bg-green-600
          transition-all duration-300 shadow-lg hover:scale-105"
        >
          Register 🚀
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-500 dark:text-green-400 font-semibold"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
