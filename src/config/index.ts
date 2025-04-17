
// API Endpoints
export const API_ENDPOINTS = {
  ZILLOW: 'https://api.bridgedataoutput.com/api/v2/zestimates',
  PERPLEXITY: 'https://api.perplexity.ai/chat/completions',
  ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
} as const;

// Feature flags and toggles
export const FEATURES = {
  ENABLE_DIAGNOSTICS: true,
  ENABLE_ANALYTICS: true,
} as const;

// API Keys (Note: In a production environment, sensitive keys should be stored securely)
export const API_KEYS = {
  ZILLOW: 'YOUR_ZILLOW_API_KEY', // Demo key for development
  ALPHA_VANTAGE: 'demo', // Alpha Vantage demo key
} as const;

// Cache durations
export const CACHE_DURATIONS = {
  MARKET_DATA: 15 * 60 * 1000, // 15 minutes in milliseconds
} as const;

// Default values
export const DEFAULTS = {
  COURSE_PAGE_SIZE: 10,
  API_TIMEOUT: 30000, // 30 seconds
} as const;
