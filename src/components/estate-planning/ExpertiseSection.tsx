
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface ExpertiseSectionProps {
  onScheduleClick: () => void;
  onInterestClick: () => void;
}

export const ExpertiseSection: React.FC<ExpertiseSectionProps> = ({
  onScheduleClick,
  onInterestClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div>
        <h2 className="text-2xl font-semibold">Our Estate Planning Expertise</h2>
        <p className="text-muted-foreground mt-1">
          Meet with our estate planning guru to create a comprehensive plan tailored to your needs.
        </p>
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <Button className="w-full sm:w-auto" onClick={onScheduleClick}>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={onInterestClick}
        >
          I'm Interested
        </Button>
      </div>
    </div>
  );
};
