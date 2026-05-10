import { useEffect, useState } from "react";
import axios from "axios";

import {
  WiDaySunny,
  WiCloud,
  WiRain,
} from "react-icons/wi";

function WeatherCard() {
  const [weather, setWeather] = useState(null);

  const [city, setCity] = useState("Kolkata");

  const API_KEY = "ff34f19c6dfe1c8bdc936051da20fa90";

  const getWeather = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      )
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getWeather();
  }, []);

  const getWeatherIcon = () => {
    if (!weather) return null;

    const condition =
      weather.weather[0].main;

    if (condition === "Clear") {
      return <WiDaySunny size={80} />;
    }

    if (condition === "Clouds") {
      return <WiCloud size={80} />;
    }

    if (condition === "Rain") {
      return <WiRain size={80} />;
    }

    return <WiCloud size={80} />;
  };

  return (
    <div className="card">
      <h2>Weather</h2>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) =>
          setCity(e.target.value)
        }
        style={{
          padding: "10px",
          width: "90%",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={getWeather}
        style={{
          padding: "10px",
          width: "100%",
          border: "none",
          backgroundColor: "#243b55",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Search
      </button>

      {weather ? (
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          {getWeatherIcon()}

          <h1>
            {weather.main.temp}°C
          </h1>

          <p>
            {weather.weather[0].main}
          </p>

          <p>{weather.name}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default WeatherCard;