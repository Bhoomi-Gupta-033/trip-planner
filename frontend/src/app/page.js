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
    <div
      className="relative min-h-screen overflow-hidden transition-all duration-500
    bg-white text-black
    dark:bg-[#020617] dark:text-white"
    >
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
        from-blue-100/60 via-transparent to-blue-200/40
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
  bg-white dark:bg-[#0f172a]/70
  dark:backdrop-blur-md
  border border-gray-200 dark:border-gray-800
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
            bg-blue-500 hover:bg-blue-600
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
            bg-white hover:bg-white/90
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
        border-t border-gray-200 dark:border-gray-800
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
