import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Lightbulb, 
  GraduationCap, 
  LandPlot, 
  Building, 
  BarChart4, 
  Heart, 
  Scale, 
  ExternalLink 
} from "lucide-react";
import { toast } from "sonner";

// Define the AdvancedTaxStrategy type
interface AdvancedTaxStrategy {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  educationalLinks: Array<{
    title: string;
    url: string;
    isExternal?: boolean;
  }>;
  professionalLinks: Array<{
    title: string;
    description: string;
    url: string;
  }>;
}

export const AdvancedTaxStrategies: React.FC = () => {
  const [advancedStrategyExpanded, setAdvancedStrategyExpanded] = useState<string | null>(null);
  
  // Advanced Tax Planning Strategies data
  const advancedTaxStrategies: AdvancedTaxStrategy[] = [
    {
      id: "tax-loss-harvesting",
      title: "Tax-Loss Harvesting",
      description: "Strategic selling of securities at a loss to offset capital gains tax liability. This technique can help reduce your overall tax burden while maintaining your investment strategy.",
      icon: <BarChart4 className="h-5 w-5 text-blue-500" />,
      educationalLinks: [
        { title: "Tax-Loss Harvesting Basics", url: "/education/tax-loss-harvesting" },
        { title: "When to Harvest Losses", url: "/education/optimal-tax-loss-timing" },
        { title: "Fidelity Guide to Tax-Loss Harvesting", url: "https://www.fidelity.com/learning-center/personal-finance/tax-loss-harvesting", isExternal: true }
      ],
      professionalLinks: [
        { title: "Tax Optimization Specialists", description: "Portfolio tax experts", url: "/marketplace/tax-specialists" },
        { title: "Investment Tax Advisors", description: "Specialized in tax-efficient investing", url: "/marketplace/investment-tax-advisors" }
      ]
    },
    {
      id: "charitable-giving",
      title: "Charitable Giving Strategies",
      description: "Advanced approaches to charitable donations including donor-advised funds, charitable remainder trusts, and qualified charitable distributions from IRAs to maximize tax benefits while supporting causes you care about.",
      icon: <Heart className="h-5 w-5 text-red-500" />,
      educationalLinks: [
        { title: "Donor-Advised Fund Guide", url: "/education/donor-advised-funds" },
        { title: "Charitable Trusts Explained", url: "/education/charitable-trusts" },
        { title: "Schwab Charitable Planning Guide", url: "https://www.schwabcharitable.org/", isExternal: true }
      ],
      professionalLinks: [
        { title: "Charitable Planning Advisors", description: "Philanthropy specialists", url: "/marketplace/charitable-advisors" },
        { title: "Estate Attorneys", description: "Specialized in charitable planning", url: "/marketplace/estate-attorneys" }
      ]
    },
    {
      id: "opportunity-zones",
      title: "Qualified Opportunity Zones",
      description: "Tax-advantaged investments in designated economically distressed communities. These investments can provide temporary tax deferral, partial tax reduction, and potential tax elimination on appreciation.",
      icon: <LandPlot className="h-5 w-5 text-green-500" />,
      educationalLinks: [
        { title: "Opportunity Zone Fundamentals", url: "/education/opportunity-zones-101" },
        { title: "QOZ Investment Strategies", url: "/education/qoz-investment-strategies" },
        { title: "IRS Opportunity Zone Resources", url: "https://www.irs.gov/credits-deductions/businesses/opportunity-zones", isExternal: true }
      ],
      professionalLinks: [
        { title: "QOZ Fund Managers", description: "Specialized investment managers", url: "/marketplace/qoz-fund-managers" },
        { title: "Tax-Advantaged Real Estate Advisors", description: "OZ property specialists", url: "/marketplace/tax-advantaged-real-estate" }
      ]
    },
    {
      id: "estate-tax",
      title: "Estate Tax Optimization",
      description: "Sophisticated techniques to minimize estate taxes including irrevocable trusts, family limited partnerships, and gifting strategies to preserve wealth for future generations.",
      icon: <Scale className="h-5 w-5 text-purple-500" />,
      educationalLinks: [
        { title: "Estate Tax Planning Guide", url: "/education/estate-tax-planning" },
        { title: "Advanced Gifting Techniques", url: "/education/advanced-gifting" },
        { title: "American College Trust Planning Course", url: "https://www.theamericancollege.edu/designations-degrees/advanced-estate-planning", isExternal: true }
      ],
      professionalLinks: [
        { title: "Estate Planning Attorneys", description: "High-net-worth specialists", url: "/marketplace/estate-attorneys" },
        { title: "Trust Companies", description: "Professional trust services", url: "/marketplace/trust-companies" }
      ]
    },
    {
      id: "executive-compensation",
      title: "Executive Compensation Planning",
      description: "Tax-efficient management of stock options, restricted stock units, deferred compensation, and other executive benefits to optimize after-tax returns.",
      icon: <Building className="h-5 w-5 text-amber-500" />,
      educationalLinks: [
        { title: "Stock Option Optimization", url: "/education/stock-option-tax-strategies" },
        { title: "RSU Tax Planning", url: "/education/rsu-tax-planning" },
        { title: "NASPP Executive Compensation Resources", url: "https://www.naspp.com/", isExternal: true }
      ],
      professionalLinks: [
        { title: "Executive Compensation Specialists", description: "Equity compensation experts", url: "/marketplace/executive-comp-specialists" },
        { title: "Corporate Benefits Advisors", description: "Specialized in executive packages", url: "/marketplace/corporate-benefits-advisors" }
      ]
    }
  ];

  const toggleStrategyExpanded = (strategyId: string) => {
    if (advancedStrategyExpanded === strategyId) {
      setAdvancedStrategyExpanded(null);
    } else {
      setAdvancedStrategyExpanded(strategyId);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Advanced Tax Planning Strategies
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-muted-foreground mb-4">
          Explore sophisticated tax planning approaches to potentially reduce your tax burden and optimize your wealth transfer strategies.
        </p>
        
        <div className="space-y-4">
          {advancedTaxStrategies.map((strategy) => (
            <div key={strategy.id} className="border rounded-lg overflow-hidden">
              <div 
                className="p-4 bg-muted/50 flex justify-between items-center cursor-pointer"
                onClick={() => toggleStrategyExpanded(strategy.id)}
              >
                <div className="flex items-center gap-2">
                  {strategy.icon}
                  <h3 className="font-medium">{strategy.title}</h3>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {advancedStrategyExpanded === strategy.id ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                  }
                </Button>
              </div>
              
              {advancedStrategyExpanded === strategy.id && (
                <div className="p-4 border-t">
                  <p className="text-sm text-muted-foreground mb-4">
                    {strategy.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium flex items-center mb-2">
                        <GraduationCap className="h-4 w-4 mr-1 text-blue-500" />
                        Educational Resources
                      </h4>
                      <ul className="space-y-1">
                        {strategy.educationalLinks.map((link, idx) => (
                          <li key={idx} className="text-sm">
                            <a 
                              href={link.url} 
                              className="text-primary hover:underline flex items-center"
                              target={link.isExternal ? "_blank" : "_self"}
                              rel={link.isExternal ? "noopener noreferrer" : ""}
                            >
                              {link.title}
                              {link.isExternal && <ExternalLink className="h-3 w-3 ml-1" />}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mr-1"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                        Professional Help
                      </h4>
                      <ul className="space-y-2">
                        {strategy.professionalLinks.map((link, idx) => (
                          <li key={idx} className="text-sm flex">
                            <a 
                              href={link.url} 
                              className="text-primary hover:underline mr-1"
                            >
                              {link.title}
                            </a>
                            <span className="text-muted-foreground">- {link.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => toast.info(`Request sent for more information about ${strategy.title}`)}
                    >
                      Request Consultation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
