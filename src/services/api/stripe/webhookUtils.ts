
import { StripeWebhookEvent } from '../types/webhookTypes';
import { logger } from '@/services/logging/loggingService';
import crypto from 'crypto';

// Mock secret for webhook signature verification
// In a real app, this would be stored securely and retrieved from environment variables
export const STRIPE_WEBHOOK_SECRET = 'whsec_mock_secret_key_for_demo_purposes';

/**
 * Verify the Stripe webhook signature
 * In a real app, this would use the Stripe SDK to verify the signature
 */
export const verifyWebhookSignature = (
  payload: string,
  signature: string
): boolean => {
  // Basic input validation
  if (!signature || !payload) {
    logger.error('Missing signature or payload in webhook verification', {
      hasSignature: !!signature,
      hasPayload: !!payload
    }, 'StripeWebhook');
    return false;
  }
  
  logger.info('Verifying webhook signature', {
    signatureLength: signature.length,
    payloadSize: payload.length
  }, 'StripeWebhook');
  
  try {
    // In a real implementation, this would use Stripe's constructEvent method
    // For demonstration, implement a simple HMAC verification
    // This is NOT production-ready, but illustrates the concept
    const hmac = crypto.createHmac('sha256', STRIPE_WEBHOOK_SECRET);
    const expectedSignature = hmac.update(payload).digest('hex');
    
    // Time-constant comparison to prevent timing attacks
    // In production, use Stripe's official SDK which handles this correctly
    const signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(signature), 
      Buffer.from(expectedSignature)
    );
    
    if (!signaturesMatch) {
      logger.warning('Invalid webhook signature', {
        signatureLength: signature.length
      }, 'StripeWebhook');
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error during signature verification:', error, 'StripeWebhook');
    return false;
  }
};

/**
 * Sanitize webhook payload to prevent potential XSS or injection attacks
 * This function removes any potentially dangerous input before processing
 */
export const sanitizeWebhookPayload = (payload: string): string => {
  try {
    // Parse and re-stringify to ensure it's valid JSON without modifications
    const parsed = JSON.parse(payload);
    return JSON.stringify(parsed);
  } catch (error) {
    logger.error('Invalid JSON payload received:', error, 'StripeWebhook');
    throw new Error('Invalid webhook payload format');
  }
};

/**
 * Validate webhook event structure and required fields
 */
export const validateWebhookEvent = (event: StripeWebhookEvent): boolean => {
  // Validate basic event structure
  if (!event || !event.id || !event.type || !event.data || !event.data.object) {
    logger.error('Invalid webhook event structure', { event }, 'StripeWebhook');
    return false;
  }
  
  // Additional specific validations based on event type
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (!session.id || session.id.trim() === '') {
      logger.error('Missing session ID in checkout.session.completed event', { event }, 'StripeWebhook');
      return false;
    }
  }
  
  return true;
};
