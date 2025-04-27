
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { FileText } from "lucide-react";

export default function GuidesWhitepapers() {
  const guides = [
    { title: "Tax Optimization Guide", description: "Tips and strategies for optimizing your tax situation.", category: "Tax Planning" },
    { title: "Estate Planning Essentials", description: "Key considerations for effective estate planning.", category: "Estate Planning" },
    { title: "Investment Strategies Whitepaper", description: "Analysis of different investment approaches for wealth building.", category: "Investments" },
    { title: "Retirement Income Planning", description: "How to generate sustainable income in retirement.", category: "Retirement" },
    { title: "Risk Management Guide", description: "Understanding and mitigating financial risks.", category: "Financial Planning" },
    { title: "College Funding Strategies", description: "Options for funding education expenses.", category: "Education Planning" },
  ];

  return (
    <ThreeColumnLayout title="Guides & Whitepapers" activeMainItem="education">
      <div className="space-y-6 p-4">
        <h1 className="text-2xl font-bold">Guides & Whitepapers</h1>
        <p className="text-muted-foreground">
          Access our library of educational guides and in-depth whitepapers.
        </p>
        <div className="grid gap-6 mt-8">
          {guides.map((guide, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card"
            >
              <div className="bg-primary/10 p-2 rounded-md">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{guide.title}</h3>
                <p className="text-sm text-muted-foreground">{guide.description}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                    {guide.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
