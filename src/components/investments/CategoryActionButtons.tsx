
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { InterestedButton } from "./InterestedButton";

interface CategoryActionButtonsProps {
  categoryName: string;
  onInterested: () => void;
  onScheduleMeeting: () => void;
}

export const CategoryActionButtons: React.FC<CategoryActionButtonsProps> = ({
  categoryName,
  onInterested,
  onScheduleMeeting
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <InterestedButton 
        assetName={categoryName}
        onInterested={onInterested}
        variant="default"
        size="default"
        className="flex-1"
      />
      
      <Button 
        variant="outline" 
        size="default"
        className="flex items-center justify-center gap-2 flex-1"
        onClick={onScheduleMeeting}
      >
        <CalendarClock className="h-4 w-4" />
        Schedule a Meeting
      </Button>
    </div>
  );
};
