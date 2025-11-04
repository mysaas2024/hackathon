'use client';

import { useState, useEffect } from 'react';
import { vegetableService } from '@/app/data/vegetableService';
import { VegetablePrice } from '@/app/lib/types';
import DashboardCharts from '@/app/components/DashboardCharts';

export default function AdminDashboard() {
  const [vegetables, setVegetables] = useState<VegetablePrice[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    region: '',
    date: '',
    unit: 'kg'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize with latest prices
  useEffect(() => {
    loadVegetables();
  }, []);

  const loadVegetables = () => {
    const latest = vegetableService.getLatestPrices();
    setVegetables(latest);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing vegetable
      const updated = vegetableService.updateVegetable(editingId, {
        ...formData,
        price: parseFloat(formData.price)
      });
      if (updated) {
        loadVegetables();
      }
    } else {
      // Add new vegetable
      vegetableService.addVegetable({
        name: formData.name,
        price: parseFloat(formData.price),
        region: formData.region,
        date: formData.date || new Date().toISOString().split('T')[0],
        unit: formData.unit
      });
      loadVegetables();
    }
    
    // Reset form
    setFormData({
      name: '',
      price: '',
      region: '',
      date: '',
      unit: 'kg'
    });
    setEditingId(null);
  };

  const handleEdit = (vegetable: VegetablePrice) => {
    setFormData({
      name: vegetable.name,
      price: vegetable.price.toString(),
      region: vegetable.region,
      date: vegetable.date,
      unit: vegetable.unit
    });
    setEditingId(vegetable.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      vegetableService.deleteVegetable(id);
      loadVegetables();
    }
  };

  const filteredVegetables = vegetables.filter(veg => 
    veg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veg.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Vegetable Prices</h2>
        
        {/* Dashboard Charts */}
        <DashboardCharts />
        
        {/* Add/Edit Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? 'Edit Vegetable Price' : 'Add New Vegetable Price'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
            <div className="sm:col-span-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Vegetable Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="kg">kg</option>
                <option value="dozen">dozen</option>
                <option value="piece">piece</option>
              </select>
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <input
                type="text"
                name="region"
                id="region"
                value={formData.region}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            
            <div className="sm:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {editingId ? 'Update' : 'Add'} Price
              </button>
            </div>
          </form>
        </div>
        
        {/* Search and Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Vegetable Prices</h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search vegetables or regions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vegetable
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVegetables.map((vegetable) => (
                  <tr key={vegetable.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vegetable.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs. {vegetable.price.toFixed(2)} / {vegetable.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vegetable.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vegetable.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(vegetable)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vegetable.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}