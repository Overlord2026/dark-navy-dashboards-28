import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NILOnboardingState {
  // Current step (1-6)
  currentStep: number;
  completedSteps: number[];
  
  // Form data
  role: 'athlete' | 'brand' | 'advisor' | null;
  jurisdiction: string;
  channels: Array<'IG' | 'TikTok' | 'YouTube'>;
  disclosurePrefs: {
    autoGenerate: boolean;
    reviewRequired: boolean;
    channelSpecific: boolean;
  };
  exclusivityPrefs: {
    categories: string[];
    exclusiveWindows: boolean;
    competitorBlocking: boolean;
  };
  paymentPrefs: {
    escrowPreferred: boolean;
    paymentTerms: 'immediate' | 'milestone' | 'completion';
    invoiceRequired: boolean;
  };
  
  // UI state
  isCompleted: boolean;
  lastSaved: Date | null;
  
  // Actions
  setStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  updateRole: (role: 'athlete' | 'brand' | 'advisor') => void;
  updateJurisdiction: (jurisdiction: string) => void;
  updateChannels: (channels: Array<'IG' | 'TikTok' | 'YouTube'>) => void;
  updateDisclosurePrefs: (prefs: Partial<NILOnboardingState['disclosurePrefs']>) => void;
  updateExclusivityPrefs: (prefs: Partial<NILOnboardingState['exclusivityPrefs']>) => void;
  updatePaymentPrefs: (prefs: Partial<NILOnboardingState['paymentPrefs']>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  saveProgress: () => void;
}

const initialState = {
  currentStep: 1,
  completedSteps: [],
  role: null,
  jurisdiction: '',
  channels: [],
  disclosurePrefs: {
    autoGenerate: true,
    reviewRequired: true,
    channelSpecific: true,
  },
  exclusivityPrefs: {
    categories: [],
    exclusiveWindows: false,
    competitorBlocking: false,
  },
  paymentPrefs: {
    escrowPreferred: true,
    paymentTerms: 'milestone' as const,
    invoiceRequired: true,
  },
  isCompleted: false,
  lastSaved: null,
};

export const useNILOnboardingStore = create<NILOnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setStep: (step: number) => {
        set({ currentStep: step });
        get().saveProgress();
      },
      
      markStepCompleted: (step: number) => {
        const { completedSteps } = get();
        if (!completedSteps.includes(step)) {
          set({ 
            completedSteps: [...completedSteps, step].sort((a, b) => a - b)
          });
        }
        get().saveProgress();
      },
      
      updateRole: (role: 'athlete' | 'brand' | 'advisor') => {
        set({ role });
        get().markStepCompleted(1);
      },
      
      updateJurisdiction: (jurisdiction: string) => {
        set({ jurisdiction });
        get().saveProgress();
      },
      
      updateChannels: (channels: Array<'IG' | 'TikTok' | 'YouTube'>) => {
        set({ channels });
        get().markStepCompleted(2);
      },
      
      updateDisclosurePrefs: (prefs) => {
        set(state => ({
          disclosurePrefs: { ...state.disclosurePrefs, ...prefs }
        }));
        get().markStepCompleted(4);
      },
      
      updateExclusivityPrefs: (prefs) => {
        set(state => ({
          exclusivityPrefs: { ...state.exclusivityPrefs, ...prefs }
        }));
        get().markStepCompleted(5);
      },
      
      updatePaymentPrefs: (prefs) => {
        set(state => ({
          paymentPrefs: { ...state.paymentPrefs, ...prefs }
        }));
        get().markStepCompleted(6);
      },
      
      completeOnboarding: () => {
        const state = get();
        set({ 
          isCompleted: true,
          completedSteps: [1, 2, 3, 4, 5, 6]
        });
        
        // Emit completion event
        console.info('nil.onboarding.complete', {
          role: state.role,
          jurisdiction: state.jurisdiction,
          channels: state.channels,
          disclosurePrefs: state.disclosurePrefs,
          exclusivityPrefs: state.exclusivityPrefs,
          paymentPrefs: state.paymentPrefs,
          completedAt: new Date().toISOString(),
        });
        
        get().saveProgress();
      },
      
      resetOnboarding: () => {
        set(initialState);
      },
      
      saveProgress: () => {
        set({ lastSaved: new Date() });
      },
    }),
    {
      name: 'nil-onboarding-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        role: state.role,
        jurisdiction: state.jurisdiction,
        channels: state.channels,
        disclosurePrefs: state.disclosurePrefs,
        exclusivityPrefs: state.exclusivityPrefs,
        paymentPrefs: state.paymentPrefs,
        isCompleted: state.isCompleted,
        lastSaved: state.lastSaved,
      }),
    }
  )
);