
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, UserIcon, MailIcon, LinkedinIcon, PhoneIcon, MapPinIcon, GraduationCapIcon, ArrowLeft, BriefcaseIcon, HeadphonesIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { AdvisorDetailView } from "@/components/profile/AdvisorDetailView";
import { AdvisorProfileEditForm } from "@/components/profile/AdvisorProfileEditForm";
import { AdvisorProfileView } from "@/components/profile/AdvisorProfileView";
import { useAdvisor } from "@/context/AdvisorContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const AdvisorProfile = () => {
  const [activeTab, setActiveTab] = useState("bio");
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { advisorInfo, updateAdvisorInfo } = useAdvisor();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  const handleSaveAdvisorInfo = (updatedInfo) => {
    updateAdvisorInfo(updatedInfo);
    setIsEditing(false);
  };

  const handleBookSession = () => {
    window.open("https://calendly.com/tonygomes/60min", "_blank");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "bio":
        return (
          <div className={cn(
            "mt-6",
            isLightTheme ? "text-foreground/80" : "text-white/80"
          )}>
            <p className="text-base leading-relaxed">{advisorInfo.bio}</p>
          </div>
        );
      case "experience":
        return (
          <div className={cn(
            "mt-6 space-y-6",
            isLightTheme ? "text-foreground/80" : "text-white/80"
          )}>
            {advisorInfo.experience?.map((exp, index) => (
              <div key={index} className="flex items-start">
                <BriefcaseIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className={cn(
                    "font-medium mb-1",
                    isLightTheme ? "text-foreground" : "text-white"
                  )}>{exp.title}</h3>
                  <p className={cn(
                    "text-sm mb-1",
                    isLightTheme ? "text-foreground/70" : "text-white/70"
                  )}>{exp.company} | {exp.period}</p>
                  <p className="text-sm">{exp.description}</p>
                </div>
              </div>
            )) || (
              <div className={cn(
                isLightTheme ? "text-foreground/80" : "text-white/80"
              )}>
                <p>No experience information available</p>
              </div>
            )}
          </div>
        );
      case "education":
        return (
          <div className={cn(
            "mt-6 space-y-4",
            isLightTheme ? "text-foreground/80" : "text-white/80"
          )}>
            <div className="flex items-start">
              <GraduationCapIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className={cn(
                  "font-medium mb-1",
                  isLightTheme ? "text-foreground" : "text-white"
                )}>Pine View Academy</h3>
                <p>Sarasota, Florida</p>
                <p className={cn(
                  "text-sm mt-1",
                  isLightTheme ? "text-foreground/70" : "text-white/70"
                )}>Top of class at top 10 school in the country</p>
              </div>
            </div>
            <div className="flex items-start">
              <GraduationCapIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className={cn(
                  "font-medium mb-1",
                  isLightTheme ? "text-foreground" : "text-white"
                )}>BS, Finance</h3>
                <p>University of North Carolina at Charlotte</p>
              </div>
            </div>
            <div className="flex items-start">
              <GraduationCapIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className={cn(
                  "font-medium mb-1",
                  isLightTheme ? "text-foreground" : "text-white"
                )}>Certifications</h3>
                {advisorInfo.certifications.map((cert, index) => (
                  <p key={index}>{cert}</p>
                ))}
              </div>
            </div>
          </div>
        );
      case "location":
        return (
          <div className={cn(
            "mt-6 space-y-4",
            isLightTheme ? "text-foreground/80" : "text-white/80"
          )}>
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className={cn(
                  "font-medium mb-1",
                  isLightTheme ? "text-foreground" : "text-white"
                )}>Office</h3>
                <p>{advisorInfo.office}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className={cn(
                  "font-medium mb-1",
                  isLightTheme ? "text-foreground" : "text-white"
                )}>Current Location</h3>
                <p>{advisorInfo.location}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className={cn(
                  "font-medium mb-1",
                  isLightTheme ? "text-foreground" : "text-white"
                )}>Hometown</h3>
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
    <div className={cn(
      "min-h-screen",
      isLightTheme ? "bg-background" : "bg-[#1B1B32]"
    )}>
      <ThreeColumnLayout activeMainItem="home" title="">
        <div className={cn(
          "min-h-full",
          isLightTheme ? "bg-background" : "bg-[#1B1B32]"
        )}>
          {showDetailView ? (
            <div className="mx-auto w-full max-w-4xl space-y-6 p-6 animate-fade-in">
              <Button 
                variant="ghost" 
                className={cn(
                  "mb-4",
                  isLightTheme ? "text-foreground" : "text-white"
                )}
                onClick={() => setShowDetailView(false)}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              
              <div className={cn(
                "rounded-lg p-6 md:p-8",
                isLightTheme ? "bg-card" : "bg-[#1B1B32]"
              )}>
                <AdvisorDetailView advisorInfo={advisorInfo} />
              </div>
            </div>
          ) : isEditing ? (
            <div className="mx-auto w-full max-w-4xl space-y-6 p-6 animate-fade-in">
              <Button 
                variant="ghost" 
                className={cn(
                  "mb-4",
                  isLightTheme ? "text-foreground" : "text-white"
                )}
                onClick={() => setIsEditing(false)}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              
              <div className={cn(
                "rounded-lg p-6 md:p-8",
                isLightTheme ? "bg-card" : "bg-[#1B1B32]"
              )}>
                <h2 className={cn(
                  "text-xl font-semibold mb-6",
                  isLightTheme ? "text-foreground" : "text-white"
                )}>Edit Advisor Profile</h2>
                <AdvisorProfileEditForm 
                  advisorInfo={advisorInfo}
                  onSave={handleSaveAdvisorInfo}
                  onCancel={() => setIsEditing(false)}
                />
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-4xl space-y-6 p-6 animate-fade-in">
              <div className={cn(
                "rounded-lg p-8",
                isLightTheme ? "bg-card" : "bg-[#1B1B32]"
              )}>
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 flex-1">
                    <div className="rounded-full overflow-hidden w-32 h-32 flex-shrink-0">
                      <img
                        src="/lovable-uploads/dc1ba115-9699-414c-b9d0-7521bf7e7224.png"
                        alt="Daniel Zamora"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center lg:text-left flex-1">
                      <h2 className={cn(
                        "text-3xl font-semibold mb-2",
                        isLightTheme ? "text-foreground" : "text-white"
                      )}>{advisorInfo.name}</h2>
                      <p className={cn(
                        "text-lg mb-6",
                        isLightTheme ? "text-foreground/70" : "text-white/70"
                      )}>{advisorInfo.title}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <a href={`mailto:${advisorInfo.email}`} className={cn(
                          "flex items-center transition-colors",
                          isLightTheme 
                            ? "text-foreground/80 hover:text-foreground" 
                            : "text-white/80 hover:text-white"
                        )}>
                          <MailIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                          <span>{advisorInfo.email}</span>
                        </a>
                        <a href={advisorInfo.linkedin || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className={cn(
                          "flex items-center transition-colors",
                          isLightTheme 
                            ? "text-foreground/80 hover:text-foreground" 
                            : "text-white/80 hover:text-white"
                        )}>
                          <LinkedinIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                          <span>LinkedIn</span>
                        </a>
                        <div className={cn(
                          "flex items-center",
                          isLightTheme ? "text-foreground/80" : "text-white/80"
                        )}>
                          <PhoneIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                          <span>{advisorInfo.phone}</span>
                        </div>
                        <div className={cn(
                          "flex items-center",
                          isLightTheme ? "text-foreground/80" : "text-white/80"
                        )}>
                          <HeadphonesIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                          <a href={`mailto:${advisorInfo.serviceEmail}`} className={cn(
                            "transition-colors",
                            isLightTheme ? "hover:text-foreground" : "hover:text-white"
                          )}>
                            {advisorInfo.serviceEmail}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 lg:flex-shrink-0">
                    <Button 
                      onClick={handleBookSession}
                      className={cn(
                        "px-6 py-3 font-medium",
                        isLightTheme 
                          ? "bg-foreground text-background hover:bg-foreground/90" 
                          : "bg-white text-[#1B1B32] hover:bg-white/90"
                      )}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book a session
                    </Button>
                    <Button
                      variant="outline"
                      className={cn(
                        "px-6 py-3",
                        isLightTheme 
                          ? "border-border text-foreground hover:bg-muted" 
                          : "border-white/20 text-white hover:bg-white/10"
                      )}
                      onClick={() => setShowDetailView(true)}
                    >
                      View full profile
                    </Button>
                  </div>
                </div>
                
                <div className={cn(
                  "mt-8 pt-8 border-t",
                  isLightTheme ? "border-border" : "border-white/10"
                )}>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className={cn(
                      "w-auto inline-flex mb-6",
                      isLightTheme ? "bg-muted" : "bg-[#2A2A40]"
                    )}>
                      <TabsTrigger value="bio" className={cn(
                        isLightTheme 
                          ? "data-[state=active]:bg-background" 
                          : "data-[state=active]:bg-white/10"
                      )}>
                        <UserIcon className="h-4 w-4 mr-2" />
                        Bio
                      </TabsTrigger>
                      <TabsTrigger value="experience" className={cn(
                        isLightTheme 
                          ? "data-[state=active]:bg-background" 
                          : "data-[state=active]:bg-white/10"
                      )}>
                        <BriefcaseIcon className="h-4 w-4 mr-2" />
                        Experience
                      </TabsTrigger>
                      <TabsTrigger value="education" className={cn(
                        isLightTheme 
                          ? "data-[state=active]:bg-background" 
                          : "data-[state=active]:bg-white/10"
                      )}>
                        <GraduationCapIcon className="h-4 w-4 mr-2" />
                        Education
                      </TabsTrigger>
                      <TabsTrigger value="location" className={cn(
                        isLightTheme 
                          ? "data-[state=active]:bg-background" 
                          : "data-[state=active]:bg-white/10"
                      )}>
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
            </div>
          )}
        </div>
        
        <Drawer open={isBookingDrawerOpen} onOpenChange={setIsBookingDrawerOpen}>
          <DrawerContent className={cn(
            isLightTheme ? "bg-background" : "bg-white"
          )}>
            <div className="mx-auto w-full max-w-4xl p-6">
              <DrawerHeader className="text-center">
                <DrawerTitle className={cn(
                  "text-xl font-bold",
                  isLightTheme ? "text-foreground" : "text-gray-900"
                )}>Book a Meeting with {advisorInfo.name}</DrawerTitle>
                <DrawerDescription className={cn(
                  isLightTheme ? "text-muted-foreground" : "text-gray-600"
                )}>
                  Choose a time that works for you
                </DrawerDescription>
              </DrawerHeader>
              
              <div className="flex flex-col md:flex-row gap-6 my-6">
                <div className={cn(
                  "flex-1 p-6 rounded-lg",
                  isLightTheme 
                    ? "bg-card text-foreground" 
                    : "bg-[#1B1B32] text-white"
                )}>
                  <div className="text-center mb-6">
                    <div className="mx-auto w-24 h-24 rounded-full overflow-hidden mb-4">
                      <img
                        src="/lovable-uploads/dc1ba115-9699-414c-b9d0-7521bf7e7224.png"
                        alt={advisorInfo.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-medium">Meet with {advisorInfo.name}</h3>
                    <div className={cn(
                      "flex items-center justify-center mt-2",
                      isLightTheme ? "text-muted-foreground" : "text-gray-300"
                    )}>
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>March 2023</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center mb-4">
                    <div className={cn(
                      "text-xs",
                      isLightTheme ? "text-muted-foreground" : "text-gray-400"
                    )}>SUN</div>
                    <div className={cn(
                      "text-xs",
                      isLightTheme ? "text-muted-foreground" : "text-gray-400"
                    )}>MON</div>
                    <div className={cn(
                      "text-xs",
                      isLightTheme ? "text-muted-foreground" : "text-gray-400"
                    )}>TUE</div>
                    <div className={cn(
                      "text-xs",
                      isLightTheme ? "text-muted-foreground" : "text-gray-400"
                    )}>WED</div>
                    <div className={cn(
                      "text-xs",
                      isLightTheme ? "text-muted-foreground" : "text-gray-400"
                    )}>THU</div>
                    <div className={cn(
                      "text-xs",
                      isLightTheme ? "text-muted-foreground" : "text-gray-400"
                    )}>FRI</div>
                    <div className={cn(
                      "text-xs",
                      isLightTheme ? "text-muted-foreground" : "text-gray-400"
                    )}>SAT</div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <div 
                        key={day}
                        className={cn(
                          "aspect-square flex items-center justify-center rounded-full text-sm cursor-pointer",
                          day === 15 
                            ? isLightTheme 
                              ? "bg-foreground text-background font-medium" 
                              : "bg-white text-[#1B1B32] font-medium"
                            : isLightTheme 
                              ? "hover:bg-muted" 
                              : "hover:bg-white/10"
                        )}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="mb-6">
                    <h4 className={cn(
                      "font-medium mb-2",
                      isLightTheme ? "text-foreground" : "text-gray-900"
                    )}>How long do you need?</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" className={cn(
                        "flex-1",
                        isLightTheme ? "bg-muted" : "bg-gray-100"
                      )}>30 mins</Button>
                      <Button variant="outline" className="flex-1">15 mins</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={cn(
                      "font-medium mb-2",
                      isLightTheme ? "text-foreground" : "text-gray-900"
                    )}>What time works best?</h4>
                    <p className={cn(
                      "text-sm mb-4",
                      isLightTheme ? "text-muted-foreground" : "text-gray-500"
                    )}>Showing times for March 15, 2023</p>
                    
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
                <Button onClick={() => window.open("https://calendly.com/tonygomes/60min", "_blank")}>Continue</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </ThreeColumnLayout>
    </div>
  );
};

export default AdvisorProfile;
