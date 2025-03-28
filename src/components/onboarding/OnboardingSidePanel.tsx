
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetClose 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

interface OnboardingSidePanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialFormId?: string;
  onFormSave?: (formId: string) => void;
}

export const OnboardingSidePanel = ({ 
  isOpen, 
  onOpenChange,
  initialFormId = "investor-profile",
  onFormSave
}: OnboardingSidePanelProps) => {
  const [activeFormId, setActiveFormId] = useState(initialFormId);

  // Update the active form when initialFormId changes
  useEffect(() => {
    if (initialFormId) {
      setActiveFormId(initialFormId);
    }
  }, [initialFormId]);

  const handleFormChange = (formId: string) => {
    setActiveFormId(formId);
  };

  const handleFormSave = (formId: string) => {
    console.log(`Form saved in side panel: ${formId}`);
    if (onFormSave) {
      onFormSave(formId);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        className="w-full sm:max-w-[40%] overflow-hidden bg-[#0F0F2D] text-[#E2E2E2] border-l border-gray-800 animate-slide-in-right" 
        side="right"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <Select value={activeFormId} onValueChange={handleFormChange}>
              <SelectTrigger className="w-full bg-transparent border-gray-700 text-white focus:ring-0">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                <SelectItem value="investor-profile">Investor Profile</SelectItem>
                <SelectItem value="contact-information">Contact Information</SelectItem>
                <SelectItem value="additional-information">Additional Information</SelectItem>
                <SelectItem value="beneficiaries">Beneficiaries</SelectItem>
                <SelectItem value="affiliations">Affiliations</SelectItem>
                <SelectItem value="trusts">Trusts</SelectItem>
                <SelectItem value="security-access">Security & Access</SelectItem>
              </SelectContent>
            </Select>
            
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
          
          <ScrollArea className="flex-1 pr-4">
            <OnboardingForm formId={activeFormId} onFormSave={handleFormSave} />
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};
