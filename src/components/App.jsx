import React, { useState, useEffect } from "react";
import WeatherCard from "./WeatherCard";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
  try {
    const stored = localStorage.getItem("weatherData");
    if (stored) {
      const data = JSON.parse(stored);
      if (data && data.main && data.weather) {
        setWeather(data);
      } else {
        localStorage.removeItem("weatherData");
      }
    }
  } catch (err) {
    console.error("Corrupt localStorage data:", err);
    localStorage.removeItem("weatherData");
  }
}, []);


  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
      localStorage.setItem("weatherData", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null); // Clear old error
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError(data.message || "City not found");
        setWeather(null);
      } else {
        setWeather(data);
        localStorage.setItem("weatherData", JSON.stringify(data));
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error fetching weather:", error);
    } finally {
      setCity("");
      setLoading(false);
    }
  };


  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      });
    }
  };

  const handleBack = () => {
    setWeather(null);
    localStorage.removeItem("weatherData");
  };

  return (
    <div className="app">
      {loading ? (
        <div className="card loading-card">
          <div className="loader"></div>
        </div>
      ) : !weather ? (
        <div className="card search-card">
          <h2>Weather App</h2>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />

          <button onClick={handleSearch} disabled={loading}>Search</button>
          {error && <p className="error-message">{error}</p>}
          <div className="divider">or</div>
          <button onClick={handleLocation} disabled={loading}>Get Device Location</button>
        </div>
      ) : (
        <WeatherCard data={weather} onBack={handleBack} />
      )}
    </div>
  );
};

export default App;
