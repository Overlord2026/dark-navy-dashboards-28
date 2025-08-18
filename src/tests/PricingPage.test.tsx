import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import PricingPage from '@/pages/PricingPage';
import { analytics } from '@/lib/analytics';
import { toast } from '@/lib/toast';

// Mock dependencies
vi.mock('@/lib/analytics', () => ({
  analytics: {
    trackEvent: vi.fn(),
  },
}));

vi.mock('@/lib/toast', () => ({
  toast: {
    ok: vi.fn(),
    err: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock search params
const mockSearchParams = new URLSearchParams();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams],
  };
});

// Mock IntersectionObserver for scroll behavior
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

const PricingPageWrapper = () => (
  <BrowserRouter>
    <PricingPage />
  </BrowserRouter>
);

describe('PricingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.delete('plan');
    mockSearchParams.delete('feature');
  });

  it('renders 3 plans from familiesEntitlements.ts', () => {
    render(<PricingPageWrapper />);
    
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Elite')).toBeInTheDocument();
  });

  it('emits pricing.viewed analytics on mount', () => {
    render(<PricingPageWrapper />);
    
    expect(analytics.trackEvent).toHaveBeenCalledWith('pricing.viewed', {
      plan: null,
      feature: null,
    });
  });

  it('auto-scrolls when feature param points to a higher tier', async () => {
    mockSearchParams.set('plan', 'premium');
    mockSearchParams.set('feature', 'advanced-analytics');
    
    render(<PricingPageWrapper />);
    
    await waitFor(() => {
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
      });
    });
  });

  it('shows upgrade badge when plan and feature params are present', () => {
    mockSearchParams.set('plan', 'premium');
    mockSearchParams.set('feature', 'advanced-analytics');
    
    render(<PricingPageWrapper />);
    
    expect(screen.getByText('Upgrade to access: advanced-analytics')).toBeInTheDocument();
  });

  it('emits pricing.cta.clicked when CTA buttons are clicked', () => {
    render(<PricingPageWrapper />);
    
    const basicButton = screen.getByText('Get Started');
    const premiumButton = screen.getByText('Start Trial');
    const eliteButton = screen.getByText('Contact Sales');
    
    fireEvent.click(basicButton);
    expect(analytics.trackEvent).toHaveBeenCalledWith('pricing.cta.clicked', {
      plan: 'basic',
    });
    
    fireEvent.click(premiumButton);
    expect(analytics.trackEvent).toHaveBeenCalledWith('pricing.cta.clicked', {
      plan: 'premium',
    });
    
    fireEvent.click(eliteButton);
    expect(analytics.trackEvent).toHaveBeenCalledWith('pricing.cta.clicked', {
      plan: 'elite',
    });
  });

  it('shows correct toast messages for each plan CTA', () => {
    render(<PricingPageWrapper />);
    
    const basicButton = screen.getByText('Get Started');
    const premiumButton = screen.getByText('Start Trial');
    const eliteButton = screen.getByText('Contact Sales');
    
    fireEvent.click(basicButton);
    expect(toast.info).toHaveBeenCalledWith('Starting Basic. Tools unlocked per Basic plan.');
    
    fireEvent.click(premiumButton);
    expect(toast.ok).toHaveBeenCalledWith('Trial started (stub).');
    
    fireEvent.click(eliteButton);
    expect(toast.info).toHaveBeenCalledWith('Concierge will reach out (stub).');
  });

  it('highlights Premium plan as recommended', () => {
    render(<PricingPageWrapper />);
    
    expect(screen.getByText('Most Popular')).toBeInTheDocument();
    
    // Premium card should have enhanced styling
    const premiumCard = screen.getByText('Premium').closest('[class*="border-primary"]');
    expect(premiumCard).toBeInTheDocument();
  });

  it('displays feature counts for each tier', () => {
    render(<PricingPageWrapper />);
    
    // Should show feature counts (checking that text pattern exists)
    const featureCounts = screen.getAllByText(/\d+ exclusive features/);
    expect(featureCounts).toHaveLength(3);
  });

  it('displays pricing information correctly', () => {
    render(<PricingPageWrapper />);
    
    expect(screen.getByText('$29')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
    expect(screen.getByText('$299')).toBeInTheDocument();
  });
});