# LiveWeatherTracker

A self-contained weather app. No backend, no API key, no build step — it calls Open-Meteo's free geocoding and forecast APIs directly from the browser.

## 🌐 Live Demo

Check out the live application here: [Live Weather Tracker](https://weather-tracker-blond-ten.vercel.app/)

## Structure

```
liveweathertracker/
├── index.html   # page structure
├── style.css    # styling (design tokens at the top of the file)
└── script.js    # geocoding, forecast fetching, and rendering
```

## Running it

Easiest: open `index.html` directly in your browser.

For live-reload while editing in VS Code: install the **Live Server** extension, right-click `index.html`, and choose "Open with Live Server".

## Notes

- Defaults to Delhi on load; use the search bar to look up any other city.
- Data comes from [Open-Meteo](https://open-meteo.com/) — no API key required, no rate-limit issues for personal use.
