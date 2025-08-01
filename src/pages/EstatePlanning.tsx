import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LearnMoreDialog } from "@/components/ui/learn-more-dialog";
import { useLearnMoreNotification } from "@/hooks/useLearnMoreNotification";
import { useEstatePlanning } from "@/hooks/useEstatePlanning";
import { EstateEducationHub } from "@/components/estate-planning/EstateEducationHub";
import { SecureFamilyVault } from "@/components/estate-planning/SecureFamilyVault";
import { AdvancedEstateCalculators } from "@/components/estate-planning/AdvancedEstateCalculators";
import { CollaborationTools } from "@/components/estate-planning/CollaborationTools";
// import { IntegrationsPanel } from "@/components/integrations/IntegrationsPanel";
import { 
  FileText, 
  Shield, 
  Users2, 
  List, 
  Clock, 
  MessageSquare, 
  PenTool, 
  FileSignature, 
  Settings, 
  RefreshCw, 
  Calendar, 
  CheckCircle2 
} from "lucide-react";
import { toast } from "sonner";

export default function EstatePlanning() {
  const [showAdvisorDialog, setShowAdvisorDialog] = useState(false);
  const [showLearnMoreDialog, setShowLearnMoreDialog] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const { createInterest, createConsultation } = useEstatePlanning();
  const { sendLearnMoreEmail } = useLearnMoreNotification();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLearnMoreClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setShowLearnMoreDialog(true);
  };

  const handleLearnMoreConfirm = async () => {
    await sendLearnMoreEmail(selectedService, "Estate Planning Service", "Estate Planning");
  };

  const handleScheduleAppointment = async () => {
    try {
      await createConsultation({
        consultation_type: "Initial Consultation",
        contact_name: formData.name,
        contact_email: formData.email,
        contact_phone: formData.phone,
      });
      
      setShowAdvisorDialog(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error('Error scheduling consultation:', error);
    }
  };

  return (
    <ThreeColumnLayout activeMainItem="estate-planning" title="">
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="text-left ml-2">
            <h1 className="text-2xl font-bold text-foreground mb-2">Estate Planning Services</h1>
            <p className="text-sm text-muted-foreground max-w-3xl">
              Secure your legacy and protect what matters most with our comprehensive estate planning solutions
            </p>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="education" className="w-full">
          <TabsList className="w-full mb-6 h-auto flex-col sm:flex-row">
            <TabsTrigger value="education" className="flex-1 w-full sm:w-auto">Education Hub</TabsTrigger>
            <TabsTrigger value="vault" className="flex-1 w-full sm:w-auto">Secure Vault</TabsTrigger>
            <TabsTrigger value="calculators" className="flex-1 w-full sm:w-auto">Calculators</TabsTrigger>
            <TabsTrigger value="collaboration" className="flex-1 w-full sm:w-auto">Collaboration</TabsTrigger>
          </TabsList>

          <TabsContent value="education" className="space-y-6">
            <EstateEducationHub />
          </TabsContent>

          <TabsContent value="vault" className="space-y-6">
            <SecureFamilyVault />
          </TabsContent>

          <TabsContent value="calculators" className="space-y-6">
            <AdvancedEstateCalculators />
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-6">
            <CollaborationTools />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <Dialog open={showAdvisorDialog} onOpenChange={setShowAdvisorDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Your Consultation</DialogTitle>
              <DialogDescription>
                Book a complimentary consultation with our estate planning experts
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="message">Additional Information (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your estate planning needs..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAdvisorDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleScheduleAppointment}>
                Schedule Consultation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <LearnMoreDialog
          open={showLearnMoreDialog}
          onOpenChange={setShowLearnMoreDialog}
          itemName={selectedService}
          onConfirm={handleLearnMoreConfirm}
        />
      </div>
    </ThreeColumnLayout>
  );
}