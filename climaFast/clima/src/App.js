import React, { useState } from 'react';
import axios from 'axios';
import './estilos.css'

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const fetchWeather = async () => {
    const apiKey = 'ae313ace0f4e43ed978144849240606';
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    try {
      const response = await axios.get(url);
      const weatherData = response.data;
      setWeather(weatherData);
      guardarHistorial(city, weatherData); // Llama a la función para guardar el historial
      setCity('');
    } catch (error) {
      console.error("Error fetching the weather data", error);
    }
  };

  const guardarHistorial = async (ciudad, datosClima) => {
    try {
      await axios.post('http://localhost:5000/api/history', { city: ciudad, weather: datosClima });
      console.log('Historial guardado en MongoDB');
      setSearchHistory(prevHistory => [ciudad, ...prevHistory]);
    } catch (error) {
      console.error('Error al guardar el historial en MongoDB:', error);
    }
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div className='clim'>
      <h1>Aplicación de Clima</h1>
      <input
        type="text"
        value={city}
        onChange={handleInputChange}
        placeholder="Ingrese la ciudad"
      />
      <button onClick={fetchWeather}>Buscar</button>
      <div>
        <h3>Historial de Búsqueda:</h3>
        <ul className='history'>
          {searchHistory.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      {weather && (
        <div>
          <h2>Clima en {weather.location.name}</h2>
          <p>Temperatura: {weather.current.temp_c}°C</p>
          <p>Condición: {weather.current.condition.text}</p>
        </div>
      )}
    </div>
  );
}

export default App;