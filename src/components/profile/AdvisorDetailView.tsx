
import React from "react";
import { MailIcon, LinkedinIcon, MapPinIcon, HomeIcon, GraduationCapIcon, UserIcon, BriefcaseIcon, CheckCircleIcon, HeadphonesIcon } from "lucide-react";

interface Experience {
  company: string;
  title: string;
  period: string;
  description: string;
}

interface AdvisorDetailViewProps {
  advisorInfo: {
    name: string;
    title: string;
    email: string;
    serviceEmail?: string;
    location: string;
    hometown?: string;
    education: string[];
    bio: string;
    experience?: Experience[];
    certifications?: string[];
    specialties?: string[];
  };
}

export const AdvisorDetailView = ({ advisorInfo }: AdvisorDetailViewProps) => {
  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-start">
        <div className="rounded-full overflow-hidden w-32 h-32 mb-4 md:mb-0 md:mr-8">
          <img
            src="/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png"
            alt={advisorInfo.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-white">{advisorInfo.name}</h1>
          <p className="text-xl text-white/70 mt-1">{advisorInfo.title}</p>
        </div>
      </div>
      
      <div className="space-y-6 mt-8 divide-y divide-white/10">
        <div className="flex justify-between items-center pb-4">
          <div className="flex items-center">
            <MailIcon className="h-5 w-5 mr-4 text-white/70" />
            <span className="text-lg text-white">Email</span>
          </div>
          <a href={`mailto:${advisorInfo.email}`} className="text-lg text-white underline">
            {advisorInfo.email}
          </a>
        </div>
        
        {advisorInfo.serviceEmail && (
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <HeadphonesIcon className="h-5 w-5 mr-4 text-white/70" />
              <span className="text-lg text-white">Service</span>
            </div>
            <a href={`mailto:${advisorInfo.serviceEmail}`} className="text-lg text-white underline">
              {advisorInfo.serviceEmail}
            </a>
          </div>
        )}
        
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <LinkedinIcon className="h-5 w-5 mr-4 text-white/70" />
            <span className="text-lg text-white">LinkedIn</span>
          </div>
          <a href="#" className="text-lg text-white underline">
            View
          </a>
        </div>
        
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 mr-4 text-white/70" />
            <span className="text-lg text-white">Location</span>
          </div>
          <span className="text-lg text-white/70">{advisorInfo.location}</span>
        </div>
        
        {advisorInfo.hometown && (
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <HomeIcon className="h-5 w-5 mr-4 text-white/70" />
              <span className="text-lg text-white">Hometown</span>
            </div>
            <span className="text-lg text-white/70">{advisorInfo.hometown}</span>
          </div>
        )}
        
        {advisorInfo.experience && advisorInfo.experience.length > 0 && (
          <div className="py-4">
            <div className="flex items-center mb-4">
              <BriefcaseIcon className="h-5 w-5 mr-4 text-white/70" />
              <span className="text-lg text-white">Professional Experience</span>
            </div>
            <div className="pl-9 space-y-6">
              {advisorInfo.experience.map((exp, index) => (
                <div key={index}>
                  <h3 className="text-lg font-medium text-white">{exp.title}</h3>
                  <p className="text-white/70 mb-1">{exp.company} | {exp.period}</p>
                  <p className="text-white/70">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="py-4">
          <div className="flex items-center mb-4">
            <GraduationCapIcon className="h-5 w-5 mr-4 text-white/70" />
            <span className="text-lg text-white">Education</span>
          </div>
          <div className="pl-9">
            {advisorInfo.education.map((edu, index) => (
              <p key={index} className="text-lg text-white/70 mb-3">{edu}</p>
            ))}
          </div>
        </div>
        
        {advisorInfo.certifications && (
          <div className="py-4">
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="h-5 w-5 mr-4 text-white/70" />
              <span className="text-lg text-white">Certifications & Licenses</span>
            </div>
            <div className="pl-9">
              {advisorInfo.certifications.map((cert, index) => (
                <p key={index} className="text-lg text-white/70 mb-2">{cert}</p>
              ))}
            </div>
          </div>
        )}
        
        {advisorInfo.specialties && (
          <div className="py-4">
            <div className="flex items-center mb-4">
              <UserIcon className="h-5 w-5 mr-4 text-white/70" />
              <span className="text-lg text-white">Areas of Expertise</span>
            </div>
            <div className="pl-9 grid grid-cols-1 md:grid-cols-2 gap-2">
              {advisorInfo.specialties.map((specialty, index) => (
                <p key={index} className="text-lg text-white/70">• {specialty}</p>
              ))}
            </div>
          </div>
        )}
        
        <div className="py-4">
          <div className="flex items-center mb-4">
            <UserIcon className="h-5 w-5 mr-4 text-white/70" />
            <span className="text-lg text-white">{advisorInfo.name}'s Bio</span>
          </div>
          <p className="text-white/70 leading-relaxed">{advisorInfo.bio}</p>
        </div>
      </div>
    </div>
  );
};
