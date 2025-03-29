
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Professional Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all hover:border-primary ${
              activeCategory === category.id ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-md ${
                  activeCategory === category.id 
                    ? "bg-primary/10 text-primary" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {category.description}
                  </p>
                  {category.specialRequirements && activeCategory === category.id && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {category.specialRequirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
