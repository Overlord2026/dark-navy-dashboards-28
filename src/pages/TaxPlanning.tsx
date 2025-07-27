
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  Calculator, 
  BookOpen, 
  BarChart, 
  PiggyBank, 
  ExternalLink,
  ArrowRight,
  Check,
  Building,
  UserSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { InterestedButton } from "@/components/investments/InterestedButton";
import { ScheduleMeetingDialog } from "@/components/investments/ScheduleMeetingDialog";
import { RequestAssistanceButton } from "@/components/ui/request-assistance-button";
import { ConsultantRequestButton } from "@/components/ui/consultant-request-button";
import { LearnMoreButton } from "@/components/investments/LearnMoreButton";
import { Link } from "react-router-dom";
import { SecureTaxReturnAnalysis } from "@/components/estate-planning/SecureTaxReturnAnalysis";
import { AccountingSoftwareIntegration } from "@/components/tax-planning/AccountingSoftwareIntegration";
import { TaxReadinessAssessment } from "@/components/tax-planning/TaxReadinessAssessment";
import { CPAMarketplace } from "@/components/tax-planning/CPAMarketplace";
import { TaxDocumentUpload } from "@/components/tax-planning/TaxDocumentUpload";
import { useTaxPlanning } from "@/hooks/useTaxPlanning";
import { useIsMobile } from "@/hooks/use-mobile";

