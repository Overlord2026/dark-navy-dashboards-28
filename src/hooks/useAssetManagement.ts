
// Sample initial data for assets and accounts
const initialAssets = [
  {
    id: 'cash1',
    name: 'Checking Account',
    type: 'cash',
    value: 25000,
    owner: 'Tom Brady',
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: 'invest1',
    name: 'Stock Portfolio',
    type: 'investment',
    value: 350000,
    owner: 'Tom Brady',
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: 'retire1',
    name: '401(k)',
    type: 'retirement',
    value: 420000,
    owner: 'Tom Brady',
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: 'vehicle1',
    name: 'Tesla Model X',
    type: 'vehicle',
    value: 85000,
    owner: 'Tom Brady',
    lastUpdated: new Date().toISOString().split('T')[0],
    details: {
      year: '2023',
      make: 'Tesla',
      model: 'Model X',
      condition: 'Excellent'
    }
  },
  {
    id: 'boat1',
    name: 'Yacht',
    type: 'boat',
    value: 750000,
    owner: 'Tom Brady',
    lastUpdated: new Date().toISOString().split('T')[0],
    details: {
      year: '2021',
      make: 'Sea Ray',
      model: 'Sundancer 370',
      location: 'Boston Harbor Marina'
    }
  },
  {
    id: 'art1',
    name: 'Modern Art Collection',
    type: 'art',
    value: 120000,
    owner: 'Tom Brady',
    lastUpdated: new Date().toISOString().split('T')[0],
    details: {
      description: 'Collection of contemporary art pieces',
      location: 'Primary Residence'
    }
  },
  {
    id: 'digital1',
    name: 'Cryptocurrency Portfolio',
    type: 'digital',
    value: 85000,
    owner: 'Tom Brady',
    lastUpdated: new Date().toISOString().split('T')[0],
    details: {
      description: 'Bitcoin, Ethereum, and other cryptocurrencies'
    }
  }
];

const initialAccounts = [
  {
    id: 'acc1',
    name: 'Primary Checking',
    type: 'banking',
    value: 15000,
    institution: 'Chase Bank'
  },
  {
    id: 'acc2',
    name: 'Investment Account',
    type: 'investment',
    value: 250000,
    institution: 'Fidelity'
  },
  {
    id: 'acc3',
    name: 'Managed Portfolio',
    type: 'managed',
    value: 500000,
    institution: 'Family Office'
  }
];

// Utility functions that don't use React hooks
export const getInitialAssets = () => initialAssets;
export const getInitialAccounts = () => initialAccounts;

// Asset calculation utility functions (no React hooks)
export const calculateTotalNetWorth = (assets) => {
  return assets.reduce((total, asset) => total + asset.value, 0);
};

export const calculateTotalAssetsByType = (assets, type) => {
  return assets
    .filter(asset => asset.type === type)
    .reduce((total, asset) => total + asset.value, 0);
};

export const getAssetsByOwner = (assets, owner) => {
  return assets.filter(asset => asset.owner === owner);
};

export const getAssetsByCategory = (assets, category) => {
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

// Convert properties to assets
export const createPropertyAssets = (properties) => {
  return properties.map(property => ({
    id: `property-${property.id}`,
    name: property.name,
    type: 'property',
    value: property.currentValue,
    owner: property.owner,
    lastUpdated: property.valuation?.lastUpdated || new Date().toISOString().split('T')[0],
    sourceId: property.id,
    source: property.valuation ? 'zillow' : 'manual'
  }));
};

export const useAssetManagement = () => {
  // This is the React hook that can only be called inside a React component
  // All implementation will be moved to NetWorthContext.tsx
  // This is just a stub to maintain compatibility
  throw new Error('useAssetManagement should not be called directly - use useNetWorth instead');
};
