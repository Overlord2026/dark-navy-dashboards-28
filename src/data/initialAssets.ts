
import { Asset, Account } from '@/types/asset';

export const initialAssets: Asset[] = [
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

export const initialAccounts: Account[] = [
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

// Sample value for liabilities (used in the context)
export const initialLiabilityValue = 150000;
