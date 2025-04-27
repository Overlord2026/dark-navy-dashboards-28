
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { FileCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlanningExamples() {
  const examples = [
    { title: "Retirement Income Strategy", description: "Case study showing how a 60-year-old couple plans for retirement income.", category: "Retirement" },
    { title: "Education Funding Plan", description: "How a family with three children created a college savings strategy.", category: "Education" },
    { title: "Tax-Efficient Withdrawal Strategy", description: "Optimizing withdrawals from multiple account types to minimize taxes.", category: "Tax Planning" },
    { title: "Business Succession Planning", description: "A business owner's approach to transitioning ownership to family members.", category: "Estate Planning" },
    { title: "Risk Management Case Study", description: "How proper insurance planning protected a family during unexpected events.", category: "Risk Management" },
  ];

  return (
    <ThreeColumnLayout title="Planning Examples" activeMainItem="education">
      <div className="space-y-6 p-4">
        <h1 className="text-2xl font-bold">Planning Examples</h1>
        <p className="text-muted-foreground">
          Real-world case studies demonstrating effective financial planning strategies.
        </p>
        <div className="grid gap-6 mt-8">
          {examples.map((example, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-6 border border-border rounded-lg bg-card"
            >
              <div className="bg-primary/10 p-2 rounded-md">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{example.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{example.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                    {example.category}
                  </span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
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
