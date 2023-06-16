import { useState } from 'react';
import './App.css';
import { WEATHER_API_KEY, WEATHER_API_URL } from './api';
import CurrentWeather from './components/current-weather/current-weather';
import Search from './components/search/search';
import Forecast from './components/forecast/forecast';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleOnSearchChange = async (searchData) => {
    const [lat, lon] = searchData.value.split(", ");
    
    const currentWeatherFetch = await fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appId=${WEATHER_API_KEY}&units=metric`);
    const weatherForcastFetch = await fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    Promise.all([currentWeatherFetch, weatherForcastFetch])
      .then(async res => {
        const weatherResponse = await res[0].json();
        const forcastResponse = await res[1].json();

        setCurrentWeather({city: searchData.label, ...weatherResponse});
        setForecast({city: searchData.label, ...forcastResponse});
      })
      .catch((e) => console.log(e))
  }

  console.log({ currentWeather, forecast });

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange}/>
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
