// Wrapper for family tools validation to match ReadyCheck interface
import { validateFamilyTools as validateFamilyToolsOriginal } from '@/tools/validateFamilyTools';

export function validateFamilyTools(): { errors?: string[]; warnings?: string[] } {
  try {
    const result = validateFamilyToolsOriginal();
    
    // Convert ValidationError[] to string[]
    const errors = result.errors.map(e => e.message);
    const warnings = result.warnings.map(w => w.message);
    
    return { errors, warnings };
  } catch (error) {
    return { 
      errors: [`Family tools validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    };
  }
}