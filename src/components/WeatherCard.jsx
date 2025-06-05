import React from "react";

const WeatherCard = ({ data, onBack }) => {
  return (
    <div className="card weather-card">
      <button className="back-button" onClick={onBack}>
        ❮
        <span className="tooltip-text">Go Back</span>
      </button>


      <h2>Weather Condition</h2>
      <img
        src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt={data.weather[0].description}
      />
      <h1>{Math.round(data.main.temp)}°C</h1>
      <p>{data.weather[0].description}</p>
      <p>📍 {data.name}, {data.sys.country}</p>
      <div className="weather-details">
        <div>
          <p>🌡️ {Math.round(data.main.feels_like)}°C</p>
          <span>Feels like</span>
        </div>
        <div>
          <p>💧 {data.main.humidity}%</p>
          <span>Humidity</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;