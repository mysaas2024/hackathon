'use client';

import { useState, useEffect } from 'react';
import { weatherService } from '@/app/data/weatherService';
import { WeatherData } from '@/app/lib/types';

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);

  useEffect(() => {
    loadWeather();
    generateForecast();
  }, []);

  const loadWeather = () => {
    const weatherData = weatherService.getAllWeather();
    setWeather(weatherData);
    
    // Set first city as default selection
    if (weatherData.length > 0 && !selectedCity) {
      setSelectedCity(weatherData[0].city);
    }
  };

  const generateForecast = () => {
    // Generate mock 7-day forecast
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const forecastData = [];
    
    for (let i = 0; i < 7; i++) {
      const day = days[(new Date().getDay() + i) % 7];
      forecastData.push({
        day: i === 0 ? 'Today' : day,
        high: Math.floor(Math.random() * 10) + 30,
        low: Math.floor(Math.random() * 10) + 20,
        condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        icon: ['☀️', '☁️', '⛅', '🌧️'][Math.floor(Math.random() * 4)]
      });
    }
    
    setForecast(forecastData);
  };

  const selectedWeather = weather.find(w => w.city === selectedCity) || weather[0];

  return (
    <div className="px-4 py-6 sm:px-0">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Weather Information</h2>
      
      {/* City Selection */}
      <div className="mb-8">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          Select City
        </label>
        <select
          id="city"
          value={selectedCity || ''}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          {weather.map(city => (
            <option key={city.city} value={city.city}>{city.city}</option>
          ))}
        </select>
      </div>
      
      {/* Current Weather */}
      {selectedWeather && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-6xl mr-4">{selectedWeather.icon}</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedWeather.city}</h3>
                <p className="text-4xl font-bold text-gray-900">{selectedWeather.temperature}°C</p>
                <p className="text-gray-600">{selectedWeather.condition}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Humidity</p>
                <p className="text-xl font-bold">{selectedWeather.humidity}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Condition</p>
                <p className="text-xl font-bold">{selectedWeather.condition}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 7-Day Forecast */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
              <p className="font-medium text-gray-900">{day.day}</p>
              <p className="text-2xl my-2">{day.icon}</p>
              <p className="text-gray-600">{day.condition}</p>
              <div className="mt-2">
                <span className="font-bold text-gray-900">{day.high}°</span>
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-gray-600">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Farming Tips Based on Weather */}
      {selectedWeather && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Farming Advice</h3>
          <div className="prose max-w-none">
            {selectedWeather.temperature > 35 ? (
              <div>
                <h4 className="text-lg font-medium text-red-600">High Temperature Alert</h4>
                <ul className="list-disc pl-5 mt-2">
                  <li>Increase irrigation frequency to prevent crop stress</li>
                  <li>Apply mulch to retain soil moisture</li>
                  <li>Consider shade cloth for sensitive crops</li>
                  <li>Harvest early morning or late evening to reduce heat damage</li>
                </ul>
              </div>
            ) : selectedWeather.humidity > 70 ? (
              <div>
                <h4 className="text-lg font-medium text-blue-600">High Humidity Conditions</h4>
                <ul className="list-disc pl-5 mt-2">
                  <li>Monitor for fungal diseases like blight and mildew</li>
                  <li>Improve air circulation around plants</li>
                  <li>Avoid overhead watering to reduce moisture on leaves</li>
                  <li>Consider preventive fungicide applications</li>
                </ul>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-medium text-green-600">Optimal Growing Conditions</h4>
                <ul className="list-disc pl-5 mt-2">
                  <li>Great time for planting new crops</li>
                  <li>Ideal conditions for crop growth and development</li>
                  <li>Regular watering schedule is sufficient</li>
                  <li>Monitor for pests as they may become active</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}