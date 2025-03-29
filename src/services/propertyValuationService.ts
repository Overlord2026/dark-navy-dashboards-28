
import { Property, PropertyValuation } from "@/types/property";

// Simulated service to get property valuations
export const getPropertyValuation = async (address: string): Promise<PropertyValuation> => {
  // This would be replaced with actual API call to Zillow or similar service
  // For now, we simulate a response with random data
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a somewhat realistic valuation that's within 15% of random base value
  const baseValue = Math.floor(Math.random() * 700000) + 300000;
  const randomFactor = 0.85 + (Math.random() * 0.3); // Between 0.85 and 1.15
  const estimatedValue = Math.floor(baseValue * randomFactor);
  
  // Generate a recent date for "last updated"
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 14); // 0-14 days ago
  const lastUpdated = new Date(today);
  lastUpdated.setDate(today.getDate() - daysAgo);
  
  // Random confidence level
  const confidenceLevels: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
  const confidence = confidenceLevels[Math.floor(Math.random() * confidenceLevels.length)];
  
  return {
    estimatedValue,
    lastUpdated: lastUpdated.toISOString().split('T')[0],
    confidence,
    source: 'Zillow Estimation Service'
  };
};

// Function to update property value based on valuation
export const updatePropertyValue = (property: Property, newValue: number): Property => {
  return {
    ...property,
    currentValue: newValue
  };
};

// Generate a Zillow search URL for a property
export const getZillowSearchUrl = (address: string): string => {
  return `https://www.zillow.com/homes/${encodeURIComponent(address)}_rb/`;
};
