'use client';

import { useState, useEffect } from 'react';
import { vegetableService } from '@/app/data/vegetableService';
import { weatherService } from '@/app/data/weatherService';
import { VegetablePrice, WeatherData } from '@/app/lib/types';
import PriceChart from '@/app/components/PriceChart';
import DashboardCharts from '@/app/components/DashboardCharts';

export default function FarmerDashboard() {
  const [vegetables, setVegetables] = useState<VegetablePrice[]>([]);
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVegetable, setSelectedVegetable] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  // Load data on component mount
  useEffect(() => {
    loadVegetables();
    loadWeather();
  }, []);

  const loadVegetables = () => {
    const latest = vegetableService.getLatestPrices();
    setVegetables(latest);
  };

  const loadWeather = () => {
    const weatherData = weatherService.getAllWeather();
    setWeather(weatherData);
  };

  // Get unique regions for filter dropdown
  const regions = ['All', ...vegetableService.getUniqueRegions()];

  // Filter vegetables based on search and region
  const filteredVegetables = vegetables.filter(veg => {
    const matchesSearch = veg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         veg.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || veg.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // Group vegetables by name for display
  const groupedVegetables = filteredVegetables.reduce((acc, veg) => {
    if (!acc[veg.name]) {
      acc[veg.name] = [];
    }
    acc[veg.name].push(veg);
    return acc;
  }, {} as Record<string, VegetablePrice[]>);

  const handleVegetableSelect = (name: string) => {
    if (comparisonMode) {
      // Toggle selection for comparison
      if (selectedForComparison.includes(name)) {
        setSelectedForComparison(selectedForComparison.filter(item => item !== name));
      } else {
        setSelectedForComparison([...selectedForComparison, name]);
      }
    } else {
      // Toggle detail view
      setSelectedVegetable(selectedVegetable === name ? null : name);
    }
  };

  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    setSelectedForComparison([]);
    setSelectedVegetable(null);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Market Prices & Weather</h2>
        
        {/* Dashboard Charts */}
        <DashboardCharts />
        
        {/* Weather Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Current Weather</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {weather.map((cityWeather) => (
              <div key={cityWeather.city} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{cityWeather.city}</h4>
                    <p className="text-2xl font-bold text-gray-900">{cityWeather.temperature}°C</p>
                  </div>
                  <span className="text-2xl">{cityWeather.icon}</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{cityWeather.condition}</p>
                  <p className="text-sm text-gray-600">Humidity: {cityWeather.humidity}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Controls */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Vegetables
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Region
              </label>
              <select
                id="region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={toggleComparisonMode}
                className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  comparisonMode 
                    ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500'
                }`}
              >
                {comparisonMode ? 'Exit Comparison' : 'Compare Prices'}
              </button>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('All');
                }}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Comparison Chart */}
          {comparisonMode && selectedForComparison.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">
                Price Comparison: {selectedForComparison.join(', ')}
              </h4>
              <PriceChart 
                vegetableNames={selectedForComparison} 
                region={selectedRegion === 'All' ? vegetables[0]?.region || 'Karachi' : selectedRegion} 
              />
            </div>
          )}
        </div>
        
        {/* Vegetable Prices Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Current Market Prices</h3>
            {comparisonMode && (
              <div className="text-sm text-purple-600">
                {selectedForComparison.length} selected for comparison
              </div>
            )}
          </div>
          
          <div className="divide-y divide-gray-200">
            {Object.entries(groupedVegetables).map(([name, vegList]) => (
              <div key={name} className="hover:bg-gray-50">
                <div 
                  className={`px-4 py-4 sm:px-6 cursor-pointer flex justify-between items-center ${
                    comparisonMode && selectedForComparison.includes(name) ? 'bg-purple-50' : ''
                  }`}
                  onClick={() => handleVegetableSelect(name)}
                >
                  <div className="flex items-center">
                    {comparisonMode && (
                      <input
                        type="checkbox"
                        checked={selectedForComparison.includes(name)}
                        onChange={() => {}} // Handled by parent div click
                        className="h-4 w-4 text-purple-600 rounded mr-3"
                      />
                    )}
                    <h4 className="text-lg font-medium text-gray-900">{name}</h4>
                    <span className="ml-2 text-sm text-gray-500">({vegList.length} regions)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      Rs. {Math.min(...vegList.map(v => v.price)).toFixed(2)} - Rs. {Math.max(...vegList.map(v => v.price)).toFixed(2)}
                    </span>
                    {!comparisonMode && (
                      <svg 
                        className={`h-5 w-5 text-gray-500 transform transition-transform ${selectedVegetable === name ? 'rotate-180' : ''}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {!comparisonMode && selectedVegetable === name && (
                  <div className="px-4 pb-4 sm:px-6">
                    {/* Price Chart */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">7-Day Price Trend</h5>
                      <PriceChart vegetableNames={[name]} region={vegList[0]?.region || ''} />
                    </div>
                    
                    {/* Detailed Prices */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Region
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Unit
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {vegList.map((vegetable) => (
                            <tr key={`${vegetable.id}-${vegetable.region}`}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {vegetable.region}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                Rs. {vegetable.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                /{vegetable.unit}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {vegetable.date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}