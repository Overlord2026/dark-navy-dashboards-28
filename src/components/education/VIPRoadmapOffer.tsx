import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  Star,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface VIPRoadmapOfferProps {
  userName?: string;
  completedCourses: number;
  trackType: "Foundation" | "Advanced" | "Mixed";
  onScheduleCall: () => void;
}

export function VIPRoadmapOffer({ 
  userName = "Valued Client", 
  completedCourses, 
  trackType, 
  onScheduleCall 
}: VIPRoadmapOfferProps) {
  const handleScheduleCall = () => {
    toast.success("Redirecting to calendar booking...");
    onScheduleCall();
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-800/30">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-2">
          <Crown className="h-8 w-8 text-amber-600 mr-2" />
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            VIP Invitation
          </Badge>
        </div>
        <CardTitle className="text-2xl text-amber-900 dark:text-amber-100">
          Exclusive Roadmap Review
        </CardTitle>
        <p className="text-amber-700 dark:text-amber-300">
          Congratulations on completing your {trackType.toLowerCase()} track education!
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-white/60 dark:bg-black/20 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Educational Achievement</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold">{completedCourses} Courses Completed</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4" />
            <span>You've demonstrated commitment to financial excellence</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100">
            You've Earned a Complimentary VIP Session:
          </h4>
          
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Personalized roadmap review with a CFP® professional</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Custom recommendations based on your learning progress</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Priority access to advanced strategies and tools</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>No sales pressure - pure educational value</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-100/50 dark:bg-amber-900/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Limited Time Offer
            </span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            This exclusive VIP review is available for 30 days after course completion. 
            Schedule now to secure your spot.
          </p>
        </div>

        <Button 
          onClick={handleScheduleCall}
          size="lg"
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
        >
          <Calendar className="h-5 w-5 mr-2" />
          Schedule My VIP Roadmap Review
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            📞 45-minute session • CFP® Professional • Zero sales agenda
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            "Education first, relationship second" - Our fiduciary promise
          </p>
        </div>
      </CardContent>
    </Card>
  );
}