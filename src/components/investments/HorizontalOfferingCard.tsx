
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarClock } from "lucide-react";
import { InterestedButton } from "./InterestedButton";
import { ScheduleMeetingDialog } from "./ScheduleMeetingDialog";

interface HorizontalOfferingCardProps {
  title: string;
  description: string;
  tags: string[];
  minimumInvestment: string;
  firm: string;
  featured?: boolean;
}

export const HorizontalOfferingCard: React.FC<HorizontalOfferingCardProps> = ({
  title,
  description,
  tags,
  minimumInvestment,
  firm,
  featured = false
}) => {
  return (
    <div className="bg-slate-900 text-white rounded-lg p-6 border border-slate-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-semibold">{title}</h3>
            {featured && (
              <Badge className="bg-yellow-500 text-black font-medium px-3 py-1">
                Featured
              </Badge>
            )}
          </div>
          
          <p className="text-slate-300 mb-4 leading-relaxed">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-slate-800 text-slate-300 border-slate-600"
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-8 mb-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Minimum Investment</p>
              <p className="text-white font-semibold text-lg">{minimumInvestment}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Firm</p>
              <p className="text-white font-semibold text-lg">{firm}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 ml-6">
          <InterestedButton assetName={title} />
          <ScheduleMeetingDialog 
            assetName={title}
            consultationType="investment"
          />
        </div>
      </div>
    </div>
  );
};
