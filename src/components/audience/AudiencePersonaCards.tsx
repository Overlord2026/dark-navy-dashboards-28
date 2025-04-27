
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
      segment: "aspiring" as AudienceSegment
    },
    {
      id: "retiree",
      title: "Pre-Retiree",
      description: "Preparing for and transitioning to retirement",
      segment: "retiree" as AudienceSegment
    },
    {
      id: "uhnw",
      title: "UHNW",
      description: "Ultra high net worth wealth management",
      segment: "uhnw" as AudienceSegment
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-4 bg-background">
      {personas.map((persona) => (
        <Card
          key={persona.id}
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            currentSegment === persona.segment ? "border-primary" : ""
          }`}
          onClick={() => setCurrentSegment(persona.segment)}
        >
          <h3 className="font-semibold text-lg mb-2">{persona.title}</h3>
          <p className="text-sm text-muted-foreground">{persona.description}</p>
        </Card>
      ))}
    </div>
  );
}
