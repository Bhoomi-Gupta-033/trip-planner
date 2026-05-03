"use client";

import { useEffect, useState } from "react";

const destinations = [
  {
    name: "Goa",
    img: "/goa.png",
  },
  {
    name: "Manali",
    img: "/manali.jpg",
  },
  {
    name: "Paris",
    img: "/paris.jpg",
  },
  {
    name: "Bali",
    img: "/bali.jpg",
  },
];

export default function DestinationCarousel() {
  const [index, setIndex] = useState(0);

  // 🔄 Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % destinations.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-xl">
      {/* IMAGE */}
      <div className="relative h-72 md:h-96">
        <img
          src={destinations[index].img}
          className="w-full h-full object-cover transition-all duration-700 ease-in-out hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text */}
        <h2 className="absolute bottom-6 left-6 text-2xl md:text-4xl font-bold text-white">
          {destinations[index].name}
        </h2>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-4">
        {destinations.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index ? "bg-emerald-500 w-6" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
