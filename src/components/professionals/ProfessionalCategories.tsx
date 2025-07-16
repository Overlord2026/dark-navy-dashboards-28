
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  FileText, 
  Home, 
  Shield, 
  Building, 
  Car, 
  Users,
  User
} from "lucide-react";
import { toast } from "sonner";

interface ProfessionalCategoryProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  specialRequirements?: string[];
}

export function ProfessionalCategories({ activeCategory, onCategoryChange }: ProfessionalCategoryProps) {
  const categories: CategoryItem[] = [
    {
      id: "all",
      name: "All Professionals",
      description: "View all professional service providers",
      icon: <Users className="h-5 w-5" />
    },
    {
      id: "Tax Professional / Accountant",
      name: "Tax Professionals",
      description: "CPAs, tax preparers, and accounting services",
      icon: <FileText className="h-5 w-5" />,
      specialRequirements: ["Valid CPA license", "Tax preparation experience"]
    },
    {
      id: "Estate Planning Attorney",
      name: "Estate Planning Attorneys",
      description: "Legal specialists in wills, trusts and estate planning",
      icon: <Briefcase className="h-5 w-5" />,
      specialRequirements: ["Bar certification", "Estate planning practice"]
    },
    {
      id: "Real Estate Agent / Property Manager",
      name: "Real Estate Services",
      description: "Agents, brokers, and property management",
      icon: <Home className="h-5 w-5" />,
      specialRequirements: ["Real estate license"]
    },
    {
      id: "Insurance / LTC Specialist",
      name: "Insurance Specialists",
      description: "Life, health, and long-term care insurance",
      icon: <Shield className="h-5 w-5" />,
      specialRequirements: ["Insurance license"]
    },
    {
      id: "Mortgage Broker",
      name: "Mortgage Brokers",
      description: "Home loans and refinancing specialists",
      icon: <Building className="h-5 w-5" />,
      specialRequirements: ["Mortgage broker license"]
    },
    {
      id: "Auto Insurance Provider",
      name: "Auto Insurance",
      description: "Vehicle insurance and coverage",
      icon: <Car className="h-5 w-5" />,
      specialRequirements: ["Insurance license"]
    },
    {
      id: "Other",
      name: "Other Professionals",
      description: "Additional service providers",
      icon: <User className="h-5 w-5" />
    }
  ];

  const handleInterested = (categoryName: string) => {
    toast.success("Interest Recorded", {
      description: `We've noted your interest in ${categoryName}. A professional will reach out soon.`,
      duration: 3000,
    });
  };

  const handleScheduleMeeting = (categoryName: string) => {
    // Open Calendly with scheduling link
    window.open("https://calendly.com/tonygomes/talk-with-tony", "_blank");
    
    toast.success("Opening scheduling page", {
      description: `Schedule a consultation about ${categoryName} services.`,
      duration: 3000,
    });
  };

  // Filter out the "all" category from being displayed
  const displayCategories = categories.filter(category => category.id !== "all");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Professional Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayCategories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all hover:border-primary min-h-[120px] ${
              activeCategory === category.id ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-2 rounded-md flex-shrink-0 ${
                  activeCategory === category.id 
                    ? "bg-primary/10 text-primary" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm leading-tight mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
              
              {/* CTA Buttons - Show when category is active and not "all" */}
              {activeCategory === category.id && category.id !== "all" && (
                <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="interested" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInterested(category.name);
                      }}
                    >
                      I'M Interested
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScheduleMeeting(category.name);
                      }}
                    >
                      Schedule Meeting
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Special Requirements - Show when category is active */}
              {category.specialRequirements && activeCategory === category.id && (
                <div className={`mt-3 pt-3 border-t border-border/50 ${category.id !== "all" ? "mt-1 pt-2" : ""}`}>
                  <div className="flex flex-wrap gap-1">
                    {category.specialRequirements.map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs py-0.5 px-2">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
