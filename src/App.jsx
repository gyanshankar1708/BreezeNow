import { useEffect, useState } from 'react'
import './App.css'
import Logo from './assets/Logo.png'

const MetricIcon = ({ type }) => {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  };

  switch (type) {
    case 'dew':
      return (
        <svg {...common}>
          <path d="M12 3s5 5 5 10a5 5 0 0 1-10 0c0-5 5-10 5-10Z" />
          <path d="M9.5 14.5c.5 1.4 1.8 2.5 3.5 2.5" />
        </svg>
      );
    case 'wind':
      return (
        <svg {...common}>
          <path d="M4 8h10a2 2 0 1 0-2-2" />
          <path d="M4 12h14a2 2 0 1 1-2 2" />
          <path d="M4 16h8" />
        </svg>
      );
    case 'pressure':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 12l3-3" />
          <path d="M12 7v1" />
        </svg>
      );
    case 'humidity':
      return (
        <svg {...common}>
          <path d="M12 3s5 5 5 10a5 5 0 0 1-10 0c0-5 5-10 5-10Z" />
          <path d="M9 13.5c.4 1 1.4 1.7 2.5 1.9" />
        </svg>
      );
    case 'cloud':
      return (
        <svg {...common}>
          <path d="M7 18h10a4 4 0 0 0 .3-8 6 6 0 0 0-11.7 1.8A3.5 3.5 0 0 0 7 18Z" />
        </svg>
      );
    case 'uv':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      );
    default:
      return null;
  }
};

const MetricCard = ({ type, label, value }) => (
  <div className={`card metric-card metric-card--${type}`}>
    <span className="metric-icon" aria-hidden="true">
      <MetricIcon type={type} />
    </span>
    <p className='text-lg font-semibold text-white'>
      {label} : {value}
    </p>
  </div>
);

