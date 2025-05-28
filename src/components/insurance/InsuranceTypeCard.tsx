
import React from "react";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { InsuranceType } from "@/types/insuranceProvider";
import { getInsuranceIcon, getInsuranceTitle, getInsuranceDescription } from "@/utils/insuranceUtils";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface InsuranceTypeCardProps {
  type: InsuranceType;
  title: string;
  description: string;
  onClick: () => void;
}

export const InsuranceTypeCard = ({ type, title, description, onClick }: InsuranceTypeCardProps) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const IconComponent = getInsuranceIcon(type);
  
  const getIconColor = () => {
    switch (type) {
      case "term-life":
      case "permanent-life":
        return "text-blue-400";
      case "annuities":
      case "fiduciary-annuities":
        return "text-green-400";
      case "long-term-care":
      case "healthcare":
        return "text-amber-400";
      case "homeowners":
      case "automobile":
      case "umbrella":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-pointer transition-all",
        isLightTheme 
          ? "bg-card border-border hover:border-accent/30 hover:shadow-md" 
          : "bg-[#121a2c] border-gray-800 hover:border-gray-600"
      )}
      onClick={onClick}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={cn(
            "text-xl font-semibold",
            isLightTheme ? "text-foreground" : "text-white"
          )}>
            {title} 
            <ChevronRight className="inline h-5 w-5 opacity-70" />
          </h2>
        </div>
        <div className="h-40 flex items-center justify-center">
          <IconComponent className={`h-24 w-24 ${getIconColor()} opacity-70`} />
        </div>
        <p className={cn(
          isLightTheme ? "text-muted-foreground" : "text-gray-400"
        )}>
          {description}
        </p>
      </div>
    </Card>
  );
};
