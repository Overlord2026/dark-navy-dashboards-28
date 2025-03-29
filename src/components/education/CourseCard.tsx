
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CourseCardProps {
  id: string | number;
  title: string;
  description: string;
  isPaid: boolean;
  level?: string;
  duration?: string;
  comingSoon?: boolean;
  ghlUrl?: string; // Add URL for the GHL course
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
    if (ghlUrl && !comingSoon) {
      // Open the GHL URL in a new tab if it exists
      window.open(ghlUrl, "_blank", "noopener,noreferrer");
    } else if (onClick) {
      // Fall back to regular onClick if no URL provided
      onClick();
    }
  };

  return (
    <Card className={`h-full flex flex-col ${comingSoon ? "opacity-70" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          {!isPaid ? (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">Free</Badge>
          ) : (
            <Badge variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white">Paid</Badge>
          )}
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
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
          variant="default" 
          className="w-full" 
          disabled={comingSoon}
          onClick={handleButtonClick}
        >
          {comingSoon ? "Coming Soon" : isPaid ? "Enroll Now" : "Access Course"}
        </Button>
      </CardFooter>
    </Card>
  );
}
