
import { toast } from 'sonner';
import { ApiResponse } from '@/types/api';
import { enrollUserInCourse, CourseEnrollmentResponse } from '@/services/api/ghlCourseApi';

// Interface for Stripe webhook event
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
  signature?: string;
}

// Interface for webhook response
export interface WebhookResponse {
  received: boolean;
  processed: boolean;
  eventType?: string;
  error?: string;
}

// Mock secret for webhook signature verification
// In a real app, this would be stored securely and retrieved from environment variables
const STRIPE_WEBHOOK_SECRET = 'whsec_mock_secret_key_for_demo_purposes';

/**
 * Verify the Stripe webhook signature
 * In a real app, this would use the Stripe SDK to verify the signature
 */
const verifyWebhookSignature = (
  payload: string,
  signature: string
): boolean => {
  // In a real implementation, this would use Stripe's signature verification
  // For demo purposes, we'll just do a basic check
  if (!signature || !payload) {
    console.error('Missing signature or payload');
    return false;
  }
  
  // Normally we would use the Stripe SDK here
  // Example: stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
  
  // For demo, return true if there's a signature
  return true;
};

/**
 * Process a checkout.session.completed event
 * This event is triggered when a customer completes the checkout process
 */
const processCheckoutSessionCompleted = async (
  event: StripeWebhookEvent
): Promise<boolean> => {
  try {
    const session = event.data.object;
    
    // Extract the necessary data from the session
    const courseId = session.metadata?.courseId;
    const userId = session.metadata?.userId;
    
    if (!courseId) {
      console.error('Course ID not found in session metadata');
      return false;
    }
    
    // Mock token for API calls
    // In a real app, we would use a server-to-server authentication method
    const apiToken = 'Bearer server_side_token';
    
    // Call GHL API to update the enrollment status
    const enrollmentData = {
      courseId,
      userData: {
        id: userId || undefined,
        email: session.customer_email || undefined
      }
    };
    
    const response = await enrollUserInCourse(apiToken, enrollmentData);
    
    if (response.success) {
      console.log('Enrollment updated successfully:', response.data);
      return true;
    } else {
      console.error('Failed to update enrollment:', response.error);
      return false;
    }
  } catch (error) {
    console.error('Error processing checkout session completed event:', error);
    return false;
  }
};

/**
 * Process a payment_intent.succeeded event
 * This event is triggered when a payment is successfully processed
 */
const processPaymentIntentSucceeded = async (
  event: StripeWebhookEvent
): Promise<boolean> => {
  try {
    const paymentIntent = event.data.object;
    
    // Extract the necessary data from the payment intent
    const courseId = paymentIntent.metadata?.courseId;
    const userId = paymentIntent.metadata?.userId;
    
    if (!courseId) {
      console.error('Course ID not found in payment intent metadata');
      return false;
    }
    
    // Similar logic to checkout.session.completed
    // Mock token for API calls
    const apiToken = 'Bearer server_side_token';
    
    // Call GHL API to update the enrollment status
    const enrollmentData = {
      courseId,
      userData: {
        id: userId || undefined,
        // We might not have the email directly in the payment intent
        // In a real application, you would fetch this from your database
      }
    };
    
    const response = await enrollUserInCourse(apiToken, enrollmentData);
    
    if (response.success) {
      console.log('Enrollment updated successfully via payment intent:', response.data);
      return true;
    } else {
      console.error('Failed to update enrollment via payment intent:', response.error);
      return false;
    }
  } catch (error) {
    console.error('Error processing payment intent succeeded event:', error);
    return false;
  }
};

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
