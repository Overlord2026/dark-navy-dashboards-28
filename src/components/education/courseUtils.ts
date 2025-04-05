
import { toast } from "sonner";

// Function to handle course enrollment and access
export const handleCourseAccess = (
  courseId: string | number,
  title: string,
  isPaid: boolean,
  ghlUrl?: string,
  setIsProcessing?: (isProcessing: boolean) => void
) => {
  if (isPaid) {
    // For paid courses, initiate Stripe checkout
    initiateStripeCheckout(courseId, title, ghlUrl, setIsProcessing);
  } else if (ghlUrl) {
    // For free courses, directly open the GHL URL
    toast.success(`Accessing ${title}...`);
    setTimeout(() => {
      window.open(ghlUrl, "_blank", "noopener,noreferrer");
    }, 500);
  }
};

// Function to handle Stripe checkout process
export const initiateStripeCheckout = (
  courseId: string | number,
  title: string,
  ghlUrl?: string,
  setIsProcessing?: (isProcessing: boolean) => void
) => {
  if (setIsProcessing) {
    setIsProcessing(true);
  }
  
  // Simulate Stripe checkout process with a delay
  toast.info("Preparing checkout page...");
  
  // This simulates a network request to create a Stripe Checkout session
  setTimeout(() => {
    toast.loading("Processing payment...", { duration: 2000 });
    
    // In a real implementation, we would redirect to Stripe Checkout here
    // In this simulation, we'll use a setTimeout to simulate the payment process
    setTimeout(() => {
      // Simulate successful payment
      toast.success("Payment processed successfully!");
      
      // After successful payment, simulate granting access to the course
      setTimeout(() => {
        if (setIsProcessing) {
          setIsProcessing(false);
        }
        
        // Grant access to the course by opening the GHL URL
        if (ghlUrl) {
          toast("You now have access to this course!", {
            description: "Opening course in a new tab...",
            action: {
              label: "Open Course",
              onClick: () => window.open(ghlUrl, "_blank", "noopener,noreferrer")
            },
          });
          
          setTimeout(() => {
            window.open(ghlUrl, "_blank", "noopener,noreferrer");
          }, 500);
        }
      }, 1000);
    }, 2000);
  }, 1500);
};
