
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/logging/loggingService';
import { toast } from 'sonner';

export interface EdgeFunctionError {
  code: string;
  message: string;
  userMessage: string;
  actionable: boolean;
  retryable: boolean;
  category: 'authentication' | 'validation' | 'network' | 'external_api' | 'rate_limit' | 'server' | 'unknown';
  details?: any;
  correlationId: string;
}

export interface EdgeFunctionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: EdgeFunctionError;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

class EdgeFunctionClient {
  private defaultRetryConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
  };

  private generateCorrelationId(): string {
    return `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private categorizeError(error: any): EdgeFunctionError['category'] {
    const message = error?.message?.toLowerCase() || '';
    const status = error?.status || 0;
    
    if (status === 401 || message.includes('unauthorized') || message.includes('token')) {
      return 'authentication';
    }
    if (status === 400 || message.includes('validation') || message.includes('invalid')) {
      return 'validation';
    }
    if (status === 429 || message.includes('rate limit') || message.includes('too many')) {
      return 'rate_limit';
    }
    if (status >= 500 && status < 600) {
      return 'server';
    }
    if (message.includes('network') || message.includes('timeout') || message.includes('connection')) {
      return 'network';
    }
    if (message.includes('stripe') || message.includes('plaid') || message.includes('external')) {
      return 'external_api';
    }
    return 'unknown';
  }

  private createUserFriendlyMessage(category: EdgeFunctionError['category'], originalMessage: string): string {
    const messageMap = {
      authentication: 'Your session has expired. Please log in again to continue.',
      validation: 'Please check your input and try again. Some required information may be missing or incorrect.',
      network: 'Connection issue detected. Please check your internet connection and try again.',
      external_api: 'External service is temporarily unavailable. Please try again in a few moments.',
      rate_limit: 'Too many requests. Please wait a moment before trying again.',
      server: 'Server is experiencing issues. Our team has been notified and is working on a fix.',
      unknown: 'An unexpected error occurred. Please try again or contact support if the issue persists.'
    };

    return messageMap[category] || messageMap.unknown;
  }

  private async logError(error: EdgeFunctionError, functionName: string, requestData?: any): Promise<void> {
    // Log to local logging service
    logger.error(
      `Edge Function Error: ${functionName}`,
      {
        error: error,
        requestData: requestData ? JSON.stringify(requestData) : undefined,
        timestamp: new Date().toISOString(),
        correlationId: error.correlationId
      },
      'EdgeFunctionClient'
    );

    // Log to Supabase audit_logs for admin dashboard
    try {
      await supabase.from('audit_logs').insert({
        event_type: 'edge_function_error',
        status: 'error',
        details: {
          function_name: functionName,
          error_code: error.code,
          error_message: error.message,
          error_category: error.category,
          correlation_id: error.correlationId,
          user_message: error.userMessage,
          retryable: error.retryable,
          request_data: requestData,
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log error to audit_logs:', logError);
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateDelay(attempt: number, config: RetryConfig): number {
    const delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1);
    return Math.min(delay, config.maxDelay);
  }

  async invoke<T = any>(
    functionName: string,
    payload?: any,
    options?: {
      retryConfig?: Partial<RetryConfig>;
      showUserError?: boolean;
      showSuccessMessage?: boolean;
      successMessage?: string;
    }
  ): Promise<EdgeFunctionResponse<T>> {
    const correlationId = this.generateCorrelationId();
    const retryConfig = { ...this.defaultRetryConfig, ...options?.retryConfig };
    const showUserError = options?.showUserError !== false; // Default to true
    
    logger.info(`Invoking edge function: ${functionName}`, { correlationId, payload }, 'EdgeFunctionClient');

    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      try {
        const { data, error } = await supabase.functions.invoke(functionName, {
          body: payload
        });

        if (error) {
          throw error;
        }

        // Log successful call
        logger.info(`Edge function success: ${functionName}`, { 
          correlationId, 
          attempt,
          responseData: data 
        }, 'EdgeFunctionClient');

        // Show success message if requested
        if (options?.showSuccessMessage && options?.successMessage) {
          toast.success(options.successMessage);
        }

        return {
          success: true,
          data: data
        };

      } catch (rawError: any) {
        const category = this.categorizeError(rawError);
        const edgeError: EdgeFunctionError = {
          code: rawError.code || `EDGE_${category.toUpperCase()}_ERROR`,
          message: rawError.message || 'Unknown error occurred',
          userMessage: this.createUserFriendlyMessage(category, rawError.message || ''),
          actionable: category !== 'server' && category !== 'unknown',
          retryable: category === 'network' || category === 'rate_limit' || category === 'server',
          category,
          details: rawError,
          correlationId
        };

        // Log the error
        await this.logError(edgeError, functionName, payload);

        // If this is the last attempt or error is not retryable, return error
        if (attempt >= retryConfig.maxAttempts || !edgeError.retryable) {
          if (showUserError) {
            this.showUserError(edgeError, functionName);
          }

          return {
            success: false,
            error: edgeError
          };
        }

        // Wait before retry
        const delay = this.calculateDelay(attempt, retryConfig);
        logger.info(`Retrying ${functionName} in ${delay}ms (attempt ${attempt}/${retryConfig.maxAttempts})`, 
          { correlationId }, 'EdgeFunctionClient');
        
        await this.sleep(delay);
      }
    }

    // This should never be reached, but TypeScript requires it
    const fallbackError: EdgeFunctionError = {
      code: 'EDGE_UNKNOWN_ERROR',
      message: 'Unknown error in edge function client',
      userMessage: 'An unexpected error occurred. Please try again.',
      actionable: false,
      retryable: false,
      category: 'unknown',
      correlationId
    };

    return {
      success: false,
      error: fallbackError
    };
  }

  private showUserError(error: EdgeFunctionError, functionName: string): void {
    const errorMessage = error.userMessage;
    
    // Determine toast type based on category
    const isActionable = error.actionable;
    
    if (isActionable) {
      toast.error(errorMessage, {
        description: `Error ID: ${error.correlationId}`,
        action: error.retryable ? {
          label: 'Retry',
          onClick: () => {
            // The calling code would need to handle retry
            toast.info('Please try your action again');
          }
        } : {
          label: 'Contact Support',
          onClick: () => {
            // Could open support modal or copy error ID
            navigator.clipboard.writeText(error.correlationId);
            toast.info('Error ID copied to clipboard');
          }
        }
      });
    } else {
      toast.error(errorMessage, {
        description: `Our team has been notified. Error ID: ${error.correlationId}`
      });
    }
  }

  // Convenience methods for specific edge function types
  async invokeOTPFunction(functionName: string, payload: any) {
    return this.invoke(functionName, payload, {
      successMessage: 'OTP sent successfully',
      showSuccessMessage: true
    });
  }

  async invokeTransferFunction(functionName: string, payload: any) {
    return this.invoke(functionName, payload, {
      retryConfig: { maxAttempts: 2 }, // Fewer retries for financial operations
      successMessage: 'Transfer processed successfully',
      showSuccessMessage: true
    });
  }

  async invokeInviteFunction(functionName: string, payload: any) {
    return this.invoke(functionName, payload, {
      successMessage: 'Invitation sent successfully',
      showSuccessMessage: true
    });
  }

  async invokePlaidFunction(functionName: string, payload: any) {
    return this.invoke(functionName, payload, {
      retryConfig: { maxAttempts: 2, baseDelay: 2000 }, // Longer delays for external API
      successMessage: 'Bank connection updated successfully',
      showSuccessMessage: true
    });
  }
}

export const edgeFunctionClient = new EdgeFunctionClient();
