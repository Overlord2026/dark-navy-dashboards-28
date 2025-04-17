
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface ProcessSectionProps {
  onScheduleClick: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onScheduleClick }) => {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h3 className="text-xl font-semibold">Our Estate Planning Process</h3>
        <div className="mt-4 space-y-6">
          {[
            {
              step: 1,
              title: "Initial Consultation",
              description: "Meet with our estate planning expert to discuss your goals, concerns, and family situation."
            },
            {
              step: 2,
              title: "Plan Design",
              description: "Our team creates a tailored estate plan addressing your specific needs and objectives."
            },
            {
              step: 3,
              title: "Document Preparation",
              description: "Legal documents are drafted, including wills, trusts, powers of attorney, and healthcare directives."
            },
            {
              step: 4,
              title: "Review & Execution",
              description: "Review all documents, make necessary adjustments, and formally execute the estate plan."
            },
            {
              step: 5,
              title: "Implementation & Funding",
              description: "Transfer assets to trusts and update beneficiary designations as needed."
            },
            {
              step: 6,
              title: "Ongoing Support",
              description: "Regular reviews to keep your plan current with life changes and law updates."
            }
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                <span className="font-bold text-primary">{item.step}</span>
              </div>
              <div>
                <h4 className="font-semibold text-lg">{item.title}</h4>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button onClick={onScheduleClick}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};