export default function TaxPlanning() {
  const { createConsultation } = useTaxPlanning();
  const isMobile = useIsMobile();

  const handleTaxStrategyConsultation = async () => {
    try {
      await createConsultation({
        consultation_type: 'tax_strategy',
        notes: 'Requested consultation for advanced tax planning strategies'
      });
    } catch (error) {
      console.error('Error scheduling consultation:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <ThreeColumnLayout 
      title="" 
      activeMainItem="education"
      activeSecondaryItem="tax-planning"
      secondaryMenuItems={[]}
    >
      <motion.div
        className={`space-y-6 ${isMobile ? 'px-2 pb-6' : 'px-1 pb-8'}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Introductory header + description */}
        <motion.div variants={itemVariants}>
          <h2 className={`font-bold tracking-tight ${isMobile ? 'text-xl' : 'text-2xl'}`}>Tax Planning</h2>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm mt-1' : 'mt-2'}`}>
            Optimize your tax strategy and minimize your tax burden through proactive planning.
          </p>
        </motion.div>

        {/* Roth IRA Conversion */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className={isMobile ? 'p-4 pb-3' : ''}>
              <CardTitle className={`flex items-center ${isMobile ? 'text-lg' : ''}`}>
                <Calculator className={`mr-2 text-primary ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                Roth IRA Conversion
              </CardTitle>
              <CardDescription className={isMobile ? 'text-sm' : ''}>
                Understanding the process and benefits of converting traditional retirement assets
              </CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                <div>
                  <p className={`text-muted-foreground ${isMobile ? 'text-sm leading-relaxed' : 'text-sm'}`}>
                    A Roth IRA conversion is the process of transferring retirement funds from a Traditional IRA, 401(k), 
                    or similar tax-deferred account into a Roth IRA. Unlike traditional retirement accounts where 
                    contributions are tax-deductible but withdrawals are taxed, Roth IRAs are funded with after-tax 
                    dollars but provide tax-free growth and qualified withdrawals.
                  </p>
                  <h4 className={`font-medium mb-2 ${isMobile ? 'mt-3 text-sm' : 'mt-4'}`}>Key Benefits:</h4>
                  <ul className={`list-disc pl-5 space-y-1 text-muted-foreground ${isMobile ? 'text-sm' : 'text-sm'}`}>
                    <li>Tax-free withdrawals in retirement</li>
                    <li>No required minimum distributions (RMDs)</li>
                    <li>Tax-free inheritance for beneficiaries</li>
                    <li>Protection against future tax rate increases</li>
                  </ul>
                </div>
                <div>
                  <div className="relative">
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="warning">Coming Soon</Badge>
                    </div>
                    <div className="opacity-60 pointer-events-none">
                      <div className={`border rounded-lg mb-4 ${isMobile ? 'p-3' : 'p-4'}`}>
                        <h4 className={`font-medium text-center mb-4 ${isMobile ? 'text-sm mb-3' : ''}`}>Roth Conversion Analysis Tool</h4>
                        <Button variant="outline" className={`w-full flex items-center justify-center ${isMobile ? 'text-sm py-2' : ''}`}>
                          <Calculator className={`mr-2 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                          Open Roth Conversion Calculator
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className={`space-y-3 ${isMobile ? 'space-y-2' : ''}`}>
                    <InterestedButton 
                      assetName="Roth IRA Conversion" 
                      itemType="Tax Strategy"
                      pageContext="Tax Planning"
                    />
                    <ScheduleMeetingDialog assetName="Roth IRA Conversion" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tax Readiness Assessment */}
        <motion.div variants={itemVariants}>
          <TaxReadinessAssessment />
        </motion.div>

        {/* Tax Document Upload */}
        <motion.div variants={itemVariants}>
          <TaxDocumentUpload />
        </motion.div>

        {/* Secure Tax Return Analysis */}
        <motion.div variants={itemVariants}>
          <SecureTaxReturnAnalysis />
        </motion.div>

        {/* Advanced Tax Planning Strategies */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className={isMobile ? 'p-4 pb-3' : ''}>
              <CardTitle className={`flex items-center ${isMobile ? 'text-lg' : ''}`}>
                <BarChart className={`mr-2 text-primary ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                Advanced Tax Planning Strategies
              </CardTitle>
              <CardDescription className={isMobile ? 'text-sm' : ''}>
                Strategic approaches to minimize your tax burden
              </CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                <div>
                  <h4 className={`font-medium mb-3 ${isMobile ? 'text-sm mb-2' : ''}`}>Income Strategies</h4>
                  <ul className={`list-disc pl-5 space-y-2 text-muted-foreground ${isMobile ? 'text-sm space-y-1' : 'text-sm'}`}>
                    <li>Income shifting to lower tax brackets</li>
                    <li>Capital gains harvesting</li>
                    <li>Qualified business income deductions</li>
                    <li>Timing of income recognition</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-medium mb-3 ${isMobile ? 'text-sm mb-2' : ''}`}>Deduction Strategies</h4>
                  <ul className={`list-disc pl-5 space-y-2 text-muted-foreground ${isMobile ? 'text-sm space-y-1' : 'text-sm'}`}>
                    <li>Itemization vs. standard deduction</li>
                    <li>Charitable contribution optimization</li>
                    <li>Business expense planning</li>
                    <li>Home office and property deductions</li>
                  </ul>
                </div>
              </div>
              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1 mt-4' : 'md:grid-cols-2 mt-6'}`}>
                <div>
                  <h4 className={`font-medium mb-3 ${isMobile ? 'text-sm mb-2' : ''}`}>Investment Strategies</h4>
                  <ul className={`list-disc pl-5 space-y-2 text-muted-foreground ${isMobile ? 'text-sm space-y-1' : 'text-sm'}`}>
                    <li>Tax-advantaged accounts utilization</li>
                    <li>Asset location optimization</li>
                    <li>Tax-loss harvesting techniques</li>
                    <li>Qualified Opportunity Zones</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-medium mb-3 ${isMobile ? 'text-sm mb-2' : ''}`}>Retirement Strategies</h4>
                  <ul className={`list-disc pl-5 space-y-2 text-muted-foreground ${isMobile ? 'text-sm space-y-1' : 'text-sm'}`}>
                    <li>Traditional vs. Roth conversions</li>
                    <li>Required minimum distribution planning</li>
                    <li>Social Security taxation management</li>
                    <li>SECURE Act implications</li>
                  </ul>
                </div>
              </div>
              <div className={`flex justify-center space-x-3 ${isMobile ? 'mt-4 flex-col space-x-0 space-y-2' : 'mt-6'}`}>
                <ConsultantRequestButton 
                  itemName="Advanced Tax Planning Strategies" 
                  itemType="Tax Strategy"
                  pageContext="Tax Planning"
                />
                <RequestAssistanceButton 
                  itemName="Advanced Tax Planning Strategies" 
                  itemType="Tax Strategy"
                  pageContext="Tax Planning"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className={isMobile ? 'p-4 pb-3' : ''}>
              <CardTitle className={`flex items-center ${isMobile ? 'text-lg' : ''}`}>
                <BookOpen className={`mr-2 text-primary ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                Additional Tax Planning Services
              </CardTitle>
              <CardDescription className={isMobile ? 'text-sm' : ''}>
                Specialized tax planning services to optimize your financial strategy
              </CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                <div className={`border rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
                  <h4 className={`font-medium flex items-center ${isMobile ? 'text-sm' : ''}`}>
                    <Calendar className={`mr-2 text-primary ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    Annual Tax Updates
                  </h4>
                  <p className={`text-muted-foreground mt-2 ${isMobile ? 'text-xs leading-relaxed' : 'text-sm'}`}>
                    Stay informed about tax law changes and receive personalized annual tax planning recommendations.
                  </p>
                  <div className={isMobile ? 'mt-2' : 'mt-3'}>
                    <LearnMoreButton 
                      assetName="Annual Tax Updates" 
                      itemType="Tax Service"
                      pageContext="Tax Planning"
                      variant="ghost"
                      className={`text-yellow-500 hover:text-yellow-600 p-0 h-auto font-medium flex items-center gap-1 ${isMobile ? 'text-xs' : ''}`}
                    >
                      <span>Learn More</span>
                      <ArrowRight className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                    </LearnMoreButton>
                  </div>
                </div>
                
                <div className={`border rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
                  <h4 className={`font-medium flex items-center ${isMobile ? 'text-sm' : ''}`}>
                    <BarChart className={`mr-2 text-primary ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    Multi-Year Projection
                  </h4>
                  <p className={`text-muted-foreground mt-2 ${isMobile ? 'text-xs leading-relaxed' : 'text-sm'}`}>
                    Long-term tax planning with multi-year projections to optimize your tax situation over time.
                  </p>
                  <div className={isMobile ? 'mt-2' : 'mt-3'}>
                    <LearnMoreButton 
                      assetName="Multi-Year Tax Projection" 
                      itemType="Tax Service"
                      pageContext="Tax Planning"
                      variant="ghost"
                      className={`text-yellow-500 hover:text-yellow-600 p-0 h-auto font-medium flex items-center gap-1 ${isMobile ? 'text-xs' : ''}`}
                    >
                      <span>Learn More</span>
                      <ArrowRight className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                    </LearnMoreButton>
                  </div>
                </div>
                
                <div className={`border rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
                  <h4 className={`font-medium flex items-center ${isMobile ? 'text-sm' : ''}`}>
                    <Building className={`mr-2 text-primary ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    State Residency Planning
                  </h4>
                  <p className={`text-muted-foreground mt-2 ${isMobile ? 'text-xs leading-relaxed' : 'text-sm'}`}>
                    Strategic planning for state tax optimization, including residency changes and domicile considerations.
                  </p>
                  <div className={isMobile ? 'mt-2' : 'mt-3'}>
                    <LearnMoreButton 
                      assetName="State Residency Planning" 
                      itemType="Tax Service"
                      pageContext="Tax Planning"
                      variant="ghost"
                      className={`text-yellow-500 hover:text-yellow-600 p-0 h-auto font-medium flex items-center gap-1 ${isMobile ? 'text-xs' : ''}`}
                    >
                      <span>Learn More</span>
                      <ArrowRight className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                    </LearnMoreButton>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className={isMobile ? 'p-4 pb-3' : ''}>
              <CardTitle className={`flex items-center ${isMobile ? 'text-lg' : ''}`}>
                <UserSquare className={`mr-2 text-primary ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                Tax Planning Professionals
              </CardTitle>
              <CardDescription className={isMobile ? 'text-sm' : ''}>
                Connect with certified tax professionals in our network
              </CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
              <CPAMarketplace />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <Badge variant="warning">Coming Soon</Badge>
            </div>
            <div className="opacity-60 pointer-events-none">
              <AccountingSoftwareIntegration />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </ThreeColumnLayout>
  );
}
