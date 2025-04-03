
import { toast } from 'sonner';
import { ApiResponse } from '@/types/api';
import { StripeWebhookEvent, WebhookResponse } from '../types/webhookTypes';
import { verifyWebhookSignature } from './webhookUtils';
import { 
  processCheckoutSessionCompleted, 
  processPaymentIntentSucceeded 
} from './eventHandlers';

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
    
    console.log(`Processing Stripe webhook event: ${event.type}`);
    
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
        console.log(`Unhandled event type: ${event.type}`);
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
    console.error('Error handling webhook:', error);
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
  stripeSignature: string
): Promise<ApiResponse<WebhookResponse>> => {
  // No authentication check here because Stripe webhooks use signatures
  // instead of tokens for authentication
  
  if (!rawBody || !stripeSignature) {
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
