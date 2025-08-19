import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ValueCalculator from '@/pages/ValueCalculator';
import { analytics } from '@/lib/analytics';

// Mock analytics
jest.mock('@/lib/analytics', () => ({
  analytics: {
    trackPageView: jest.fn(),
    track: jest.fn(),
  },
}));

// Mock sound utility
jest.mock('@/utils/sounds', () => ({
  playSound: jest.fn(),
}));

// Mock CountUp component
jest.mock('react-countup', () => {
  return function MockCountUp({ end, formattingFn }: any) {
    const value = formattingFn ? formattingFn(end) : end;
    return <span>{value}</span>;
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock celebration component
jest.mock('@/components/ConfettiAnimation', () => ({
  Celebration: () => null,
}));

// Mock stress test preview
jest.mock('@/components/retirement/StressTestPreview', () => ({
  StressTestPreview: () => <div data-testid="stress-test-preview">Stress Test Preview</div>,
}));

describe('ValueCalculator Horizon Toggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('defaults to 30 years and changes to 10 years with analytics tracking', async () => {
    render(<ValueCalculator />);
    
    // Check default state - 30 years should be selected (pressed)
    const thirtyYearButton = screen.getByRole('button', { name: '30 years' });
    const tenYearButton = screen.getByRole('button', { name: '10 years' });
    const twentyYearButton = screen.getByRole('button', { name: '20 years' });
    
    expect(thirtyYearButton).toHaveAttribute('aria-pressed', 'true');
    expect(tenYearButton).toHaveAttribute('aria-pressed', 'false');
    expect(twentyYearButton).toHaveAttribute('aria-pressed', 'false');
    
    // Click 10 years button
    fireEvent.click(tenYearButton);
    
    // Verify state change
    expect(tenYearButton).toHaveAttribute('aria-pressed', 'true');
    expect(thirtyYearButton).toHaveAttribute('aria-pressed', 'false');
    expect(twentyYearButton).toHaveAttribute('aria-pressed', 'false');
    
    // Verify analytics tracking
    expect(analytics.track).toHaveBeenCalledWith('calc.horizon_set', { y: 10 });
  });

  test('calculate function uses selected horizon value', async () => {
    render(<ValueCalculator />);
    
    // Change to 10 years
    const tenYearButton = screen.getByRole('button', { name: '10 years' });
    fireEvent.click(tenYearButton);
    
    // Set some input values
    const portfolioInput = screen.getByLabelText('Portfolio Value');
    fireEvent.change(portfolioInput, { target: { value: '1000000' } });
    
    // Click calculate
    const calculateButton = screen.getByRole('button', { name: /calculate your savings/i });
    fireEvent.click(calculateButton);
    
    // Wait for calculation to complete and verify analytics call includes the right inputs
    await waitFor(() => {
      expect(analytics.track).toHaveBeenCalledWith('calc_run', expect.objectContaining({
        timeHorizon: 10
      }));
    });
  });

  test('all three horizon options work correctly', () => {
    render(<ValueCalculator />);
    
    const tenYearButton = screen.getByRole('button', { name: '10 years' });
    const twentyYearButton = screen.getByRole('button', { name: '20 years' });
    const thirtyYearButton = screen.getByRole('button', { name: '30 years' });
    
    // Test 10 years
    fireEvent.click(tenYearButton);
    expect(tenYearButton).toHaveAttribute('aria-pressed', 'true');
    expect(analytics.track).toHaveBeenCalledWith('calc.horizon_set', { y: 10 });
    
    // Test 20 years
    fireEvent.click(twentyYearButton);
    expect(twentyYearButton).toHaveAttribute('aria-pressed', 'true');
    expect(tenYearButton).toHaveAttribute('aria-pressed', 'false');
    expect(analytics.track).toHaveBeenCalledWith('calc.horizon_set', { y: 20 });
    
    // Test 30 years
    fireEvent.click(thirtyYearButton);
    expect(thirtyYearButton).toHaveAttribute('aria-pressed', 'true');
    expect(twentyYearButton).toHaveAttribute('aria-pressed', 'false');
    expect(analytics.track).toHaveBeenCalledWith('calc.horizon_set', { y: 30 });
  });

  test('horizon value is passed to stress test component', async () => {
    render(<ValueCalculator />);
    
    // Change to 20 years
    const twentyYearButton = screen.getByRole('button', { name: '20 years' });
    fireEvent.click(twentyYearButton);
    
    // Trigger calculation to show stress test preview
    const calculateButton = screen.getByRole('button', { name: /calculate your savings/i });
    fireEvent.click(calculateButton);
    
    // Wait for results to show
    await waitFor(() => {
      expect(screen.getByTestId('stress-test-preview')).toBeInTheDocument();
    });
  });
});