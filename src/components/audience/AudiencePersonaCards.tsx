
import React from "react";
import { Card } from "@/components/ui/card";
import { AudienceSegment } from "@/types/audience";
import { useAudience } from "@/context/AudienceContext";

export function AudiencePersonaCards() {
  const { setCurrentSegment, currentSegment } = useAudience();
  
  const personas = [
    {
      id: "aspiring",
      title: "Aspiring Wealthy",
      description: "Building and growing wealth for a prosperous future",
      segment: "aspiring" as AudienceSegment,
      tag: "Growth-Focused"
    },
    {
      id: "retiree",
      title: "Pre-Retirees & Retirees",
      description: "Securing and optimizing retirement wealth",
      segment: "retiree" as AudienceSegment,
      tag: "Stability-Focused"
    },
    {
      id: "uhnw",
      title: "Ultra High Net Worth",
      description: "Sophisticated wealth management & legacy planning",
      segment: "uhnw" as AudienceSegment,
      tag: "Legacy-Focused"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-6 bg-background">
      {personas.map((persona) => (
        <Card
          key={persona.id}
          className={`p-8 cursor-pointer transition-all hover:shadow-xl group ${
            currentSegment === persona.segment 
              ? "border-2 border-primary bg-primary/5" 
              : "hover:border-[#D4AF37] hover:border-2"
          }`}
          onClick={() => setCurrentSegment(persona.segment)}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-2xl">{persona.title}</h3>
              <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {persona.tag}
              </span>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
              {persona.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
