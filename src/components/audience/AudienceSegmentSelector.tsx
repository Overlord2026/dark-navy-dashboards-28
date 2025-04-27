
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAudience } from "@/context/AudienceContext";
import { Badge } from "@/components/ui/badge";
import { Check, Diamond, GraduationCap, Landmark } from "lucide-react";
import { AudienceSegment } from "@/types/audience";

export function AudienceSegmentSelector() {
  const { currentSegment, setCurrentSegment, audienceProfiles } = useAudience();
  
  const segmentDetails = [
    { 
      id: 'aspiring',
      name: 'Aspiring Wealthy', 
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      description: 'Building wealth with strategic planning and investment growth.',
      badge: 'Growth-Focused'
    },
    { 
      id: 'retiree',
      name: 'Retirees', 
      icon: <Landmark className="h-8 w-8 text-amber-500" />,
      description: 'Preserving wealth and generating income for retirement years.',
      badge: 'Income & Preservation'
    },
    { 
      id: 'uhnw',
      name: 'Ultra-High Net Worth', 
      icon: <Diamond className="h-8 w-8 text-indigo-500" />,
      description: 'Sophisticated wealth management and legacy planning.',
      badge: 'Complex Planning'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Your Wealth Journey</h2>
        <p className="text-muted-foreground">
          Choose the profile that best describes your current financial situation and goals.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {segmentDetails.map((segment) => {
          const isActive = currentSegment === segment.id;
          
          return (
            <Card 
              key={segment.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                isActive ? 'border-2 border-primary bg-primary/5' : ''
              }`}
              onClick={() => setCurrentSegment(segment.id as AudienceSegment)}
            >
              <CardHeader className="pb-2 relative">
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 rounded-full mb-2 ${
                    isActive ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    {segment.icon}
                  </div>
                  <CardTitle>{segment.name}</CardTitle>
                  <Badge variant="outline" className="mt-2">{segment.badge}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>{segment.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={isActive ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => setCurrentSegment(segment.id as AudienceSegment)}
                >
                  {isActive ? 'Selected' : 'Choose This Profile'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
