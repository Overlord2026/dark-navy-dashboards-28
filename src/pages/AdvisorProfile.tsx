
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AdvisorProfileHeader } from "@/components/advisor/AdvisorProfileHeader";
import { AdvisorTabs } from "@/components/advisor/AdvisorTabs";
import { BookingDrawer } from "@/components/advisor/BookingDrawer";
import { AdvisorDetailView } from "@/components/profile/AdvisorDetailView";
import { AdvisorProfileEditForm } from "@/components/profile/AdvisorProfileEditForm";
import { useAdvisorProfileState } from "@/hooks/useAdvisorProfileState";

const AdvisorProfile = () => {
  const {
    activeTab,
    setActiveTab,
    isBookingDrawerOpen,
    setIsBookingDrawerOpen,
    showDetailView,
    setShowDetailView,
    isEditing,
    setIsEditing,
    advisorInfo,
    handleSaveAdvisorInfo
  } = useAdvisorProfileState();

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
      ) : isEditing ? (
        <div className="mx-auto w-full max-w-6xl space-y-6 p-4 animate-fade-in">
          <Button 
            variant="ghost" 
            className="mb-4 text-white"
            onClick={() => setIsEditing(false)}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          
          <div className="bg-[#0a1021] rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Edit Advisor Profile</h2>
            <AdvisorProfileEditForm 
              advisorInfo={advisorInfo}
              onSave={handleSaveAdvisorInfo}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-6xl space-y-6 p-4 animate-fade-in">
          <div className="bg-[#0a1021] rounded-lg p-6 md:p-8">
            <AdvisorProfileHeader 
              advisorInfo={advisorInfo}
              onBookSession={() => setIsBookingDrawerOpen(true)}
              onViewFullProfile={() => setShowDetailView(true)}
              onEditProfile={() => setIsEditing(true)}
            />
            
            <AdvisorTabs 
              advisorInfo={advisorInfo}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
      )}
      
      <BookingDrawer 
        isOpen={isBookingDrawerOpen}
        onOpenChange={setIsBookingDrawerOpen}
        advisorName={advisorInfo.name}
      />
    </ThreeColumnLayout>
  );
};

export default AdvisorProfile;
