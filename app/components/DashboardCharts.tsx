'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { vegetableService } from '@/app/data/vegetableService';
import { VegetablePrice } from '@/app/lib/types';

interface PriceByVegetable {
  name: string;
  avgPrice: number;
  count: number;
}

interface PriceByRegion {
  region: string;
  avgPrice: number;
}

interface VegetableDistribution {
  name: string;
  value: number;
  [key: string]: string | number; // Index signature to satisfy Recharts
}

export default function DashboardCharts() {
  const [priceByVegetable, setPriceByVegetable] = useState<PriceByVegetable[]>([]);
  const [priceByRegion, setPriceByRegion] = useState<PriceByRegion[]>([]);
  const [vegetableDistribution, setVegetableDistribution] = useState<VegetableDistribution[]>([]);
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Get all vegetables
    const allVegetables = vegetableService.getAllVegetables();
    
    // Calculate average price by vegetable
    const vegetableMap = new Map<string, { total: number; count: number }>();
    allVegetables.forEach(veg => {
      if (!vegetableMap.has(veg.name)) {
        vegetableMap.set(veg.name, { total: 0, count: 0 });
      }
      const current = vegetableMap.get(veg.name)!;
      vegetableMap.set(veg.name, {
        total: current.total + veg.price,
        count: current.count + 1
      });
    });
    
    const priceByVeg: PriceByVegetable[] = [];
    vegetableMap.forEach((value, key) => {
      priceByVeg.push({
        name: key,
        avgPrice: value.total / value.count,
        count: value.count
      });
    });
    
    // Calculate average price by region
    const regionMap = new Map<string, { total: number; count: number }>();
    allVegetables.forEach(veg => {
      if (!regionMap.has(veg.region)) {
        regionMap.set(veg.region, { total: 0, count: 0 });
      }
      const current = regionMap.get(veg.region)!;
      regionMap.set(veg.region, {
        total: current.total + veg.price,
        count: current.count + 1
      });
    });
    
    const priceByReg: PriceByRegion[] = [];
    regionMap.forEach((value, key) => {
      priceByReg.push({
        region: key,
        avgPrice: value.total / value.count
      });
    });
    
    // Calculate vegetable distribution
    const distribution: VegetableDistribution[] = [];
    vegetableMap.forEach((value, key) => {
      distribution.push({
        name: key,
        value: value.count
      });
    });
    
    setPriceByVegetable(priceByVeg);
    setPriceByRegion(priceByReg);
    setVegetableDistribution(distribution);
  };

  // Custom label function with proper typing
  const renderCustomizedLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {/* Average Price by Vegetable */}
      <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Average Price by Vegetable</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={priceByVegetable}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={60}
              />
              <YAxis 
                tickFormatter={(value) => `Rs.${value}`}
              />
              <Tooltip 
                formatter={(value) => [`Rs. ${value}`, 'Average Price']}
                labelFormatter={(label) => `Vegetable: ${label}`}
              />
              <Legend />
              <Bar dataKey="avgPrice" name="Average Price (Rs.)" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Average Price by Region */}
      <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Average Price by Region</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={priceByRegion}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="region" 
                angle={-45} 
                textAnchor="end" 
                height={60}
              />
              <YAxis 
                tickFormatter={(value) => `Rs.${value}`}
              />
              <Tooltip 
                formatter={(value) => [`Rs. ${value}`, 'Average Price']}
                labelFormatter={(label) => `Region: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avgPrice" 
                name="Average Price (Rs.)" 
                stroke="#3b82f6" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Vegetable Distribution */}
      <div className="lg:col-span-4 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Vegetable Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={vegetableDistribution}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {vegetableDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}