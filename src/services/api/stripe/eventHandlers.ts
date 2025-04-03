
import { StripeWebhookEvent } from '../types/webhookTypes';
import { enrollUserInCourse } from '../ghlCourseApi';
import { logger } from '@/services/logging/loggingService';

/**
 * Validate checkout session data
 * @param session The checkout session to validate
 * @returns boolean indicating if the session is valid
 */
const validateCheckoutSession = (session: any): boolean => {
  // Security: Validate required fields
  if (!session || typeof session !== 'object') {
    logger.error('Invalid session object', { session }, 'StripeEventHandler');
    return false;
  }
  
  // Security: Validate session ID
  if (!session.id || typeof session.id !== 'string') {
    logger.error('Missing or invalid session ID', { sessionId: session.id }, 'StripeEventHandler');
    return false;
  }
  
  // Security: Validate metadata
  if (!session.metadata || typeof session.metadata !== 'object') {
    logger.warning('Missing session metadata', { sessionId: session.id }, 'StripeEventHandler');
    // Not returning false here as metadata might be optional in some cases
  }
  
  return true;
};

/**
 * Process a checkout.session.completed event
 * This event is triggered when a customer completes the checkout process
 * Enhanced with additional security measures
 */
export const processCheckoutSessionCompleted = async (
  event: StripeWebhookEvent
): Promise<boolean> => {
  try {
    const session = event.data.object;
    
    // Security: Validate session data
    if (!validateCheckoutSession(session)) {
      return false;
    }
    
    // Extract the necessary data from the session
    const courseId = session.metadata?.courseId;
    const userId = session.metadata?.userId;
    
    // Security: Validate required metadata
    if (!courseId) {
      logger.error('Course ID not found in session metadata', { 
        eventId: event.id,
        session: {
          id: session.id,
          hasMetadata: !!session.metadata
        }
      }, 'StripeEventHandler');
      return false;
    }
    
    // Security: Log securely without exposing full customer data
    logger.info('Processing checkout.session.completed', {
      eventId: event.id,
      courseId,
      // Only log partial email if available
      customerEmailDomain: session.customer_email ? 
        `@${session.customer_email.split('@')[1]}` : 
        'not available',
      timestamp: new Date().toISOString()
    }, 'StripeEventHandler');
    
    // Use server-side token for API calls
    // In a real app, this would be a secure server-to-server authentication
    const apiToken = 'Bearer server_side_token';
    
    // Security: Validate and sanitize enrollment data
    const enrollmentData = {
      courseId: String(courseId), // Ensure string type
      userData: {
        name: userId ? String(userId) : undefined,
        email: session.customer_email ? String(session.customer_email) : undefined
      }
    };
    
    logger.info('Enrolling user in course', { 
      courseId, 
      userEmail: session.customer_email ? 
        `***${session.customer_email.substring(3)}` : // Partial masking
        'not available'
    }, 'StripeEventHandler');
    
    // Security: Call GHL API with proper error handling
    const response = await enrollUserInCourse(apiToken, enrollmentData);
    
    if (response.success) {
      logger.info('Enrollment updated successfully', { 
        courseId, 
        enrollmentId: response.data?.enrollmentId 
      }, 'StripeEventHandler');
      return true;
    } else {
      logger.error('Failed to update enrollment', { 
        courseId, 
        error: response.error 
      }, 'StripeEventHandler');
      return false;
    }
  } catch (error) {
    // Security: Log error without exposing implementation details
    logger.error('Error processing checkout session completed event:', error, 'StripeEventHandler');
    return false;
  }
};

/**
 * Validate payment intent data
 * @param paymentIntent The payment intent to validate
 * @returns boolean indicating if the payment intent is valid
 */
const validatePaymentIntent = (paymentIntent: any): boolean => {
  // Security: Validate required fields
  if (!paymentIntent || typeof paymentIntent !== 'object') {
    logger.error('Invalid payment intent object', { paymentIntent }, 'StripeEventHandler');
    return false;
  }
  
  // Security: Validate payment intent ID
  if (!paymentIntent.id || typeof paymentIntent.id !== 'string') {
    logger.error('Missing or invalid payment intent ID', { 
      paymentIntentId: paymentIntent.id 
    }, 'StripeEventHandler');
    return false;
  }
  
  return true;
};

/**
 * Process a payment_intent.succeeded event
 * This event is triggered when a payment is successfully processed
 * Enhanced with additional security measures
 */
export const processPaymentIntentSucceeded = async (
  event: StripeWebhookEvent
): Promise<boolean> => {
  try {
    const paymentIntent = event.data.object;
    
    // Security: Validate payment intent data
    if (!validatePaymentIntent(paymentIntent)) {
      return false;
    }
    
    // Extract the necessary data from the payment intent
    const courseId = paymentIntent.metadata?.courseId;
    const userId = paymentIntent.metadata?.userId;
    
    if (!courseId) {
      logger.error('Course ID not found in payment intent metadata', { 
        eventId: event.id,
        paymentIntent: {
          id: paymentIntent.id,
          hasMetadata: !!paymentIntent.metadata
        }
      }, 'StripeEventHandler');
      return false;
    }
    
    logger.info('Processing payment_intent.succeeded', {
      eventId: event.id,
      courseId,
      paymentIntentId: paymentIntent.id,
      timestamp: new Date().toISOString()
    }, 'StripeEventHandler');
    
    // Similar logic to checkout.session.completed
    // Use server-side token for API calls
    const apiToken = 'Bearer server_side_token';
    
    // Security: Validate and sanitize enrollment data
    const enrollmentData = {
      courseId: String(courseId), // Ensure string type
      userData: {
        name: userId ? String(userId) : undefined,
        // We might not have the email directly in the payment intent
        // In a real application, you would fetch this from your database
      }
    };
    
    logger.info('Enrolling user in course via payment intent', { 
      courseId, 
      userId: userId ? `${userId.substring(0, 3)}***` : 'not available' // Partial masking
    }, 'StripeEventHandler');
    
    // Security: Call GHL API with proper error handling
    const response = await enrollUserInCourse(apiToken, enrollmentData);
    
    if (response.success) {
      logger.info('Enrollment updated successfully via payment intent', { 
        courseId, 
        enrollmentId: response.data?.enrollmentId 
      }, 'StripeEventHandler');
      return true;
    } else {
      logger.error('Failed to update enrollment via payment intent', { 
        courseId, 
        error: response.error 
      }, 'StripeEventHandler');
      return false;
    }
  } catch (error) {
    // Security: Log error without exposing implementation details
    logger.error('Error processing payment intent succeeded event:', error, 'StripeEventHandler');
    return false;
  }
};
