
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";

export interface CourseCardProps {
  id: string | number;
  title: string;
  description: string;
  isPaid: boolean;
  level?: string;
  duration?: string;
  comingSoon?: boolean;
  ghlUrl?: string;
  onClick?: () => void;
}

export function CourseCard({
  id,
  title,
  description,
  isPaid,
  level = "Beginner",
  duration = "2-3 hours",
  comingSoon = false,
  ghlUrl,
  onClick,
}: CourseCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleButtonClick = () => {
    if (comingSoon) {
      toast.info(`${title} is coming soon. Stay tuned!`);
      return;
    }
    
    if (isPaid) {
      // For paid courses, initiate Stripe checkout
      initiateStripeCheckout();
    } else if (ghlUrl) {
      // For free courses, directly open the GHL URL
      toast.success(`Accessing ${title}...`);
      setTimeout(() => {
        window.open(ghlUrl, "_blank", "noopener,noreferrer");
      }, 500);
    } else if (onClick) {
      // Fallback to regular onClick if no URL provided
      onClick();
    }
  };

  const initiateStripeCheckout = () => {
    setIsProcessing(true);
    
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
          setIsProcessing(false);
          
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
    
    // In a real implementation, you would:
    // 1. Call your backend to create a Stripe Checkout session
    // 2. Redirect the user to the Stripe Checkout page
    // 3. Handle the webhook from Stripe to confirm payment
    // 4. Grant access to the course in your database
    // 5. Redirect the user to the course
  };

  return (
    <Card className={`h-full flex flex-col transition-all duration-200 hover:shadow-md ${comingSoon ? "opacity-70" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-left">{title}</CardTitle>
          {!isPaid ? (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">Free</Badge>
          ) : (
            <Badge variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white">Paid</Badge>
          )}
        </div>
        <CardDescription className="mt-2 text-left">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Trophy className="mr-1 h-4 w-4" />
            <span>{level}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={isPaid ? "default" : "outline"} 
          className="w-full transition-colors flex items-center justify-center gap-2" 
          disabled={comingSoon || isProcessing}
          onClick={handleButtonClick}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : comingSoon ? (
            "Coming Soon"
          ) : isPaid ? (
            "Enroll Now"
          ) : (
            <>
              Access Course
              <ExternalLink className="h-3 w-3 opacity-70" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
