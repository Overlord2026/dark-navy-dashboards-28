
import { FormValidationTestResult } from './types';
import { testFormValidation } from './formValidationTests';
import { v4 as uuidv4 } from 'uuid';

export const getFormValidationDiagnostics = async () => {
  const results = testFormValidation();
  
  // Calculate statistics
  const total = results.length;
  const success = results.filter(r => r.status === 'success').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const errors = results.filter(r => r.status === 'error').length;
  
  // Generate recommendations for issues
  const recommendations = results
    .filter(r => r.status !== 'success')
    .map(r => ({
      formName: r.formName,
      formId: r.id,
      recommendations: generateRecommendationsForForm(r)
    }));
  
  // Return summary
  return {
    results,
    statistics: {
      total,
      success,
      warnings,
      errors,
      passRate: total > 0 ? Math.round((success / total) * 100) : 100
    },
    recommendations,
    timestamp: Date.now()
  };
};

// Generate recommendations for form issues
const generateRecommendationsForForm = (formResult: FormValidationTestResult) => {
  const recommendations = [];
  
  // Form level recommendations
  if (formResult.status === 'warning') {
    recommendations.push({
      id: uuidv4(),
      text: `Review form validation in ${formResult.formName} for potential UX improvements`,
      priority: 'medium',
      type: 'form'
    });
  } else if (formResult.status === 'error') {
    recommendations.push({
      id: uuidv4(),
      text: `Fix critical form validation issues in ${formResult.formName}`,
      priority: 'high',
      type: 'form'
    });
  }
  
  // Field level recommendations
  if (formResult.fields) {
    formResult.fields.forEach(field => {
      if (field.status === 'warning') {
        recommendations.push({
          id: uuidv4(),
          text: `Improve validation for ${field.name || field.fieldName} field in ${formResult.formName}`,
          priority: 'medium',
          type: 'field',
          field: field.name || field.fieldName
        });
      } else if (field.status === 'error') {
        recommendations.push({
          id: uuidv4(),
          text: `Fix critical validation for ${field.name || field.fieldName} field in ${formResult.formName}`,
          priority: 'high',
          type: 'field',
          field: field.name || field.fieldName
        });
      }
    });
  }
  
  return recommendations;
};

// Get a specific form validation test
export const getFormValidationTest = (formId: string): FormValidationTestResult | null => {
  const allTests = testFormValidation();
  // We use either the form property or id for backwards compatibility
  return allTests.find(t => t.form === formId || t.id === formId) || null;
};