function App() {
  const [city, setCity] = useState("London");
  const [cityInfo, setCityInfo] = useState("");
  const [cityName, setCityName] = useState("London");
  const [temperature, setTemperature] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [moisture, setMoisture] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [cloud, setCloud] = useState(null);
  const [condition, setCondition] = useState(null);
  const [icon, setIcon] = useState(null);
  const [feelsLike, setFeelsLike] = useState(null);
  const [uv, setUv] = useState(null);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          setError("City not found");
          return;
        }
        setError(null);
        const data = await response.json();
        console.log(data);
        setCityName(data.location.name);
        setTemperature(data.current.temp_c);
        setLatitude(data.location.lat);
        setLongitude(data.location.lon);
        setMoisture(data.current.dewpoint_c);
        setWindSpeed(data.current.wind_kph);
        setPressure(data.current.pressure_in);
        setHumidity(data.current.humidity);
        setCloud(data.current.cloud);
        setCondition(data.current.condition.text);
        setIcon(data.current.condition.icon);
        setFeelsLike(data.current.feelslike_c);
        setUv(data.current.uv);
        setRegion(data.location.region);
      } catch (error) {
        setError("Error fetching data"+ error);
      }
    }
    fetchData();

  }, [city])

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    setCityInfo("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCity(`${latitude},${longitude}`);
        setLoadingLocation(false);
      },
      (error) => {
        setLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setError("Location information is unavailable");
            break;
          case error.TIMEOUT:
            setError("The request to get user location timed out");
            break;
          default:
            setError("An unknown error occurred while fetching location");
            break;
        }
      }
    );
  };

  const handleChange = (e) => {
    setCityInfo(e.target.value);
  }
  const getWeatherInsights = () => {
  const insights = [];

  if (temperature >= 35) {
    insights.push({
      title: "Stay hydrated in high temperatures",
      description:
        `Temperatures above ${temperature}°C — drink water regularly and avoid prolonged sun exposure.`,
      emoji: "🌡️",
      accent: "yellow",
    });
  }

  if (uv >= 6) {
    insights.push({
      title: "High UV exposure today",
      description:
        `UV index is currently ${uv}. Use sunscreen and avoid excessive sun exposure.`,
      emoji: "🧴",
      accent: "yellow",
    });
  }

  if (windSpeed >= 25) {
    insights.push({
      title: "Strong winds expected outside",
      description:
        `Wind speeds at ${windSpeed} KPH — be cautious while traveling outdoors.`,
      emoji: "💨",
      accent: "blue",
    });
  }

  if (humidity >= 80) {
    insights.push({
      title: "High humidity levels today",
      description:
        `Humidity is currently ${humidity}% which may make the weather feel warmer.`,
      emoji: "💧",
      accent: "cyan",
    });
  }

  if (
    condition?.toLowerCase().includes("rain")
  ) {
    insights.push({
      title: "Carry an umbrella before heading out",
      description:
        "Rainy conditions are expected today. Keep an umbrella or raincoat handy.",
      emoji: "🌧️",
      accent: "purple",
    });
  }

  if (
    condition?.toLowerCase().includes("sunny") ||
    condition?.toLowerCase().includes("clear")
  ) {
    insights.push({
      title: "Great weather for outdoor activities",
      description:
        "Clear skies and pleasant visibility make this ideal for outdoor plans.",
      emoji: "☀️",
      accent: "green",
    });
  }

  if (
    condition?.toLowerCase().includes("overcast") ||
    condition?.toLowerCase().includes("cloudy")
  ) {
    insights.push({
      title: "Cloudy skies expected today",
      description:
        "Dense cloud cover may reduce sunlight throughout the day.",
      emoji: "☁️",
      accent: "gray",
    });
  }

  if (
    condition?.toLowerCase().includes("mist") ||
    condition?.toLowerCase().includes("fog") ||
    condition?.toLowerCase().includes("haze")
  ) {
    insights.push({
      title: "Reduced visibility outdoors",
      description:
        "Mist or fog conditions may affect visibility while driving or traveling.",
      emoji: "🌫️",
      accent: "cyan",
    });
  }

  if (
    condition?.toLowerCase().includes("thunder")
  ) {
    insights.push({
      title: "Thunderstorm conditions detected",
      description:
        "Take precautions and avoid open areas during thunderstorms.",
      emoji: "⛈️",
      accent: "purple",
    });
  }

  if (
    condition?.toLowerCase().includes("snow")
  ) {
    insights.push({
      title: "Snowfall expected today",
      description:
        "Cold and snowy conditions may affect travel and outdoor activities.",
      emoji: "❄️",
      accent: "blue",
    });
  }

  if (temperature <= 10) {
    insights.push({
      title: "Cold weather detected",
      description:
        "Wear warm clothing and avoid prolonged exposure to cold weather.",
      emoji: "🧥",
      accent: "cyan",
    });
  }

  return insights.slice(0, 3);
};
  const ErrorBox = () => {
    return (
      <div className="errorbox">
        <h1 className='text-2xl font-bold text-red-600'>{error}</h1>
      </div>
    );
  }

  const WeatherDetail = () => {
    const insights = getWeatherInsights();
    return (
      <div className="datas flex flex-col items-center justify-center gap-10">
        <div className="imp-datas flex flex-col md:flex-row gap-10">
          <div className="location-detail flex flex-col items-center gap-5 justify-center">
            <h1 className='text-4xl font-bold text-white'>{cityName}</h1>
            {region && <p className='text-white flex items-center gap-1'><span className='font-bold'>Region : </span> <span className='details region-detail'>{region}</span></p>}
            <div className="latt-long flex items-center gap-5">
              <p className='text-white'><span className='font-bold'>Latitude : </span> <span className='details'>{latitude}</span></p>
              <p className='text-white'><span className='font-bold'>Longitude : </span><span className='details'>{longitude}</span></p>
            </div>
          </div>
          <div className="condition flex flex-col items-center gap-4 mt-6 justify-center">
            {icon && <img className='icon' src={icon} alt="weather icon" width={100} />}
            {condition && <p className='text-2xl font-semibold text-white'>{condition}</p>}
          </div>
          <div className="temp flex flex-col items-center gap-4 justify-center">
            {temperature !== null && <h1 className='text-6xl font-bold text-white'>{temperature}&#8451;</h1>}
            {feelsLike !== null && <p className='text-xl font-semibold text-white'>Feels Like : {feelsLike}&#8451;</p>}
          </div>
        </div>
        <div className="less-imp-datas mb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mt-10">
            {moisture !== null && <MetricCard type="dew" label="Dew Point" value={<>{moisture}&#8451;</>} />}
            {windSpeed !== null && <MetricCard type="wind" label="Wind Speed" value={<>{windSpeed} KPH</>} />}
            {pressure !== null && <MetricCard type="pressure" label="Pressure" value={<>{pressure} in</>} />}
            {humidity !== null && <MetricCard type="humidity" label="Humidity" value={<>{humidity} %</>} />}
            {cloud !== null && <MetricCard type="cloud" label="Cloud" value={<>{cloud} %</>} />}
            {uv !== null && <MetricCard type="uv" label="UV Index" value={uv} />}
          </div>
          {insights.length > 0 && (
          <div className="advisory-section">
            <div className="advisory-topline">
              <div className="line"></div>
              <p>WEATHER INSIGHTS</p>
              <div className="line"></div>
            </div>

            <div className="advisory-header">
              <h2>🌤 Today's Advisory</h2>
              <p>Based on current weather conditions</p>
            </div>

            <div className="advisory-grid">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`advisory-card ${insight.accent}`}
                >
                  <div className="advisory-icon">
                    {insight.emoji}
                  </div>

                  <div className="advisory-content">
                    <h3>{insight.title}</h3>
                    <p>{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    );
  }
  return (
    <>
      <nav className='flex items-center justify-center p-4 shadow-md'>
        <img src={Logo} alt="" width={150} />
      </nav>
      <main className='flex flex-col items-center justify-center gap-6 mt-10'>
        <div className="input-container flex flex-wrap justify-center gap-4">
          <input type="text" placeholder='Enter City Name' value={cityInfo} onChange={handleChange} className='border-2 p-3 rounded-xl md:w-xl text-white' onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setCity(cityInfo);
              setCityInfo("");
            }
          }} />
          <button onClick={() => {
            setCity(cityInfo)
            setCityInfo("");
          }} className='border-2 p-3 rounded-2xl bg-blue-700 text-white submit-btn'>Search</button>
          <button
            onClick={handleUseCurrentLocation}
            disabled={loadingLocation}
            className='border-2 p-3 rounded-2xl bg-green-600 text-white submit-btn disabled:opacity-50'
          >
            {loadingLocation ? "Detecting..." : "Use Current Location"}
          </button>
        </div>
        {error ? <ErrorBox /> : <WeatherDetail />}
      </main>
    </>
  )

}

export default App;
