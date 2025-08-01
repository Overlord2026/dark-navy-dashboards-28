// Brand color palette for charts
export const CHART_COLORS = {
  // Primary brand colors from design system
  primary: '#D4AF37', // Gold primary
  secondary: '#B8860B', // Gold premium  
  accent: '#0F766E', // Money green accent
  
  // Performance colors
  positive: '#059669', // Success green
  negative: '#DC2626', // Red for losses
  neutral: '#6B7280', // Gray for neutral
  
  // Diversified chart palette
  portfolio: ['#D4AF37', '#0F766E', '#059669', '#B8860B', '#0891B2', '#7C3AED', '#DC2626', '#F59E0B'],
  
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

// Chart styling configurations
export const CHART_STYLES = {
  grid: {
    stroke: '#E5E7EB',
    strokeWidth: 1,
    strokeDasharray: '2 2'
  },
  axis: {
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    fill: '#374151'
  },
  tooltip: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif'
  },
  legend: {
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    fill: '#374151'
  }
};