
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
      <div className="p-10">
        <div className="flex flex-col xl:flex-row items-start justify-between gap-10">
          <div className="flex flex-col lg:flex-row items-start gap-8 flex-1 min-w-0">
            <div className="rounded-full overflow-hidden w-32 h-32 flex-shrink-0">
              <Avatar className="w-full h-full">
                <AvatarFallback className="bg-[#9F9EA1] text-white text-[24px]">
                  {advisorInfo.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-6 flex-1 min-w-0">
              <div>
                <h2 className="text-3xl font-semibold text-white mb-2">{advisorInfo.name}</h2>
                <p className="text-xl text-white/70">{advisorInfo.title}</p>
              </div>
              
              {/* Contact Information in a more spacious grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-3xl">
                <div className="flex items-center text-white/80 hover:text-white transition-colors">
                  <MailIcon className="h-5 w-5 mr-4 flex-shrink-0" />
                  <a href={`mailto:${advisorInfo.email}`} className="hover:underline truncate">
                    {advisorInfo.email}
                  </a>
                </div>
                
                <div className="flex items-center text-white/80">
                  <MapPinIcon className="h-5 w-5 mr-4 flex-shrink-0" />
                  <span className="truncate">{advisorInfo.location}</span>
                </div>
                
                <div className="flex items-center text-white/80 hover:text-white transition-colors lg:col-span-2">
                  <LinkedinIcon className="h-5 w-5 mr-4 flex-shrink-0" />
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
          <div className="flex flex-col space-y-4 lg:flex-shrink-0">
            <Button 
              onClick={onBookSession}
              className="bg-white text-[#0a1021] hover:bg-white/90 px-8 py-3 rounded-md font-medium text-base"
            >
              Book a session
            </Button>
            {onEditProfile && (
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-base"
                onClick={onEditProfile}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs Section with expanded content area */}
      <div className="px-10 pb-10">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="bg-[#1c2e4a] w-auto inline-flex mb-8">
            <TabsTrigger value="bio" className="data-[state=active]:bg-white/10 px-6 py-3">
              <UserIcon className="h-4 w-4 mr-2" />
              Bio
            </TabsTrigger>
            <TabsTrigger value="location" className="data-[state=active]:bg-white/10 px-6 py-3">
              <MapPinIcon className="h-4 w-4 mr-2" />
              Location
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-white/10 px-6 py-3">
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
