
import { toast } from 'sonner';
import { ApiResponse } from '@/types/api';
import { StripeWebhookEvent, WebhookResponse } from '../types/webhookTypes';
import { 
  verifyWebhookSignature, 
  sanitizeWebhookPayload,
  validateWebhookEvent
} from './webhookUtils';
import { 
  processCheckoutSessionCompleted, 
  processPaymentIntentSucceeded 
} from './eventHandlers';
import { authenticateRequest } from '../auth/authUtils';
import { logger } from '@/services/logging/loggingService';
import { UserToken } from '@/types/api';

/**
 * Handle incoming Stripe webhook events with enhanced security
 */
export const handleStripeWebhook = async (
  payload: string,
  signature: string
): Promise<ApiResponse<WebhookResponse>> => {
  try {
    // Security: Step 1 - Verify the webhook signature
    const isValid = verifyWebhookSignature(payload, signature);
    
    if (!isValid) {
      logger.warning('Invalid webhook signature received', { signature }, 'StripeWebhook');
      return {
        success: false,
        error: 'Invalid webhook signature',
        data: {
          received: true,
          processed: false,
          error: 'Invalid webhook signature'
        }
      };
    }
    
    // Security: Step 2 - Sanitize the payload
    const sanitizedPayload = sanitizeWebhookPayload(payload);
    
    // Security: Step 3 - Parse the event data
    const event: StripeWebhookEvent = JSON.parse(sanitizedPayload);
    
    // Security: Step 4 - Validate event structure
    if (!validateWebhookEvent(event)) {
      return {
        success: false,
        error: 'Invalid webhook event structure',
        data: {
          received: true,
          processed: false,
          error: 'Invalid webhook event structure'
        }
      };
    }
    
    logger.info(`Processing Stripe webhook event: ${event.type}`, { 
      eventId: event.id,
      timestamp: new Date().toISOString()
    }, 'StripeWebhook');
    
    let processed = false;
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        processed = await processCheckoutSessionCompleted(event);
        break;
        
      case 'payment_intent.succeeded':
        processed = await processPaymentIntentSucceeded(event);
        break;
        
      // Add more event types as needed
      
      default:
        logger.info(`Unhandled event type: ${event.type}`, { eventId: event.id }, 'StripeWebhook');
        // Return success but indicate event was not processed
        return {
          success: true,
          data: {
            received: true,
            processed: false,
            eventType: event.type,
            error: 'Event type not handled'
          }
        };
    }
    
    if (processed) {
      logger.info(`Successfully processed event: ${event.type}`, { eventId: event.id }, 'StripeWebhook');
    } else {
      logger.error(`Failed to process event: ${event.type}`, { eventId: event.id }, 'StripeWebhook');
    }
    
    return {
      success: true,
      data: {
        received: true,
        processed,
        eventType: event.type
      },
      message: processed 
        ? `Successfully processed event: ${event.type}`
        : `Event received but processing failed: ${event.type}`
    };
  } catch (error) {
    // Security: Ensure we don't leak sensitive error details
    const safeErrorMessage = 'Failed to process webhook event';
    logger.error('Error handling webhook:', error, 'StripeWebhook');
    
    return {
      success: false,
      error: safeErrorMessage,
      data: {
        received: true,
        processed: false,
        error: safeErrorMessage
      }
    };
  }
};

/**
 * POST /api/stripe/webhook endpoint handler
 * This function would be called by a server-side API route
 * Enhanced with additional security measures
 */
export const processStripeWebhook = async (
  rawBody: string,
  stripeSignature: string,
  token?: string
): Promise<ApiResponse<WebhookResponse>> => {
  // Security: Input validation
  if (!rawBody || !stripeSignature) {
    const errorMessage = 'Missing webhook payload or signature';
    logger.warning(errorMessage, {
      hasPayload: !!rawBody,
      hasSignature: !!stripeSignature,
      timestamp: new Date().toISOString()
    }, 'StripeWebhook');
    
    return {
      success: false,
      error: errorMessage,
      data: {
        received: false,
        processed: false,
        error: errorMessage
      }
    };
  }
  
  // Security: Rate limiting could be implemented here
  // This would typically use Redis or similar for tracking request counts
  
  // Process the webhook with enhanced security
  return handleStripeWebhook(rawBody, stripeSignature);
};

/**
 * Generic API handler with authentication for non-webhook Stripe endpoints
 * Enhanced with security best practices
 * @param token JWT token
 * @param handler The handler function to execute if authentication passes
 */
export const authenticatedStripeEndpoint = async <T, U>(
  token: string,
  handler: (userData: UserToken) => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> => {
  // Security: Validate input
  if (!token || typeof token !== 'string') {
    logger.warning('Invalid or missing authentication token', {
      hasToken: !!token,
      tokenType: typeof token,
      timestamp: new Date().toISOString()
    }, 'StripeAuth');
    
    return {
      success: false,
      error: 'Authentication required. Please provide a valid token.',
    };
  }

  // Security: Authenticate and validate the token
  const { isAuthenticated, user, errorResponse } = authenticateRequest<T>(token);
  
  if (!isAuthenticated || !user) {
    logger.warning('Unauthorized access attempt to Stripe endpoint', { 
      authorized: isAuthenticated,
      timestamp: new Date().toISOString()
    }, 'StripeAuth');
    
    return errorResponse!;
  }
  
  try {
    logger.info('Authenticated request to Stripe endpoint', { 
      userId: user.id,
      timestamp: new Date().toISOString()
    }, 'StripeEndpoint');
    
    // Execute the handler with the authenticated user
    return await handler(user);
  } catch (error) {
    // Security: Generic error message to avoid leaking implementation details
    const safeErrorMessage = 'An unexpected error occurred while processing your request';
    
    logger.error('Error in authenticated Stripe endpoint:', error, 'StripeEndpoint');
    
    return {
      success: false,
      error: safeErrorMessage,
    };
  }
};
