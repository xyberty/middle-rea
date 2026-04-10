import { wmoCode } from "./weather.js";
import { randomUUID } from "crypto";

function icsEscape(str) {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

// Fold long lines per RFC 5545 (max 75 octets per line)
function foldLine(line) {
  const bytes = Buffer.from(line, "utf-8");
  if (bytes.length <= 75) return line;
  const parts = [];
  let offset = 0;
  // First chunk: 75 bytes
  while (offset < bytes.length) {
    const chunk = offset === 0 ? 75 : 74;
    parts.push(bytes.slice(offset, offset + chunk).toString("utf-8"));
    offset += chunk;
  }
  return parts.join("\r\n ");
}

export function windDirection(deg) {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export function generateICS(weather, locationName, units, tempMode) {
  const tempUnit = units === "imperial" ? "°F" : "°C";
  const windUnit = units === "imperial" ? "mph" : "m/s";
  const precipUnit = units === "imperial" ? "in" : "mm";
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const events = weather.time.map((dateStr, i) => {
    const wmo = wmoCode(weather.weather_code[i]);
    const tMax = Math.round(weather.temperature_2m_max[i]);
    const tMin = Math.round(weather.temperature_2m_min[i]);
    const tDay = Math.round((tMax + tMin) / 2);
    const precip = weather.precipitation_sum[i];
    const precipProb = weather.precipitation_probability_max[i];
    const windMax = Math.round(weather.windspeed_10m_max[i]);
    const windGust = Math.round(weather.windgusts_10m_max[i]);
    const windDir = windDirection(weather.winddirection_10m_dominant[i]);
    const sunrise = weather.sunrise[i]?.split("T")[1]?.slice(0, 5);
    const sunset = weather.sunset[i]?.split("T")[1]?.slice(0, 5);

    // All-day event date format: YYYYMMDD
    const dateCompact = dateStr.replace(/-/g, "");
    const nextDay = new Date(dateStr);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayCompact = nextDay.toISOString().slice(0, 10).replace(/-/g, "");

    const tempDisplay =
      tempMode === "day"
        ? `${tDay}${tempUnit}`
        : `${tMin}..${tMax}${tempUnit}`;

    const summary = `${tempDisplay} ${wmo.emoji} ${wmo.label}`;

    const descLines = [
      `🌡 Temperature: ${tMin} .. ${tMax}${tempUnit}`,
      `${wmo.emoji} Condition: ${wmo.label}`,
      precip > 0
        ? `💧 Precipitation: ${precip} ${precipUnit} (${precipProb}% chance)`
        : `☀️ No significant precipitation`,
      `💨 Wind: ${windDir} ${windMax} ${windUnit}${windGust > windMax ? ` (gusts ${windGust})` : ""}`,
      sunrise && sunset ? `🌅 Sunrise: ${sunrise}  🌇 Sunset: ${sunset}` : "",
      // `📍 ${locationName}`,
    ].filter(Boolean).join("\n");

    const uid = `weather-${dateStr}-${locationName.replace(/[^a-z0-9]/gi, "")}-${randomUUID().slice(0, 8)}@weather-cal`;

    return [
      "BEGIN:VEVENT",
      foldLine(`DTSTART;VALUE=DATE:${dateCompact}`),
      foldLine(`DTEND;VALUE=DATE:${nextDayCompact}`),
      foldLine(`DTSTAMP:${now}`),
      foldLine(`UID:${uid}`),
      foldLine(`SUMMARY:${icsEscape(summary)}`),
      foldLine(`DESCRIPTION:${icsEscape(descLines)}`),
      foldLine(`LOCATION:${icsEscape(locationName)}`),
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    ].join("\r\n");
  });

  const calName = `Weather – ${locationName}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//weather-ical//self-hosted//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    foldLine(`X-WR-CALNAME:${icsEscape(calName)}`),
    "X-WR-CALDESC:Daily weather forecast via Open-Meteo",
    "REFRESH-INTERVAL;VALUE=DURATION:PT6H",
    "X-PUBLISHED-TTL:PT6H",
    ...events,
    "END:VCALENDAR",
  ];

  return lines.join("\r\n") + "\r\n";
}
