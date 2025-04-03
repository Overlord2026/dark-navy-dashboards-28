
import { toast } from 'sonner';
import { ApiResponse } from '@/types/api';
import { StripeWebhookEvent, WebhookResponse } from '../types/webhookTypes';
import { verifyWebhookSignature } from './webhookUtils';
import { 
  processCheckoutSessionCompleted, 
  processPaymentIntentSucceeded 
} from './eventHandlers';
import { authenticateRequest } from '../auth/authUtils';
import { logger } from '@/services/logging/loggingService';
import { UserToken } from '@/types/api'; // Fix missing import

/**
 * Handle incoming Stripe webhook events
 */
export const handleStripeWebhook = async (
  payload: string,
  signature: string
): Promise<ApiResponse<WebhookResponse>> => {
  try {
    // Verify the webhook signature
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
    
    // Parse the event data
    const event: StripeWebhookEvent = JSON.parse(payload);
    
    logger.info(`Processing Stripe webhook event: ${event.type}`, { eventId: event.id }, 'StripeWebhook');
    
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
    logger.error('Error handling webhook:', error, 'StripeWebhook');
    return {
      success: false,
      error: 'Failed to process webhook event',
      data: {
        received: true,
        processed: false,
        error: error.message
      }
    };
  }
};

/**
 * POST /api/stripe/webhook endpoint handler
 * This function would be called by a server-side API route
 */
export const processStripeWebhook = async (
  rawBody: string,
  stripeSignature: string,
  token?: string
): Promise<ApiResponse<WebhookResponse>> => {
  // No authentication check here because Stripe webhooks use signatures
  // instead of tokens for authentication
  
  if (!rawBody || !stripeSignature) {
    logger.warning('Missing webhook payload or signature', {}, 'StripeWebhook');
    return {
      success: false,
      error: 'Missing webhook payload or signature',
      data: {
        received: false,
        processed: false,
        error: 'Missing webhook payload or signature'
      }
    };
  }
  
  return handleStripeWebhook(rawBody, stripeSignature);
};

/**
 * Generic API handler with authentication for non-webhook Stripe endpoints
 * @param token JWT token
 * @param handler The handler function to execute if authentication passes
 */
export const authenticatedStripeEndpoint = async <T, U>(
  token: string,
  handler: (userData: UserToken) => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> => {
  const { isAuthenticated, user, errorResponse } = authenticateRequest<T>(token);
  
  if (!isAuthenticated || !user) {
    logger.warning('Unauthorized access attempt to Stripe endpoint', 
      { authorized: isAuthenticated }, 'StripeAuth');
    return errorResponse!;
  }
  
  try {
    logger.info('Authenticated request to Stripe endpoint', 
      { userId: user.id }, 'StripeEndpoint');
    return await handler(user);
  } catch (error) {
    logger.error('Error in authenticated Stripe endpoint:', error, 'StripeEndpoint');
    return {
      success: false,
      error: 'An unexpected error occurred while processing your request',
    };
  }
};
