
import { UserIcon, MailIcon, LinkedinIcon, PhoneIcon, MapPinIcon, FileTextIcon, GraduationCapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdvisorInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  office: string;
  bio: string;
  linkedin?: string;
}

interface AdvisorProfileViewProps {
  advisorInfo: AdvisorInfo;
  activeTab: string;
  onTabChange: (value: string) => void;
  onBookSession: () => void;
  onEditProfile?: () => void;
}

export const AdvisorProfileView = ({ 
  advisorInfo, 
  activeTab, 
  onTabChange, 
  onBookSession,
  onEditProfile
}: AdvisorProfileViewProps) => {
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "bio":
        return (
          <div className="text-sm text-white/80 mt-8 leading-relaxed max-w-4xl">
            {advisorInfo.bio.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        );
      case "location":
        return (
          <div className="text-sm text-white/80 mt-8 space-y-4 max-w-2xl">
            <div className="flex items-center space-x-4">
              <span className="font-medium text-white/90 min-w-[80px]">Office:</span>
              <span>{advisorInfo.office}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-medium text-white/90 min-w-[80px]">Location:</span>
              <span>{advisorInfo.location}</span>
            </div>
          </div>
        );
      case "education":
        return (
          <div className="text-sm text-white/80 mt-8 space-y-4 max-w-3xl">
            <div className="space-y-3">
              <p className="font-medium text-white/90">MBA, Finance - University of Florida</p>
              <p className="font-medium text-white/90">BS, Business Administration - UNC Chapel Hill</p>
              <p className="font-medium text-white/90">Certified Financial Planner™ (CFP®)</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0a1021] rounded-lg overflow-hidden mb-6 max-w-7xl mx-auto">
      {/* Header Section with expanded layout */}
      <div className="p-6 md:p-10">
        <div className="flex flex-col xl:flex-row items-start justify-between gap-6 md:gap-10">
          <div className="flex flex-col lg:flex-row items-start gap-6 md:gap-8 flex-1 min-w-0">
            <div className="rounded-full overflow-hidden w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
              <Avatar className="w-full h-full">
                <AvatarFallback className="bg-[#9F9EA1] text-white text-lg md:text-2xl">
                  {advisorInfo.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-4 md:space-y-6 flex-1 min-w-0">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">{advisorInfo.name}</h2>
                <p className="text-lg md:text-xl text-white/70">{advisorInfo.title}</p>
              </div>
              
              {/* Contact Information in a more spacious grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl">
                <div className="flex items-center text-white/80 hover:text-white transition-colors">
                  <MailIcon className="h-4 w-4 md:h-5 md:w-5 mr-3 md:mr-4 flex-shrink-0" />
                  <a href={`mailto:${advisorInfo.email}`} className="hover:underline truncate text-sm md:text-base">
                    {advisorInfo.email}
                  </a>
                </div>
                
                <div className="flex items-center text-white/80">
                  <MapPinIcon className="h-4 w-4 md:h-5 md:w-5 mr-3 md:mr-4 flex-shrink-0" />
                  <span className="truncate text-sm md:text-base">{advisorInfo.location}</span>
                </div>
                
                <div className="flex items-center text-white/80 hover:text-white transition-colors md:col-span-2">
                  <LinkedinIcon className="h-4 w-4 md:h-5 md:w-5 mr-3 md:mr-4 flex-shrink-0" />
                  {advisorInfo.linkedin ? (
                    <a href={advisorInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-sm md:text-base">
                      LinkedIn Profile
                    </a>
                  ) : (
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline text-sm md:text-base">
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 md:space-y-4 w-full xl:w-auto xl:flex-shrink-0">
            <Button 
              onClick={onBookSession}
              className="bg-white text-[#0a1021] hover:bg-white/90 px-6 md:px-8 py-2.5 md:py-3 rounded-md font-medium text-sm md:text-base w-full xl:w-auto"
            >
              Book a session
            </Button>
            {onEditProfile && (
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base w-full xl:w-auto"
                onClick={onEditProfile}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs Section with improved mobile responsiveness */}
      <div className="px-4 md:px-10 pb-6 md:pb-10">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <div className="w-full mb-6 md:mb-8">
            <TabsList className="bg-[#1c2e4a] w-full grid grid-cols-3 h-auto p-1 gap-1">
              <TabsTrigger 
                value="bio" 
                className="data-[state=active]:bg-white/10 px-2 py-2.5 text-xs font-medium flex-1 min-w-0"
              >
                <UserIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span className="truncate">Bio</span>
              </TabsTrigger>
              <TabsTrigger 
                value="location" 
                className="data-[state=active]:bg-white/10 px-2 py-2.5 text-xs font-medium flex-1 min-w-0"
              >
                <MapPinIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span className="truncate">Location</span>
              </TabsTrigger>
              <TabsTrigger 
                value="education" 
                className="data-[state=active]:bg-white/10 px-2 py-2.5 text-xs font-medium flex-1 min-w-0"
              >
                <GraduationCapIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span className="truncate">Education</span>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={activeTab} className="mt-0">
            {renderTabContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
