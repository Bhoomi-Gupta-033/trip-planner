const axios = require("axios");

/**
 * Extract JSON safely from AI response
 */
function extractJSON(text) {
  try {
    if (!text) throw new Error("Empty AI response");

    const cleaned = text.replace(/```json|```/g, "").trim();

    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in response");

    return JSON.parse(match[0]);
  } catch (err) {
    throw new Error("JSON parsing failed: " + err.message);
  }
}

/**
 * Extract number from ₹ string
 */
function extractNumber(value) {
  if (!value) return 0;

  const numbers = value.toString().match(/\d+/g);
  return numbers ? parseInt(numbers.join("")) : 0;
}

/**
 * Generate itinerary
 */
async function generateItinerary({
  destination,
  days,
  budget,
  interests,
  language = "English",
}) {
  try {
    const prompt = `
    You are a professional travel planner.

    Create a ${days}-day itinerary for ${destination}.
     Language: ${language}

    STRICT RULES:
    - Respond ONLY in ${language}
    - Use REAL famous places only
    - No generic placeholders
    - Group nearby places together
    - Include food spots + hidden gems
    - Budget: ${budget}
    - Interests: ${interests?.join(", ") || "general"}
    - Every activity MUST include approximate cost in INR
    - Costs should be realistic
    - Return ONLY valid JSON
    - No markdown
    - No explanation

    FORMAT:
    {
      "days":[
        {
          "day":1,
          "activities":[
            {
              "name":"Activity name",
              "cost":"₹500"
            }
          ]
        }
      ],
      "budget":{
        "flights":"₹0",
        "hotel":"₹0",
        "food":"₹0",
        "activities":"₹0",
        "total":"₹0"
      },
      "hotels":[
        {"name":"", "type":"Budget"},
        {"name":"", "type":"Mid Range"},
        {"name":"", "type":"Luxury"}
      ]
    }
    `;

    // ==================================================================================================
    // Gemini API call
    // const response = await axios.post(
    //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    //   {
    //     contents: [
    //       {
    //         parts: [{ text: prompt }],
    //       },
    //     ],
    //     generationConfig: {
    //       temperature: 0.4,
    //       responseMimeType: "application/json",
    //     },
    //   },
    // );
    // ========================================================================================================

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a professional travel planner. Return ONLY valid JSON. No explanation.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    // ==========================================================================================================
    // const candidate = response.data?.candidates?.[0];
    // const raw = candidate?.content?.parts?.[0]?.text;

    // ====================================================================================================

    const raw = response.data?.choices?.[0]?.message?.content;
    console.log("AI RAW:", raw);

    if (!raw) {
      throw new Error("Empty response from AI");
    }

    const result = extractJSON(raw);

    /**
     * Calculate activity total
     */
    let totalActivitiesCost = 0;

    result.days?.forEach((day) => {
      day.activities?.forEach((activity) => {
        totalActivitiesCost += extractNumber(activity.cost);
      });
    });

    /**
     * Budget calculations
     */
    const flightCost = extractNumber(result.budget?.flights);
    const hotelCost = extractNumber(result.budget?.hotel);
    const foodCost = extractNumber(result.budget?.food);

    const totalTripCost =
      flightCost + hotelCost + foodCost + totalActivitiesCost;

    result.budget.activities = `₹${totalActivitiesCost}`;
    result.budget.total = `₹${totalTripCost}`;

    return result;
  } catch (err) {
    console.log("AI FAILED → fallback:");
    console.log(err.response?.data || err.message);

    /**
     * Fallback response
     */
    const fallbackActivitiesCost = days * 1800;

    return {
      days: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        activities: [
          {
            name: `Explore top attractions in ${destination}`,
            cost: "₹500",
          },
          {
            name: "Try local street food",
            cost: "₹300",
          },
          {
            name: "Visit hidden gems",
            cost: "₹400",
          },
          {
            name: "Relax and explore local markets",
            cost: "₹600",
          },
        ],
      })),
      budget: {
        flights: "₹3000",
        hotel: "₹4000",
        food: "₹2500",
        activities: `₹${fallbackActivitiesCost}`,
        total: `₹${3000 + 4000 + 2500 + fallbackActivitiesCost}`,
      },
      hotels: [
        { name: `${destination} Budget Stay`, type: "Budget" },
        { name: `${destination} Comfort Hotel`, type: "Mid Range" },
        { name: `${destination} Luxury Hotel`, type: "Luxury" },
      ],
    };
  }
}
// =============================================================================================================
/**
 * Estimate cost for user-added activity
 */
