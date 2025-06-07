import { useEffect, useState } from 'react';
import axios from 'axios';
import { TiWeatherCloudy } from "react-icons/ti";
import { useFarm } from '@/app/Context/FarmContext';
import Loader from '@/app/components/loader';

interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  date: string;
  temperature: string;
  rainfallForecast: string;
  wind: string;
  humidity: string;
  sunlightDuration: string;
  dewPoint: string;
  extremeWeatherAlert: string | string[];
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sync, setSync] = useState<boolean>(false);
  const {farm,setFarm} = useFarm();

  useEffect(() => {
    if(farm && farm.latitude && farm.longitude )setSync(true);
     
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await axios.get(`http://localhost:5000/weather?lat=${lat}&lon=${lon}`);
        setWeather(res.data);
      } catch (err) {
        console.error('Failed to fetch weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    const updateFarmCoord = async (lat:number,lon:number)=>{
      try {
        if(farm && !weather){
           const res = await axios.put(`http://localhost:5000/api/farm/farm-properties/${farm[0]._id}`,{latitude:lat,longitude:lon});
        setFarm(res.data);
        console.log(res.data);
        }
       
      } catch (err) {
        console.error('Failed to update data:', err);
      } finally {
        setLoading(false);
    }}
  
  if(sync && farm) navigator.geolocation.getCurrentPosition(
    (position) => {
      setLoading(true);
      const { latitude, longitude } = position.coords;
      if (!farm.latitude || !farm.longitude){
        fetchWeather(latitude, longitude)
        updateFarmCoord(latitude,longitude)
      };
        if(farm.latitude && farm.longitude){
        fetchWeather(farm.latitude,farm.longitude)
        }
    },
    (error) => {
      console.error('Geolocation error:', error);
      setLoading(false);
    }
  );
  }, [farm,sync,setFarm,weather]);
  

  if (sync && loading) return <div className="text-center h-full flex gap-4 flex-col items-center justify-center text-gray-600 mt-10"><Loader /> <div className=''>Loading...</div></div>;

  if (sync && !weather) return <div className="text-center text-grey-700 mt-10 px-3 py-2  rounded-full cursor-pointer" onClick={()=>setSync(true)}>Wait ...</div>;

  return (<div>
     {sync && weather?<div className="max-w-xl mx-auto  p-6 rounded-2xl  bg-white space-y-4">


{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Date
</div>
<div>
 {weather.date?weather.date:"N/A"}
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Temperature
</div>
<div>
 {weather.temperature?weather.temperature:"N/A"}
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Rainfall
</div>
<div>
 {weather.rainfallForecast?weather.rainfallForecast:"N/A"}
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Wind
</div>
<div>
 {weather.wind?weather.wind:"N/A"}
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Humidity
</div>
<div>
 {weather.humidity?weather.humidity:"N/A"}
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Sunlight Duration
</div>
<div>
 {weather.sunlightDuration?weather.sunlightDuration:"N/A"}
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Dew Point
</div>
<div>
 {weather.dewPoint?weather.dewPoint:"N/A"}
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Extreme weather Alert
</div>
<div>
 {weather.extremeWeatherAlert? Array.isArray(weather.extremeWeatherAlert)
          ? weather.extremeWeatherAlert.length
            ? weather.extremeWeatherAlert[0].headline
            : 'No alerts'
          : weather.extremeWeatherAlert:"N/A"}
</div>
</div>
     

     
    </div>:<div className='w-full flex flex-col items-center justify-center gap-2 cursor-pointer' onClick={()=>setSync(true)}>
        <div className='text-4xl'>
        <TiWeatherCloudy className='text-[100px] text-grey-800' />
        </div>
        <div className='text-grey-600'>Click to sync report {"(to be done near/on farm)"}</div>
    </div>}
  </div>
   
  );
}
