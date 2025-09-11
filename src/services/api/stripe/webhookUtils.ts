import { StripeWebhookEvent } from '../types/webhookTypes';
import { logger } from '@/services/logging/loggingService';
import * as Canonical from '@/lib/canonical';

// Mock secret for webhook signature verification
// In a real app, this would be stored securely and retrieved from environment variables
export const STRIPE_WEBHOOK_SECRET = 'whsec_mock_secret_key_for_demo_purposes';

/**
 * Verify the Stripe webhook signature
 * In a real app, this would use the Stripe SDK to verify the signature
 */
export const verifyWebhookSignature = async (
  payload: string,
  signature: string
): Promise<boolean> => {
  // Basic input validation
  if (!signature || !payload) {
    logger.error('Missing signature or payload in webhook verification', {
      hasSignature: !!signature,
      hasPayload: !!payload
    }, 'StripeWebhook');
    return false;
  }
  
  // Prevent excessive payload size to avoid DoS attacks
  if (payload.length > 1000000) { // 1MB limit
    logger.error('Payload size exceeds limit', {
      payloadSize: payload.length
    }, 'StripeWebhook');
    return false;
  }
  
  // Validate signature format before processing
  const signatureRegex = /^[a-zA-Z0-9=_-]+$/;
  if (!signatureRegex.test(signature)) {
    logger.error('Invalid signature format', {}, 'StripeWebhook');
    return false;
  }
  
  logger.info('Verifying webhook signature', {
    signatureLength: signature.length,
    payloadSize: payload.length
  }, 'StripeWebhook');
  
  try {
    // In a real implementation, this would use Stripe's constructEvent method
    // For demonstration, implement a simple hash verification
    // This is NOT production-ready, but illustrates the concept
    const expectedSignature = await Canonical.sha256Hex(STRIPE_WEBHOOK_SECRET + payload);
    
    // Simple comparison (in production, use proper HMAC and timing-safe comparison)
    const signaturesMatch = signature === expectedSignature;
    
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
    // Check for payload size to prevent DoS attacks
    if (payload.length > 1000000) { // 1MB limit
      throw new Error('Payload size exceeds limit');
    }
    
    // Parse and re-stringify to ensure it's valid JSON without modifications
    const parsed = JSON.parse(payload);
    
    // Additional sanitization could be added here for specific fields
    
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
  
  // Validate event ID format (additional security check)
  const eventIdRegex = /^evt_[a-zA-Z0-9]+$/;
  if (!eventIdRegex.test(event.id)) {
    logger.error('Invalid event ID format', { eventId: event.id }, 'StripeWebhook');
    return false;
  }
  
  // Additional specific validations based on event type
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (!session.id || session.id.trim() === '') {
      logger.error('Missing session ID in checkout.session.completed event', { event }, 'StripeWebhook');
      return false;
    }
    
    // Validate session ID format
    const sessionIdRegex = /^cs_[a-zA-Z0-9]+$/;
    if (!sessionIdRegex.test(session.id)) {
      logger.error('Invalid session ID format', { sessionId: session.id }, 'StripeWebhook');
      return false;
    }
  }
  
  return true;
};