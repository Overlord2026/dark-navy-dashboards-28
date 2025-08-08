// MLS/RETS Integration Service
// Scaffold with stubs and environment placeholders

import { MLSListing, RentalComp, MarketTrend } from '@/types/realtor';

// Environment configuration
const MLS_CONFIG = {
  apiUrl: process.env.MLS_API_URL || 'https://demo-mls-api.example.com',
  apiKey: process.env.MLS_API_KEY || 'demo_key_placeholder',
  clientId: process.env.RESO_CLIENT_ID || 'demo_client_id',
  clientSecret: process.env.RESO_CLIENT_SECRET || 'demo_client_secret',
  timeout: 30000 // 30 seconds
};

// MLS Sync Functions
export async function mlsSyncListings({ officeId }: { officeId: string }): Promise<MLSListing[]> {
  try {
    // If no real API credentials, return mock data
    if (!process.env.MLS_API_KEY || MLS_CONFIG.apiKey === 'demo_key_placeholder') {
      console.log('MLS API not configured, returning demo data');
      return getMockMLSListings();
    }

    const response = await fetch(`${MLS_CONFIG.apiUrl}/listings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MLS_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(MLS_CONFIG.timeout)
    });

    if (!response.ok) {
      throw new Error(`MLS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return mapMLSResponse(data);
  } catch (error) {
    console.error('MLS sync error:', error);
    // Fallback to demo data on error
    return getMockMLSListings();
  }
}

export async function getRentalComps(area: string): Promise<RentalComp[]> {
  try {
    if (!process.env.MLS_API_KEY || MLS_CONFIG.apiKey === 'demo_key_placeholder') {
      console.log('MLS API not configured, returning demo rental comps');
      return getMockRentalComps(area);
    }

    const response = await fetch(`${MLS_CONFIG.apiUrl}/rentals/comps`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MLS_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        area,
        radius: 1, // 1 mile radius
        limit: 10
      }),
      signal: AbortSignal.timeout(MLS_CONFIG.timeout)
    });

    if (!response.ok) {
      throw new Error(`Rental comps API error: ${response.status}`);
    }

    const data = await response.json();
    return mapRentalCompsResponse(data);
  } catch (error) {
    console.error('Rental comps error:', error);
    return getMockRentalComps(area);
  }
}

export async function getMarketTrends(zip: string): Promise<MarketTrend[]> {
  try {
    if (!process.env.MLS_API_KEY || MLS_CONFIG.apiKey === 'demo_key_placeholder') {
      console.log('MLS API not configured, returning demo market trends');
      return getMockMarketTrends(zip);
    }

    const response = await fetch(`${MLS_CONFIG.apiUrl}/market/trends`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MLS_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        zip,
        period: 'quarterly',
        metrics: ['prices', 'dom', 'inventory']
      }),
      signal: AbortSignal.timeout(MLS_CONFIG.timeout)
    });

    if (!response.ok) {
      throw new Error(`Market trends API error: ${response.status}`);
    }

    const data = await response.json();
    return mapMarketTrendsResponse(data);
  } catch (error) {
    console.error('Market trends error:', error);
    return getMockMarketTrends(zip);
  }
}

