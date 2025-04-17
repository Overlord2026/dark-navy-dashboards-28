
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhyChooseUs } from "@/components/estate-planning/WhyChooseUs";
import { FamilyLegacyBox } from "@/components/estate-planning/FamilyLegacyBox";
import { ServicesSection } from "@/components/estate-planning/ServicesSection";
import { InterestDialog } from "@/components/estate-planning/InterestDialog";
import { ExpertiseSection } from "@/components/estate-planning/ExpertiseSection";
import { ProcessSection } from "@/components/estate-planning/ProcessSection";
import { ResourcesTabContent } from "@/components/estate-planning/ResourcesTabContent";
import { AdvisorDialog } from "@/components/estate-planning/AdvisorDialog";

export default function EstatePlanning() {
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [showAdvisorDialog, setShowAdvisorDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShowInterest = () => {
    console.log("Sending email to advisor with form data:", formData);
    console.log("Alerting advisor about interest:", formData);
    toast.success("Thank you for your interest! An advisor will contact you soon.");
    setShowInterestDialog(false);
  };

  const handleScheduleAppointment = () => {
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    toast.success("Opening scheduling page");
  };

  return (
    <ThreeColumnLayout activeMainItem="estate-planning" title="Estate Planning">
      <div className="space-y-8">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="bg-muted/50 p-6 sm:p-10 flex flex-col sm:flex-row gap-6 items-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Calendar className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2 flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Estate Planning Services</h1>
              <p className="text-muted-foreground">Secure your legacy and protect what matters most with our comprehensive estate planning solutions.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ExpertiseSection 
            onScheduleClick={() => setShowAdvisorDialog(true)}
            onInterestClick={() => setShowInterestDialog(true)}
          />

          <Tabs defaultValue="services" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="services" className="flex-1">Our Services</TabsTrigger>
              <TabsTrigger value="family-legacy-box" className="flex-1">Family Legacy Box</TabsTrigger>
              <TabsTrigger value="process" className="flex-1">Our Process</TabsTrigger>
              <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="services">
              <ServicesSection onInterestClick={() => setShowInterestDialog(true)} />
            </TabsContent>

            <TabsContent value="family-legacy-box" className="space-y-6">
              <FamilyLegacyBox />
            </TabsContent>

            <TabsContent value="process" className="space-y-6">
              <ProcessSection onScheduleClick={handleScheduleAppointment} />
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <ResourcesTabContent onInterestClick={() => setShowInterestDialog(true)} />
            </TabsContent>
          </Tabs>
        </div>

        <WhyChooseUs />

        <InterestDialog
          open={showInterestDialog}
          onOpenChange={setShowInterestDialog}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleShowInterest}
          services={[
            { title: "Family Legacy Box" },
            { title: "Will & Trust Creation" },
            { title: "Estate Tax Planning" }
          ]}
        />

        <AdvisorDialog
          open={showAdvisorDialog}
          onOpenChange={setShowAdvisorDialog}
          formData={formData}
          onInputChange={handleInputChange}
          onSchedule={handleScheduleAppointment}
        />
      </div>
    </ThreeColumnLayout>
  );
}
