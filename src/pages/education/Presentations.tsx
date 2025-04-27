
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Presentation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Presentations() {
  const presentations = [
    { title: "Market Outlook 2025", description: "Analysis of current market trends and future projections.", category: "Investments", duration: "45 min" },
    { title: "Estate Planning Fundamentals", description: "Key components of an effective estate plan.", category: "Estate Planning", duration: "60 min" },
    { title: "Tax Strategies for High-Income Earners", description: "Approaches to minimize tax burdens for high earners.", category: "Tax Planning", duration: "50 min" },
    { title: "Sustainable Investing", description: "Incorporating ESG factors into your investment strategy.", category: "Investments", duration: "30 min" },
    { title: "Retirement Income Planning", description: "Strategies for creating reliable income streams in retirement.", category: "Retirement", duration: "55 min" },
  ];

  return (
    <ThreeColumnLayout title="Presentations" activeMainItem="education">
      <div className="space-y-6 p-4">
        <h1 className="text-2xl font-bold">Presentations</h1>
        <p className="text-muted-foreground">
          Educational presentations from our financial experts.
        </p>
        <div className="grid gap-6 mt-8">
          {presentations.map((presentation, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-6 border border-border rounded-lg bg-card"
            >
              <div className="bg-primary/10 p-2 rounded-md">
                <Presentation className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{presentation.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{presentation.description}</p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <span>Duration: {presentation.duration}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                    {presentation.category}
                  </span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>View Presentation</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
