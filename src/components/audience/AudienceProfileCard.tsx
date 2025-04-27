
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAudience } from "@/context/AudienceContext";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight, Diamond, GraduationCap, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { AudienceSegment } from "@/types/audience";

export function AudienceProfileCard() {
  const { currentSegment, currentProfile } = useAudience();
  
  const getSegmentIcon = () => {
    switch(currentSegment) {
      case 'aspiring':
        return <GraduationCap className="h-6 w-6 text-primary" />;
      case 'retiree':
        return <Landmark className="h-6 w-6 text-amber-500" />;
      case 'uhnw':
        return <Diamond className="h-6 w-6 text-indigo-500" />;
    }
  };
  
  const getSegmentBadge = () => {
    switch(currentSegment) {
      case 'aspiring':
        return <Badge className="bg-primary">Growth-Focused</Badge>;
      case 'retiree':
        return <Badge className="bg-amber-500">Income & Preservation</Badge>;
      case 'uhnw':
        return <Badge className="bg-indigo-500">Complex Planning</Badge>;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className={`pb-2 ${
        currentSegment === 'aspiring' ? 'bg-primary/10' : 
        currentSegment === 'retiree' ? 'bg-amber-500/10' : 
        'bg-indigo-500/10'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          {getSegmentIcon()}
          <CardTitle>{currentProfile.name}</CardTitle>
          {getSegmentBadge()}
        </div>
        <CardDescription>{currentProfile.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Recommended Services</h4>
            <div className="flex flex-wrap gap-2">
              {currentProfile.recommendedServices.slice(0, 3).map((service, idx) => (
                <Badge variant="outline" key={idx} className="bg-background">
                  {service}
                </Badge>
              ))}
              {currentProfile.recommendedServices.length > 3 && (
                <Badge variant="outline" className="bg-background">
                  +{currentProfile.recommendedServices.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Common Goals</h4>
            <ul className="text-sm space-y-1">
              {currentProfile.commonGoals.slice(0, 3).map((goal, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{goal}</span>
                </li>
              ))}
              {currentProfile.commonGoals.length > 3 && (
                <li className="text-muted-foreground text-xs">
                  +{currentProfile.commonGoals.length - 3} more goals
                </li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Link to="/settings/profile">
          <Button variant="outline" size="sm">Update Profile</Button>
        </Link>
        <Link to="/audience-preferences">
          <Button size="sm" className="flex items-center gap-1">
            View Details
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
