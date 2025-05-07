
import { PropertyValuation } from "@/types/property";

export const getPropertyValuation = async (address: string): Promise<PropertyValuation> => {
  // This is a mock implementation that would normally call an API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a realistic but fake valuation
      const baseValue = 350000 + Math.floor(Math.random() * 650000);
      const confidenceValues = ["low", "medium", "high"] as const;
      const confidence = confidenceValues[Math.floor(Math.random() * confidenceValues.length)];
      
      resolve({
        estimatedValue: baseValue,
        source: "Zillow Estimate",
        confidence,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }, 1500); // Simulate API delay
  });
};

export const getZillowSearchUrl = (address: string): string => {
  const formattedAddress = encodeURIComponent(address);
  return `https://www.zillow.com/homes/${formattedAddress}_rb/`;
};
