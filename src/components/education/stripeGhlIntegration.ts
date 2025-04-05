
import { toast } from "sonner";
import { logger } from "@/services/logging/loggingService";

/**
 * Utility to manage Stripe payment integration with GoHighLevel (GHL)
 * This handles both the payment flow and subsequent GHL access
 */

interface StripeGhlPaymentOptions {
  courseId: string | number;
  courseName: string;
  priceInCents: number;
  ghlUrl?: string;
  userId?: string;
  userEmail?: string;
  metadata?: Record<string, string>;
}

interface StripeSessionResponse {
  url: string;
  sessionId: string;
}

/**
 * Initialize a Stripe checkout session and handle redirection to GHL
 * For demo purposes, this simulates the Stripe checkout flow
 * In production, this would make an actual API call to your Stripe backend
 */
export const initiateStripeGhlPayment = async (
  options: StripeGhlPaymentOptions,
  onProcessingChange?: (isProcessing: boolean) => void
): Promise<void> => {
  const { courseId, courseName, ghlUrl } = options;
  
  if (onProcessingChange) {
    onProcessingChange(true);
  }
  
  logger.info('Initiating Stripe payment for GHL course', { 
    courseId,
    courseName
  }, 'StripeGHL');
  
  try {
    toast.info("Preparing secure checkout page...");
    
    // In a real implementation, this would be an API call to create a Stripe session
    // For example: const response = await fetch('/api/create-checkout', { method: 'POST', body: JSON.stringify(options) });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful Stripe session creation
    const mockSession: StripeSessionResponse = {
      url: "#stripe-checkout-simulation", // In production this would be a real Stripe URL
      sessionId: `cs_test_${Date.now()}`
    };
    
    // Store the session ID and course info in localStorage for the success page to use
    localStorage.setItem('stripe_ghl_pending_course', JSON.stringify({
      courseId,
      courseName,
      ghlUrl,
      sessionId: mockSession.sessionId,
      timestamp: Date.now()
    }));
    
    toast.loading("Processing your secure payment...", { duration: 2000 });
    
    // In a real implementation, we would redirect to the Stripe checkout URL
    // window.location.href = mockSession.url;
    
    // For the simulation, we'll wait and then simulate a successful payment
    setTimeout(() => {
      toast.success("Payment processed successfully!");
      
      setTimeout(() => {
        // After successful payment simulation, direct to GHL
        handleGhlRedirect(courseId, courseName, ghlUrl);
        if (onProcessingChange) {
          onProcessingChange(false);
        }
      }, 1000);
    }, 2000);
    
  } catch (error) {
    logger.error('Error initiating Stripe payment:', error, 'StripeGHL');
    toast.error("Payment processing failed. Please try again.");
    
    if (onProcessingChange) {
      onProcessingChange(false);
    }
  }
};

/**
 * Handle redirection to GHL after successful payment
 */
export const handleGhlRedirect = (
  courseId: string | number, 
  courseName: string,
  ghlUrl?: string
): void => {
  if (!ghlUrl) {
    toast.error("Course access URL not available. Please contact support.");
    return;
  }
  
  logger.info('Redirecting to GHL course after payment', { 
    courseId, 
    courseName 
  }, 'StripeGHL');
  
  // Record successful purchase in localStorage
  const completedPurchases = JSON.parse(localStorage.getItem('completed_course_purchases') || '[]');
  completedPurchases.push({
    courseId,
    courseName,
    purchaseDate: new Date().toISOString(),
    ghlUrl
  });
  localStorage.setItem('completed_course_purchases', JSON.stringify(completedPurchases));
  
  // Show toast with action button
  toast("You now have access to this course!", {
    description: "Opening course in a new tab...",
    action: {
      label: "Open Course",
      onClick: () => window.open(ghlUrl, "_blank", "noopener,noreferrer")
    },
  });
  
  // Auto-redirect after a short delay
  setTimeout(() => {
    window.open(ghlUrl, "_blank", "noopener,noreferrer");
  }, 500);
};

/**
 * Check if a user has already purchased a course
 * This can be used to show different UI for courses already purchased
 */
export const hasUserPurchasedCourse = (courseId: string | number): boolean => {
  try {
    const completedPurchases = JSON.parse(localStorage.getItem('completed_course_purchases') || '[]');
    return completedPurchases.some((purchase: any) => purchase.courseId.toString() === courseId.toString());
  } catch (error) {
    return false;
  }
};

/**
 * Get GHL access URL for a previously purchased course
 */
export const getGhlAccessUrl = (courseId: string | number): string | null => {
  try {
    const completedPurchases = JSON.parse(localStorage.getItem('completed_course_purchases') || '[]');
    const purchase = completedPurchases.find(
      (p: any) => p.courseId.toString() === courseId.toString()
    );
    return purchase ? purchase.ghlUrl : null;
  } catch (error) {
    return null;
  }
};
