
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, MessageSquare, BarChart } from "lucide-react";
import { toast } from "sonner";

interface MarketingFunnelDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MarketingFunnelDialog({ isOpen, onClose }: MarketingFunnelDialogProps) {
  const [activeTab, setActiveTab] = useState("landing-page");
  const [isCompleted, setIsCompleted] = useState(false);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleNext = () => {
    if (activeTab === "landing-page") {
      setActiveTab("campaigns");
      toast.success("Landing page settings saved!");
    } else if (activeTab === "campaigns") {
      setActiveTab("calendar");
      toast.success("Campaign settings saved!");
    } else if (activeTab === "calendar") {
      setActiveTab("lead-scoring");
      toast.success("Calendar settings saved!");
    } else if (activeTab === "lead-scoring") {
      setIsCompleted(true);
      toast.success("Lead scoring settings saved!");
    }
  };
  
  const handleComplete = () => {
    toast.success("Marketing funnel created successfully!");
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#0F0F2D] text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Set Up Your Marketing Funnel
          </DialogTitle>
          <p className="text-gray-300 mt-2">
            Create a powerful lead generation and conversion system in just a few steps
          </p>
        </DialogHeader>
        
        {!isCompleted ? (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="landing-page">Landing Page</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="lead-scoring">Lead Scoring</TabsTrigger>
            </TabsList>
            
            <TabsContent value="landing-page" className="space-y-4">
              <h3 className="font-medium text-lg">Custom Landing Page</h3>
              <p className="text-gray-400">
                Create a professional landing page to capture prospect information
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700 mt-4">
                <h4 className="font-medium mb-2">Landing Page Templates</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-[#1EAEDB]/40 bg-[#1EAEDB]/10 p-3 rounded-md cursor-pointer">
                    <p className="font-medium text-sm">Retirement Planning</p>
                    <p className="text-xs text-gray-400">For retirement-focused practices</p>
                  </div>
                  <div className="border border-gray-700 p-3 rounded-md cursor-pointer hover:border-[#1EAEDB]/40 hover:bg-[#1EAEDB]/5">
                    <p className="font-medium text-sm">Wealth Management</p>
                    <p className="text-xs text-gray-400">For broad wealth services</p>
                  </div>
                  <div className="border border-gray-700 p-3 rounded-md cursor-pointer hover:border-[#1EAEDB]/40 hover:bg-[#1EAEDB]/5">
                    <p className="font-medium text-sm">Tax Strategy</p>
                    <p className="text-xs text-gray-400">For tax-focused advisors</p>
                  </div>
                  <div className="border border-gray-700 p-3 rounded-md cursor-pointer hover:border-[#1EAEDB]/40 hover:bg-[#1EAEDB]/5">
                    <p className="font-medium text-sm">Estate Planning</p>
                    <p className="text-xs text-gray-400">For estate specialists</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleNext}>Next: Campaign Setup</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="campaigns" className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#1EAEDB]" />
                <h3 className="font-medium text-lg">Automated Campaigns</h3>
              </div>
              <p className="text-gray-400">
                Configure email and SMS sequences to nurture your leads
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700 mt-4 space-y-4">
                <div className="border-b border-gray-700 pb-3">
                  <h4 className="font-medium mb-2">Email Campaign</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#1EAEDB]">•</span>
                      <span>Welcome Email (Day 1)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#1EAEDB]">•</span>
                      <span>Value Proposition (Day 3)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#1EAEDB]">•</span>
                      <span>Client Success Story (Day 7)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#1EAEDB]">•</span>
                      <span>Consultation Invitation (Day 10)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">SMS Follow-ups</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#1EAEDB]">•</span>
                      <span>Confirmation Text (Immediate)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#1EAEDB]">•</span>
                      <span>Quick Tip (Day 5)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#1EAEDB]">•</span>
                      <span>Appointment Reminder</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleNext}>Next: Calendar Setup</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#1EAEDB]" />
                <h3 className="font-medium text-lg">Appointment Scheduling</h3>
              </div>
              <p className="text-gray-400">
                Configure your availability for prospect consultations
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700 mt-4">
                <h4 className="font-medium mb-2">Availability Settings</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="border border-gray-700 p-3 rounded-md">
                    <p className="font-medium">Monday</p>
                    <p className="text-gray-400">9:00 AM - 5:00 PM</p>
                  </div>
                  <div className="border border-gray-700 p-3 rounded-md">
                    <p className="font-medium">Tuesday</p>
                    <p className="text-gray-400">9:00 AM - 5:00 PM</p>
                  </div>
                  <div className="border border-gray-700 p-3 rounded-md">
                    <p className="font-medium">Wednesday</p>
                    <p className="text-gray-400">9:00 AM - 5:00 PM</p>
                  </div>
                  <div className="border border-gray-700 p-3 rounded-md">
                    <p className="font-medium">Thursday</p>
                    <p className="text-gray-400">9:00 AM - 5:00 PM</p>
                  </div>
                  <div className="border border-gray-700 p-3 rounded-md">
                    <p className="font-medium">Friday</p>
                    <p className="text-gray-400">9:00 AM - 3:00 PM</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Meeting Types</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#1EAEDB]">•</span>
                      <span>Initial Consultation (30 min)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#1EAEDB]">•</span>
                      <span>Financial Review (60 min)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#1EAEDB]">•</span>
                      <span>Quick Check-in (15 min)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleNext}>Next: Lead Scoring</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="lead-scoring" className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-[#1EAEDB]" />
                <h3 className="font-medium text-lg">Real-time Lead Scoring</h3>
              </div>
              <p className="text-gray-400">
                Configure how leads are automatically scored and prioritized
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700 mt-4">
                <h4 className="font-medium mb-2">Scoring Criteria</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-sm">Email opened</span>
                    <span className="text-sm font-medium">+5 points</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-sm">Link clicked</span>
                    <span className="text-sm font-medium">+10 points</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-sm">Form submitted</span>
                    <span className="text-sm font-medium">+20 points</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-sm">Downloaded resource</span>
                    <span className="text-sm font-medium">+15 points</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-sm">Booked meeting</span>
                    <span className="text-sm font-medium">+50 points</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-sm">Account value over $500k</span>
                    <span className="text-sm font-medium">+25 points</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleNext}>Complete Setup</Button>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-6 space-y-4">
            <div className="bg-green-500/20 text-green-400 p-4 rounded-lg border border-green-500/30 text-center">
              <h3 className="font-medium text-lg mb-1">Marketing Funnel Created!</h3>
              <p className="text-sm">Your marketing funnel is ready to go. You'll start capturing and nurturing leads automatically.</p>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
              <h4 className="font-medium mb-3">What's Next?</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#1EAEDB] font-bold">•</span>
                  <span className="text-sm">Share your landing page with prospects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1EAEDB] font-bold">•</span>
                  <span className="text-sm">Monitor your campaign performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1EAEDB] font-bold">•</span>
                  <span className="text-sm">Respond to high-scoring leads quickly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1EAEDB] font-bold">•</span>
                  <span className="text-sm">Review analytics weekly to optimize</span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        <DialogFooter>
          {isCompleted ? (
            <Button 
              variant="advisor"
              onClick={handleComplete}
            >
              Start Generating Leads
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={onClose}
              className="border-gray-700"
            >
              Save & Finish Later
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
