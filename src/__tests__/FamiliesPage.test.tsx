import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FamiliesPage from '@/pages/FamiliesPage';

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  analytics: {
    track: vi.fn()
  }
}));

// Mock components
vi.mock('@/components/families/FamilyHero', () => ({
  FamilyHero: () => <div data-testid="family-hero">Family Hero</div>
}));

vi.mock('@/components/families/FamiliesToolsBand', () => ({
  default: () => <div data-testid="tools-band">Tools Band</div>
}));

describe('FamiliesPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  it('renders with proper header spacing', () => {
    renderWithRouter(<FamiliesPage />);
    
    const main = screen.getByRole('main');
    expect(main).toHaveClass('pt-[var(--header-stack)]');
    expect(main).toHaveClass('scroll-mt-[var(--header-stack)]');
  });

  it('passes basic accessibility checks', async () => {
    const { container } = renderWithRouter(<FamiliesPage />);
    
    // Check for proper semantic HTML
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Check for proper heading structure
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);
  });
});