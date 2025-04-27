
import React from "react";
import { Card } from "@/components/ui/card";
import { AudienceSegment } from "@/types/audience";
import { useAudience } from "@/context/AudienceContext";

export function AudiencePersonaCards() {
  const { setCurrentSegment, currentSegment } = useAudience();
  
  const personas = [
    {
      id: "aspiring",
      title: "Aspiring",
      description: "Building wealth and planning for the future",
      segment: "aspiring" as AudienceSegment,
      tag: "Growth-Focused"
    },
    {
      id: "retiree",
      title: "Pre-Retiree",
      description: "Preparing for and transitioning to retirement",
      segment: "retiree" as AudienceSegment,
      tag: "Stability-Focused"
    },
    {
      id: "uhnw",
      title: "UHNW",
      description: "Ultra high net worth wealth management",
      segment: "uhnw" as AudienceSegment,
      tag: "Legacy-Focused"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-background">
      {personas.map((persona) => (
        <Card
          key={persona.id}
          className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
            currentSegment === persona.segment 
              ? "border-2 border-primary bg-primary/5" 
              : "hover:border-primary/50"
          }`}
          onClick={() => setCurrentSegment(persona.segment)}
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-xl">{persona.title}</h3>
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {persona.tag}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {persona.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
