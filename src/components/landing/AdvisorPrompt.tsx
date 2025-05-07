
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarClock } from 'lucide-react';
import { toast } from 'sonner';

interface AdvisorPromptProps {
  isMobile: boolean;
}

export const AdvisorPrompt: React.FC<AdvisorPromptProps> = ({ isMobile }) => {
  const handleScheduleDemo = () => {
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    toast.success("Opening scheduling page", {
      description: "Schedule a meeting to discuss our services with an advisor.",
    });
  };

  return (
    <Button 
      onClick={handleScheduleDemo}
      className={`bg-white hover:bg-gray-200 text-[#0A1F44] flex items-center gap-2`}
    >
      <CalendarClock className="h-4 w-4" />
      Schedule a Demo
    </Button>
  );
};
