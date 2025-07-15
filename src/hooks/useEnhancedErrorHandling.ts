import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface ErrorDetails {
  message: string;
  code?: string;
  context?: string;
  timestamp: Date;
  userId?: string;
  component?: string;
  action?: string;
  retryable?: boolean;
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
    
    // Log to console for debugging
    console.error('Enhanced Error:', {
      ...error,
      stack: error instanceof Error ? error.stack : undefined
    });

    // Send to analytics/monitoring service (placeholder)
    if (process.env.NODE_ENV === 'production') {
      // analytics.track('error_occurred', error);
    }
  }, []);

  const handleError = useCallback((
    error: unknown,
    context: string,
    component?: string,
    action?: string,
    retryable = true
  ) => {
    const errorDetails: ErrorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error && 'code' in error ? String(error.code) : undefined,
      context,
      timestamp: new Date(),
      component,
      action,
      retryable
    };

    logError(errorDetails);

    // Show appropriate toast based on error type
    if (errorDetails.retryable) {
      toast.error(errorDetails.message, {
        action: {
          label: 'Retry',
          onClick: () => {
            // Retry logic would be implemented by the consuming component
            toast.info('Retrying...');
          }
        }
      });
    } else {
      toast.error(errorDetails.message);
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

  const handleAddButtonError = useCallback((
    error: unknown,
    buttonType: string,
    additionalContext?: string
  ) => {
    const context = `Add ${buttonType} button${additionalContext ? ` - ${additionalContext}` : ''}`;
    
    let userMessage = `Failed to add ${buttonType}`;
    let retryable = true;

    if (error instanceof Error) {
      // Handle specific error types
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
      // Handle specific error types
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
    handleAddButtonError,
    handleShareButtonError,
    clearErrors,
    getErrorsForComponent,
    getRecentErrors
  };
};