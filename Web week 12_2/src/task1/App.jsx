import { useState, useEffect } from 'react';
import Nav from '../shared/Nav.jsx';
import { useDebouncedValue } from '../shared/useDebouncedValue.js';

/* ---------- helpers ---------- */

// WMO weather codes -> description + emoji (Open-Meteo docs)
const WMO = {
  0: ['Clear sky', '☀️'], 1: ['Mainly clear', '🌤️'], 2: ['Partly cloudy', '⛅'], 3: ['Overcast', '☁️'],
  45: ['Fog', '🌫️'], 48: ['Rime fog', '🌫️'],
  51: ['Light drizzle', '🌦️'], 53: ['Drizzle', '🌦️'], 55: ['Heavy drizzle', '🌦️'],
  56: ['Freezing drizzle', '🌧️'], 57: ['Freezing drizzle', '🌧️'],
  61: ['Light rain', '🌧️'], 63: ['Rain', '🌧️'], 65: ['Heavy rain', '🌧️'],
  66: ['Freezing rain', '🌧️'], 67: ['Freezing rain', '🌧️'],
  71: ['Light snow', '🌨️'], 73: ['Snow', '🌨️'], 75: ['Heavy snow', '❄️'], 77: ['Snow grains', '❄️'],
  80: ['Rain showers', '🌦️'], 81: ['Rain showers', '🌧️'], 82: ['Violent showers', '⛈️'],
  85: ['Snow showers', '🌨️'], 86: ['Heavy snow showers', '❄️'],
  95: ['Thunderstorm', '⛈️'], 96: ['Thunderstorm + hail', '⛈️'], 99: ['Thunderstorm + hail', '⛈️'],
};
const describe = (code) => WMO[code] ?? ['Unknown', '❔'];

/** fetch JSON with friendly errors: network down, bad coords (400), rate limit (429) */
async function getJSON(url, signal) {
  let res;
  try {
    res = await fetch(url, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err; // let the caller ignore cancelled requests
    throw new Error('Network error. Check your internet connection and try again.');
  }
  if (!res.ok) {
    if (res.status === 429) throw new Error('Rate limit reached. Please wait a minute and try again.');
    let reason = '';
    try { reason = (await res.json()).reason; } catch { /* body was not JSON */ }
    throw new Error(reason || `Request failed (HTTP ${res.status}).`);
  }
  return res.json();
}

const SEOUL = { name: 'Seoul', country: 'South Korea', lat: 37.5665, lon: 126.978 };
const dayName = (iso, i) =>
  i === 0 ? 'Today' : new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });

/* ---------- component ---------- */

