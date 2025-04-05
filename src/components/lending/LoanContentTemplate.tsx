
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";
import { LucideIcon } from "lucide-react";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string;
}

interface LoanContentTemplateProps {
  title: string;
  description: string;
  howItWorksFeatures: FeatureItem[];
  useCaseFeatures: FeatureItem[];
  offeringName: string;
}

export const LoanContentTemplate: React.FC<LoanContentTemplateProps> = ({
  title,
  description,
  howItWorksFeatures,
  useCaseFeatures,
  offeringName
}) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">How It Works</h3>
              <p className="text-muted-foreground mb-4">
                {howItWorksFeatures[0].description}
              </p>
              <div className="flex flex-col gap-4">
                {howItWorksFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`${feature.colorClass} p-2 rounded-full`}>
                      <feature.icon className={`h-5 w-5 ${feature.colorClass.replace('bg-', 'text-').replace('-50', '-600')}`} />
                    </div>
                    <div>
                      <p className="font-medium">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">Use Cases</h3>
              <p className="text-muted-foreground mb-4">
                {useCaseFeatures[0].description}
              </p>
              <div className="flex flex-col gap-4">
                {useCaseFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`${feature.colorClass} p-2 rounded-full`}>
                      <feature.icon className={`h-5 w-5 ${feature.colorClass.replace('bg-', 'text-').replace('-50', '-600')}`} />
                    </div>
                    <div>
                      <p className="font-medium">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-xl font-medium mb-4">Ready to Get Started?</h3>
        <p className="text-muted-foreground mb-6">
          Speak with your advisor to explore {offeringName.toLowerCase()} options tailored to your 
          financial situation and goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ScheduleMeetingButton offeringName={offeringName} />
          <Button variant="outline">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
};
