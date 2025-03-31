
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
    
    if (onClick) {
      onClick();
      setIsProcessing(true);
      
      // Reset the processing state after 1 second for UX feedback
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    }
  };

  return (
    <Card className={`h-full flex flex-col transition-all duration-200 hover:shadow-md ${comingSoon ? "opacity-70" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-left">{title}</CardTitle>
          {!isPaid ? (
            <Badge variant="success" className="text-white">Free</Badge>
          ) : (
            <Badge variant="info" className="text-white">Paid</Badge>
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
