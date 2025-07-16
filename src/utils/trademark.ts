// Utility functions for trademark protection

export const TRADEMARKED_TERMS = {
  "Boutique Family Office": "Boutique Family Office™",
  "Fiduciary Duty Principles": "Fiduciary Duty Principles™",
  "Strategic Wealth Alpha GPS": "Strategic Wealth Alpha GPS™",
  "SWAG": "SWAG™",
} as const;

/**
 * Adds trademark symbols to protected terms
 */
export const addTrademarks = (text: string): string => {
  let result = text;
  
  Object.entries(TRADEMARKED_TERMS).forEach(([term, trademarked]) => {
    const regex = new RegExp(`\\b${term}\\b(?!™)`, 'g');
    result = result.replace(regex, trademarked);
  });
  
  return result;
};

/**
 * React component wrapper that automatically adds trademarks
 */
export const withTrademarks = (text: string) => addTrademarks(text);