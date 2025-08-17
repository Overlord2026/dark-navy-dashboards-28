import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Persona, PersonaSegment } from '@/lib/persona';

interface PersonaState {
  selectedPersona: Persona | null;
  selectedSegment: PersonaSegment | null;
  isAuthenticated: boolean;
  userId: string | null;
}

interface PersonaActions {
  setPersona: (persona: Persona, segment?: PersonaSegment) => void;
  setSegment: (segment: PersonaSegment) => void;
  setAuthState: (authenticated: boolean, userId?: string) => void;
  clearSelection: () => void;
  syncWithProfile: () => Promise<void>;
}

interface PersonaStore extends PersonaState, PersonaActions {}

const STORAGE_KEY = 'fom-persona-selection';
const COOKIE_NAME = 'fom_persona';

// Cookie utilities
const setCookie = (name: string, value: string, days = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const usePersonaStore = create<PersonaStore>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedPersona: null,
      selectedSegment: null,
      isAuthenticated: false,
      userId: null,

      // Actions
      setPersona: (persona: Persona, segment?: PersonaSegment) => {
        set({ 
          selectedPersona: persona, 
          selectedSegment: segment || null 
        });
        
        // Update cookie for server-side access
        const cookieValue = JSON.stringify({ 
          persona, 
          segment: segment || null,
          timestamp: Date.now()
        });
        setCookie(COOKIE_NAME, cookieValue);

        // Sync with user profile if authenticated
        const { isAuthenticated } = get();
        if (isAuthenticated) {
          get().syncWithProfile();
        }

        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('persona-changed', {
          detail: { persona, segment }
        }));
      },

      setSegment: (segment: PersonaSegment) => {
        const { selectedPersona } = get();
        set({ selectedSegment: segment });
        
        if (selectedPersona) {
          const cookieValue = JSON.stringify({ 
            persona: selectedPersona, 
            segment,
            timestamp: Date.now()
          });
          setCookie(COOKIE_NAME, cookieValue);

          // Sync with profile if authenticated
          const { isAuthenticated } = get();
          if (isAuthenticated) {
            get().syncWithProfile();
          }
        }

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('persona-segment-changed', {
          detail: { segment }
        }));
      },

      setAuthState: (authenticated: boolean, userId?: string) => {
        set({ 
          isAuthenticated: authenticated, 
          userId: userId || null 
        });

        // Sync persona selection with profile when user logs in
        if (authenticated && userId) {
          get().syncWithProfile();
        }
      },

      clearSelection: () => {
        set({ 
          selectedPersona: null, 
          selectedSegment: null 
        });
        
        // Clear cookie
        setCookie(COOKIE_NAME, '', -1);

        // Dispatch clear event
        window.dispatchEvent(new CustomEvent('persona-cleared'));
      },

      syncWithProfile: async () => {
        const { selectedPersona, selectedSegment, isAuthenticated, userId } = get();
        
        if (!isAuthenticated || !userId) {
          return;
        }

        try {
          // This would integrate with your auth/profile system
          // Example implementation:
          const { supabase } = await import('@/integrations/supabase/client');
          
          await supabase
            .from('profiles')
            .update({
              client_segment: selectedSegment,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        } catch (error) {
          console.warn('Failed to sync persona preference with profile:', error);
        }
      }
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        selectedPersona: state.selectedPersona,
        selectedSegment: state.selectedSegment
      }),
      onRehydrateStorage: () => (state) => {
        // Initialize from cookie if available (for SSR/initial load)
        if (typeof window !== 'undefined') {
          const cookieData = getCookie(COOKIE_NAME);
          if (cookieData && state) {
            try {
              const { persona, segment } = JSON.parse(cookieData);
              if (persona && Object.values(Persona).includes(persona)) {
                state.selectedPersona = persona;
                state.selectedSegment = segment;
              }
            } catch (error) {
              console.warn('Failed to parse persona cookie:', error);
            }
          }
        }
      },
    }
  )
);

// Helper hooks for common patterns
export const useSelectedPersona = () => usePersonaStore(state => state.selectedPersona);
export const useSelectedSegment = () => usePersonaStore(state => state.selectedSegment);
export const usePersonaActions = () => usePersonaStore(state => ({
  setPersona: state.setPersona,
  setSegment: state.setSegment,
  clearSelection: state.clearSelection
}));