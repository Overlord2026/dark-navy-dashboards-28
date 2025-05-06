
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserIcon, BriefcaseIcon, GraduationCapIcon, MapPinIcon } from "lucide-react";

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface AdvisorInfo {
  bio: string;
  office: string;
  hometown?: string;
  location: string;
  experience?: Experience[];
  certifications: string[];
}

interface AdvisorTabsProps {
  advisorInfo: AdvisorInfo;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdvisorTabs: React.FC<AdvisorTabsProps> = ({
  advisorInfo,
  activeTab,
  onTabChange
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "bio":
        return (
          <div className="text-white/80 mt-4">
            <p className="text-base leading-relaxed">{advisorInfo.bio}</p>
          </div>
        );
      case "experience":
        return (
          <div className="text-white/80 mt-4 space-y-6">
            {advisorInfo.experience?.map((exp, index) => (
              <div key={index} className="flex items-start">
                <BriefcaseIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-white mb-1">{exp.title}</h3>
                  <p className="text-sm text-white/70 mb-1">{exp.company} | {exp.period}</p>
                  <p className="text-sm">{exp.description}</p>
                </div>
              </div>
            )) || (
              <div className="text-white/80">
                <p>No experience information available</p>
              </div>
            )}
          </div>
        );
      case "education":
        return (
          <div className="text-white/80 mt-4 space-y-4">
            <div className="flex items-start">
              <GraduationCapIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white mb-1">Pine View Academy</h3>
                <p>Sarasota, Florida</p>
                <p className="text-sm text-white/70 mt-1">Top of class at top 10 school in the country</p>
              </div>
            </div>
            <div className="flex items-start">
              <GraduationCapIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white mb-1">BS, Finance</h3>
                <p>University of North Carolina at Charlotte</p>
              </div>
            </div>
            <div className="flex items-start">
              <GraduationCapIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white mb-1">Certifications</h3>
                {advisorInfo.certifications.map((cert, index) => (
                  <p key={index}>{cert}</p>
                ))}
              </div>
            </div>
          </div>
        );
      case "location":
        return (
          <div className="text-white/80 mt-4 space-y-4">
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white mb-1">Office</h3>
                <p>{advisorInfo.office}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white mb-1">Current Location</h3>
                <p>{advisorInfo.location}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white mb-1">Hometown</h3>
                <p>{advisorInfo.hometown}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="bg-[#1c2e4a] w-auto inline-flex mb-6">
        <TabsTrigger value="bio" className="data-[state=active]:bg-white/10">
          <UserIcon className="h-4 w-4 mr-2" />
          Bio
        </TabsTrigger>
        <TabsTrigger value="experience" className="data-[state=active]:bg-white/10">
          <BriefcaseIcon className="h-4 w-4 mr-2" />
          Experience
        </TabsTrigger>
        <TabsTrigger value="education" className="data-[state=active]:bg-white/10">
          <GraduationCapIcon className="h-4 w-4 mr-2" />
          Education
        </TabsTrigger>
        <TabsTrigger value="location" className="data-[state=active]:bg-white/10">
          <MapPinIcon className="h-4 w-4 mr-2" />
          Location
        </TabsTrigger>
      </TabsList>
      <TabsContent value={activeTab}>
        {renderTabContent()}
      </TabsContent>
    </Tabs>
  );
};
