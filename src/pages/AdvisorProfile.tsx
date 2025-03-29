import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, UserIcon, MailIcon, LinkedinIcon, PhoneIcon, MapPinIcon, GraduationCapIcon, ArrowLeft, BriefcaseIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { AdvisorDetailView } from "@/components/profile/AdvisorDetailView";
import { Link } from "react-router-dom";

const AdvisorProfile = () => {
  const [activeTab, setActiveTab] = useState("bio");
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);

  const advisorInfo = {
    name: "Daniel Zamora",
    title: "Certified Financial Planner™",
    location: "Tampa, FL",
    email: "Daniel@awmfl.com",
    phone: "(800) 555-1234",
    office: "New York, NY",
    hometown: "Asheville, NC",
    education: [
      "Pine View Academy - Sarasota, Florida (Top of class at top 10 school in the country)",
      "Bachelor of Science in Finance - University of North Carolina at Charlotte",
      "Certified Financial Planner™ (CFP®) - Certified Financial Planner Board of Standards"
    ],
    experience: [
      {
        company: "AWM Financial Advisors",
        title: "Senior Financial Advisor",
        period: "2020 - Present",
        description: "Provide comprehensive financial planning and investment management services to high-net-worth individuals and families."
      },
      {
        company: "Fisher Investments",
        title: "Client Acquisition Director",
        period: "2017 - 2020",
        description: "Led team responsible for client acquisition and relationship management, consistently exceeding quarterly targets."
      },
      {
        company: "UBS Financial Services",
        title: "Wealth Management Advisor",
        period: "2013 - 2017",
        description: "Developed personalized financial strategies for affluent clients with focus on retirement planning and wealth preservation."
      },
      {
        company: "Vanguard",
        title: "Financial Advisor",
        period: "2010 - 2013",
        description: "Provided investment guidance and financial planning services to individual investors."
      }
    ],
    certifications: [
      "Certified Financial Planner™ (CFP®)",
      "Chartered Financial Analyst (CFA) Level II Candidate",
      "Series 7 & 66 Licenses"
    ],
    specialties: [
      "Retirement Planning",
      "Tax-Efficient Investment Strategies",
      "Estate Planning",
      "Risk Management",
      "Asset Allocation"
    ],
    bio: "Daniel, a seasoned finance professional, guides high net worth investors. His approach blends investment management, risk mitigation, tax optimization, and overall strategy. Starting at Vanguard, then UBS, he directed client acquisition at Fisher Investments before joining BFO. Originally from Asheville, NC, Daniel now resides in Tampa, enjoying fitness, community activities, and sunny days by the water."
  };

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
            {advisorInfo.experience.map((exp, index) => (
              <div key={index} className="flex items-start">
                <BriefcaseIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-white mb-1">{exp.title}</h3>
                  <p className="text-sm text-white/70 mb-1">{exp.company} | {exp.period}</p>
                  <p className="text-sm">{exp.description}</p>
                </div>
              </div>
            ))}
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
    <ThreeColumnLayout activeMainItem="home" title="Advisor Profile">
      {showDetailView ? (
        <div className="mx-auto w-full max-w-6xl space-y-6 p-4 animate-fade-in">
          <Button 
            variant="ghost" 
            className="mb-4 text-white"
            onClick={() => setShowDetailView(false)}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          
          <div className="bg-[#0a1021] rounded-lg p-6 md:p-8">
            <AdvisorDetailView advisorInfo={advisorInfo} />
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-6xl space-y-6 p-4 animate-fade-in">
          <div className="bg-[#0a1021] rounded-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="flex flex-col md:flex-row items-center mb-6 md:mb-0">
                <div className="rounded-full overflow-hidden w-32 h-32 mb-4 md:mb-0 md:mr-8">
                  <img
                    src="/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png"
                    alt="Daniel Zamora"
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
                    <a href="#" className="flex items-center text-white/80 hover:text-white">
                      <LinkedinIcon className="h-4 w-4 mr-2" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                  
                  <div className="flex items-center mt-3 text-white/80">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <span>{advisorInfo.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => setIsBookingDrawerOpen(true)}
                  className="bg-white text-[#0a1021] hover:bg-white/90 px-6"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a session
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => setShowDetailView(true)}
                >
                  View full profile
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          </div>
        </div>
      )}
      
      <Drawer open={isBookingDrawerOpen} onOpenChange={setIsBookingDrawerOpen}>
        <DrawerContent className="bg-white">
          <div className="mx-auto w-full max-w-4xl p-6">
            <DrawerHeader className="text-center">
              <DrawerTitle className="text-xl font-bold">Book a Meeting with {advisorInfo.name}</DrawerTitle>
              <DrawerDescription>
                Choose a time that works for you
              </DrawerDescription>
            </DrawerHeader>
            
            <div className="flex flex-col md:flex-row gap-6 my-6">
              <div className="flex-1 p-6 bg-[#0a1021] text-white rounded-lg">
                <div className="text-center mb-6">
                  <div className="mx-auto w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img
                      src="/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png"
                      alt="Daniel Zamora"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-medium">Meet with {advisorInfo.name}</h3>
                  <div className="flex items-center justify-center mt-2 text-gray-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>March 2023</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center mb-4">
                  <div className="text-xs text-gray-400">SUN</div>
                  <div className="text-xs text-gray-400">MON</div>
                  <div className="text-xs text-gray-400">TUE</div>
                  <div className="text-xs text-gray-400">WED</div>
                  <div className="text-xs text-gray-400">THU</div>
                  <div className="text-xs text-gray-400">FRI</div>
                  <div className="text-xs text-gray-400">SAT</div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <div 
                      key={day}
                      className={`
                        aspect-square flex items-center justify-center rounded-full text-sm
                        ${day === 15 ? 'bg-white text-[#0a1021] font-medium' : 'hover:bg-white/10 cursor-pointer'}
                      `}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="mb-6">
                  <h4 className="font-medium mb-2">How long do you need?</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-gray-100">30 mins</Button>
                    <Button variant="outline" className="flex-1">15 mins</Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">What time works best?</h4>
                  <p className="text-sm text-gray-500 mb-4">Showing times for March 15, 2023</p>
                  
                  <div className="space-y-2">
                    {["10:15 am", "1:15 pm", "3:15 pm", "4:45 pm", "5:30 pm"].map((time) => (
                      <Button 
                        key={time}
                        variant="outline" 
                        className="w-full justify-center text-center"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <DrawerFooter>
              <Button>Continue</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </ThreeColumnLayout>
  );
};

export default AdvisorProfile;
