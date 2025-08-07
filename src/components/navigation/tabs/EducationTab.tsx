
import React from "react";
import { EnhancedEducationHub } from "@/components/education/EnhancedEducationHub";
import { GraduationCapIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const educationNavItems: NavItem[] = [
  { 
    title: "Education Center", 
    href: "/client-education", 
    icon: GraduationCapIcon 
  },
  { 
    title: "NIL Education", 
    href: "/athletes/nil-landing", 
    icon: GraduationCapIcon 
  }
];

const EducationTab = React.memo(() => {
  return (
    <div className="education-tab space-y-6">
      <EnhancedEducationHub />
    </div>
  );
});

export default EducationTab;
