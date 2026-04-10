import http from "http";
import { URL } from "url";
import { generateICS, windDirection } from "./ics.js";
import { fetchWeather } from "./weather.js";
import { geocode } from "./geocode.js";
import { UI_HTML } from "./ui.js";

const PORT = process.env.PORT || 3000;

async function resolveLocation(searchParams) {
  let lat = parseFloat(searchParams.get("lat"));
  let lon = parseFloat(searchParams.get("lon"));
  let locationName = searchParams.get("city") || null;

  if (isNaN(lat) || isNaN(lon)) {
    if (!locationName) throw new Error("Please provide ?city=CityName or ?lat=…&lon=…");
    const geo = await geocode(locationName);
    lat = geo.lat;
    lon = geo.lon;
    locationName = geo.name;
  } else if (!locationName) {
    locationName = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }

  return { lat, lon, locationName };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost`);

  // ── Home: interactive UI ──────────────────────────────────────────────────
  if (url.pathname === "/" || url.pathname === "") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(UI_HTML);
    return;
  }

  // ── /preview — JSON endpoint for the UI (3-day weather preview) ──────────
  if (url.pathname === "/preview") {
    const units = url.searchParams.get("units") === "imperial" ? "imperial" : "metric";
    const windUnit = units === "imperial" ? "mph" : "m/s";

    try {
      const { lat, lon, locationName } = await resolveLocation(url.searchParams);
      const weather = await fetchWeather(lat, lon, units, 3);

      const days = weather.time.map((date, i) => ({
        date,
        code: weather.weather_code[i],
        tMax: weather.temperature_2m_max[i],
        tMin: weather.temperature_2m_min[i],
        windMax: Math.round(weather.windspeed_10m_max[i]),
        windDir: windDirection(weather.winddirection_10m_dominant[i]),
        precip: weather.precipitation_sum[i],
        precipProb: weather.precipitation_probability_max[i],
      }));

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      });
      res.end(JSON.stringify({ location: locationName, days }));
    } catch (err) {
      res.writeHead(err.message.includes("not found") ? 404 : 500, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ── /cal — iCalendar feed ─────────────────────────────────────────────────
  if (url.pathname === "/cal") {
    const units = url.searchParams.get("units") === "imperial" ? "imperial" : "metric";
    const tempMode = url.searchParams.get("temp") === "day" ? "day" : "range";
    const days = Math.min(16, Math.max(1, parseInt(url.searchParams.get("days") || "14", 10)));

    try {
      const { lat, lon, locationName } = await resolveLocation(url.searchParams);
      const weather = await fetchWeather(lat, lon, units, days);
      const ics = generateICS(weather, locationName, units, tempMode);

      res.writeHead(200, {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `inline; filename="weather-${locationName.replace(/\s+/g, "_")}.ics"`,
        "Cache-Control": "public, max-age=3600",
      });
      res.end(ics);
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(`Error: ${err.message}`);
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Weather calendar server running on port ${PORT}`);
});
