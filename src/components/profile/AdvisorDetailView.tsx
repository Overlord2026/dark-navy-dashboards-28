
import React from "react";
import { MailIcon, LinkedinIcon, MapPinIcon, HomeIcon, GraduationCapIcon, UserIcon } from "lucide-react";

interface AdvisorDetailViewProps {
  advisorInfo: {
    name: string;
    title: string;
    email: string;
    location: string;
    hometown: string;
    education: string[];
    bio: string;
  };
}

export const AdvisorDetailView = ({ advisorInfo }: AdvisorDetailViewProps) => {
  return (
    <div className="space-y-6 py-4">
      <h1 className="text-3xl font-bold text-white text-center">{advisorInfo.name}</h1>
      
      <div className="space-y-6 mt-8">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center">
            <MailIcon className="h-5 w-5 mr-4 text-white/70" />
            <span className="text-lg text-white">Email</span>
          </div>
          <a href={`mailto:${advisorInfo.email}`} className="text-lg text-white underline">
            {advisorInfo.email}
          </a>
        </div>
        
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center">
            <LinkedinIcon className="h-5 w-5 mr-4 text-white/70" />
            <span className="text-lg text-white">LinkedIn</span>
          </div>
          <a href="#" className="text-lg text-white underline">
            View
          </a>
        </div>
        
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 mr-4 text-white/70" />
            <span className="text-lg text-white">Location</span>
          </div>
          <span className="text-lg text-white/70">{advisorInfo.location}</span>
        </div>
        
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center">
            <HomeIcon className="h-5 w-5 mr-4 text-white/70" />
            <span className="text-lg text-white">Hometown</span>
          </div>
          <span className="text-lg text-white/70">{advisorInfo.hometown}</span>
        </div>
        
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center mb-4">
            <GraduationCapIcon className="h-5 w-5 mr-4 text-white/70" />
            <span className="text-lg text-white">Education</span>
          </div>
          <div className="pl-9">
            {advisorInfo.education.map((edu, index) => (
              <p key={index} className="text-lg text-white/70">{edu}</p>
            ))}
          </div>
        </div>
        
        <div className="pb-4">
          <div className="flex items-center mb-4">
            <UserIcon className="h-5 w-5 mr-4 text-white/70" />
            <span className="text-lg text-white">Daniel's Bio</span>
          </div>
          <p className="text-white/70 leading-relaxed">{advisorInfo.bio}</p>
        </div>
      </div>
    </div>
  );
};
