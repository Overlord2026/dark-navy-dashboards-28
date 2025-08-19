import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProsPage from '@/pages/ProsPage';

// Mock components
vi.mock('@/components/site/BFOHeader', () => ({
  BFOHeader: () => <div data-testid="bfo-header">BFO Header</div>
}));

vi.mock('@/components/ui/BrandedFooter', () => ({
  BrandedFooter: () => <div data-testid="branded-footer">Branded Footer</div>
}));

vi.mock('@/components/pros/ProfessionalHero', () => ({
  ProfessionalHero: () => <div data-testid="professional-hero">Professional Hero</div>
}));

vi.mock('@/components/pros/ProfessionalTabs', () => ({
  ProfessionalTabs: () => <div data-testid="professional-tabs">Professional Tabs</div>
}));

vi.mock('@/components/pros/ProfessionalQuickActions', () => ({
  ProfessionalQuickActions: () => <div data-testid="professional-quick-actions">Professional Quick Actions</div>
}));

vi.mock('@/components/pros/ProfessionalFeatures', () => ({
  ProfessionalFeatures: () => <div data-testid="professional-features">Professional Features</div>
}));

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  analytics: {
    track: vi.fn()
  }
}));

describe('ProsPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all main components', () => {
    renderWithRouter(<ProsPage />);
    
    expect(screen.getByTestId('bfo-header')).toBeInTheDocument();
    expect(screen.getByTestId('professional-hero')).toBeInTheDocument();
    expect(screen.getByTestId('professional-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('professional-quick-actions')).toBeInTheDocument();
    expect(screen.getByTestId('professional-features')).toBeInTheDocument();
    expect(screen.getByTestId('branded-footer')).toBeInTheDocument();
  });

  it('renders with proper header spacing', () => {
    renderWithRouter(<ProsPage />);
    
    const main = screen.getByRole('main');
    expect(main).toHaveClass('pt-[var(--header-stack)]');
    expect(main).toHaveClass('scroll-mt-[var(--header-stack)]');
  });

  it('tracks page view analytics on mount', () => {
    const { analytics } = require('@/lib/analytics');
    
    renderWithRouter(<ProsPage />);
    
    expect(analytics.track).toHaveBeenCalledWith('pros.home.viewed', {
      timestamp: expect.any(Number),
      source: 'direct'
    });
  });
});