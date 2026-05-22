import { useEffect, useState } from "react";
import "./App.css";
import { Card } from "./components/Card";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { Hero } from "./components/Hero";
import { ThemeToggle } from "./components/ThemeToggle";

const featureCards = [
  {
    icon: <SearchIcon />,
    title: "Weather at a glance",
    text: "Open the working experience to search a city, use your location, and review live conditions fast.",
    badge: "Landing page",
  },
  {
    icon: <ThermometerIcon />,
    title: "Clean card system",
    text: "Use reusable cards for feature highlights, live metrics, or future content blocks with a consistent style.",
    badge: "Reusable UI",
  },
  {
    icon: <ForecastIcon />,
    title: "Responsive layout",
    text: "The landing page stays readable on mobile, tablet, and desktop with subtle motion and strong hierarchy.",
    badge: "Accessible",
  },
  {
    icon: <ShieldIcon />,
    title: "Theme aware",
    text: "Light and dark themes persist across visits so the first impression feels consistent every time.",
    badge: "Persistent",
  },
];

const placeholderSummary = [
  {
    title: "Humidity",
    value: "--",
    text: "Comfort and moisture levels",
    icon: <DropletIcon />,
  },
  {
    title: "Wind speed",
    value: "--",
    text: "Helpful for planning outdoors",
    icon: <WindIcon />,
  },
  {
    title: "Pressure",
    value: "--",
    text: "Atmospheric pressure trends",
    icon: <GaugeIcon />,
  },
  {
    title: "Cloud cover",
    value: "--",
    text: "How open the sky feels",
    icon: <CloudIcon />,
  },
  {
    title: "UV index",
    value: "--",
    text: "Sun exposure guidance",
    icon: <SunIcon />,
  },
  {
    title: "Dew point",
    value: "--",
    text: "Air temperature comfort",
    icon: <ThermometerIcon />,
  },
];

const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("weather-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialUnit() {
  if (typeof window === "undefined") {
    return "f";
  }

  const savedUnit = window.localStorage.getItem("weather-unit");
  return savedUnit === "c" ? "c" : "f";
}

