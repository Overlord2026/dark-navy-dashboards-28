
import { API_ENDPOINTS, API_KEYS } from '@/config';

export const fetchAlphaVantageData = async (symbol: string): Promise<number> => {
  const response = await fetch(
    `${API_ENDPOINTS.ALPHA_VANTAGE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEYS.ALPHA_VANTAGE}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${symbol}`);
  }
  
  const data = await response.json();
  
  if (!data['Global Quote'] || !data['Global Quote']['10. change percent']) {
    throw new Error('Invalid API response format');
  }
  
  const changePercentStr = data['Global Quote']['10. change percent'];
  const changePercent = parseFloat(changePercentStr.replace('%', ''));
  
  return changePercent;
};
