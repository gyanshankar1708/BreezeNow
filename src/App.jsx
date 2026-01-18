import { useEffect, useState } from 'react'
import './App.css'
import Logo from './assets/Logo.png'
// import { VITE_WEATHER_API_KEY } from './secrets'; // Uncomment this line if you are using the secrets.js file and comment at the time of pushing to github

function App() {
  const [city, setCity] = useState("London");
  const [cityInfo, setCityInfo] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [lattitude, setLatitude] = useState(null);
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
  const[region, setRegion]= useState(null);

  useEffect(() => {
    // const apiKey = VITE_WEATHER_API_KEY; // Uncomment this line if you are using the secrets.js file and comment at the time of pushing to github
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY; // Comment this line if you are using the secrets.js file and uncomment at the time of pushing to github  
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          setError("City not found");
        }
        setError(null);
        const data = await response.json();
        console.log(data);
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
        setError("Error fetching data");
      }
    }
    fetchData();

  }, [city])

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
      <div className="datas">
        <div className="imp-datas flex flex-col md:flex-row gap-10">
          <div className="location-detail flex flex-col items-center gap-1 justify-center">
            <h1 className='text-4xl font-bold text-white'>{city}</h1>
            {region && <p className='text-white'>Region : {region}</p>}
            <p className='text-white'>Lattitude : {lattitude}</p>
            <p className='text-white'>Longitude : {longitude}</p>
          </div>
          <div className="condition flex flex-col items-center gap-4 mt-6 justify-center">
            {icon && <img src={icon} alt="weather icon" width={100} />}
            {condition && <p className='text-2xl font-semibold text-white'>{condition}</p>}
          </div>
          <div className="temp flex flex-col items-center gap-4 justify-center">
            {temperature !== null && <h1 className='text-6xl font-bold text-white'>{temperature}&#8451;</h1>}
            {feelsLike !== null && <p className='text-xl font-semibold text-white'>Feels Like : {feelsLike}&#8451;</p>}
          </div>
        </div>
        <div className="less-imp-datas mb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mt-10">
            {moisture !== null && <p className='text-lg font-semibold text-white'>Dew Point : {moisture}&#8451;</p>}
            {windSpeed !== null && <p className='text-lg font-semibold text-white'>Wind Speed : {windSpeed} KPH</p>}
            {pressure !== null && <p className='text-lg font-semibold text-white'>Pressure : {pressure} in</p>}
            {humidity !== null && <p className='text-lg font-semibold text-white'>Humidity : {humidity} %</p>}
            {cloud !== null && <p className='text-lg font-semibold text-white'>Cloud : {cloud} %</p>}
            {uv !== null && <p className='text-lg font-semibold text-white'>UV Index : {uv}</p>}
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
        <div className="input-container flex gap-4">
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
        </div>
        {error ? <ErrorBox /> : <WeatherDetail />}
      </main>
    </>
  )
}

export default App;
