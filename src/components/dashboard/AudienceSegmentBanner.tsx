
import React from "react";
import { useAudience } from "@/context/AudienceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Diamond, GraduationCap, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { AudienceProfileCard } from "@/components/audience/AudienceProfileCard";

export function AudienceSegmentBanner() {
  const { currentSegment, isSegmentDetected } = useAudience();
  
  if (!isSegmentDetected) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Personalize Your Wealth Journey</h3>
              <p className="text-muted-foreground">
                Tell us more about your financial situation to get tailored recommendations and insights.
              </p>
            </div>
            <Link to="/audience-preferences">
              <Button className="whitespace-nowrap">
                Complete Profile
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return <AudienceProfileCard />;
}
