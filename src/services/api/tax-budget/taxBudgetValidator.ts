
import { TaxBudget, HypotheticalScenario } from '@/types/tax-budget';
import { logger } from '@/services/logging/loggingService';

/**
 * Validates a tax budget object
 * @param taxBudget The tax budget to validate
 * @returns true if valid, false otherwise
 */
export const validateTaxBudget = (taxBudget: Partial<TaxBudget>): boolean => {
  try {
    // Check required fields
    if (!taxBudget.year || !taxBudget.owner) {
      logger.warning('Missing required tax budget fields', { 
        hasYear: !!taxBudget.year,
        hasOwner: !!taxBudget.owner
      }, 'TaxBudgetService');
      return false;
    }
    
    // Validate year is within reasonable range
    const currentYear = new Date().getFullYear();
    if (taxBudget.year < currentYear - 1 || taxBudget.year > currentYear + 10) {
      logger.warning('Tax budget year out of valid range', { 
        year: taxBudget.year,
        currentYear
      }, 'TaxBudgetService');
      return false;
    }
    
    // Validate capital gains limit is a positive number
    if (taxBudget.capitalGainsLimit !== undefined && 
        (typeof taxBudget.capitalGainsLimit !== 'number' || 
         taxBudget.capitalGainsLimit < 0 || 
         !Number.isFinite(taxBudget.capitalGainsLimit))) {
      logger.warning('Invalid capital gains limit', { 
        capitalGainsLimit: taxBudget.capitalGainsLimit
      }, 'TaxBudgetService');
      return false;
    }
    
    // Validate accounts array
    if (taxBudget.accounts) {
      if (!Array.isArray(taxBudget.accounts)) {
        logger.warning('Tax budget accounts is not an array', {
          accounts: taxBudget.accounts
        }, 'TaxBudgetService');
        return false;
      }
      
      // Check if all account IDs are strings
      const allValidAccountIds = taxBudget.accounts.every(
        accountId => typeof accountId === 'string' && accountId.trim() !== ''
      );
      
      if (!allValidAccountIds) {
        logger.warning('Invalid account IDs in tax budget', {
          accountsCount: taxBudget.accounts.length
        }, 'TaxBudgetService');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    logger.error('Error validating tax budget', error, 'TaxBudgetService');
    return false;
  }
};

/**
 * Validates a hypothetical scenario object
 * @param scenario The scenario to validate
 * @returns true if valid, false otherwise
 */
export const validateHypotheticalScenario = (scenario: Partial<HypotheticalScenario>): boolean => {
  try {
    // Check required fields
    if (!scenario.name || !scenario.owner) {
      logger.warning('Missing required hypothetical scenario fields', { 
        hasName: !!scenario.name,
        hasOwner: !!scenario.owner
      }, 'TaxBudgetService');
      return false;
    }
    
    // Validate name length
    if (scenario.name.length > 100) {
      logger.warning('Scenario name exceeds maximum length', { 
        nameLength: scenario.name.length
      }, 'TaxBudgetService');
      return false;
    }
    
    // Validate tax horizon is a positive number
    if (scenario.taxHorizon !== undefined && 
        (typeof scenario.taxHorizon !== 'number' || 
         scenario.taxHorizon <= 0 || 
         scenario.taxHorizon > 50 || 
         !Number.isInteger(scenario.taxHorizon))) {
      logger.warning('Invalid tax horizon', { 
        taxHorizon: scenario.taxHorizon
      }, 'TaxBudgetService');
      return false;
    }
    
    // Validate accounts array
    if (scenario.accounts) {
      if (!Array.isArray(scenario.accounts)) {
        logger.warning('Scenario accounts is not an array', {
          accounts: scenario.accounts
        }, 'TaxBudgetService');
        return false;
      }
      
      // Check if all account IDs are strings
      const allValidAccountIds = scenario.accounts.every(
        accountId => typeof accountId === 'string' && accountId.trim() !== ''
      );
      
      if (!allValidAccountIds) {
        logger.warning('Invalid account IDs in scenario', {
          accountsCount: scenario.accounts.length
        }, 'TaxBudgetService');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    logger.error('Error validating hypothetical scenario', error, 'TaxBudgetService');
    return false;
  }
};

/**
 * Sanitizes a tax budget object to prevent injection attacks
 * @param taxBudget The tax budget to sanitize
 * @returns Sanitized tax budget
 */
export const sanitizeTaxBudget = (taxBudget: Partial<TaxBudget>): Partial<TaxBudget> => {
  try {
    const sanitized: Partial<TaxBudget> = { ...taxBudget };
    
    // Sanitize string fields
    if (typeof sanitized.id === 'string') {
      sanitized.id = sanitized.id.slice(0, 100).trim();
    }
    
    if (typeof sanitized.owner === 'string') {
      sanitized.owner = sanitized.owner.slice(0, 100).trim();
    }
    
    // Ensure accounts is an array of strings
    if (sanitized.accounts) {
      sanitized.accounts = sanitized.accounts
        .filter(accountId => typeof accountId === 'string')
        .map(accountId => accountId.slice(0, 100).trim());
    }
    
    return sanitized;
  } catch (error) {
    logger.error('Error sanitizing tax budget', error, 'TaxBudgetService');
    return {}; // Return empty object in case of error
  }
};

/**
 * Sanitizes a hypothetical scenario object to prevent injection attacks
 * @param scenario The scenario to sanitize
 * @returns Sanitized scenario
 */
export const sanitizeHypotheticalScenario = (scenario: Partial<HypotheticalScenario>): Partial<HypotheticalScenario> => {
  try {
    const sanitized: Partial<HypotheticalScenario> = { ...scenario };
    
    // Sanitize string fields
    if (typeof sanitized.id === 'string') {
      sanitized.id = sanitized.id.slice(0, 100).trim();
    }
    
    if (typeof sanitized.name === 'string') {
      sanitized.name = sanitized.name.slice(0, 100).trim();
    }
    
    if (typeof sanitized.owner === 'string') {
      sanitized.owner = sanitized.owner.slice(0, 100).trim();
    }
    
    if (typeof sanitized.portfolioModel === 'string') {
      sanitized.portfolioModel = sanitized.portfolioModel.slice(0, 100).trim();
    }
    
    // Ensure accounts is an array of strings
    if (sanitized.accounts) {
      sanitized.accounts = sanitized.accounts
        .filter(accountId => typeof accountId === 'string')
        .map(accountId => accountId.slice(0, 100).trim());
    }
    
    return sanitized;
  } catch (error) {
    logger.error('Error sanitizing hypothetical scenario', error, 'TaxBudgetService');
    return {}; // Return empty object in case of error
  }
};
