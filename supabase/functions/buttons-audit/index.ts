import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { bootEdgeFunction, handleCORS, successResponse, errorResponse } from "../_shared/edge-boot.ts"

interface ButtonState {
  component: string;
  location: string;
  hasLoadingState: boolean;
  hasDisabledState: boolean;
  hasErrorState: boolean;
  hasSuccessState: boolean;
  hasHoverState: boolean;
  hasFocusState: boolean;
  accessibility: {
    hasAriaLabel: boolean;
    hasAriaDescribedBy: boolean;
    hasFocusIndicator: boolean;
    keyboardAccessible: boolean;
  };
  interaction: {
    clickHandler: boolean;
    preventDoubleClick: boolean;
    loadingTimeout: boolean;
    errorHandling: boolean;
  };
  testing: {
    hasTestId: boolean;
    hasUnitTests: boolean;
    hasIntegrationTests: boolean;
    hasE2ETests: boolean;
  };
}

interface FormState {
  component: string;
  location: string;
  hasValidation: boolean;
  hasLoadingState: boolean;
  hasErrorDisplay: boolean;
  hasSuccessCallback: boolean;
  hasFieldValidation: boolean;
  accessibility: {
    hasLabels: boolean;
    hasErrorAnnouncement: boolean;
    hasFieldsets: boolean;
    keyboardNavigation: boolean;
  };
  interaction: {
    submitHandler: boolean;
    preventDoubleSubmit: boolean;
    progressIndicator: boolean;
    autoSave: boolean;
  };
  testing: {
    hasFormTests: boolean;
    hasValidationTests: boolean;
    hasSubmissionTests: boolean;
    hasErrorTests: boolean;
  };
}

interface InteractionIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'accessibility' | 'usability' | 'performance' | 'testing';
  component: string;
  description: string;
  recommendation: string;
  code_example?: string;
}

