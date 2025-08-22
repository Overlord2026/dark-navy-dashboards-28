import familyToolsConfig from '@/config/familyTools.json';
import catalogConfig from '@/config/catalogConfig.json';

interface ValidationError {
  type: 'error' | 'warning';
  message: string;
  segment?: string;
  toolKey?: string;
  location?: string;
}

interface ValidationResult {
  errors: ValidationError[];
  warnings: ValidationError[];
  summary: {
    totalTools: number;
    validTools: number;
    missingTools: string[];
    unreachableRoutes: string[];
  };
}

export function validateFamilyTools(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const missingTools: string[] = [];
  const unreachableRoutes: string[] = [];
  let totalTools = 0;
  let validTools = 0;

  // Create lookup map of catalog tools
  const catalogTools = new Map();
  let toolsArray: any[] = [];
  
  if (Array.isArray(catalogConfig)) {
    toolsArray = catalogConfig;
  } else if (catalogConfig && Array.isArray((catalogConfig as any).tools)) {
    toolsArray = (catalogConfig as any).tools;
  }
  
  toolsArray.forEach(tool => {
    catalogTools.set(tool.key, tool);
  });

  // Validate each segment configuration
  Object.entries(familyToolsConfig).forEach(([segment, config]) => {
    if (!config || typeof config !== 'object') {
      errors.push({
        type: 'error',
        message: `Invalid configuration for segment: ${segment}`,
        segment
      });
      return;
    }

    // Validate tabs
    if (!config.tabs || !Array.isArray(config.tabs)) {
      errors.push({
        type: 'error',
        message: `Missing or invalid tabs configuration for segment: ${segment}`,
        segment,
        location: 'tabs'
      });
    } else {
      config.tabs.forEach((tab, tabIndex) => {
        if (!tab.key || !tab.label) {
          errors.push({
            type: 'error',
            message: `Tab ${tabIndex} missing key or label in segment: ${segment}`,
            segment,
            location: `tabs[${tabIndex}]`
          });
        }

        if (!tab.cards || !Array.isArray(tab.cards)) {
          errors.push({
            type: 'error',
            message: `Tab "${tab.label}" missing cards array in segment: ${segment}`,
            segment,
            location: `tabs[${tabIndex}].cards`
          });
        } else if (tab.cards.length === 0) {
          warnings.push({
            type: 'warning',
            message: `Tab "${tab.label}" has no cards in segment: ${segment}`,
            segment,
            location: `tabs[${tabIndex}].cards`
          });
        } else {
          // Validate each tool card
          tab.cards.forEach((card, cardIndex) => {
            totalTools++;
            if (!card.toolKey) {
              errors.push({
                type: 'error',
                message: `Card ${cardIndex} missing toolKey in tab "${tab.label}", segment: ${segment}`,
                segment,
                location: `tabs[${tabIndex}].cards[${cardIndex}].toolKey`
              });
            } else {
              // Check if tool exists in catalog
              const catalogTool = catalogTools.get(card.toolKey);
              if (!catalogTool) {
                errors.push({
                  type: 'error',
                  message: `Tool "${card.toolKey}" not found in catalog`,
                  segment,
                  toolKey: card.toolKey,
                  location: `tabs[${tabIndex}].cards[${cardIndex}]`
                });
                missingTools.push(card.toolKey);
              } else {
                validTools++;
                // Check if tool has valid routes
                if (!catalogTool.route) {
                  warnings.push({
                    type: 'warning',
                    message: `Tool "${card.toolKey}" missing route in catalog`,
                    segment,
                    toolKey: card.toolKey
                  });
                  unreachableRoutes.push(card.toolKey);
                }
              }
            }
          });
        }
      });
    }

    // Validate quick actions
    if (!config.quickActions || !Array.isArray(config.quickActions)) {
      errors.push({
        type: 'error',
        message: `Missing or invalid quickActions configuration for segment: ${segment}`,
        segment,
        location: 'quickActions'
      });
    } else {
      config.quickActions.forEach((action, actionIndex) => {
        if (!action.label || !action.route) {
          errors.push({
            type: 'error',
            message: `Quick action ${actionIndex} missing label or route in segment: ${segment}`,
            segment,
            location: `quickActions[${actionIndex}]`
          });
        } else {
          // Basic route validation
          if (!action.route.startsWith('/')) {
            warnings.push({
              type: 'warning',
              message: `Quick action "${action.label}" has invalid route format: ${action.route}`,
              segment,
              location: `quickActions[${actionIndex}].route`
            });
          }
        }
      });
    }
  });

  // Additional validations
  const segments = Object.keys(familyToolsConfig);
  if (segments.length === 0) {
    errors.push({
      type: 'error',
      message: 'No segments defined in familyTools.json'
    });
  }

  // Check for required segments
  const requiredSegments = ['aspiring', 'retirees'];
  requiredSegments.forEach(requiredSegment => {
    if (!segments.includes(requiredSegment)) {
      errors.push({
        type: 'error',
        message: `Required segment "${requiredSegment}" missing from familyTools.json`,
        segment: requiredSegment
      });
    }
  });

  return {
    errors,
    warnings,
    summary: {
      totalTools,
      validTools,
      missingTools: [...new Set(missingTools)],
      unreachableRoutes: [...new Set(unreachableRoutes)]
    }
  };
}

// Helper function to get validation status
export function getFamilyToolsValidationStatus(): 'pass' | 'fail' | 'warning' {
  const result = validateFamilyTools();
  
  if (result.errors.length > 0) {
    return 'fail';
  }
  
  if (result.warnings.length > 0) {
    return 'warning';
  }
  
  return 'pass';
}

// Helper function to format validation results for display
export function formatValidationResults(result: ValidationResult): string {
  const lines: string[] = [];
  
  lines.push(`Family Tools Validation Summary:`);
  lines.push(`- Total tools: ${result.summary.totalTools}`);
  lines.push(`- Valid tools: ${result.summary.validTools}`);
  lines.push(`- Errors: ${result.errors.length}`);
  lines.push(`- Warnings: ${result.warnings.length}`);
  
  if (result.summary.missingTools.length > 0) {
    lines.push(`- Missing tools: ${result.summary.missingTools.join(', ')}`);
  }
  
  if (result.summary.unreachableRoutes.length > 0) {
    lines.push(`- Unreachable routes: ${result.summary.unreachableRoutes.join(', ')}`);
  }
  
  return lines.join('\n');
}