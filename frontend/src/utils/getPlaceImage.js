const cache = {};

export async function getPlaceImage(query) {
  if (cache[query]) return cache[query];

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_KEY}`,
        },
      },
    );
    const data = await res.json();
    const url = data.results?.[0]?.urls?.regular || "/fallback.jpg";
    cache[query] = url;
    return url;
  } catch {
    return "/fallback.jpg";
  }
}
