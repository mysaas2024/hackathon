// Mock weather service for Pakistani cities
import { WeatherData } from '../lib/types';

class WeatherService {
  private weatherData: WeatherData[] = [];
  
  constructor() {
    this.initializeMockData();
  }
  
  private initializeMockData() {
    const cities = [
      { name: 'Karachi', temp: 32, humidity: 65, condition: 'Sunny', icon: '☀️' },
      { name: 'Lahore', temp: 35, humidity: 45, condition: 'Clear', icon: '☀️' },
      { name: 'Islamabad', temp: 28, humidity: 55, condition: 'Partly Cloudy', icon: '⛅' },
      { name: 'Peshawar', temp: 38, humidity: 40, condition: 'Hot', icon: '🔥' },
      { name: 'Quetta', temp: 22, humidity: 30, condition: 'Clear', icon: '☀️' },
      { name: 'Multan', temp: 40, humidity: 35, condition: 'Very Hot', icon: '🌡️' },
      { name: 'Faisalabad', temp: 34, humidity: 50, condition: 'Sunny', icon: '☀️' },
      { name: 'Rawalpindi', temp: 29, humidity: 58, condition: 'Cloudy', icon: '☁️' }
    ];
    
    this.weatherData = cities.map(city => ({
      city: city.name,
      temperature: city.temp,
      humidity: city.humidity,
      condition: city.condition,
      icon: city.icon
    }));
  }
  
  getAllWeather(): WeatherData[] {
    return [...this.weatherData];
  }
  
  getWeatherByCity(city: string): WeatherData | undefined {
    return this.weatherData.find(w => w.city.toLowerCase() === city.toLowerCase());
  }
  
  getWeatherByRegion(region: string): WeatherData | undefined {
    // Map regions to closest city for weather data
    const regionToCityMap: Record<string, string> = {
      'sindh': 'Karachi',
      'punjab': 'Lahore',
      'kpk': 'Peshawar',
      'balochistan': 'Quetta',
      'islamabad': 'Islamabad',
      'ajk': 'Rawalpindi',
      'gilgit': 'Islamabad'
    };
    
    const mappedCity = regionToCityMap[region.toLowerCase()];
    if (mappedCity) {
      return this.getWeatherByCity(mappedCity);
    }
    
    // If no mapping, try direct match
    return this.getWeatherByCity(region);
  }
}

// Export singleton instance
export const weatherService = new WeatherService();