// Cap Rate Calculator
export function estimateCapRate(inputs: { 
  price: number; 
  rent: number; 
  vacancy: number; 
  opex: number; 
  tax: number; 
  hoa: number; 
}): { capRate: number; cashOnCash: number; monthlyNet: number; annualNet: number } {
  const { price, rent, vacancy, opex, tax, hoa } = inputs;
  
  // Annual calculations
  const annualRent = rent * 12;
  const vacancyLoss = annualRent * (vacancy / 100);
  const effectiveIncome = annualRent - vacancyLoss;
  
  const annualExpenses = opex + tax + hoa;
  const netOperatingIncome = effectiveIncome - annualExpenses;
  
  // Cap rate = NOI / Property Value
  const capRate = (netOperatingIncome / price) * 100;
  
  // Assuming 25% down payment for cash-on-cash
  const downPayment = price * 0.25;
  const loanAmount = price - downPayment;
  
  // Estimated mortgage payment (5% interest, 30 years)
  const monthlyRate = 0.05 / 12;
  const numPayments = 30 * 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                        (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  const annualDebtService = monthlyPayment * 12;
  const cashFlow = netOperatingIncome - annualDebtService;
  const cashOnCash = (cashFlow / downPayment) * 100;
  
  return {
    capRate: Math.round(capRate * 100) / 100,
    cashOnCash: Math.round(cashOnCash * 100) / 100,
    monthlyNet: Math.round(cashFlow / 12),
    annualNet: Math.round(cashFlow)
  };
}

// Mock Data Functions (for demo mode)
function getMockMLSListings(): MLSListing[] {
  return [
    {
      mlsNumber: 'MLS001234',
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      beds: 3,
      baths: 2,
      sqft: 1200,
      yearBuilt: 1985,
      listPrice: 1250000,
      status: 'Active',
      daysOnMarket: 15,
      photos: ['/api/placeholder/400/300'],
      description: 'Beautiful Victorian home in prime location',
      listingAgent: {
        name: 'Jane Smith',
        phone: '(555) 123-4567',
        email: 'jane@realty.com'
      },
      updatedAt: new Date()
    },
    {
      mlsNumber: 'MLS005678',
      address: '456 Oak Avenue',
      city: 'San Francisco',
      state: 'CA',
      zip: '94110',
      beds: 2,
      baths: 1,
      sqft: 900,
      yearBuilt: 1950,
      listPrice: 850000,
      status: 'Active',
      daysOnMarket: 8,
      photos: ['/api/placeholder/400/300'],
      description: 'Charming starter home with garden',
      listingAgent: {
        name: 'Bob Johnson',
        phone: '(555) 987-6543',
        email: 'bob@homes.com'
      },
      updatedAt: new Date()
    }
  ];
}

function getMockRentalComps(area: string): RentalComp[] {
  return [
    {
      address: '789 Pine Street',
      beds: 2,
      baths: 1,
      sqft: 850,
      rentPrice: 3200,
      distance: 0.3,
      leaseDate: new Date('2024-01-15')
    },
    {
      address: '321 Elm Drive',
      beds: 2,
      baths: 1,
      sqft: 920,
      rentPrice: 3400,
      distance: 0.5,
      leaseDate: new Date('2024-02-01')
    },
    {
      address: '654 Cedar Lane',
      beds: 2,
      baths: 2,
      sqft: 1050,
      rentPrice: 3800,
      distance: 0.7,
      leaseDate: new Date('2024-01-28')
    }
  ];
}

function getMockMarketTrends(zip: string): MarketTrend[] {
  return [
    {
      id: 'trend_1',
      area: zip,
      type: 'rental',
      currentValue: 3500,
      previousValue: 3300,
      changePercent: 6.1,
      trend: 'up',
      period: 'quarterly',
      dataSource: 'MLS Demo Data',
      createdAt: new Date()
    },
    {
      id: 'trend_2',
      area: zip,
      type: 'dom',
      currentValue: 25,
      previousValue: 32,
      changePercent: -21.9,
      trend: 'down',
      period: 'quarterly',
      dataSource: 'MLS Demo Data',
      createdAt: new Date()
    },
    {
      id: 'trend_3',
      area: zip,
      type: 'inventory',
      currentValue: 45,
      previousValue: 62,
      changePercent: -27.4,
      trend: 'down',
      period: 'quarterly',
      dataSource: 'MLS Demo Data',
      createdAt: new Date()
    }
  ];
}

// Response Mapping Functions
function mapMLSResponse(data: any): MLSListing[] {
  // Map external MLS API response to our MLSListing interface
  if (!data || !Array.isArray(data.listings)) {
    return [];
  }
  
  return data.listings.map((listing: any) => ({
    mlsNumber: listing.ListingKey || listing.mls_number,
    address: `${listing.StreetNumber || ''} ${listing.StreetName || ''}`.trim(),
    city: listing.City || '',
    state: listing.StateOrProvince || '',
    zip: listing.PostalCode || '',
    beds: parseInt(listing.BedroomsTotal) || 0,
    baths: parseFloat(listing.BathroomsTotalInteger) || 0,
    sqft: parseInt(listing.LivingArea) || 0,
    lotSize: parseInt(listing.LotSizeSquareFeet) || undefined,
    yearBuilt: parseInt(listing.YearBuilt) || undefined,
    listPrice: parseFloat(listing.ListPrice) || 0,
    status: listing.StandardStatus || 'Unknown',
    daysOnMarket: parseInt(listing.DaysOnMarket) || 0,
    photos: Array.isArray(listing.Media) ? listing.Media.map((m: any) => m.MediaURL) : [],
    description: listing.PublicRemarks || '',
    listingAgent: {
      name: `${listing.ListAgentFirstName || ''} ${listing.ListAgentLastName || ''}`.trim(),
      phone: listing.ListAgentMobilePhone || listing.ListAgentDirectPhone || '',
      email: listing.ListAgentEmail || ''
    },
    updatedAt: new Date(listing.ModificationTimestamp || Date.now())
  }));
}

function mapRentalCompsResponse(data: any): RentalComp[] {
  if (!data || !Array.isArray(data.comps)) {
    return [];
  }
  
  return data.comps.map((comp: any) => ({
    address: comp.address || '',
    beds: parseInt(comp.beds) || 0,
    baths: parseFloat(comp.baths) || 0,
    sqft: parseInt(comp.sqft) || 0,
    rentPrice: parseFloat(comp.rent) || 0,
    distance: parseFloat(comp.distance) || 0,
    leaseDate: new Date(comp.lease_date || Date.now())
  }));
}

function mapMarketTrendsResponse(data: any): MarketTrend[] {
  if (!data || !Array.isArray(data.trends)) {
    return [];
  }
  
  return data.trends.map((trend: any, index: number) => ({
    id: `trend_${index}`,
    area: trend.area || '',
    type: trend.metric || 'sales',
    currentValue: parseFloat(trend.current_value) || 0,
    previousValue: parseFloat(trend.previous_value) || 0,
    changePercent: parseFloat(trend.change_percent) || 0,
    trend: trend.direction || 'stable',
    period: trend.period || 'quarterly',
    dataSource: trend.source || 'MLS API',
    createdAt: new Date()
  }));
}

// Validation and Configuration Check
export function validateMLSConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!MLS_CONFIG.apiUrl || MLS_CONFIG.apiUrl.includes('demo')) {
    errors.push('MLS API URL not configured');
  }
  
  if (!MLS_CONFIG.apiKey || MLS_CONFIG.apiKey === 'demo_key_placeholder') {
    errors.push('MLS API key not configured');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Health Check
export async function checkMLSHealth(): Promise<{ status: 'healthy' | 'degraded' | 'down'; message: string }> {
  try {
    const { isValid } = validateMLSConfig();
    
    if (!isValid) {
      return {
        status: 'degraded',
        message: 'Running in demo mode - configure MLS credentials for live data'
      };
    }
    
    const response = await fetch(`${MLS_CONFIG.apiUrl}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MLS_CONFIG.apiKey}`
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      return {
        status: 'healthy',
        message: 'MLS API connection healthy'
      };
    } else {
      return {
        status: 'down',
        message: `MLS API error: ${response.status}`
      };
    }
  } catch (error) {
    return {
      status: 'down',
      message: `MLS API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}