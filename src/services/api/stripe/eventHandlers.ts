
import { StripeWebhookEvent } from '../types/webhookTypes';
import { enrollUserInCourse } from '../ghlCourseApi';

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
      console.error('Course ID not found in session metadata');
      return false;
    }
    
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
export const processPaymentIntentSucceeded = async (
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
