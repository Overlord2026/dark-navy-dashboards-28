// Mock ROI tracking data for the Advisor Platform
// This will be replaced with real API calls/data stores later

export interface ROIMetrics {
  totalSpend: number;
  conversionRate: number;
  newProspects: number;
  newAUM: number;
  period: string;
}

export interface ChannelPerformance {
  id: string;
  channel: string;
  spend: number;
  prospects: number;
  conversions: number;
  aum: number;
  costPerProspect: number;
  costPerConversion: number;
  roi: number;
}

export interface ChartDataPoint {
  month: string;
  spend: number;
  prospects: number;
  conversions: number;
  aum: number;
  roi: number;
}

// Mock ROI metrics
export const getMockROIMetrics = (): ROIMetrics => {
  return {
    totalSpend: 125000,
    conversionRate: 18.5,
    newProspects: 89,
    newAUM: 12500000,
    period: 'Last 6 Months'
  };
};

// Mock channel performance data
export const getMockChannelPerformance = (): ChannelPerformance[] => {
  return [
    {
      id: 'facebook',
      channel: 'Facebook Ads',
      spend: 25000,
      prospects: 32,
      conversions: 6,
      aum: 3200000,
      costPerProspect: 781.25,
      costPerConversion: 4166.67,
      roi: 12700
    },
    {
      id: 'linkedin',
      channel: 'LinkedIn Campaigns',
      spend: 35000,
      prospects: 28,
      conversions: 8,
      aum: 4500000,
      costPerProspect: 1250,
      costPerConversion: 4375,
      roi: 12757
    },
    {
      id: 'google',
      channel: 'Google Ads',
      spend: 30000,
      prospects: 18,
      conversions: 4,
      aum: 2100000,
      costPerProspect: 1666.67,
      costPerConversion: 7500,
      roi: 6900
    },
    {
      id: 'webinars',
      channel: 'Webinar Series',
      spend: 20000,
      prospects: 45,
      conversions: 9,
      aum: 2800000,
      costPerProspect: 444.44,
      costPerConversion: 2222.22,
      roi: 13900
    },
    {
      id: 'seminars',
      channel: 'In-Person Seminars',
      spend: 15000,
      prospects: 22,
      conversions: 5,
      aum: 1900000,
      costPerProspect: 681.82,
      costPerConversion: 3000,
      roi: 12567
    }
  ];
};

// Mock chart data for trends
export const getMockChartData = (): ChartDataPoint[] => {
  return [
    {
      month: 'Jul',
      spend: 18000,
      prospects: 12,
      conversions: 2,
      aum: 1800000,
      roi: 9900
    },
    {
      month: 'Aug',
      spend: 22000,
      prospects: 18,
      conversions: 3,
      aum: 2200000,
      roi: 9900
    },
    {
      month: 'Sep',
      spend: 19500,
      prospects: 15,
      conversions: 4,
      aum: 2800000,
      roi: 14256
    },
    {
      month: 'Oct',
      spend: 21000,
      prospects: 14,
      conversions: 3,
      aum: 2100000,
      roi: 9900
    },
    {
      month: 'Nov',
      spend: 23500,
      prospects: 16,
      conversions: 4,
      aum: 2600000,
      roi: 10957
    },
    {
      month: 'Dec',
      spend: 21000,
      prospects: 14,
      conversions: 2,
      aum: 1000000,
      roi: 4662
    }
  ];
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
};

// Helper function to format percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Helper function to get channel performance color
export const getChannelPerformanceColor = (roi: number): string => {
  if (roi >= 12000) return 'text-green-600';
  if (roi >= 8000) return 'text-yellow-600';
  return 'text-red-600';
};

// Helper function to get ROI trend
export const getROITrend = (current: number, previous: number): { trend: 'up' | 'down' | 'stable'; percentage: number } => {
  const change = ((current - previous) / previous) * 100;
  
  if (Math.abs(change) < 1) {
    return { trend: 'stable', percentage: 0 };
  }
  
  return {
    trend: change > 0 ? 'up' : 'down',
    percentage: Math.abs(change)
  };
};