# ⛅ weather-ical

Self-hosted weather calendar feed — adds a 14-day weather forecast to any
calendar app that supports iCalendar (`.ics`) subscriptions.

**No API key. No external accounts. Zero npm dependencies.**  
Weather data from [Open-Meteo](https://open-meteo.com) (free, open-source, CC BY 4.0).

---

## Quick start (local)

```bash
node src/server.js
# → http://localhost:3000
```

Then subscribe your calendar app to:
```
http://localhost:3000/cal?city=London&units=metric
```

---

## Deploy on CapRover

### Option A — tar upload (fastest)

1. Zip the project (everything in this folder):
   ```bash
   tar -czf weather-ical.tar.gz --exclude='.git' .
   ```
2. In CapRover: **Apps → Create New App** → name it e.g. `weather-ical`
3. Enable **HTTPS** and optionally a custom domain
4. Go to **Deployment** tab → **Deploy via Uploaded Tar File**
5. Upload `weather-ical.tar.gz` → Deploy

### Option B — GitHub deploy

1. Push this repo to GitHub
2. In CapRover: **Deployment** tab → connect your repo
3. Enable auto-deploy on push (optional)

### Option C — caprover CLI

```bash
npm install -g caprover
caprover deploy
```

---

## URL parameters

| Parameter | Values | Default |
|-----------|--------|---------|
| `city` | City name, optionally `City,CountryCode` | *required* |
| `lat` / `lon` | Decimal coordinates (alternative to city) | — |
| `units` | `metric` · `imperial` | `metric` |
| `temp` | `day` (average) · `range` (min–max) | `range` |
| `days` | 1–16 | `14` |

### Examples

```
/cal?city=Paris,FR&units=metric
/cal?city=New+York,US&units=imperial&temp=day
/cal?lat=51.5074&lon=-0.1278
```

### Subscribe URL format

Most calendar apps accept `webcal://` links directly:
```
webcal://your-caprover-domain.example.com/cal?city=Berlin,DE
```

---

## Calendar app compatibility

Works with any iCalendar-compliant app:

- **macOS/iOS Calendar** — File → New Calendar Subscription
- **Google Calendar** — Other calendars → From URL  
  *(note: Google refreshes only every 12–24h regardless of TTL)*
- **Thunderbird / Lightning** — New Calendar → On the Network
- **Nextcloud Calendar** — New subscription
- **Any CalDAV client** supporting webcal:// subscriptions

---

## CapRover environment variables

None required. Optionally set:

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `3000` | Internal HTTP port |

---

## Credits

- Weather data: [Open-Meteo](https://open-meteo.com) (CC BY 4.0)
- Inspired by [weather-in-your-calendar](https://github.com/vejnoe/weather-in-your-calendar)