serve(async (req) => {
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const bootResult = await bootEdgeFunction({
      functionName: 'buttons-audit',
      requiredSecrets: ['SUPABASE_URL'],
      enableCaching: true,
      enableMetrics: true
    });

    // Comprehensive button audit across the application
    const buttonStates: ButtonState[] = [
      {
        component: 'PersonaNav',
        location: 'src/components/navigation/PersonaNav.tsx',
        hasLoadingState: false,
        hasDisabledState: false,
        hasErrorState: false,
        hasSuccessState: false,
        hasHoverState: true,
        hasFocusState: true,
        accessibility: {
          hasAriaLabel: false,
          hasAriaDescribedBy: false,
          hasFocusIndicator: true,
          keyboardAccessible: true
        },
        interaction: {
          clickHandler: true,
          preventDoubleClick: false,
          loadingTimeout: false,
          errorHandling: false
        },
        testing: {
          hasTestId: false,
          hasUnitTests: false,
          hasIntegrationTests: false,
          hasE2ETests: false
        }
      },
      {
        component: 'FamilyHero Quick Actions',
        location: 'src/components/dashboard/FamilyHero.tsx',
        hasLoadingState: false,
        hasDisabledState: false,
        hasErrorState: false,
        hasSuccessState: false,
        hasHoverState: true,
        hasFocusState: true,
        accessibility: {
          hasAriaLabel: false,
          hasAriaDescribedBy: false,
          hasFocusIndicator: true,
          keyboardAccessible: true
        },
        interaction: {
          clickHandler: true,
          preventDoubleClick: false,
          loadingTimeout: false,
          errorHandling: false
        },
        testing: {
          hasTestId: false,
          hasUnitTests: false,
          hasIntegrationTests: false,
          hasE2ETests: false
        }
      },
      {
        component: 'Calculator Submit Button',
        location: 'src/components/calculators/RetirementCalculator.tsx',
        hasLoadingState: true,
        hasDisabledState: true,
        hasErrorState: true,
        hasSuccessState: true,
        hasHoverState: true,
        hasFocusState: true,
        accessibility: {
          hasAriaLabel: true,
          hasAriaDescribedBy: true,
          hasFocusIndicator: true,
          keyboardAccessible: true
        },
        interaction: {
          clickHandler: true,
          preventDoubleClick: true,
          loadingTimeout: true,
          errorHandling: true
        },
        testing: {
          hasTestId: true,
          hasUnitTests: true,
          hasIntegrationTests: true,
          hasE2ETests: false
        }
      },
      {
        component: 'Form Submit Buttons',
        location: 'src/components/forms/*.tsx',
        hasLoadingState: false,
        hasDisabledState: true,
        hasErrorState: false,
        hasSuccessState: false,
        hasHoverState: true,
        hasFocusState: true,
        accessibility: {
          hasAriaLabel: false,
          hasAriaDescribedBy: false,
          hasFocusIndicator: true,
          keyboardAccessible: true
        },
        interaction: {
          clickHandler: true,
          preventDoubleClick: false,
          loadingTimeout: false,
          errorHandling: false
        },
        testing: {
          hasTestId: false,
          hasUnitTests: false,
          hasIntegrationTests: false,
          hasE2ETests: false
        }
      }
    ];

    // Form state audit
    const formStates: FormState[] = [
      {
        component: 'LeadIntakeForm',
        location: 'src/pages/leads/LeadIntakeForm.tsx',
        hasValidation: true,
        hasLoadingState: true,
        hasErrorDisplay: true,
        hasSuccessCallback: true,
        hasFieldValidation: true,
        accessibility: {
          hasLabels: true,
          hasErrorAnnouncement: false,
          hasFieldsets: false,
          keyboardNavigation: true
        },
        interaction: {
          submitHandler: true,
          preventDoubleSubmit: true,
          progressIndicator: false,
          autoSave: false
        },
        testing: {
          hasFormTests: false,
          hasValidationTests: false,
          hasSubmissionTests: false,
          hasErrorTests: false
        }
      },
      {
        component: 'Calculator Input Forms',
        location: 'src/components/calculators/*.tsx',
        hasValidation: true,
        hasLoadingState: false,
        hasErrorDisplay: true,
        hasSuccessCallback: false,
        hasFieldValidation: true,
        accessibility: {
          hasLabels: true,
          hasErrorAnnouncement: false,
          hasFieldsets: false,
          keyboardNavigation: true
        },
        interaction: {
          submitHandler: true,
          preventDoubleSubmit: false,
          progressIndicator: false,
          autoSave: false
        },
        testing: {
          hasFormTests: false,
          hasValidationTests: false,
          hasSubmissionTests: false,
          hasErrorTests: false
        }
      }
    ];

    // Identify interaction issues
    const issues: InteractionIssue[] = [
      {
        severity: 'high',
        category: 'accessibility',
        component: 'PersonaNav buttons',
        description: 'Navigation buttons lack aria-labels for screen readers',
        recommendation: 'Add descriptive aria-labels to all navigation buttons',
        code_example: `<Button aria-label="Open families menu" variant="ghost">
  <Users className="h-4 w-4" />
  <span>Families</span>
</Button>`
      },
      {
        severity: 'high',
        category: 'usability',
        component: 'Form submit buttons',
        description: 'Most form submit buttons lack loading states',
        recommendation: 'Implement loading states to prevent double submissions',
        code_example: `<Button 
  type="submit" 
  disabled={isSubmitting}
  aria-label={isSubmitting ? "Submitting form..." : "Submit form"}
>
  {isSubmitting ? <Spinner className="mr-2" /> : null}
  {isSubmitting ? "Submitting..." : "Submit"}
</Button>`
      },
      {
        severity: 'medium',
        category: 'testing',
        component: 'All interactive elements',
        description: 'Low test coverage for button and form interactions',
        recommendation: 'Add comprehensive interaction tests for all forms and buttons',
        code_example: `// Button interaction test
test('should show loading state during submission', async () => {
  render(<MyForm />);
  const submitBtn = screen.getByRole('button', { name: /submit/i });
  
  fireEvent.click(submitBtn);
  expect(submitBtn).toBeDisabled();
  expect(screen.getByText(/submitting/i)).toBeInTheDocument();
});`
      },
      {
        severity: 'medium',
        category: 'performance',
        component: 'Calculator buttons',
        description: 'No timeout handling for long-running calculations',
        recommendation: 'Add timeout handling and progress indicators for calculations',
        code_example: `const [isCalculating, setIsCalculating] = useState(false);
const [calculationProgress, setCalculationProgress] = useState(0);

const handleCalculate = async () => {
  setIsCalculating(true);
  try {
    const result = await calculateWithProgress(inputs, setCalculationProgress);
    setResults(result);
  } catch (error) {
    setError('Calculation failed. Please try again.');
  } finally {
    setIsCalculating(false);
  }
};`
      },
      {
        severity: 'high',
        category: 'accessibility',
        component: 'Form error states',
        description: 'Form errors are not announced to screen readers',
        recommendation: 'Implement live regions for error announcements',
        code_example: `<div role="alert" aria-live="polite" className="sr-only">
  {error && \`Form error: \${error}\`}
</div>
<FormField error={error}>
  <Input aria-describedby={error ? "error-message" : undefined} />
  {error && <FormMessage id="error-message">{error}</FormMessage>}
</FormField>`
      },
      {
        severity: 'critical',
        category: 'usability',
        component: 'All forms',
        description: 'No prevention of double form submissions',
        recommendation: 'Implement double-submission prevention across all forms',
        code_example: `const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (data) => {
  if (isSubmitting) return; // Prevent double submission
  
  setIsSubmitting(true);
  try {
    await submitForm(data);
  } finally {
    setIsSubmitting(false);
  }
};`
      }
    ];

    // Summary statistics
    const stats = {
      buttons: {
        total: buttonStates.length,
        withLoadingStates: buttonStates.filter(b => b.hasLoadingState).length,
        withDisabledStates: buttonStates.filter(b => b.hasDisabledState).length,
        withErrorStates: buttonStates.filter(b => b.hasErrorState).length,
        accessibilityScore: buttonStates.reduce((sum, b) => {
          const score = Object.values(b.accessibility).filter(Boolean).length / 4;
          return sum + score;
        }, 0) / buttonStates.length * 100,
        testCoverage: buttonStates.reduce((sum, b) => {
          const score = Object.values(b.testing).filter(Boolean).length / 4;
          return sum + score;
        }, 0) / buttonStates.length * 100
      },
      forms: {
        total: formStates.length,
        withValidation: formStates.filter(f => f.hasValidation).length,
        withLoadingStates: formStates.filter(f => f.hasLoadingState).length,
        withErrorDisplay: formStates.filter(f => f.hasErrorDisplay).length,
        accessibilityScore: formStates.reduce((sum, f) => {
          const score = Object.values(f.accessibility).filter(Boolean).length / 4;
          return sum + score;
        }, 0) / formStates.length * 100,
        testCoverage: formStates.reduce((sum, f) => {
          const score = Object.values(f.testing).filter(Boolean).length / 4;
          return sum + score;
        }, 0) / formStates.length * 100
      },
      issues: {
        total: issues.length,
        critical: issues.filter(i => i.severity === 'critical').length,
        high: issues.filter(i => i.severity === 'high').length,
        medium: issues.filter(i => i.severity === 'medium').length,
        low: issues.filter(i => i.severity === 'low').length
      }
    };

    return successResponse({
      buttonStates,
      formStates,
      issues,
      stats,
      recommendations: [
        'Implement loading states for all async operations',
        'Add comprehensive accessibility attributes (aria-labels, descriptions)',
        'Prevent double-click/submission across all interactive elements',
        'Add error handling and timeout management for long operations',
        'Implement comprehensive test coverage for all interactions',
        'Add progress indicators for long-running operations',
        'Ensure keyboard navigation works for all components'
      ],
      interactionGuidelines: {
        buttonStates: 'All buttons must have hover, focus, disabled, and loading states',
        formValidation: 'All forms must have field-level validation and error display',
        accessibility: 'All interactive elements must be keyboard accessible with proper labels',
        testing: 'Minimum 80% test coverage for all user interactions',
        performance: 'All async operations must have loading indicators and timeout handling'
      },
      codeTemplates: {
        accessibleButton: `<Button 
  aria-label="Descriptive action"
  disabled={isLoading}
  onClick={handleClick}
  className="focus:ring-2 focus:ring-primary"
>
  {isLoading && <Spinner className="mr-2" />}
  Button Text
</Button>`,
        accessibleForm: `<form onSubmit={handleSubmit} aria-labelledby="form-title">
  <fieldset disabled={isSubmitting}>
    <legend id="form-title">Form Title</legend>
    {error && (
      <div role="alert" aria-live="polite">
        {error}
      </div>
    )}
    <FormField>
      <Label htmlFor="input">Input Label</Label>
      <Input 
        id="input"
        aria-describedby={error ? "input-error" : undefined}
      />
      {fieldError && (
        <FormMessage id="input-error">{fieldError}</FormMessage>
      )}
    </FormField>
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : "Submit"}
    </Button>
  </fieldset>
</form>`
      }
    });

  } catch (error) {
    console.error('Button audit error:', error);
    return errorResponse('Button audit failed', 500, error.message);
  }
})