import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  PersonalizationState, 
  Persona, 
  UserFacts, 
  ComplexityTier, 
  DEFAULT_PERSONALIZATION 
} from './types';
import { 
  deriveComplexityTier, 
  createTierReceipt, 
  emitPersonalizationEvent,
  calculateTierImpact 
} from './utils';

interface PersonalizationContextType {
  state: PersonalizationState;
  updatePersona: (persona: Persona) => void;
  updateFacts: (facts: Partial<UserFacts>) => void;
  refreshPersonalization: () => void;
  isLoading: boolean;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

type PersonalizationAction =
  | { type: 'SET_PERSONA'; payload: Persona }
  | { type: 'UPDATE_FACTS'; payload: Partial<UserFacts> }
  | { type: 'SET_STATE'; payload: PersonalizationState }
  | { type: 'SET_TIER'; payload: ComplexityTier };

function personalizationReducer(
  state: PersonalizationState,
  action: PersonalizationAction
): PersonalizationState {
  switch (action.type) {
    case 'SET_PERSONA':
      return {
        ...state,
        persona: action.payload
      };
    
    case 'UPDATE_FACTS': {
      const newFacts = { ...state.facts, ...action.payload };
      const newTier = deriveComplexityTier(newFacts);
      
      return {
        ...state,
        facts: newFacts,
        complexityTier: newTier,
        lastTierChange: newTier !== state.complexityTier ? new Date() : state.lastTierChange
      };
    }
    
    case 'SET_STATE':
      return action.payload;
    
    case 'SET_TIER':
      return {
        ...state,
        complexityTier: action.payload,
        lastTierChange: action.payload !== state.complexityTier ? new Date() : state.lastTierChange
      };
    
    default:
      return state;
  }
}

// Mock API functions (replace with actual API calls)
const personalizationApi = {
  getPersonalization: async (): Promise<PersonalizationState> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try to load from localStorage for demo
    try {
      const stored = localStorage.getItem('user_personalization');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure we have a valid state
        if (parsed.persona && parsed.facts) {
          return {
            ...DEFAULT_PERSONALIZATION,
            ...parsed,
            complexityTier: deriveComplexityTier(parsed.facts)
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load personalization from storage:', error);
    }
    
    return DEFAULT_PERSONALIZATION;
  },

  updatePersonalization: async (state: PersonalizationState): Promise<PersonalizationState> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Store in localStorage for demo
    try {
      localStorage.setItem('user_personalization', JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save personalization to storage:', error);
    }
    
    return state;
  }
};

interface PersonalizationProviderProps {
  children: ReactNode;
  userId?: string;
}

export function PersonalizationProvider({ children, userId = 'demo-user' }: PersonalizationProviderProps) {
  const [state, dispatch] = useReducer(personalizationReducer, DEFAULT_PERSONALIZATION);
  const queryClient = useQueryClient();

  // Load personalization data
  const { isLoading, data } = useQuery({
    queryKey: ['personalization', userId],
    queryFn: personalizationApi.getPersonalization
  });

  // Update state when data is loaded
  useEffect(() => {
    if (data) {
      dispatch({ type: 'SET_STATE', payload: data });
    }
  }, [data]);

  // Update personalization mutation
  const updateMutation = useMutation({
    mutationFn: personalizationApi.updatePersonalization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalization', userId] });
    }
  });

  // Handle tier changes
  useEffect(() => {
    const newTier = deriveComplexityTier(state.facts);
    if (newTier !== state.complexityTier) {
      const impact = calculateTierImpact(state.complexityTier, newTier);
      
      // Create tier receipt
      createTierReceipt(userId, state.complexityTier, newTier, state.facts);
      
      // Emit analytics event
      emitPersonalizationEvent({
        type: 'tier.changed',
        payload: {
          userId,
          previousTier: state.complexityTier,
          newTier,
          facts: state.facts,
          timestamp: new Date()
        }
      });

      // Show toast notification
      if (impact === 'upgrade') {
        toast.success('Family Office features unlocked!', {
          description: 'Your profile now qualifies for advanced planning tools.'
        });
      }

      // Update tier
      dispatch({ type: 'SET_TIER', payload: newTier });
    }
  }, [state.facts, state.complexityTier, userId]);

  const updatePersona = (persona: Persona) => {
    dispatch({ type: 'SET_PERSONA', payload: persona });
    
    const newState = { ...state, persona };
    updateMutation.mutate(newState);
    
    emitPersonalizationEvent({
      type: 'persona.switched',
      payload: {
        userId,
        persona,
        timestamp: new Date()
      }
    });

    toast.success(`Switched to ${persona} mode`, {
      description: 'Your dashboard will update to reflect your preferences.'
    });
  };

  const updateFacts = (facts: Partial<UserFacts>) => {
    dispatch({ type: 'UPDATE_FACTS', payload: facts });
    
    const newFacts = { ...state.facts, ...facts };
    const newState = { ...state, facts: newFacts };
    updateMutation.mutate(newState);
    
    emitPersonalizationEvent({
      type: 'personalization.changed',
      payload: {
        userId,
        facts: newFacts,
        timestamp: new Date()
      }
    });
  };

  const refreshPersonalization = () => {
    queryClient.invalidateQueries({ queryKey: ['personalization', userId] });
  };

  return (
    <PersonalizationContext.Provider
      value={{
        state,
        updatePersona,
        updateFacts,
        refreshPersonalization,
        isLoading: isLoading || updateMutation.isPending
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
}