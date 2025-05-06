
import React from "react";
import { Button } from "@/components/ui/button";
import { MailIcon, LinkedinIcon, PhoneIcon, HeadphonesIcon, Calendar } from "lucide-react";

interface AdvisorInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  serviceEmail?: string;
  linkedin?: string;
}

interface AdvisorProfileHeaderProps {
  advisorInfo: AdvisorInfo;
  onBookSession: () => void;
  onViewFullProfile: () => void;
  onEditProfile: () => void;
}

export const AdvisorProfileHeader: React.FC<AdvisorProfileHeaderProps> = ({
  advisorInfo,
  onBookSession,
  onViewFullProfile,
  onEditProfile
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8">
      <div className="flex flex-col md:flex-row items-center mb-6 md:mb-0">
        <div className="rounded-full overflow-hidden w-32 h-32 mb-4 md:mb-0 md:mr-8">
          <img
            src="/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png"
            alt={advisorInfo.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-semibold text-white">{advisorInfo.name}</h2>
          <p className="text-white/70 mt-1">{advisorInfo.title}</p>
          
          <div className="flex flex-col md:flex-row md:items-center mt-4 space-y-2 md:space-y-0 md:space-x-6">
            <a href={`mailto:${advisorInfo.email}`} className="flex items-center text-white/80 hover:text-white">
              <MailIcon className="h-4 w-4 mr-2" />
              <span>{advisorInfo.email}</span>
            </a>
            <a href={advisorInfo.linkedin || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="flex items-center text-white/80 hover:text-white">
              <LinkedinIcon className="h-4 w-4 mr-2" />
              <span>LinkedIn</span>
            </a>
          </div>
          
          <div className="flex items-center mt-3 text-white/80">
            <PhoneIcon className="h-4 w-4 mr-2" />
            <span>{advisorInfo.phone}</span>
          </div>
          
          <div className="flex items-center mt-3 text-white/80">
            <HeadphonesIcon className="h-4 w-4 mr-2" />
            <a href={`mailto:${advisorInfo.serviceEmail}`} className="hover:text-white">
              {advisorInfo.serviceEmail}
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Button 
          onClick={onBookSession}
          className="bg-white text-[#0a1021] hover:bg-white/90 px-6"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book a session
        </Button>
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
          onClick={onViewFullProfile}
        >
          View full profile
        </Button>
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
          onClick={onEditProfile}
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
};
