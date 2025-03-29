
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  title,
  description,
  isPaid,
  level = "Beginner",
  duration = "2-3 hours",
  comingSoon = false,
  ghlUrl,
  onClick,
}: CourseCardProps) {
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
      window.open(ghlUrl, "_blank", "noopener,noreferrer");
    } else if (onClick) {
      // Fallback to regular onClick if no URL provided
      onClick();
    }
  };

  const initiateStripeCheckout = () => {
    // This would connect to your Stripe checkout in a real implementation
    // For now, we'll simulate with a toast message
    toast.info("Redirecting to payment page...");
    
    // Simulate successful payment after 2 seconds
    setTimeout(() => {
      toast.success("Payment successful! You now have access to this course.");
      
      // After successful payment, redirect to the course
      if (ghlUrl) {
        window.open(ghlUrl, "_blank", "noopener,noreferrer");
      }
    }, 2000);
    
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
          className="w-full transition-colors" 
          disabled={comingSoon}
          onClick={handleButtonClick}
        >
          {comingSoon ? "Coming Soon" : isPaid ? "Enroll Now" : "Access Course"}
        </Button>
      </CardFooter>
    </Card>
  );
}
