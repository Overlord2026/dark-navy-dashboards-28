
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
          <div className="text-sm text-white/80 mt-4">
            {advisorInfo.bio.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        );
      case "location":
        return (
          <div className="text-sm text-white/80 mt-4">
            <p className="mb-2">Office: {advisorInfo.office}</p>
            <p>Location: {advisorInfo.location}</p>
          </div>
        );
      case "education":
        return (
          <div className="text-sm text-white/80 mt-4">
            <p className="mb-2">MBA, Finance - University of Florida</p>
            <p className="mb-2">BS, Business Administration - UNC Chapel Hill</p>
            <p>Certified Financial Planner™ (CFP®)</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0a1021] rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="rounded-full overflow-hidden w-32 h-32 mb-4 md:mb-0 md:mr-6">
            <Avatar className="w-full h-full">
              <AvatarFallback className="bg-[#9F9EA1] text-white text-[24px]">
                {advisorInfo.name.split(' ').map(name => name[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-white">{advisorInfo.name}</h2>
            <div className="flex items-center mt-2 text-white/80 space-x-4">
              <a href={`mailto:${advisorInfo.email}`} className="flex items-center hover:text-white">
                <MailIcon className="h-4 w-4 mr-2" />
                <span>{advisorInfo.email}</span>
              </a>
            </div>
            <div className="flex items-center mt-2 text-white/80">
              {advisorInfo.linkedin ? (
                <a href={advisorInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white">
                  <LinkedinIcon className="h-4 w-4 mr-2" />
                  <span>LinkedIn</span>
                </a>
              ) : (
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white">
                  <LinkedinIcon className="h-4 w-4 mr-2" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 mt-4 md:mt-0">
          <a 
            href="https://calendly.com/tonygomes/60min"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#0a1021] hover:bg-white/90 px-4 py-2 rounded-md font-medium inline-flex items-center"
            onClick={onBookSession}
          >
            Book a session
          </a>
          {onEditProfile && (
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              onClick={onEditProfile}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="bg-[#1c2e4a] w-auto inline-flex">
          <TabsTrigger value="bio" className="data-[state=active]:bg-white/10">
            <UserIcon className="h-4 w-4 mr-2" />
            Bio
          </TabsTrigger>
          <TabsTrigger value="location" className="data-[state=active]:bg-white/10">
            <MapPinIcon className="h-4 w-4 mr-2" />
            Location
          </TabsTrigger>
          <TabsTrigger value="education" className="data-[state=active]:bg-white/10">
            <GraduationCapIcon className="h-4 w-4 mr-2" />
            Education
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          {renderTabContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
