import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/services/logging/loggingService';
import { edgeFunctionClient } from '@/services/edgeFunction/EdgeFunctionClient';

export interface ErrorDetails {
  message: string;
  code?: string;
  context?: string;
  timestamp: Date;
  userId?: string;
  component?: string;
  action?: string;
  retryable?: boolean;
  correlationId?: string;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  backoffMultiplier: number;
}

export const useEnhancedErrorHandling = () => {
  const [errors, setErrors] = useState<ErrorDetails[]>([]);
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});

  const defaultRetryConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    backoffMultiplier: 2
  };

  const logError = useCallback((error: ErrorDetails) => {
    setErrors(prev => [...prev, error]);
    
    // Enhanced logging with correlation ID
    logger.error('Enhanced Error Handler', {
      ...error,
      stack: error instanceof Error ? error.stack : undefined
    }, 'useEnhancedErrorHandling');
  }, []);

  const handleError = useCallback((
    error: unknown,
    context: string,
    component?: string,
    action?: string,
    retryable = true
  ) => {
    const correlationId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const errorDetails: ErrorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error && 'code' in error ? String(error.code) : undefined,
      context,
      timestamp: new Date(),
      component,
      action,
      retryable,
      correlationId
    };

    logError(errorDetails);

    // Use the EdgeFunctionClient's error display logic for consistency
    if (retryable) {
      toast.error(errorDetails.message, {
        description: `Error ID: ${correlationId}`,
        action: {
          label: 'Retry',
          onClick: () => {
            toast.info('Please try your action again');
          }
        }
      });
    } else {
      toast.error(errorDetails.message, {
        description: `Error ID: ${correlationId}`,
        action: {
          label: 'Contact Support',
          onClick: () => {
            navigator.clipboard.writeText(correlationId);
            toast.info('Error ID copied to clipboard');
          }
        }
      });
    }

    return errorDetails;
  }, [logError]);

  const withRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    operationKey: string,
    config: Partial<RetryConfig> = {},
    context: string = 'Operation'
  ): Promise<T> => {
    const finalConfig = { ...defaultRetryConfig, ...config };
    const currentAttempt = retryCount[operationKey] || 0;

    try {
      const result = await operation();
      
      // Reset retry count on success
      if (currentAttempt > 0) {
        setRetryCount(prev => ({ ...prev, [operationKey]: 0 }));
        toast.success(`${context} succeeded after ${currentAttempt} retries`);
      }
      
      return result;
    } catch (error) {
      const nextAttempt = currentAttempt + 1;
      
      if (nextAttempt < finalConfig.maxAttempts) {
        setRetryCount(prev => ({ ...prev, [operationKey]: nextAttempt }));
        
        const delay = finalConfig.baseDelay * Math.pow(finalConfig.backoffMultiplier, currentAttempt);
        
        toast.info(`${context} failed, retrying in ${delay}ms... (${nextAttempt}/${finalConfig.maxAttempts})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return withRetry(operation, operationKey, config, context);
      } else {
        // Max attempts reached
        setRetryCount(prev => ({ ...prev, [operationKey]: 0 }));
        
        const errorDetails = handleError(
          error,
          `${context} failed after ${finalConfig.maxAttempts} attempts`,
          undefined,
          operationKey,
          false
        );
        
        throw new Error(errorDetails.message);
      }
    }
  }, [retryCount, handleError]);

  // Enhanced edge function handling
  const handleEdgeFunction = useCallback(async (
    functionName: string,
    payload?: any,
    options?: {
      context?: string;
      retryConfig?: Partial<RetryConfig>;
      showSuccessMessage?: boolean;
      successMessage?: string;
    }
  ) => {
    const context = options?.context || `Edge Function: ${functionName}`;
    
    try {
      // Use the centralized EdgeFunctionClient
      const response = await edgeFunctionClient.invoke(functionName, payload, {
        retryConfig: options?.retryConfig,
        showSuccessMessage: options?.showSuccessMessage,
        successMessage: options?.successMessage
      });

      if (!response.success && response.error) {
        // Error already handled by EdgeFunctionClient, just log locally
        const errorDetails: ErrorDetails = {
          message: response.error.message,
          code: response.error.code,
          context,
          timestamp: new Date(),
          retryable: response.error.retryable,
          correlationId: response.error.correlationId
        };
        
        logError(errorDetails);
      }

      return response;
    } catch (error) {
      // Fallback error handling
      return handleError(error, context, 'EdgeFunction', functionName, true);
    }
  }, [logError, handleError]);

  const handleAddButtonError = useCallback((
    error: unknown,
    buttonType: string,
    additionalContext?: string
  ) => {
    const context = `Add ${buttonType} button${additionalContext ? ` - ${additionalContext}` : ''}`;
    
    let userMessage = `Failed to add ${buttonType}`;
    let retryable = true;

    if (error instanceof Error) {
      if (error.message.includes('network')) {
        userMessage = `Network error while adding ${buttonType}. Please check your connection.`;
      } else if (error.message.includes('permission')) {
        userMessage = `Permission denied. Please check your access rights.`;
        retryable = false;
      } else if (error.message.includes('validation')) {
        userMessage = `Invalid data provided. Please check your input.`;
        retryable = false;
      }
    }

    return handleError(
      new Error(userMessage),
      context,
      'AddButton',
      buttonType,
      retryable
    );
  }, [handleError]);

  const handleShareButtonError = useCallback((
    error: unknown,
    shareType: string,
    additionalContext?: string
  ) => {
    const context = `Share ${shareType} button${additionalContext ? ` - ${additionalContext}` : ''}`;
    
    let userMessage = `Failed to share ${shareType}`;
    let retryable = true;

    if (error instanceof Error) {
      if (error.message.includes('no documents')) {
        userMessage = `No documents available to share. Please add documents first.`;
        retryable = false;
      } else if (error.message.includes('no professionals')) {
        userMessage = `No professionals found. Please add professionals first.`;
        retryable = false;
      } else if (error.message.includes('authentication')) {
        userMessage = `Authentication required. Please log in and try again.`;
        retryable = false;
      }
    }

    return handleError(
      new Error(userMessage),
      context,
      'ShareButton',
      shareType,
      retryable
    );
  }, [handleError]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getErrorsForComponent = useCallback((component: string) => {
    return errors.filter(error => error.component === component);
  }, [errors]);

  const getRecentErrors = useCallback((minutesAgo: number = 5) => {
    const cutoff = new Date(Date.now() - minutesAgo * 60 * 1000);
    return errors.filter(error => error.timestamp > cutoff);
  }, [errors]);

  return {
    errors,
    retryCount,
    handleError,
    withRetry,
    handleEdgeFunction,
    handleAddButtonError,
    handleShareButtonError,
    clearErrors,
    getErrorsForComponent,
    getRecentErrors
  };
};
