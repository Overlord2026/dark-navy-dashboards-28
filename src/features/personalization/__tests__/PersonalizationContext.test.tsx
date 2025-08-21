import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersonalizationProvider, usePersonalization } from '../PersonalizationContext';

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn()
  }
}));

// Test component that uses personalization
function TestComponent() {
  const { state, updatePersona, updateFacts } = usePersonalization();
  
  return (
    <div>
      <div data-testid="persona">{state.persona}</div>
      <div data-testid="tier">{state.complexityTier}</div>
      <div data-testid="entities">{state.facts.entitiesCount}</div>
      
      <button 
        onClick={() => updatePersona('retiree')}
        data-testid="switch-persona"
      >
        Switch to Retiree
      </button>
      
      <button
        onClick={() => updateFacts({ entitiesCount: 3 })}
        data-testid="update-entities"
      >
        Update Entities
      </button>
    </div>
  );
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <PersonalizationProvider userId="test-user">
        {children}
      </PersonalizationProvider>
    </QueryClientProvider>
  );
}

describe('PersonalizationContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should provide default personalization state', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('persona')).toHaveTextContent('aspiring');
      expect(screen.getByTestId('tier')).toHaveTextContent('foundational');
      expect(screen.getByTestId('entities')).toHaveTextContent('0');
    });
  });

  it('should update persona when updatePersona is called', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('persona')).toHaveTextContent('aspiring');
    });

    fireEvent.click(screen.getByTestId('switch-persona'));

    await waitFor(() => {
      expect(screen.getByTestId('persona')).toHaveTextContent('retiree');
    });
  });

  it('should update complexity tier when facts change', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tier')).toHaveTextContent('foundational');
    });

    fireEvent.click(screen.getByTestId('update-entities'));

    await waitFor(() => {
      expect(screen.getByTestId('tier')).toHaveTextContent('advanced');
      expect(screen.getByTestId('entities')).toHaveTextContent('3');
    });
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('usePersonalization must be used within a PersonalizationProvider');
    
    consoleSpy.mockRestore();
  });
});