export default function App() {
  const [mode, setMode] = useState('city'); // 'city' | 'coords'
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [geoState, setGeoState] = useState('idle'); // idle | loading | done | error
  const [coordsInput, setCoordsInput] = useState({ lat: '37.5665', lon: '126.978' });
  const [place, setPlace] = useState(SEOUL);
  const [unit, setUnit] = useState(() => localStorage.getItem('wx-unit') || 'celsius');

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locMsg, setLocMsg] = useState(null);

  const debouncedQuery = useDebouncedValue(query.trim(), 400);

  /* Effect 1 — city-name geocoding (debounced + abortable) */
  useEffect(() => {
    if (mode !== 'city' || debouncedQuery.length < 2) {
      setSuggestions([]);
      setGeoState('idle');
      return;
    }
    const controller = new AbortController();
    setGeoState('loading');
    getJSON(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(debouncedQuery)}&count=6&language=en&format=json`,
      controller.signal,
    )
      .then((data) => {
        setSuggestions(data.results ?? []);
        setGeoState('done');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setSuggestions([]);
        setGeoState('error');
        setError(err.message);
      });
    return () => controller.abort();
  }, [debouncedQuery, mode]);

  /* Effect 2 — fetch the forecast whenever the coordinates (or unit) change */
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      latitude: place.lat,
      longitude: place.lon,
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'auto',
      forecast_days: '6',
      temperature_unit: unit,
      wind_speed_unit: unit === 'celsius' ? 'kmh' : 'mph',
    });

    getJSON(`https://api.open-meteo.com/v1/forecast?${params}`, controller.signal)
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return; // cancelled: a newer request is on its way
        setWeather(null); // never show old data under a new place name
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [place.lat, place.lon, unit]);

  /* Effect 3 — sync the browser tab title (restore on unmount) */
  useEffect(() => {
    if (weather) {
      document.title = `${Math.round(weather.current.temperature_2m)}° ${place.name} | Weather`;
    }
    return () => { document.title = 'Task 1 · Weather Dashboard'; };
  }, [weather, place.name]);

  /* Effect 4 — persist unit preference */
  useEffect(() => {
    localStorage.setItem('wx-unit', unit);
  }, [unit]);

  /* ---------- event handlers (NOT effects: they respond to user actions) ---------- */

  function pickCity(r) {
    setPlace({ name: r.name, country: r.country ?? r.admin1 ?? '', lat: r.latitude, lon: r.longitude });
    setQuery('');
    setSuggestions([]);
    setError(null);
    setLocMsg(null);
  }

  function applyCoords(e) {
    e.preventDefault();
    const lat = Number(coordsInput.lat);
    const lon = Number(coordsInput.lon);
    if (coordsInput.lat === '' || coordsInput.lon === '' || Number.isNaN(lat) || Number.isNaN(lon)) {
      setError('Please enter numeric latitude and longitude.');
      return;
    }
    // out-of-range values (e.g. lat 120) are intentionally sent to the API so you can see its error
    setPlace({ name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`, country: 'Custom coordinates', lat, lon });
    setLocMsg(null);
  }

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setLocMsg('Geolocation is not supported by this browser.');
      return;
    }
    setLocMsg('Locating you…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPlace({ name: 'My location', country: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`, lat: latitude, lon: longitude });
        setLocMsg(null);
      },
      (err) => setLocMsg(err.code === 1 ? 'Location permission denied.' : 'Could not detect your location.'),
      { timeout: 10000 },
    );
  }

  const cur = weather?.current;
  const [desc, icon] = cur ? describe(cur.weather_code) : ['', ''];
  const u = unit === 'celsius' ? { t: '°C', w: 'km/h' } : { t: '°F', w: 'mph' };

  return (
    <>
      <Nav current={1} />
      <main className="container">
        <div className="page-head">
          <div className="eyebrow">Task 1 · Homework</div>
          <h1>Weather Dashboard</h1>
          <p>
            Live data from the free <strong>Open-Meteo</strong> API (no key needed). Search by city or
            coordinates; the forecast is fetched inside <code>useEffect</code> with loading, error handling and
            an <code>AbortController</code> cleanup.
          </p>
        </div>

        {/* ----- search panel ----- */}
        <section className="card wx-search">
          <div className="row">
            <div className="tabs" role="tablist">
              <button className={`tab ${mode === 'city' ? 'active' : ''}`} onClick={() => setMode('city')}>City name</button>
              <button className={`tab ${mode === 'coords' ? 'active' : ''}`} onClick={() => setMode('coords')}>Coordinates</button>
            </div>
            <span className="spacer" />
            <div className="tabs" aria-label="Units">
              <button className={`tab ${unit === 'celsius' ? 'active' : ''}`} onClick={() => setUnit('celsius')}>°C</button>
              <button className={`tab ${unit === 'fahrenheit' ? 'active' : ''}`} onClick={() => setUnit('fahrenheit')}>°F</button>
            </div>
          </div>

          {mode === 'city' ? (
            <div className="wx-city">
              <div className="row">
                <input
                  className="input"
                  style={{ flex: 1, minWidth: 200 }}
                  placeholder="Search a city… e.g. Seoul, Tashkent, Paris"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="City name"
                />
                <button className="btn" onClick={useMyLocation} title="Bonus: navigator.geolocation">📍 Use my location</button>
              </div>
              {geoState === 'loading' && <p className="muted mt"><span className="spinner" /> Searching cities…</p>}
              {geoState === 'done' && suggestions.length === 0 && <p className="muted mt">No city found for “{debouncedQuery}”.</p>}
              {suggestions.length > 0 && (
                <ul className="wx-suggest pop">
                  {suggestions.map((r) => (
                    <li key={r.id}>
                      <button onClick={() => pickCity(r)}>
                        <strong>{r.name}</strong>
                        <span className="muted">{[r.admin1, r.country].filter(Boolean).join(', ')}</span>
                        <span className="badge">{r.latitude.toFixed(2)}, {r.longitude.toFixed(2)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <form className="wx-coords" onSubmit={applyCoords}>
              <label className="field">Latitude (−90 … 90)
                <input className="input" inputMode="decimal" value={coordsInput.lat}
                  onChange={(e) => setCoordsInput((c) => ({ ...c, lat: e.target.value }))} />
              </label>
              <label className="field">Longitude (−180 … 180)
                <input className="input" inputMode="decimal" value={coordsInput.lon}
                  onChange={(e) => setCoordsInput((c) => ({ ...c, lon: e.target.value }))} />
              </label>
              <button className="btn primary" type="submit">Get weather</button>
              <button className="btn" type="button" onClick={useMyLocation}>📍 Use my location</button>
            </form>
          )}
          {locMsg && <p className="muted mt">{locMsg}</p>}
          {mode === 'coords' && <p className="muted mt" style={{ fontSize: '.82rem' }}>Tip: try latitude <code>120</code> to see the API error handled gracefully.</p>}
        </section>

        {/* ----- results ----- */}
        {error && (
          <div className="alert err mt" role="alert">
            <span>⚠️</span>
            <div><strong>Something went wrong.</strong><br />{error}</div>
          </div>
        )}

        {loading && !weather && (
          <div className="grid mt">
            <div className="skeleton" style={{ height: 220 }} />
            <div className="skeleton" style={{ height: 120 }} />
          </div>
        )}

        {cur && (
          <div className={`mt ${loading ? 'wx-dim' : ''}`}>
            <section className={`card wx-hero pop ${cur.is_day ? 'day' : 'night'}`}>
              <div className="wx-hero-top">
                <div>
                  <div className="eyebrow">{cur.is_day ? 'Daytime' : 'Night'} · {weather.timezone_abbreviation}</div>
                  <h2 className="wx-place">{place.name}</h2>
                  <div className="muted">{place.country}</div>
                </div>
                {loading && <span className="spinner" aria-label="Updating" />}
              </div>
              <div className="wx-hero-main">
                <div className="wx-icon" aria-hidden="true">{icon}</div>
                <div>
                  <div className="wx-temp">{Math.round(cur.temperature_2m)}<span>{u.t}</span></div>
                  <div className="wx-desc">{desc}</div>
                </div>
              </div>
              <div className="wx-stats">
                <div><span>💨 Wind</span><strong>{cur.wind_speed_10m} {u.w}</strong></div>
                <div><span>🌡️ Feels like</span><strong>{Math.round(cur.apparent_temperature)}{u.t}</strong></div>
                <div><span>💧 Humidity</span><strong>{cur.relative_humidity_2m}%</strong></div>
                <div><span>🧭 Coordinates</span><strong>{weather.latitude.toFixed(2)}, {weather.longitude.toFixed(2)}</strong></div>
              </div>
            </section>

            <h3 className="mt" style={{ marginBottom: 10 }}>5-day forecast</h3>
            <div className="wx-forecast">
              {weather.daily.time.slice(0, 5).map((d, i) => {
                const [dDesc, dIcon] = describe(weather.daily.weather_code[i]);
                return (
                  <div className="card wx-day pop" key={d} style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="muted">{dayName(d, i)}</div>
                    <div className="wx-day-icon" title={dDesc}>{dIcon}</div>
                    <div className="wx-day-desc">{dDesc}</div>
                    <div><strong>{Math.round(weather.daily.temperature_2m_max[i])}°</strong> <span className="muted">{Math.round(weather.daily.temperature_2m_min[i])}°</span></div>
                    <div className="badge accent">💧 {weather.daily.precipitation_probability_max[i] ?? 0}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="muted mt" style={{ fontSize: '.82rem' }}>
          Data: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo.com</a> ·
          Effects used: geocoding (debounce + abort), forecast fetch (abort), document.title sync, localStorage.
        </p>
      </main>
    </>
  );
}
