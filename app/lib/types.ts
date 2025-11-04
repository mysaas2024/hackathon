export type UserRole = 'admin' | 'farmer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface VegetablePrice {
  id: string;
  name: string;
  price: number;
  region: string;
  date: string; // ISO date string
  unit: string; // e.g., "kg", "dozen"
}

export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  condition: string; // e.g., "Sunny", "Cloudy", "Rainy"
  icon: string; // emoji or icon identifier
}