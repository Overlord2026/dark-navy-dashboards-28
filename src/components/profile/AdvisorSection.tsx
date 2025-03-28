
import { useState } from "react";
import { ChevronRight, UserRoundIcon, MailIcon, LinkedinIcon, Calendar, ExternalLinkIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
            className="flex items-center w-full p-2 hover:bg-[#2A2A40] rounded-md transition-colors cursor-pointer"
          >
            <Avatar className="h-[30px] w-[30px] mr-3">
              <AvatarFallback className="bg-[#2A2A40] text-white">CB</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-[14px] text-gray-200 font-medium">Advisor:</span>
              <span className="text-[14px] text-gray-300">Charles Bryant</span>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          align="start" 
          alignOffset={-40} 
          side="top" 
          className="w-64 bg-[#1E1E30] border-gray-700 text-white shadow-md shadow-black/20"
        >
          <div className="flex flex-col space-y-3 p-1">
            <div className="flex items-center space-x-3">
              <Avatar className="h-[60px] w-[60px]">
                <AvatarFallback className="bg-[#2A2A40] text-white text-xl">CB</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Charles Bryant</p>
                <p className="text-sm text-gray-400">Senior Financial Advisor</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-300">New York, NY</div>
            
            <a href="mailto:charles.bryant@example.com" className="text-sm text-blue-400 hover:underline flex items-center">
              <MailIcon className="h-3.5 w-3.5 mr-1.5" />
              charles.bryant@example.com
            </a>
            
            <div className="flex flex-col space-y-2 pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start hover:bg-[#2A2A40] text-white"
                onClick={() => onViewProfile("bio")}
              >
                <UserRoundIcon className="h-3.5 w-3.5 mr-1.5" />
                View profile
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start hover:bg-[#2A2A40] text-white"
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
