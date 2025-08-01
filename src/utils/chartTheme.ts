// Modern vibrant color palette for charts
export const CHART_COLORS = {
  // Primary brand colors - vibrant blue/gold/green theme
  primary: '#2563EB', // Vibrant blue primary
  secondary: '#D4AF37', // Elegant gold  
  accent: '#059669', // Success green accent
  
  // Performance colors with enhanced vibrancy
  positive: '#10B981', // Bright success green
  negative: '#EF4444', // Clear red for losses
  neutral: '#6B7280', // Professional gray
  
  // Modern diversified chart palette with shadows and depth
  portfolio: ['#2563EB', '#D4AF37', '#059669', '#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#84CC16'],
  
  // Benchmark colors (distinct from portfolio)
  benchmarks: {
    sp500: '#1E40AF', // Deep blue for S&P 500
    agg: '#7C2D12', // Brown for AGG bonds
    msci: '#6366F1', // Indigo for MSCI
    custom: '#BE185D' // Pink for custom benchmarks
  },
  
  // Risk level colors
  risk: {
    conservative: '#059669', // Green
    moderate: '#0891B2', // Blue
    growth: '#F59E0B', // Orange
    aggressive: '#DC2626' // Red
  },
  
  // Accessibility-friendly alternatives
  accessible: {
    high: '#0F766E',
    medium: '#D4AF37', 
    low: '#059669',
    danger: '#DC2626'
  }
};

// Modern chart styling with shadows and animations
export const CHART_STYLES = {
  grid: {
    stroke: '#E5E7EB',
    strokeWidth: 1,
    strokeDasharray: '3 3',
    opacity: 0.6
  },
  axis: {
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    fill: '#374151',
    fontWeight: 500
  },
  tooltip: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    padding: '12px'
  },
  legend: {
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    fill: '#374151',
    fontWeight: 500
  },
  // Animation configurations
  animations: {
    duration: 800,
    easing: 'ease-out',
    delay: 100
  },
  // Enhanced visual effects
  effects: {
    chartShadow: '0 4px 20px rgba(37, 99, 235, 0.15)',
    barShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    glowEffect: '0 0 20px rgba(37, 99, 235, 0.3)'
  }
};

// ROI formatting utilities
export const formatROI = (amount: number, timeframe: string = '') => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return timeframe ? `${formatted} over ${timeframe}` : formatted;
};