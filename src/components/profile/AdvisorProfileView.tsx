
import { UserIcon, MailIcon, LinkedinIcon, PhoneIcon, MapPinIcon, FileTextIcon, GraduationCapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdvisorInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  office: string;
  bio: string;
}

interface AdvisorProfileViewProps {
  advisorInfo: AdvisorInfo;
  activeTab: string;
  onTabChange: (value: string) => void;
  onBookSession: () => void;
}

export const AdvisorProfileView = ({ 
  advisorInfo, 
  activeTab, 
  onTabChange, 
  onBookSession 
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
            <img
              src="/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png"
              alt={advisorInfo.name}
              className="w-full h-full object-cover"
            />
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
              <a href="#" className="flex items-center hover:text-white">
                <LinkedinIcon className="h-4 w-4 mr-2" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        <a 
          href="https://meetings.hubspot.com/daniel-herrera1?uuid=55ab1315-5daa-4009-af29-f100ee7aae67"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 md:mt-0 bg-white text-[#0a1021] hover:bg-white/90 px-4 py-2 rounded-md font-medium inline-flex items-center"
        >
          Book a session
        </a>
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
