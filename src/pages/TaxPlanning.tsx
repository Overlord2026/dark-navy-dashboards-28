
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
import { useTaxPlanning } from "@/hooks/useTaxPlanning";

export default function TaxPlanning() {
  const { createConsultation } = useTaxPlanning();

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
        className="space-y-8 px-1 pb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Introductory header + description */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold tracking-tight">Tax Planning</h2>
          <p className="text-muted-foreground mt-2">
            Optimize your tax strategy and minimize your tax burden through proactive planning.
          </p>
        </motion.div>

        {/* Roth IRA Conversion */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-primary" />
                Roth IRA Conversion
              </CardTitle>
              <CardDescription>
                Understanding the process and benefits of converting traditional retirement assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    A Roth IRA conversion is the process of transferring retirement funds from a Traditional IRA, 401(k), 
                    or similar tax-deferred account into a Roth IRA. Unlike traditional retirement accounts where 
                    contributions are tax-deductible but withdrawals are taxed, Roth IRAs are funded with after-tax 
                    dollars but provide tax-free growth and qualified withdrawals.
                  </p>
                  <h4 className="font-medium mt-4 mb-2">Key Benefits:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
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
                      <div className="border rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-center mb-4">Roth Conversion Analysis Tool</h4>
                        <Button variant="outline" className="w-full flex items-center justify-center">
                          <Calculator className="mr-2 h-4 w-4" />
                          Open Roth Conversion Calculator
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
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

        {/* Secure Tax Return Analysis */}
        <motion.div variants={itemVariants}>
          <SecureTaxReturnAnalysis />
        </motion.div>

        {/* Advanced Tax Planning Strategies */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Advanced Tax Planning Strategies
              </CardTitle>
              <CardDescription>
                Strategic approaches to minimize your tax burden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">Income Strategies</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Income shifting to lower tax brackets</li>
                    <li>Capital gains harvesting</li>
                    <li>Qualified business income deductions</li>
                    <li>Timing of income recognition</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Deduction Strategies</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Itemization vs. standard deduction</li>
                    <li>Charitable contribution optimization</li>
                    <li>Business expense planning</li>
                    <li>Home office and property deductions</li>
                  </ul>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <div>
                  <h4 className="font-medium mb-3">Investment Strategies</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Tax-advantaged accounts utilization</li>
                    <li>Asset location optimization</li>
                    <li>Tax-loss harvesting techniques</li>
                    <li>Qualified Opportunity Zones</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Retirement Strategies</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Traditional vs. Roth conversions</li>
                    <li>Required minimum distribution planning</li>
                    <li>Social Security taxation management</li>
                    <li>SECURE Act implications</li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-center mt-6 space-x-3">
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
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Additional Tax Planning Services
              </CardTitle>
              <CardDescription>
                Specialized tax planning services to optimize your financial strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    Annual Tax Updates
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Stay informed about tax law changes and receive personalized annual tax planning recommendations.
                  </p>
                  <div className="mt-3">
                    <LearnMoreButton 
                      assetName="Annual Tax Updates" 
                      itemType="Tax Service"
                      pageContext="Tax Planning"
                      variant="ghost"
                      className="text-yellow-500 hover:text-yellow-600 p-0 h-auto font-medium flex items-center gap-1"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="h-4 w-4" />
                    </LearnMoreButton>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center">
                    <BarChart className="h-4 w-4 mr-2 text-primary" />
                    Multi-Year Projection
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Long-term tax planning with multi-year projections to optimize your tax situation over time.
                  </p>
                  <div className="mt-3">
                    <LearnMoreButton 
                      assetName="Multi-Year Tax Projection" 
                      itemType="Tax Service"
                      pageContext="Tax Planning"
                      variant="ghost"
                      className="text-yellow-500 hover:text-yellow-600 p-0 h-auto font-medium flex items-center gap-1"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="h-4 w-4" />
                    </LearnMoreButton>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center">
                    <Building className="h-4 w-4 mr-2 text-primary" />
                    State Residency Planning
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Strategic planning for state tax optimization, including residency changes and domicile considerations.
                  </p>
                  <div className="mt-3">
                    <LearnMoreButton 
                      assetName="State Residency Planning" 
                      itemType="Tax Service"
                      pageContext="Tax Planning"
                      variant="ghost"
                      className="text-yellow-500 hover:text-yellow-600 p-0 h-auto font-medium flex items-center gap-1"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="h-4 w-4" />
                    </LearnMoreButton>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <Badge variant="warning">Coming Soon</Badge>
            </div>
            <div className="opacity-60 pointer-events-none">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserSquare className="mr-2 h-5 w-5 text-primary" />
                    Tax Planning Professionals
                  </CardTitle>
                  <CardDescription>
                    Connect with certified tax professionals in our network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border shadow-sm">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">CPAs</CardTitle>
                        <CardDescription>Certified Public Accountants</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Experts in tax preparation, planning, and compliance who can handle complex tax situations.
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" size="sm" className="w-full">Find a CPA</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="border shadow-sm">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Tax Attorneys</CardTitle>
                        <CardDescription>Legal Tax Experts</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Specialized attorneys who can handle complex tax matters, disputes, and legal tax planning.
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" size="sm" className="w-full">Find a Tax Attorney</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="border shadow-sm">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Enrolled Agents</CardTitle>
                        <CardDescription>IRS-Certified Specialists</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Federally-licensed tax practitioners who can represent taxpayers before the IRS.
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" size="sm" className="w-full">Find an Enrolled Agent</Button>
                      </CardFooter>
                    </Card>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Button>View All Tax Professionals</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
