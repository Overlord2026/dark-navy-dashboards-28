
import React from "react";
import { ChevronRight, UserRoundIcon, MailIcon, LinkedinIcon, Calendar, ExternalLinkIcon, MapPinIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/context/ThemeContext";
import { Link } from "react-router-dom";
import { useAdvisor } from "@/context/AdvisorContext";

interface AdvisorSectionProps {
  onViewProfile: (tabId: string) => void;
  onBookSession: () => void;
  collapsed?: boolean;
}

export const AdvisorSection = ({ onViewProfile, onBookSession, collapsed = false }: AdvisorSectionProps) => {
  const { theme } = useTheme();
  const { advisorInfo } = useAdvisor();
  const isLightTheme = theme === "light";
  
  return (
    <div className="px-2 py-2">
      <Popover>
        <PopoverTrigger asChild>
          <div 
            className={`flex items-center w-full py-4 px-4 rounded-lg transition-colors cursor-pointer min-h-[90px] ${isLightTheme ? 'bg-white text-[#222222] hover:bg-[#F5F5F5] border border-gray-200' : 'bg-[#2A2A40] text-white hover:bg-[#333350] border border-white/10'}`}
          >
            {!collapsed && (
              <div className="flex flex-col overflow-hidden flex-1 space-y-1.5 min-w-0">
                <span className={`text-[13px] ${isLightTheme ? 'text-[#666666]' : 'text-gray-400'} font-medium whitespace-nowrap`}>Advisor/CFO</span>
                <span className={`text-[16px] ${isLightTheme ? 'text-[#222222]' : 'text-white'} whitespace-nowrap truncate font-semibold`}>{advisorInfo.name}</span>
              </div>
            )}
            {!collapsed && (
              <ChevronRight className={`h-4 w-4 ${isLightTheme ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0 ml-2`} />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent 
          align="start" 
          side={collapsed ? "right" : "bottom"} 
          className={`w-[380px] p-0 overflow-hidden ${isLightTheme ? 'bg-[#F9F7E8] border-[#DCD8C0] text-[#222222]' : 'bg-[#1E1E30] border-gray-700 text-white'} shadow-md shadow-black/20 border`}
        >
          <div className="bg-[#1B1B32] p-6 text-white">
            <div className="flex items-start space-x-4 mb-4">
              <Avatar className="h-[70px] w-[70px] border-2 border-gray-600">
                <AvatarImage src="/lovable-uploads/dc1ba115-9699-414c-b9d0-7521bf7e7224.png" alt={advisorInfo.name} />
                <AvatarFallback className="bg-[#9F9EA1] text-white text-[24px]">
                  {advisorInfo.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="font-semibold text-xl whitespace-nowrap text-ellipsis overflow-hidden mb-1">{advisorInfo.name}</p>
                <div className="flex items-center text-sm text-gray-300 mb-2">
                  <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{advisorInfo.location}</span>
                </div>
                <a href={`mailto:${advisorInfo.email}`} className="text-sm text-blue-400 hover:underline flex items-center">
                  <MailIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{advisorInfo.email}</span>
                </a>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <Link 
                to="/client-advisor-profile"
                className="w-full flex items-center justify-center py-2.5 px-4 bg-transparent hover:bg-white/10 border border-white/20 rounded-md transition-colors"
                onClick={() => onViewProfile("bio")}
              >
                <UserRoundIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">View profile</span>
              </Link>
              
              <button 
                onClick={onBookSession}
                className="w-full flex items-center justify-center py-2.5 px-4 bg-transparent hover:bg-white/10 border border-white/20 rounded-md transition-colors text-white"
              >
                <Calendar className="h-5 w-5 mr-2" />
                <span className="font-medium">Book a session</span>
                <ExternalLinkIcon className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
