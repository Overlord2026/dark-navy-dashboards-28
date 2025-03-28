
import { useState } from "react";
import { ChevronRight, MailIcon, LinkedinIcon, Calendar, ExternalLinkIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface AdvisorInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  office: string;
  bio: string;
}

interface AdvisorSectionProps {
  advisorInfo: AdvisorInfo;
  onViewProfile: (tabId: string) => void;
  onBookSession: () => void;
}

export const AdvisorSection = ({ advisorInfo, onViewProfile, onBookSession }: AdvisorSectionProps) => {
  return (
    <div className="fixed bottom-0 left-0 z-40 w-[220px] p-4">
      <Popover>
        <PopoverTrigger asChild>
          <div 
            className="flex items-center justify-between w-full p-2 hover:bg-[#1c2e4a] rounded-md transition-colors cursor-pointer"
          >
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white font-medium mr-3">
                DH
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Advisor</span>
                <span className="font-medium text-sm">{advisorInfo.name}</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4" />
          </div>
        </PopoverTrigger>
        <PopoverContent align="start" alignOffset={-40} side="top" className="w-64 bg-[#0c1224] border-gray-700 text-white">
          <div className="flex flex-col space-y-3 p-1">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-medium">
                DH
              </div>
              <div>
                <p className="font-medium text-sm">{advisorInfo.name}</p>
                <p className="text-xs text-gray-400">{advisorInfo.title}</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-300">{advisorInfo.location}</div>
            
            <a href={`mailto:${advisorInfo.email}`} className="text-sm text-blue-400 hover:underline flex items-center">
              <MailIcon className="h-3.5 w-3.5 mr-1.5" />
              {advisorInfo.email}
            </a>
            
            <div className="flex flex-col space-y-2 pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start hover:bg-[#1c2e4a] text-white"
                onClick={() => onViewProfile("bio")}
              >
                <MailIcon className="h-3.5 w-3.5 mr-1.5" />
                View profile
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start hover:bg-[#1c2e4a] text-white"
                onClick={onBookSession}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Book a session
                <ExternalLinkIcon className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
