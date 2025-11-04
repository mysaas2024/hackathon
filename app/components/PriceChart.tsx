'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { vegetableService } from '@/app/data/vegetableService';
import { VegetablePrice } from '@/app/lib/types';

interface PriceChartProps {
  vegetableNames: string | string[]; // Support single or multiple vegetables
  region: string;
}

interface ChartDataPoint {
  date: string;
  [key: string]: string | number; // Dynamic keys for multiple vegetables
}

export default function PriceChart({ vegetableNames, region }: PriceChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [vegetableList, setVegetableList] = useState<string[]>([]);

  useEffect(() => {
    // Normalize vegetableNames to an array
    const names = Array.isArray(vegetableNames) ? vegetableNames : [vegetableNames];
    setVegetableList(names);
    
    loadChartData(names);
  }, [vegetableNames, region]);

  const loadChartData = (names: string[]) => {
    // Get all unique dates across all vegetables
    const allDates = new Set<string>();
    const vegetableData: Record<string, Record<string, number>> = {};
    
    names.forEach(name => {
      const historicalPrices = vegetableService.getHistoricalPrices(name, region);
      vegetableData[name] = {};
      
      historicalPrices.forEach(item => {
        allDates.add(item.date);
        vegetableData[name][item.date] = item.price;
      });
    });
    
    // Convert Set to sorted array
    const sortedDates = Array.from(allDates).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
    
    // Create chart data points
    const formattedData: ChartDataPoint[] = sortedDates.map(date => {
      const dataPoint: ChartDataPoint = {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
      
      names.forEach(name => {
        dataPoint[name] = vegetableData[name][date] || 0;
      });
      
      return dataPoint;
    });
    
    setChartData(formattedData);
  };

  // Generate distinct colors for multiple lines
  const getColor = (index: number) => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[index % colors.length];
  };

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No price data available for {Array.isArray(vegetableNames) ? vegetableNames.join(', ') : vegetableNames} in {region}
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            domain={['dataMin - 10', 'dataMax + 10']} 
            tickFormatter={(value) => `Rs.${value}`}
          />
          <Tooltip 
            formatter={(value) => [`Rs. ${value}`, 'Price']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          {vegetableList.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              name={name}
              stroke={getColor(index)}
              activeDot={{ r: 8 }}
              strokeWidth={2}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}