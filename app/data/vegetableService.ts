// Mock data service for vegetable prices
import { VegetablePrice } from '../lib/types';

class VegetableService {
  private vegetables: VegetablePrice[] = [];
  
  constructor() {
    // Initialize with some mock data
    this.initializeMockData();
  }
  
  private initializeMockData() {
    const vegetables = ['Tomato', 'Potato', 'Onion', 'Carrot', 'Cabbage', 'Spinach', 'Cauliflower', 'Brinjal'];
    const regions = ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta'];
    const units = ['kg', 'dozen'];
    
    // Generate mock data for the past 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      vegetables.forEach(veg => {
        regions.forEach(region => {
          const unit = units[Math.floor(Math.random() * units.length)];
          const price = Math.floor(Math.random() * 200) + 50; // Random price between 50-250
          
          this.vegetables.push({
            id: `veg_${this.vegetables.length + 1}`,
            name: veg,
            price,
            region,
            date: dateString,
            unit
          });
        });
      });
    }
  }
  
  getAllVegetables(): VegetablePrice[] {
    return [...this.vegetables];
  }
  
  getVegetablesByDate(date: string): VegetablePrice[] {
    return this.vegetables.filter(veg => veg.date === date);
  }
  
  getVegetablesByName(name: string): VegetablePrice[] {
    return this.vegetables.filter(veg => veg.name.toLowerCase() === name.toLowerCase());
  }
  
  getLatestPrices(): VegetablePrice[] {
    // Get unique vegetables with latest prices
    const uniqueVegs = new Map<string, VegetablePrice>();
    
    this.vegetables.forEach(veg => {
      const key = `${veg.name}-${veg.region}`;
      if (!uniqueVegs.has(key) || uniqueVegs.get(key)!.date < veg.date) {
        uniqueVegs.set(key, veg);
      }
    });
    
    return Array.from(uniqueVegs.values());
  }
  
  addVegetable(vegetable: Omit<VegetablePrice, 'id'>): VegetablePrice {
    const newVegetable: VegetablePrice = {
      ...vegetable,
      id: `veg_${Date.now()}`
    };
    
    this.vegetables.push(newVegetable);
    return newVegetable;
  }
  
  updateVegetable(id: string, updates: Partial<VegetablePrice>): VegetablePrice | null {
    const index = this.vegetables.findIndex(veg => veg.id === id);
    if (index === -1) return null;
    
    this.vegetables[index] = { ...this.vegetables[index], ...updates };
    return this.vegetables[index];
  }
  
  deleteVegetable(id: string): boolean {
    const initialLength = this.vegetables.length;
    this.vegetables = this.vegetables.filter(veg => veg.id !== id);
    return this.vegetables.length < initialLength;
  }
  
  getHistoricalPrices(vegetableName: string, region: string): VegetablePrice[] {
    return this.vegetables
      .filter(veg => 
        veg.name.toLowerCase() === vegetableName.toLowerCase() && 
        veg.region.toLowerCase() === region.toLowerCase()
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  getUniqueVegetableNames(): string[] {
    const names = new Set(this.vegetables.map(veg => veg.name));
    return Array.from(names).sort();
  }
  
  getUniqueRegions(): string[] {
    const regions = new Set(this.vegetables.map(veg => veg.region));
    return Array.from(regions).sort();
  }
}

// Export singleton instance
export const vegetableService = new VegetableService();