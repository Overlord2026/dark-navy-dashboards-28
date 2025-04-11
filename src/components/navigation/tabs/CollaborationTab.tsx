import React, { useState } from "react";
import { BriefcaseIcon, Users2, UsersIcon, InfoIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfessionalType } from "@/types/professional";
import { useProfessionals } from "@/hooks/useProfessionals";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

export const collaborationNavItems: NavItem[] = [
  { 
    title: "Service Professionals", 
    href: "/professionals", 
    icon: Users2 
  },
  { 
    title: "Family Members", 
    href: "/sharing", 
    icon: UsersIcon 
  }
];

type DocumentType = "legal" | "document" | "image" | "spreadsheet" | "pdf" | "property" | "financial" | "insurance";

interface DocumentCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  relevantProfessionals: ProfessionalType[];
  description: string;
  documentTypes: DocumentType[];
}

const documentCategories: DocumentCategory[] = [
  {
    id: "legal",
    name: "Legal Documents",
    icon: InfoIcon,
    relevantProfessionals: ["Estate Planning Attorney", "Tax Professional / Accountant"],
    description: "Legal agreements, contracts, and estate planning documents",
    documentTypes: ["legal", "document"]
  },
  {
    id: "property",
    name: "Property Records",
    icon: InfoIcon,
    relevantProfessionals: ["Real Estate Agent / Property Manager"],
    description: "Property deeds, inspection reports, and rental agreements",
    documentTypes: ["property", "document", "image"]
  },
  {
    id: "financial",
    name: "Financial Documents",
    icon: InfoIcon,
    relevantProfessionals: ["Financial Advisor", "Tax Professional / Accountant"],
    description: "Tax returns, financial statements, and investment documents",
    documentTypes: ["financial", "spreadsheet"]
  },
  {
    id: "insurance",
    name: "Insurance Policies",
    icon: InfoIcon,
    relevantProfessionals: ["Insurance / LTC Specialist"],
    description: "Insurance policies and claims documentation",
    documentTypes: ["insurance", "document", "pdf"]
  },
  {
    id: "mortgage",
    name: "Mortgage Documents",
    icon: InfoIcon,
    relevantProfessionals: ["Mortgage Broker", "Real Estate Agent / Property Manager"],
    description: "Mortgage agreements, refinancing documents, and loan applications",
    documentTypes: ["financial", "document"]
  }
];

interface AccessControlProps {
  id: string;
  label: string;
  defaultValue?: boolean;
  tooltipText: string;
  onChange?: (value: boolean) => void;
}

const AccessControl: React.FC<AccessControlProps> = ({ id, label, defaultValue = false, tooltipText, onChange }) => {
  const [isFullAccess, setIsFullAccess] = useState(defaultValue);
  
  const handleToggle = (checked: boolean) => {
    setIsFullAccess(checked);
    if (onChange) {
      onChange(checked);
    }
    
    toast.success(`Access level updated to ${checked ? "Full Access" : "Limited Access"}`);
  };
  
  return (
    <div className="flex items-center space-x-2 my-2">
      <Switch 
        id={id} 
        checked={isFullAccess} 
        onCheckedChange={handleToggle} 
      />
      <Label htmlFor={id} className="font-medium text-sm">{label}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-white/95 shadow-lg p-3 rounded-lg border">
            <p className="text-sm">{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const CollaborationTab = () => {
  return (
    <div className="collaboration-tab p-4">
      <h2 className="text-2xl font-semibold mb-6 text-white">Sharing</h2>
      
      <div className="bg-[#010a1c] rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-medium mb-2 text-white">Your Collaborators</h3>
        <p className="text-gray-400 mb-6">
          Share access with family members and service professionals (e.g., your accountant) by giving them full or partial access.
        </p>
        
        <div className="space-y-4">
          <div className="text-center py-10 bg-[#071429] rounded-lg border border-gray-800">
            <UsersIcon size={60} className="mx-auto text-blue-500/60 mb-4" />
            <h3 className="text-xl font-medium mb-3 text-white">No Family Members Added</h3>
            <p className="text-gray-400 text-base max-w-md mx-auto mb-6">
              Share access with your family members by inviting them to collaborate on financial planning, document access, and more.
            </p>
            <Link 
              to="/sharing?add=family"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg inline-flex"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationTab;
