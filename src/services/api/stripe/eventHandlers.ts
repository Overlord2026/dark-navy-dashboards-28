
import { StripeWebhookEvent } from '../types/webhookTypes';
import { enrollUserInCourse } from '../ghlCourseApi';
import { logger } from '@/services/logging/loggingService';

/**
 * Process a checkout.session.completed event
 * This event is triggered when a customer completes the checkout process
 */
export const processCheckoutSessionCompleted = async (
  event: StripeWebhookEvent
): Promise<boolean> => {
  try {
    const session = event.data.object;
    
    // Extract the necessary data from the session
    const courseId = session.metadata?.courseId;
    const userId = session.metadata?.userId;
    
    if (!courseId) {
      logger.error('Course ID not found in session metadata', { 
        eventId: event.id,
        session: {
          id: session.id,
          metadata: session.metadata
        }
      }, 'StripeEventHandler');
      return false;
    }
    
    logger.info('Processing checkout.session.completed', {
      eventId: event.id,
      courseId,
      customerEmail: session.customer_email
    }, 'StripeEventHandler');
    
    // Use server-side token for API calls
    // In a real app, this would be a secure server-to-server authentication
    const apiToken = 'Bearer server_side_token';
    
    // Call GHL API to update the enrollment status
    const enrollmentData = {
      courseId,
      userData: {
        name: userId || undefined,
        email: session.customer_email || undefined
      }
    };
    
    logger.info('Enrolling user in course', { 
      courseId, 
      userEmail: session.customer_email 
    }, 'StripeEventHandler');
    
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
    logger.error('Error processing checkout session completed event:', error, 'StripeEventHandler');
    return false;
  }
};

/**
 * Process a payment_intent.succeeded event
 * This event is triggered when a payment is successfully processed
 */
export const processPaymentIntentSucceeded = async (
  event: StripeWebhookEvent
): Promise<boolean> => {
  try {
    const paymentIntent = event.data.object;
    
    // Extract the necessary data from the payment intent
    const courseId = paymentIntent.metadata?.courseId;
    const userId = paymentIntent.metadata?.userId;
    
    if (!courseId) {
      logger.error('Course ID not found in payment intent metadata', { 
        eventId: event.id,
        paymentIntent: {
          id: paymentIntent.id,
          metadata: paymentIntent.metadata
        }
      }, 'StripeEventHandler');
      return false;
    }
    
    logger.info('Processing payment_intent.succeeded', {
      eventId: event.id,
      courseId,
      paymentIntentId: paymentIntent.id
    }, 'StripeEventHandler');
    
    // Similar logic to checkout.session.completed
    // Use server-side token for API calls
    const apiToken = 'Bearer server_side_token';
    
    // Call GHL API to update the enrollment status
    const enrollmentData = {
      courseId,
      userData: {
        name: userId || undefined,
        // We might not have the email directly in the payment intent
        // In a real application, you would fetch this from your database
      }
    };
    
    logger.info('Enrolling user in course via payment intent', { 
      courseId, 
      userId 
    }, 'StripeEventHandler');
    
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
    logger.error('Error processing payment intent succeeded event:', error, 'StripeEventHandler');
    return false;
  }
};
