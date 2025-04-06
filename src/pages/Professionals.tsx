
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { ProfessionalsDirectory } from "@/components/professionals/ProfessionalsDirectory";
import { AddProfessionalDialog } from "@/components/professionals/AddProfessionalDialog";
import { ConsultationsPrompt } from "@/components/professionals/ConsultationsPrompt";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, ExternalLink, MessageSquare, FileText, ShieldCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfessionalType } from "@/types/professional";
import { ProfessionalsProvider } from "@/context/ProfessionalsContext";

export default function Professionals() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [professionalType, setProfessionalType] = useState<ProfessionalType>("Tax Professional / Accountant");
  const [activeTab, setActiveTab] = useState("professionals");
  const navigate = useNavigate();

  const handleProfessionalSignup = () => {
    navigate("/professional-signup", { state: { professionalType } });
  };

  const handleNavigateToFeedback = () => {
    navigate("/advisor-feedback");
  };

  return (
    <ThreeColumnLayout activeMainItem="professionals" title="Service Professionals">
      <ProfessionalsProvider>
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Service Professionals</h1>
              <p className="text-muted-foreground mt-1">
                Manage your professional service providers and share documents securely
              </p>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <UserPlus size={16} />
              Add Professional
            </Button>
          </div>

          <Tabs defaultValue="professionals" onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="professionals" className="flex gap-2 items-center">
                <Users2Icon size={16} />
                <span>Professionals</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex gap-2 items-center">
                <FileText size={16} />
                <span>Shared Documents</span>
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex gap-2 items-center">
                <ShieldCheck size={16} />
                <span>Permissions</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="professionals" className="space-y-6">
              <ConsultationsPrompt />

              {activeTab === "professionals" && (
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h2 className="text-lg font-medium mb-3">Are you a Professional?</h2>
                  <p className="text-muted-foreground mb-4">
                    Join our marketplace to connect with clients and collaborate with other professionals.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select 
                      value={professionalType} 
                      onValueChange={(value) => setProfessionalType(value as ProfessionalType)}
                    >
                      <SelectTrigger className="w-full sm:w-[250px]">
                        <SelectValue placeholder="Select professional type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tax Professional / Accountant">Tax Professional / Accountant</SelectItem>
                        <SelectItem value="Estate Planning Attorney">Estate Planning Attorney</SelectItem>
                        <SelectItem value="Financial Advisor">Financial Advisor</SelectItem>
                        <SelectItem value="Real Estate Agent / Property Manager">Real Estate Agent / Property Manager</SelectItem>
                        <SelectItem value="Insurance / LTC Specialist">Insurance / LTC Specialist</SelectItem>
                        <SelectItem value="Mortgage Broker">Mortgage Broker</SelectItem>
                        <SelectItem value="Auto Insurance Provider">Auto Insurance Provider</SelectItem>
                        <SelectItem value="Other">Other Professional</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleProfessionalSignup} className="flex items-center gap-2">
                      <ExternalLink size={16} />
                      Sign Up as Professional
                    </Button>
                  </div>
                </div>
              )}

              {/* New advisor feedback prompt */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h2 className="text-lg font-medium mb-2">Already a Professional on our Platform?</h2>
                <p className="text-muted-foreground mb-4">
                  Share your experience with our practice management tools, marketing features, and marketplace visibility.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleNavigateToFeedback}
                  className="flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Provide Advisor Feedback
                </Button>
              </div>

              <ProfessionalsDirectory />
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="bg-card p-6 rounded-lg border border-border space-y-4">
                <h2 className="text-xl font-medium">Shared Documents</h2>
                <p className="text-muted-foreground">
                  Manage documents shared with your service professionals. Control access and track document viewing.
                </p>
                <div className="p-8 border border-dashed border-border rounded-lg flex flex-col items-center justify-center">
                  <FileText size={48} className="text-muted-foreground mb-4" />
                  <p className="text-center mb-2">No documents shared yet</p>
                  <Button variant="outline">Share Documents</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="permissions">
              <div className="bg-card p-6 rounded-lg border border-border space-y-4">
                <h2 className="text-xl font-medium">Professional Access Permissions</h2>
                <p className="text-muted-foreground">
                  Manage what information each professional can view and edit.
                </p>
                <div className="p-8 border border-dashed border-border rounded-lg flex flex-col items-center justify-center">
                  <ShieldCheck size={48} className="text-muted-foreground mb-4" />
                  <p className="text-center mb-2">No custom permissions configured</p>
                  <Button variant="outline">Configure Permissions</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <AddProfessionalDialog 
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
          />
        </div>
      </ProfessionalsProvider>
    </ThreeColumnLayout>
  );
}