function getWeatherSummary(weather, unit) {
  if (!weather) {
    return placeholderSummary;
  }

  const isMetric = unit === "c";
  const suffix = isMetric ? "°C" : "°F";

  return [
    {
      title: "Humidity",
      value: `${weather.current.humidity}%`,
      text: "Comfort and moisture levels",
      icon: <DropletIcon />,
    },
    {
      title: "Wind speed",
      value: `${isMetric ? Math.round(weather.current.wind_kph) : Math.round(weather.current.wind_mph)} ${isMetric ? "KPH" : "MPH"}`,
      text: `${weather.current.wind_dir} breeze`,
      icon: <WindIcon />,
    },
    {
      title: "Pressure",
      value: `${weather.current.pressure_in} in`,
      text: "Atmospheric pressure",
      icon: <GaugeIcon />,
    },
    {
      title: "Cloud cover",
      value: `${weather.current.cloud}%`,
      text: "Sky coverage",
      icon: <CloudIcon />,
    },
    {
      title: "UV index",
      value: `${weather.current.uv}`,
      text: "Sun exposure guidance",
      icon: <SunIcon />,
    },
    {
      title: "Dew point",
      value: `${isMetric ? Math.round(weather.current.dewpoint_c) : Math.round(weather.current.dewpoint_f)}${suffix}`,
      text: "Air comfort index",
      icon: <ThermometerIcon />,
    },
  ];
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [unit, setUnit] = useState(getInitialUnit);
  const [view, setView] = useState("landing");
  const [query, setQuery] = useState("Lahore");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(
    "Open the weather workspace to load live conditions.",
  );
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("weather-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("weather-unit", unit);
  }, [unit]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedSearches = window.localStorage.getItem(
      "weather-recent-searches",
    );
    if (!savedSearches) {
      return;
    }

    try {
      const parsedSearches = JSON.parse(savedSearches);
      if (Array.isArray(parsedSearches)) {
        setRecentSearches(parsedSearches.slice(0, 3));
      }
    } catch {
      window.localStorage.removeItem("weather-recent-searches");
    }
  }, []);

  async function loadWeather(searchTerm, { remember = true } = {}) {
    if (!weatherApiKey) {
      setError(
        "Weather API key is missing. Add VITE_WEATHER_API_KEY to .env.local.",
      );
      setStatus("Unable to load weather data");
      setLoading(false);
      return;
    }

    if (!searchTerm?.trim()) {
      setError("Enter a city name to search weather conditions.");
      return;
    }

    setLoading(true);
    setError("");
    setStatus(`Loading weather for ${searchTerm.trim()}...`);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${encodeURIComponent(searchTerm.trim())}&days=3&aqi=no&alerts=no`,
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload?.error?.message ?? "Unable to fetch weather data.",
        );
      }

      setWeather(payload);
      setQuery(payload.location.name);
      setStatus(`Live weather for ${payload.location.name}`);

      if (remember && payload.location?.name) {
        setRecentSearches((current) => {
          const nextSearches = [
            payload.location.name,
            ...current.filter((item) => item !== payload.location.name),
          ].slice(0, 3);

          window.localStorage.setItem(
            "weather-recent-searches",
            JSON.stringify(nextSearches),
          );

          return nextSearches;
        });
      }
    } catch (fetchError) {
      setWeather(null);
      setError(fetchError.message || "Unable to fetch weather data.");
      setStatus("Weather data unavailable");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setView("weather");
    void loadWeather(query);
  }

  function useCurrentLocation() {
    setView("weather");

    if (!navigator.geolocation) {
      setError("Location services are not supported in this browser.");
      return;
    }

    setError("");
    setStatus("Getting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        void loadWeather(`${latitude},${longitude}`);
      },
      () => {
        setError(
          "Location access was blocked. Search a city manually instead.",
        );
        setStatus("Unable to use current location");
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  function openWeatherApp() {
    setView("weather");
    void loadWeather(query, { remember: false });
  }

  function toggleUnit() {
    setUnit((currentUnit) => (currentUnit === "f" ? "c" : "f"));
  }

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }

  const featureSummary = getWeatherSummary(weather, unit);
  const forecastDays = weather?.forecast?.forecastday ?? [];
  const currentWeather = weather?.current;
  const location = weather?.location;
  const currentIcon = currentWeather?.condition?.icon
    ? `https:${currentWeather.condition.icon}`
    : null;
  const isMetric = unit === "c";
  const currentTemp = currentWeather
    ? isMetric
      ? Math.round(currentWeather.temp_c)
      : Math.round(currentWeather.temp_f)
    : null;
  const feelsLike = currentWeather
    ? isMetric
      ? Math.round(currentWeather.feelslike_c)
      : Math.round(currentWeather.feelslike_f)
    : null;

  return (
    <div className="app-shell">
      <div className="page-shell">
        <header className="topbar">
          <a className="brand" href="#home" aria-label="BreezeNow weather home">
            <span className="brand-mark weather-mark" aria-hidden="true">
              <WeatherMark />
            </span>
            <span>
              BreezeNow
              <small>Weather made simple</small>
            </span>
          </a>

          <nav className="topbar-actions" aria-label="Primary">
            {view === "weather" ? (
              <button
                type="button"
                className="ghost-link"
                onClick={() => setView("landing")}
              >
                Back to landing
              </button>
            ) : (
              <a className="ghost-link" href="#landing-highlights">
                Explore features
              </a>
            )}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </nav>
        </header>

        <main id="home">
          {view === "landing" ? (
            <>
              <Hero
                kicker="Weather that feels polished"
                headline={
                  <>
                    Track local conditions with{" "}
                    <span className="accent-text">BreezeNow</span>
                  </>
                }
                description="A calm, responsive landing page that leads into the real weather experience with live search, unit switching, and detailed metrics."
                actions={
                  <>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={openWeatherApp}
                    >
                      Get Started
                    </button>
                    <a className="secondary-button" href="#landing-highlights">
                      See what&apos;s included
                    </a>
                  </>
                }
              >
                <div
                  className="hero-art landing-hero-art"
                  aria-label="Weather preview illustration"
                >
                  <div className="hero-art-glow" />
                  <div className="hero-device landing-device">
                    <div className="hero-device-top">
                      <div className="weather-device-brand">
                        <WeatherMark />
                        <span>Weather workspace</span>
                      </div>
                      <span>Ready on click</span>
                    </div>
                    <div className="hero-device-panel">
                      <div>
                        <p>Live search</p>
                        <strong>City by city weather data</strong>
                      </div>
                      <div className="hero-chip">°C / °F toggle</div>
                    </div>
                    <div className="landing-stat-row">
                      <article>
                        <strong>Pressure</strong>
                        <span>Weather patterns</span>
                      </article>
                      <article>
                        <strong>UV</strong>
                        <span>Sun guidance</span>
                      </article>
                    </div>
                    <div className="hero-device-footer">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              </Hero>

              <section
                className="section-block"
                id="landing-highlights"
                aria-labelledby="landing-highlights-heading"
              >
                <div className="section-heading">
                  <p className="section-kicker">Highlights</p>
                  <h2 id="landing-highlights-heading">
                    A landing page that leads into the working weather app
                  </h2>
                  <p>
                    The experience starts with a strong first impression and
                    then opens the live weather workspace only when the user is
                    ready.
                  </p>
                </div>

                <FeaturesGrid>
                  {featureCards.map((card) => (
                    <Card key={card.title} {...card} />
                  ))}
                </FeaturesGrid>
              </section>

              <section className="cta-band" aria-label="Call to action">
                <div>
                  <p className="section-kicker">Ready to explore</p>
                  <h2>
                    Click Get Started to open the actual weather functionality.
                  </h2>
                </div>

                <button
                  className="primary-button"
                  type="button"
                  onClick={openWeatherApp}
                >
                  Get Started
                </button>
              </section>
            </>
          ) : (
            <section
              className="section-block weather-workspace"
              id="weather-app"
              aria-labelledby="weather-app-heading"
            >
              <div className="section-heading">
                <p className="section-kicker">Weather workspace</p>
                <h2 id="weather-app-heading">
                  Live search, unit switching, and detailed weather metrics
                </h2>
                <p>
                  Search a city, use your current location, and switch between
                  Celsius and Fahrenheit while checking pressure, cloud cover,
                  UV index, and dew point.
                </p>
              </div>

              <div className="weather-toolbar">
                <form className="weather-search" onSubmit={handleSubmit}>
                  <label className="sr-only" htmlFor="city-search">
                    Search a city
                  </label>
                  <input
                    id="city-search"
                    className="weather-search-input"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Enter city name"
                  />
                  <button
                    className="primary-button"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Search"}
                  </button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={useCurrentLocation}
                  >
                    Use current location
                  </button>
                </form>

                <button
                  type="button"
                  className="unit-switch"
                  onClick={toggleUnit}
                  aria-pressed={isMetric}
                >
                  Switch to {isMetric ? "°F" : "°C"}
                </button>
              </div>

              <div className="recent-searches" aria-label="Recent searches">
                <span>Recent</span>
                {recentSearches.length > 0 ? (
                  recentSearches.map((city) => (
                    <button
                      key={city}
                      type="button"
                      className="recent-chip"
                      onClick={() => {
                        setQuery(city);
                        void loadWeather(city);
                      }}
                    >
                      {city}
                    </button>
                  ))
                ) : (
                  <span className="recent-chip recent-chip-muted">Lahore</span>
                )}
              </div>

              {error ? (
                <p className="weather-alert" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="weather-current-panel">
                <div className="weather-current-overview">
                  <div className="weather-device-brand">
                    {currentIcon ? (
                      <img src={currentIcon} alt="" aria-hidden="true" />
                    ) : (
                      <WeatherMark />
                    )}
                    <span>BreezeNow Weather</span>
                  </div>
                  <p className="weather-status" aria-live="polite">
                    {status}
                  </p>
                  <h3>
                    {location
                      ? `${location.name}, ${location.country}`
                      : "Search any city to load live weather"}
                  </h3>
                  <p>
                    {location
                      ? `${location.region} • ${currentWeather?.condition?.text ?? "Live conditions"}`
                      : "Pressure, cloud cover, UV index, dew point, and forecast details are shown here."}
                  </p>
                </div>

                <div className="weather-current-temp">
                  <strong>
                    {currentTemp !== null
                      ? `${currentTemp}°${unit.toUpperCase()}`
                      : "--"}
                  </strong>
                  <span>
                    Feels like{" "}
                    {feelsLike !== null
                      ? `${feelsLike}°${unit.toUpperCase()}`
                      : "--"}
                  </span>
                </div>
              </div>

              <div className="weather-summary-grid">
                {featureSummary.map((card) => (
                  <Card
                    key={card.title}
                    icon={card.icon}
                    title={card.title}
                    text={card.text}
                    badge={card.value}
                    subtle
                  />
                ))}
              </div>

              <section
                className="section-block compact weather-forecast-block"
                aria-labelledby="forecast-heading"
              >
                <div className="section-heading align-start">
                  <p className="section-kicker">Forecast</p>
                  <h2 id="forecast-heading">Three-day forecast</h2>
                </div>

                <div className="forecast-grid">
                  {forecastDays.length > 0 ? (
                    forecastDays.map((day) => {
                      const maxTemp = isMetric
                        ? Math.round(day.day.maxtemp_c)
                        : Math.round(day.day.maxtemp_f);
                      const minTemp = isMetric
                        ? Math.round(day.day.mintemp_c)
                        : Math.round(day.day.mintemp_f);

                      return (
                        <article className="forecast-card" key={day.date}>
                          <p>
                            {new Date(day.date).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <img
                            src={`https:${day.day.condition.icon}`}
                            alt=""
                            aria-hidden="true"
                          />
                          <strong>
                            {maxTemp}°{unit.toUpperCase()}
                          </strong>
                          <span>{minTemp}° low</span>
                          <small>{day.day.condition.text}</small>
                        </article>
                      );
                    })
                  ) : (
                    <article className="forecast-card forecast-empty">
                      <p>Forecast unavailable</p>
                      <strong>--</strong>
                      <span>Try another city</span>
                    </article>
                  )}
                </div>
              </section>

              <section className="cta-band" aria-label="Call to action">
                <div>
                  <p className="section-kicker">Need another view</p>
                  <h2>Return to the landing page or search another city.</h2>
                </div>

                <button
                  className="primary-button"
                  type="button"
                  onClick={() => setView("landing")}
                >
                  Back to landing
                </button>
              </section>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function WeatherMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.2 18.5h10.3a3.8 3.8 0 0 0 .9-7.5 5.3 5.3 0 0 0-10.2-1.8A3.7 3.7 0 0 0 7.2 18.5Z" />
      <path d="M9.2 6.7A3.8 3.8 0 0 1 16 8.9" />
      <circle cx="8.2" cy="8.2" r="1.4" />
      <path d="M8.2 12.7v2.7M11 13.3v2.1M13.8 12.5v2.9" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.5 4.5A6 6 0 1 0 10.5 16.5a6 6 0 0 0 0-12zm0 9.3a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6z" />
      <path d="M15.7 15.7 20 20" />
    </svg>
  );
}

function ThermometerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 14.8V5.6a2 2 0 0 0-4 0v9.2a4 4 0 1 0 4 0z" />
      <path d="M12 18.2V9.8" />
    </svg>
  );
}

function ForecastIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5.5V4m10 1.5V4M4.5 9h15" />
      <path d="M6.5 8.5h11A2.5 2.5 0 0 1 20 11v6.5A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5V11a2.5 2.5 0 0 1 2.5-2.5Z" />
      <path d="M8 13h3M13 13h3M8 16h8" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l8 3v6c0 5.2-3.2 9.8-8 11-4.8-1.2-8-5.8-8-11V5l8-3zm0 4.2L6 8.4V11c0 4 2.4 7.4 6 8.5 3.6-1.1 6-4.5 6-8.5V8.4l-6-2.2z" />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3c3.1 4.2 6 7.3 6 11a6 6 0 1 1-12 0c0-3.7 2.9-6.8 6-11Z" />
    </svg>
  );
}

function WindIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8h11a3 3 0 1 0-2.7-4.3" />
      <path d="M4 13h15a2.5 2.5 0 1 1-2.2 3.6" />
      <path d="M4 18h8" />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 17a7 7 0 1 1 14 0" />
      <path d="M12 12l4-3" />
      <circle cx="12" cy="17" r="1" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 17.5h8.5A3.5 3.5 0 1 0 15.6 11a5 5 0 0 0-9.3 1.5A3 3 0 0 0 8 17.5Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </svg>
  );
}

export default App;
