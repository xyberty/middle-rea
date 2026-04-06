// Uses Open-Meteo's free geocoding API — no key required
export async function geocode(cityQuery) {
  const name = cityQuery.split(",")[0].trim();
  const countryCode = cityQuery.includes(",") ? cityQuery.split(",")[1].trim() : null;

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", name);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Geocoding request failed: ${res.status}`);

  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`City not found: ${cityQuery}`);
  }

  // If country code provided, try to match it
  let result = data.results[0];
  if (countryCode) {
    const match = data.results.find(
      (r) => r.country_code?.toLowerCase() === countryCode.toLowerCase()
    );
    if (match) result = match;
  }

  return {
    lat: result.latitude,
    lon: result.longitude,
    name: [result.name, result.admin1, result.country].filter(Boolean).join(", "),
  };
}
