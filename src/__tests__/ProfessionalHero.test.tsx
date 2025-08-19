import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProfessionalHero } from '@/components/pros/ProfessionalHero';

const mockNavigate = vi.fn();

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  analytics: {
    track: vi.fn()
  }
}));

describe('ProfessionalHero', () => {
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

  it('renders advisor onboarding CTA', () => {
    renderWithRouter(<ProfessionalHero />);
    
    const ctaButton = screen.getByRole('button', { name: /Start Advisor Onboarding/i });
    expect(ctaButton).toBeInTheDocument();
  });

  it('navigates to advisor onboarding when CTA clicked', () => {
    const { analytics } = require('@/lib/analytics');
    renderWithRouter(<ProfessionalHero />);
    
    const ctaButton = screen.getByRole('button', { name: /Start Advisor Onboarding/i });
    fireEvent.click(ctaButton);
    
    expect(analytics.track).toHaveBeenCalledWith('pros.cta.click', {
      cta: 'start_advisor_onboarding',
      source: 'hero'
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding?persona=professional&segment=advisor');
  });

  it('tracks learn more click', () => {
    const { analytics } = require('@/lib/analytics');
    renderWithRouter(<ProfessionalHero />);
    
    const learnMoreButton = screen.getByRole('button', { name: /Learn More/i });
    fireEvent.click(learnMoreButton);
    
    expect(analytics.track).toHaveBeenCalledWith('pros.cta.click', {
      cta: 'learn_more',
      source: 'hero'
    });
  });

  it('displays professional stats', () => {
    renderWithRouter(<ProfessionalHero />);
    
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('Professional Partners')).toBeInTheDocument();
    expect(screen.getByText('$2.1B+')).toBeInTheDocument();
    expect(screen.getByText('Assets Under Management')).toBeInTheDocument();
    expect(screen.getByText('98%')).toBeInTheDocument();
    expect(screen.getByText('Client Satisfaction')).toBeInTheDocument();
  });
});