// async function estimateActivityCost(activity, destination) {
//   try {
//     const prompt = `
// Estimate average cost in INR for this activity.

// Activity: ${activity}
// Destination: ${destination}

// Return ONLY number.

// Example:
// 1500
// `;

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [{ text: prompt }],
//           },
//         ],
//         generationConfig: {
//           temperature: 0.2,
//         },
//       },
//     );

//     const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     const estimatedCost = extractNumber(raw);

//     return estimatedCost || 500;
//   } catch (err) {
//     console.log("Activity cost estimation failed:", err.message);
//     return 500;
//   }
// }
// =======================================================================================================
async function estimateActivityCost(activity, destination) {
  try {
    const prompt = `
Estimate average cost in INR for this activity.

Activity: ${activity}
Destination: ${destination}

Return ONLY a number (no text, no explanation).

Example:
1500
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a cost estimator. Return only a number in INR. No explanation.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const raw = response.data?.choices?.[0]?.message?.content;

    const estimatedCost = extractNumber(raw);

    return estimatedCost || 500;
  } catch (err) {
    console.log("Activity cost estimation failed:", err.message);
    return 500;
  }
}

// ========================================================================================================
// // regenerate day with AI
// async function regenerateDayAI({
//   destination,
//   dayNumber,
//   interests,
//   budget,
//   existingActivities = [],
// }) {
//   try {
//     const prompt = `
// You are a travel planner.

// Regenerate ONLY Day ${dayNumber} for ${destination}.

// IMPORTANT RULES:
// - Do NOT repeat these activities:
// ${existingActivities.map((a) => `- ${a.name}`).join("\n")}

// - Give COMPLETELY NEW places
// - Include cost in INR
// - Budget: ${budget}
// - Interests: ${interests?.join(", ") || "general"}

// Return ONLY JSON:
// {
//   "day": ${dayNumber},
//   "activities": [
//     {
//       "name": "Place name",
//       "cost": "₹500"
//     }
//   ]
// }
// `;

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [{ parts: [{ text: prompt }] }],
//         generationConfig: {
//           temperature: 0.9, // 🔥 random output
//         },
//       },
//     );

//     const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     const result = extractJSON(raw);

//     return result;
//   } catch (err) {
//     console.log("Regenerate failed:", err.message);

//     // 🔥 Better fallback
//     return {
//       day: dayNumber,
//       activities: [
//         { name: "Explore hidden gems", cost: "₹400" },
//         { name: "Try local street food", cost: "₹300" },
//         { name: "Visit scenic viewpoint", cost: "₹500" },
//         { name: "Relax at popular spot", cost: "₹200" },
//       ],
//     };
//   }
// }

// module.exports = {
//   generateItinerary,
//   estimateActivityCost,
//   regenerateDayAI,
// };

// =============================================================================================================

async function regenerateDayAI({
  destination,
  dayNumber,
  interests,
  budget,
  existingActivities = [],
}) {
  try {
    const prompt = `
You are a travel planner.

Regenerate ONLY Day ${dayNumber} for ${destination}.

IMPORTANT RULES:
- Do NOT repeat these activities:
${existingActivities.map((a) => `- ${a.name}`).join("\n")}

- Give COMPLETELY NEW places
- Include cost in INR
- Budget: ${budget}
- Interests: ${interests?.join(", ") || "general"}

Return ONLY valid JSON:

{
  "day": ${dayNumber},
  "activities": [
    {
      "name": "Place name",
      "cost": "₹500"
    }
  ]
}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a professional travel planner. Return ONLY valid JSON. No explanation.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const raw = response.data?.choices?.[0]?.message?.content;

    const result = extractJSON(raw);

    return result;
  } catch (err) {
    console.log("Regenerate failed:", err.message);

    // 🔥 fallback (safe structure)
    return {
      day: dayNumber,
      activities: [
        { name: "Explore hidden gems", cost: "₹400" },
        { name: "Try local street food", cost: "₹300" },
        { name: "Visit scenic viewpoint", cost: "₹500" },
        { name: "Relax at popular spot", cost: "₹200" },
      ],
    };
  }
}

module.exports = {
  generateItinerary,
  estimateActivityCost,
  regenerateDayAI,
};
