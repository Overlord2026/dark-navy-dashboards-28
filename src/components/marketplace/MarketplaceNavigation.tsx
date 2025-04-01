
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  ReceiptText, 
  Scroll, 
  Briefcase, 
  Users, 
  ChevronRight,
  DollarSign,
  Building,
  LineChart,
  CalendarClock
} from "lucide-react";

export type SubCategory = {
  id: string;
  name: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  subcategories: SubCategory[];
};

// Define the main marketplace categories and their subcategories
export const serviceCategories: ServiceCategory[] = [
  {
    id: "wealth-management",
    name: "Holistic Wealth Management & Investment Advisory",
    icon: BarChart3,
    description: "Comprehensive wealth management and investment advisory services",
    subcategories: [
      { id: "portfolio-management", name: "Portfolio Management & Monitoring" },
      { id: "private-markets", name: "Private Market Investment Opportunities" },
      { id: "risk-tax-optimization", name: "Risk & Tax Optimization Strategies" }
    ]
  },
  {
    id: "tax-planning",
    name: "Proactive Tax Planning & Optimization",
    icon: ReceiptText,
    description: "Advanced tax planning and optimization strategies",
    subcategories: [
      { id: "tax-minimization", name: "Advanced Tax Minimization Techniques" },
      { id: "multi-state", name: "Multi-State Residency Strategies" },
      { id: "professional-coordination", name: "CPA & Attorney Coordination" },
      { id: "business-tax-strategy", name: "Business Owner Tax Strategies" }
    ]
  },
  {
    id: "estate-planning",
    name: "Estate & Legacy Planning",
    icon: Scroll,
    description: "Comprehensive estate planning and legacy preservation",
    subcategories: [
      { id: "estate-trust", name: "Comprehensive Estate & Trust Planning" },
      { id: "family-legacy", name: "Family Legacy Planning (Family Legacy Box)" },
      { id: "philanthropy", name: "Philanthropy & Charitable Giving" }
    ]
  },
  {
    id: "business-services",
    name: "Business Owner Services",
    icon: Building,
    description: "Specialized services for business owners and entrepreneurs",
    subcategories: [
      { id: "exit-planning", name: "Business Exit Planning & Strategy" },
      { id: "liquidity-planning", name: "Liquidity Planning & Execution" },
      { id: "cfo-services", name: "Fractional CFO Services" },
      { id: "succession-planning", name: "Business Succession Planning" }
    ]
  },
  {
    id: "concierge-services",
    name: "Concierge Lifestyle & Administrative Services",
    icon: Briefcase,
    description: "Premium lifestyle management and administrative services",
    subcategories: [
      { id: "bill-pay", name: "Bill Pay & Personal Bookkeeping" },
      { id: "travel-property", name: "Private Travel & Property Management" },
      { id: "exclusive-experiences", name: "Exclusive Experiences & Memberships" }
    ]
  },
  {
    id: "family-governance",
    name: "Strategic Family Governance & Education",
    icon: Users,
    description: "Family governance structures and educational programs",
    subcategories: [
      { id: "governance-succession", name: "Family Governance & Succession Structures" },
      { id: "next-gen", name: "Next-Generation Education Programs" },
      { id: "strategic-philanthropy", name: "Strategic Philanthropy & Impact Investing" },
      { id: "family-meetings", name: "Family Meeting Facilitation" },
      { id: "conflict-resolution", name: "Family Conflict Resolution" }
    ]
  },
  {
    id: "boutique-services",
    name: "Specialized Boutique Services",
    icon: DollarSign,
    description: "Highly specialized services for unique family office needs",
    subcategories: [
      { id: "private-placement", name: "Private Placement Life Insurance" },
      { id: "art-advisory", name: "Art Advisory & Collection Management" },
      { id: "family-security", name: "Family Security & Privacy" },
      { id: "venture-capital", name: "Family Venture Capital Access" },
      { id: "cross-border", name: "Cross-Border Planning & Compliance" }
    ]
  }
];

interface MarketplaceNavigationProps {
  activeCategory: string;
  activeSubcategory: string | null;
  onCategoryChange: (categoryId: string) => void;
  onSubcategoryChange: (categoryId: string, subcategoryId: string) => void;
  className?: string;
  expanded?: boolean;
}

export function MarketplaceNavigation({
  activeCategory,
  activeSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  className,
  expanded = true
}: MarketplaceNavigationProps) {
  // Track which categories are expanded in the accordion
  const [expandedCategories, setExpandedCategories] = useState<string[]>([activeCategory]);

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Service Categories</CardTitle>
      </CardHeader>
      <CardContent className="px-3">
        <Accordion
          type="multiple"
          value={expandedCategories}
          className="space-y-2"
        >
          {serviceCategories.map((category) => (
            <AccordionItem 
              key={category.id} 
              value={category.id}
              className={cn(
                "border rounded-md overflow-hidden",
                activeCategory === category.id ? "border-primary bg-accent/30" : "border-gray-200"
              )}
            >
              <div className="flex flex-col">
                <div 
                  className={cn(
                    "flex items-center w-full p-2 cursor-pointer hover:bg-accent/50 transition-colors",
                    activeCategory === category.id ? "bg-accent/30" : ""
                  )}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <category.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium flex-grow">{category.name}</span>
                  <AccordionTrigger 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryToggle(category.id);
                    }}
                    className="!p-0 !m-0 h-6 w-6 !no-underline"
                  />
                </div>
                
                <AccordionContent className="pt-1 pb-2">
                  <div className="pl-10 space-y-1">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className={cn(
                          "flex items-center text-sm py-1.5 px-3 rounded-md cursor-pointer transition-colors",
                          activeSubcategory === subcategory.id 
                            ? "bg-primary text-primary-foreground font-medium" 
                            : "hover:bg-accent"
                        )}
                        onClick={() => onSubcategoryChange(category.id, subcategory.id)}
                      >
                        <ChevronRight className={cn(
                          "h-3 w-3 mr-2 transition-transform",
                          activeSubcategory === subcategory.id ? "text-primary-foreground" : "text-muted-foreground"
                        )} />
                        {subcategory.name}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
