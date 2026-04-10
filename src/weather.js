// WMO Weather interpretation codes → emoji + description
const WMO_CODES = {
  0:  { emoji: "☀️",  label: "Clear sky" },
  1:  { emoji: "🌤",  label: "Mainly clear" },
  2:  { emoji: "⛅",  label: "Partly cloudy" },
  3:  { emoji: "☁️",  label: "Overcast" },
  45: { emoji: "🌫",  label: "Fog" },
  48: { emoji: "🌫",  label: "Icy fog" },
  51: { emoji: "🌦",  label: "Light drizzle" },
  53: { emoji: "🌦",  label: "Drizzle" },
  55: { emoji: "🌧",  label: "Heavy drizzle" },
  56: { emoji: "🌧",  label: "Freezing drizzle" },
  57: { emoji: "🌧",  label: "Heavy freezing drizzle" },
  61: { emoji: "🌧",  label: "Slight rain" },
  63: { emoji: "🌧",  label: "Rain" },
  65: { emoji: "🌧",  label: "Heavy rain" },
  66: { emoji: "🌨",  label: "Freezing rain" },
  67: { emoji: "🌨",  label: "Heavy freezing rain" },
  71: { emoji: "🌨",  label: "Slight snow" },
  73: { emoji: "❄️",  label: "Snow" },
  75: { emoji: "❄️",  label: "Heavy snow" },
  77: { emoji: "❄️",  label: "Snow grains" },
  80: { emoji: "🌦",  label: "Slight showers" },
  81: { emoji: "🌧",  label: "Showers" },
  82: { emoji: "🌧",  label: "Heavy showers" },
  85: { emoji: "🌨",  label: "Snow showers" },
  86: { emoji: "🌨",  label: "Heavy snow showers" },
  95: { emoji: "⛈",  label: "Thunderstorm" },
  96: { emoji: "⛈",  label: "Thunderstorm with hail" },
  99: { emoji: "⛈",  label: "Thunderstorm with heavy hail" },
};

export function wmoCode(code) {
  return WMO_CODES[code] ?? { emoji: "🌡", label: `Code ${code}` };
}

export async function fetchWeather(lat, lon, units, days) {
  const tempUnit = units === "imperial" ? "fahrenheit" : "celsius";
  const windUnit = units === "imperial" ? "mph" : "ms";

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("daily", [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_sum",
    "precipitation_probability_max",
    "windspeed_10m_max",
    "windgusts_10m_max",
    "winddirection_10m_dominant",
    "sunrise",
    "sunset",
  ].join(","));
  url.searchParams.set("temperature_unit", tempUnit);
  url.searchParams.set("wind_speed_unit", windUnit);
  url.searchParams.set("precipitation_unit", units === "imperial" ? "inch" : "mm");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", days);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Weather API request failed: ${res.status}`);

  const data = await res.json();
  return { ...data.daily, units: data.daily_units, timezone: data.timezone };
}
