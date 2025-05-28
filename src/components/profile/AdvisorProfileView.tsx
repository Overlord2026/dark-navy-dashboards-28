
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
          <div className="text-sm text-white/80 mt-6 leading-relaxed">
            {advisorInfo.bio.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        );
      case "location":
        return (
          <div className="text-sm text-white/80 mt-6 space-y-3">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-white/90 min-w-[60px]">Office:</span>
              <span>{advisorInfo.office}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-medium text-white/90 min-w-[60px]">Location:</span>
              <span>{advisorInfo.location}</span>
            </div>
          </div>
        );
      case "education":
        return (
          <div className="text-sm text-white/80 mt-6 space-y-3">
            <div className="space-y-2">
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
    <div className="bg-[#0a1021] rounded-lg overflow-hidden mb-6">
      {/* Header Section with improved spacing */}
      <div className="p-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 flex-1">
            <div className="rounded-full overflow-hidden w-28 h-28 flex-shrink-0">
              <Avatar className="w-full h-full">
                <AvatarFallback className="bg-[#9F9EA1] text-white text-[20px]">
                  {advisorInfo.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center lg:text-left space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1">{advisorInfo.name}</h2>
                <p className="text-lg text-white/70">{advisorInfo.title}</p>
              </div>
              
              {/* Contact Information with better spacing */}
              <div className="space-y-2">
                <div className="flex items-center justify-center lg:justify-start text-white/80 hover:text-white transition-colors">
                  <MailIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <a href={`mailto:${advisorInfo.email}`} className="hover:underline">
                    {advisorInfo.email}
                  </a>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start text-white/80">
                  <MapPinIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span>{advisorInfo.location}</span>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start text-white/80 hover:text-white transition-colors">
                  <LinkedinIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                  {advisorInfo.linkedin ? (
                    <a href={advisorInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      LinkedIn Profile
                    </a>
                  ) : (
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 lg:flex-shrink-0">
            <Button 
              onClick={onBookSession}
              className="bg-white text-[#0a1021] hover:bg-white/90 px-6 py-2.5 rounded-md font-medium"
            >
              Book a session
            </Button>
            {onEditProfile && (
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 px-6 py-2.5"
                onClick={onEditProfile}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs Section with improved spacing */}
      <div className="px-8 pb-8">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="bg-[#1c2e4a] w-auto inline-flex mb-6">
            <TabsTrigger value="bio" className="data-[state=active]:bg-white/10 px-4 py-2">
              <UserIcon className="h-4 w-4 mr-2" />
              Bio
            </TabsTrigger>
            <TabsTrigger value="location" className="data-[state=active]:bg-white/10 px-4 py-2">
              <MapPinIcon className="h-4 w-4 mr-2" />
              Location
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-white/10 px-4 py-2">
              <GraduationCapIcon className="h-4 w-4 mr-2" />
              Education
            </TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            {renderTabContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
