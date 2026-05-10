import React, { useEffect, useState } from "react";

import {
  FaSearch,
  FaTint,
  FaWind,
  FaCloudRain,
  FaTemperatureHigh,
  FaLocationArrow,
} from "react-icons/fa";

import "../styles/Weather.css";

function Weather() {

  const [city, setCity] = useState("Kolkata");

  const [weather, setWeather] = useState(null);

  const API_KEY =
    "ff34f19c6dfe1c8bdc936051da20fa90";

  // SEARCH WEATHER BY CITY
  const fetchWeather = async () => {

    try {

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      setWeather(data);

    } catch (error) {

      console.log(error);

    }
  };

  // WEATHER USING CURRENT LOCATION
  const fetchLocationWeather = () => {

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        const lat = position.coords.latitude;

        const lon = position.coords.longitude;

        try {

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );

          const data = await response.json();

          setWeather(data);

          setCity(data.name);

        } catch (error) {

          console.log(error);

        }
      }
    );
  };

  // AUTO LOAD CURRENT LOCATION WEATHER
  useEffect(() => {

    fetchLocationWeather();

  }, []);

  return (
    <div className="weather-page">

      <div className="weather-top">

        <div>

          <h1>🌤 Weather Center</h1>

          <p>
            Real-time climate intelligence for smart cities
          </p>

        </div>

        <div className="search-box">

          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
          />

          <button onClick={fetchWeather}>
            <FaSearch />
          </button>

          <button
            className="location-btn"
            onClick={fetchLocationWeather}
          >
            <FaLocationArrow />
          </button>

        </div>

      </div>

      {weather && weather.main && (

        <div className="main-weather-card">

          <div className="weather-left">

            <h2>{weather.name}</h2>

            <h1>
              {Math.round(weather.main.temp)}°
            </h1>

            <p>
              {weather.weather[0].description}
            </p>

          </div>

          <div className="weather-right">

            <div className="weather-mini-card">

              <FaTint />

              <div>
                <h3>
                  {weather.main.humidity}%
                </h3>

                <p>Humidity</p>
              </div>

            </div>

            <div className="weather-mini-card">

              <FaWind />

              <div>
                <h3>
                  {weather.wind.speed} km/h
                </h3>

                <p>Wind Speed</p>
              </div>

            </div>

            <div className="weather-mini-card">

              <FaCloudRain />

              <div>
                <h3>
                  {weather.clouds.all}%
                </h3>

                <p>Cloudiness</p>
              </div>

            </div>

            <div className="weather-mini-card">

              <FaTemperatureHigh />

              <div>
                <h3>
                  {Math.round(weather.main.feels_like)}°
                </h3>

                <p>Feels Like</p>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Weather;