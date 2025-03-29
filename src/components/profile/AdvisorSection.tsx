
import React from "react";
import { ChevronRight, UserRoundIcon, MailIcon, LinkedinIcon, Calendar, ExternalLinkIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/context/ThemeContext";

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
  collapsed?: boolean;
}

export const AdvisorSection = ({ advisorInfo, onViewProfile, onBookSession, collapsed = false }: AdvisorSectionProps) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  
  return (
    <div className={`px-4 mt-auto mb-4 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'}`}>
      <Popover>
        <PopoverTrigger asChild>
          <div 
            className={`flex items-center w-full p-2 rounded-md transition-colors cursor-pointer border bg-black ${isLightTheme ? 'border-[#9F9EA1]' : 'border-[#9F9EA1]'}`}
          >
            <div className="relative h-[30px] w-[30px] mr-3">
              <Avatar className="h-[30px] w-[30px] border-2 border-[#9F9EA1] rounded-full">
                <AvatarFallback className="bg-black text-white">
                  {advisorInfo.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className={`text-[14px] text-gray-200 font-medium whitespace-nowrap`}>Advisor/CFO:</span>
                <span className={`text-[14px] text-gray-300 whitespace-nowrap truncate max-w-[120px]`}>{advisorInfo.name}</span>
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent 
          align="start" 
          side={collapsed ? "right" : "bottom"} 
          className={`w-64 ${isLightTheme ? 'bg-[#F9F7E8] border-[#DCD8C0] text-[#222222]' : 'bg-[#1E1E30] border-gray-700 text-white'} shadow-md shadow-black/20 border border-primary`}
        >
          <div className="flex flex-col space-y-3 p-1">
            <div className="flex items-center space-x-3">
              <Avatar className="h-[60px] w-[60px] border-2 border-[#9F9EA1]">
                <AvatarFallback className={`bg-black text-white text-xl`}>
                  {advisorInfo.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[150px] overflow-hidden">
                <p className="font-medium whitespace-nowrap text-ellipsis overflow-hidden">{advisorInfo.name}</p>
                <p className="text-sm text-gray-400 whitespace-nowrap text-ellipsis overflow-hidden">{advisorInfo.title}</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-300">{advisorInfo.location}</div>
            
            <a href={`mailto:${advisorInfo.email}`} className="text-sm text-blue-400 hover:underline flex items-center">
              <MailIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span className="truncate">{advisorInfo.email}</span>
            </a>
            
            <div className="flex flex-col space-y-2 pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`justify-start ${isLightTheme ? 'hover:bg-[#E9E7D8] text-[#222222]' : 'hover:bg-[#2A2A40] text-white'} border border-primary`}
                onClick={() => onViewProfile("bio")}
              >
                <UserRoundIcon className="h-3.5 w-3.5 mr-1.5" />
                View profile
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={`justify-start ${isLightTheme ? 'hover:bg-[#E9E7D8] text-[#222222]' : 'hover:bg-[#2A2A40] text-white'} border border-primary`}
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
