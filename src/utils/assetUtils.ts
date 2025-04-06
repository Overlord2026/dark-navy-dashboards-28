
import { Asset } from '@/types/asset';

/**
 * Calculates the total value of the provided assets
 */
export const calculateTotalValue = (assets: Asset[]): number => {
  return assets.reduce((total, asset) => total + asset.value, 0);
};

/**
 * Filters assets by type
 */
export const getAssetsByType = (assets: Asset[], type: Asset['type']): Asset[] => {
  return assets.filter(asset => asset.type === type);
};

/**
 * Calculates the total value of assets by type
 */
export const getTotalValueByType = (assets: Asset[], type: Asset['type']): number => {
  return getAssetsByType(assets, type)
    .reduce((total, asset) => total + asset.value, 0);
};

/**
 * Filters assets by owner
 */
export const getAssetsByOwner = (assets: Asset[], owner: string): Asset[] => {
  return assets.filter(asset => asset.owner === owner);
};

/**
 * Filters assets by category (could be a specific type or a group of types)
 */
export const getAssetsByCategory = (assets: Asset[], category: string): Asset[] => {
  if (category === 'vehicles') {
    return assets.filter(asset => ['vehicle', 'boat'].includes(asset.type));
  }
  
  if (category === 'collectibles') {
    return assets.filter(asset => ['antique', 'collectible', 'jewelry'].includes(asset.type));
  }
  
  if (category === 'art') {
    return assets.filter(asset => asset.type === 'art');
  }
  
  if (category === 'digital') {
    return assets.filter(asset => asset.type === 'digital');
  }
  
  // Default: return by exact type
  return assets.filter(asset => asset.type === category);
};
