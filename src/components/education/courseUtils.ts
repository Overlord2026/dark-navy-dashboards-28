
import { toast } from "sonner";
import { initiateStripeGhlPayment, hasUserPurchasedCourse, getGhlAccessUrl } from "./stripeGhlIntegration";

// Function to handle course enrollment and access
export const handleCourseAccess = (
  courseId: string | number,
  title: string,
  isPaid: boolean,
  ghlUrl?: string,
  setIsProcessing?: (isProcessing: boolean) => void
) => {
  // Check if course was already purchased
  if (hasUserPurchasedCourse(courseId)) {
    toast.success(`Accessing ${title}...`);
    const accessUrl = getGhlAccessUrl(courseId) || ghlUrl;
    
    if (accessUrl) {
      setTimeout(() => {
        window.open(accessUrl, "_blank", "noopener,noreferrer");
      }, 500);
    } else {
      toast.error("Course access link not found. Please contact support.");
    }
    return;
  }

  if (isPaid) {
    // For paid courses, initiate Stripe checkout with GHL integration
    initiateStripeGhlPayment({
      courseId,
      courseName: title,
      priceInCents: 7900, // Default price can be customized per course
      ghlUrl,
      metadata: {
        courseId: courseId.toString(),
        courseType: "educational_content"
      }
    }, setIsProcessing);
  } else if (ghlUrl) {
    // For free courses, directly open the GHL URL
    toast.success(`Accessing ${title}...`);
    setTimeout(() => {
      window.open(ghlUrl, "_blank", "noopener,noreferrer");
    }, 500);
  }
};

// This function is kept for backward compatibility but now uses the new integration
export const initiateStripeCheckout = (
  courseId: string | number,
  title: string,
  ghlUrl?: string,
  setIsProcessing?: (isProcessing: boolean) => void
) => {
  initiateStripeGhlPayment({
    courseId,
    courseName: title,
    priceInCents: 7900,
    ghlUrl
  }, setIsProcessing);
};
