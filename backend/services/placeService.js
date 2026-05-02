const axios = require("axios");

/**
 * Get Wikipedia summary + image (FREE API)
 */
async function getPlaceInfo(placeName) {
  try {
    // 1. Wikipedia Summary
    const wikiRes = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        placeName,
      )}`,
    );

    const data = wikiRes.data;

    return {
      name: data.title,
      description: data.extract,
      image:
        data.thumbnail?.source ||
        `https://source.unsplash.com/600x400/?${encodeURIComponent(placeName)}`,
      url: data.content_urls?.desktop?.page,
    };
  } catch (err) {
    console.log("Wiki fallback used:", placeName);

    return {
      name: placeName,
      description: "Explore this beautiful destination.",
      image: `https://source.unsplash.com/600x400/?${encodeURIComponent(
        placeName,
      )}`,
      url: `https://www.google.com/search?q=${encodeURIComponent(placeName)}`,
    };
  }
}

module.exports = { getPlaceInfo };
