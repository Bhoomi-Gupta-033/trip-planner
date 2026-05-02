"use client";

export default function Itinerary({ data }) {
  if (!data || !data.days) {
    return (
      <p className="text-center text-gray-300 mt-6">Loading itinerary...</p>
    );
  }

  return (
    <div className="mt-10 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Your Trip Plan ✨
        </h2>

        <p className="text-gray-400">
          Personalized AI itinerary with estimated costs
        </p>
      </div>

      {/* Days */}
      {data.days.map((day) => (
        <div
          key={day.day}
          className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-purple-300 mb-5">
            Day {day.day}
          </h3>

          <div className="space-y-3">
            {day.activities?.map((act, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <span className="text-gray-100">
                  {typeof act === "object" ? act.name : act}
                </span>

                {typeof act === "object" && (
                  <span className="text-green-400 font-semibold">
                    {act.cost}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Budget */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-700 rounded-3xl p-6">
        <h3 className="text-2xl font-bold text-white mb-5">
          Budget Summary 💰
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-white">
            Flights: {data?.budget?.flights}
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-white">
            Hotel: {data?.budget?.hotel}
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-white">
            Food: {data?.budget?.food}
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-white">
            Activities: {data?.budget?.activities}
          </div>
        </div>

        <div className="mt-6 bg-black/20 rounded-2xl p-5 text-center">
          <p className="text-gray-200">Total Estimated Cost</p>

          <h2 className="text-4xl font-bold text-yellow-300">
            {data?.budget?.total}
          </h2>
        </div>
      </div>

      {/* Hotels */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
        <h3 className="text-2xl font-bold text-white mb-5">
          Recommended Hotels 🏨
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          {data.hotels?.map((hotel, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <h4 className="text-white font-semibold">{hotel.name}</h4>

              <p className="text-purple-300 mt-2">{hotel.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
