import { useEffect, useState } from 'react'
import './App.css'
import Logo from './assets/Logo.png'

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

  const ErrorBox = () => {
    return (
      <div className="errorbox">
        <h1 className='text-2xl font-bold text-red-600'>{error}</h1>
      </div>
    );
  }

  const WeatherDetail = () => {
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
            {moisture !== null && <div className="card">
              <p className='text-lg font-semibold text-white'>
                Dew Point : {moisture}&#8451;
              </p>
            </div>}
            {windSpeed !== null && <div className="card">
              <p className='text-lg font-semibold text-white'>
                Wind Speed : {windSpeed} KPH
              </p>
            </div>}
            {pressure !== null && <div className="card">
              <p className='text-lg font-semibold text-white'>
                Pressure : {pressure} in
              </p>
            </div>}
            {humidity !== null && <div className="card">
              <p className='text-lg font-semibold text-white'>
                Humidity : {humidity} %
              </p>
            </div>}
            {cloud !== null && <div className="card">
              <p className='text-lg font-semibold text-white'>
                Cloud : {cloud} %
              </p>
            </div>}
            {uv !== null && <div className="card">
              <p className='text-lg font-semibold text-white'>
                UV Index : {uv}
              </p>
            </div>}
          </div>
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
