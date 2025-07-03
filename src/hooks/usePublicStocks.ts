import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface PublicStock {
  id: string;
  companyName: string;
  tickerSymbol: string;
  numberOfShares: number;
  pricePerShare: number;
  totalValue: number;
  createdAt: string;
}

export interface PublicStockData {
  companyName: string;
  tickerSymbol: string;
  numberOfShares: number;
  pricePerShare: number;
}

export const usePublicStocks = () => {
  const [stocks, setStocks] = useState<PublicStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Simulate fetching stocks - in a real app, this would come from an API
  const fetchStocks = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get from localStorage for demo purposes
      const savedStocks = localStorage.getItem('publicStocks');
      if (savedStocks) {
        setStocks(JSON.parse(savedStocks));
      }
    } catch (error) {
      console.error('Error fetching public stocks:', error);
      toast.error('Failed to fetch public stocks');
    } finally {
      setLoading(false);
    }
  };

  // Add a new public stock
  const addStock = async (stockData: PublicStockData): Promise<PublicStock | null> => {
    try {
      setSaving(true);
      
      const totalValue = stockData.numberOfShares * stockData.pricePerShare;
      
      const newStock: PublicStock = {
        id: `stock-${Date.now()}`,
        ...stockData,
        totalValue,
        createdAt: new Date().toISOString()
      };

      const updatedStocks = [newStock, ...stocks];
      setStocks(updatedStocks);
      
      // Save to localStorage for demo purposes
      localStorage.setItem('publicStocks', JSON.stringify(updatedStocks));
      
      toast.success('Public stock added successfully');
      return newStock;
    } catch (error) {
      console.error('Error adding public stock:', error);
      toast.error('Failed to add public stock');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Delete a public stock
  const deleteStock = async (id: string): Promise<boolean> => {
    try {
      setSaving(true);
      
      const updatedStocks = stocks.filter(stock => stock.id !== id);
      setStocks(updatedStocks);
      
      // Save to localStorage for demo purposes
      localStorage.setItem('publicStocks', JSON.stringify(updatedStocks));
      
      toast.success('Public stock deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting public stock:', error);
      toast.error('Failed to delete public stock');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Get total value of all stocks
  const getTotalValue = () => {
    return stocks.reduce((total, stock) => total + stock.totalValue, 0);
  };

  // Get formatted total value
  const getFormattedTotalValue = () => {
    const total = getTotalValue();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(total);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return {
    stocks,
    loading,
    saving,
    addStock,
    deleteStock,
    getTotalValue,
    getFormattedTotalValue,
    refreshStocks: fetchStocks,
  };
};