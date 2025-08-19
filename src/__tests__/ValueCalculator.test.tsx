import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ValueCalculator from '@/pages/ValueCalculator';
import { analytics } from '@/lib/analytics';

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  analytics: {
    track: vi.fn(),
    trackPageView: vi.fn()
  }
}));

// Mock motion components
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => children
}));

// Mock sound utils
vi.mock('@/utils/sounds', () => ({
  playSound: vi.fn()
}));

// Mock confetti component
vi.mock('@/components/ConfettiAnimation', () => ({
  Celebration: ({ trigger }: { trigger: boolean }) => null
}));

// Mock stress test component
vi.mock('@/components/retirement/StressTestPreview', () => ({
  StressTestPreview: () => <div data-testid="stress-test-preview">Stress Test Preview</div>
}));

describe('ValueCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders horizon toggle buttons', () => {
    render(<ValueCalculator />);
    
    expect(screen.getByRole('button', { name: '10 years' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '20 years' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '30 years' })).toBeInTheDocument();
  });

  it('changes horizon and tracks analytics when button clicked', () => {
    render(<ValueCalculator />);
    
    const tenYearButton = screen.getByRole('button', { name: '10 years' });
    fireEvent.click(tenYearButton);
    
    expect(analytics.track).toHaveBeenCalledWith('calc.horizon_set', { horizon_years: 10 });
    expect(tenYearButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows active state for selected horizon', () => {
    render(<ValueCalculator />);
    
    // 30 years should be selected by default
    const thirtyYearButton = screen.getByRole('button', { name: '30 years' });
    expect(thirtyYearButton).toHaveAttribute('aria-pressed', 'true');
    
    // Click 20 years
    const twentyYearButton = screen.getByRole('button', { name: '20 years' });
    fireEvent.click(twentyYearButton);
    
    expect(twentyYearButton).toHaveAttribute('aria-pressed', 'true');
    expect(thirtyYearButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('updates calculation when horizon changes', () => {
    render(<ValueCalculator />);
    
    const tenYearButton = screen.getByRole('button', { name: '10 years' });
    fireEvent.click(tenYearButton);
    
    const calculateButton = screen.getByRole('button', { name: /Calculate Your Savings/i });
    fireEvent.click(calculateButton);
    
    // Should track calculation with updated horizon
    expect(analytics.track).toHaveBeenCalledWith(
      'calc_run',
      expect.objectContaining({ timeHorizon: 10 })
    );
  });

  it('tracks page view on mount', () => {
    render(<ValueCalculator />);
    
    expect(analytics.trackPageView).toHaveBeenCalledWith('/value-calculator');
  });
});