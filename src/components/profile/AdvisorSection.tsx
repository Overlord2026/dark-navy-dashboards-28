
import React from "react";
import { ChevronRight, UserRoundIcon, MailIcon, LinkedinIcon, Calendar, ExternalLinkIcon, MapPinIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/context/ThemeContext";
import { Link } from "react-router-dom";

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
            className={`flex items-center w-full py-1.5 px-3 rounded-md transition-colors cursor-pointer border bg-black ${isLightTheme ? 'border-[#9F9EA1]' : 'border-[#9F9EA1]'}`}
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
                <span className={`text-[14px] text-gray-300 whitespace-nowrap truncate max-w-[150px]`}>{advisorInfo.name}</span>
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent 
          align="start" 
          side={collapsed ? "right" : "bottom"} 
          className={`w-[350px] p-0 overflow-hidden ${isLightTheme ? 'bg-[#F9F7E8] border-[#DCD8C0] text-[#222222]' : 'bg-[#1E1E30] border-gray-700 text-white'} shadow-md shadow-black/20 border border-primary`}
        >
          <div className="bg-[#1B1B32] p-6 text-white">
            <div className="flex items-start space-x-4 mb-4">
              <Avatar className="h-[70px] w-[70px] border-2 border-[#9F9EA1]">
                <AvatarFallback className="bg-black text-white text-[24px]">
                  {advisorInfo.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="font-semibold text-xl whitespace-nowrap text-ellipsis overflow-hidden mb-1">{advisorInfo.name}</p>
                <p className="text-sm text-gray-300 mb-3">{advisorInfo.title}</p>
                <div className="flex items-center text-sm text-gray-300 mb-2">
                  <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Sarasota, FL</span>
                </div>
                <a href={`mailto:${advisorInfo.email}`} className="text-sm text-blue-400 hover:underline flex items-center">
                  <MailIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{advisorInfo.email}</span>
                </a>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <Link 
                to="/advisor-profile"
                className="w-full flex items-center justify-center py-2.5 px-4 bg-transparent hover:bg-white/10 border border-white/20 rounded-md transition-colors"
                onClick={() => onViewProfile("bio")}
              >
                <UserRoundIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">View profile</span>
              </Link>
              
              <a 
                href="https://meetings.hubspot.com/daniel-herrera1?uuid=55ab1315-5daa-4009-af29-f100ee7aae67"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center py-2.5 px-4 bg-transparent hover:bg-white/10 border border-white/20 rounded-md transition-colors text-white"
              >
                <Calendar className="h-5 w-5 mr-2" />
                <span className="font-medium">Book a session</span>
                <ExternalLinkIcon className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
