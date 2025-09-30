import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RetirementAnalysisInput } from '@/types/retirement';

interface RetirementIntakeState {
  inputs: Partial<RetirementAnalysisInput> | null;
  currentStep: number;
  completedSteps: number[];
}

interface RetirementIntakeActions {
  setInputs: (inputs: Partial<RetirementAnalysisInput>) => void;
  updateInputs: (partial: Partial<RetirementAnalysisInput>) => void;
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  reset: () => void;
}

interface RetirementIntakeStore extends RetirementIntakeState, RetirementIntakeActions {}

const STORAGE_KEY = 'retirement-intake-state';

export const useRetirementIntake = create<RetirementIntakeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      inputs: null,
      currentStep: 1,
      completedSteps: [],

      // Actions
      setInputs: (inputs: Partial<RetirementAnalysisInput>) => {
        set({ inputs });
      },

      updateInputs: (partial: Partial<RetirementAnalysisInput>) => {
        const currentInputs = get().inputs || {};
        set({ inputs: { ...currentInputs, ...partial } });
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      markStepComplete: (step: number) => {
        const { completedSteps } = get();
        if (!completedSteps.includes(step)) {
          set({ completedSteps: [...completedSteps, step] });
        }
      },

      reset: () => {
        set({
          inputs: null,
          currentStep: 1,
          completedSteps: []
        });
      }
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        inputs: state.inputs,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps
      })
    }
  )
);
