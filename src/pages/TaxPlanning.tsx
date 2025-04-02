import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  FileText, 
  Calculator, 
  BookOpen, 
  BarChart, 
  PiggyBank, 
  ExternalLink,
  ArrowRight,
  HeartIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { InterestedButton } from "@/components/investments/InterestedButton";
import { ScheduleMeetingDialog } from "@/components/investments/ScheduleMeetingDialog";
import { Link } from "react-router-dom";

export default function TaxPlanning() {
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
      title="Proactive Tax Planning" 
      activeMainItem="education"
    >
      <motion.div
        className="space-y-6 px-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold tracking-tight">Proactive Tax Planning</h2>
          <p className="text-muted-foreground mt-2">
            Optimize your tax strategy and minimize your tax burden through proactive planning.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
              <TabsTrigger value="roth-conversion">Roth Conversion</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="calendar">Tax Calendar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="mr-2 h-5 w-5 text-primary" />
                      Why Tax Planning Matters
                    </CardTitle>
                    <CardDescription>
                      Understanding the importance of proactive tax strategy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Tax planning is not just about filing returns correctly, but about implementing strategies year-round to minimize tax liability and maximize wealth retention. Proactive tax planning can lead to significant savings and help you achieve your financial goals faster.
                    </p>
                    <Button className="mt-4" variant="outline">Learn More</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PiggyBank className="mr-2 h-5 w-5 text-primary" />
                      Key Tax Planning Areas
                    </CardTitle>
                    <CardDescription>
                      Focus areas for effective tax optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Income timing and character</li>
                      <li>Deduction and credit maximization</li>
                      <li>Investment tax efficiency</li>
                      <li>Retirement account optimization</li>
                      <li>Estate and gift tax planning</li>
                      <li>Business entity structuring</li>
                    </ul>
                    <Button className="mt-4" variant="outline">Explore Areas</Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart className="mr-2 h-5 w-5 text-primary" />
                      Your Tax Planning Journey
                    </CardTitle>
                    <CardDescription>
                      A personalized roadmap to tax efficiency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Our approach to tax planning is tailored to your specific financial situation and goals. We'll help you develop a comprehensive tax strategy that adapts to changing tax laws and your evolving financial circumstances.
                      </p>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium text-center">Assessment</h4>
                          <p className="text-xs text-center text-muted-foreground mt-2">
                            Evaluate your current tax situation and identify opportunities
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium text-center">Strategy</h4>
                          <p className="text-xs text-center text-muted-foreground mt-2">
                            Develop customized tax planning strategies
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium text-center">Implementation</h4>
                          <p className="text-xs text-center text-muted-foreground mt-2">
                            Execute tax optimization techniques with ongoing review
                          </p>
                        </div>
                      </div>
                      <Button className="w-full mt-2">Begin Tax Assessment</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="strategies" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Income Strategies</CardTitle>
                    <CardDescription>Techniques to optimize income taxation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Income shifting to lower tax brackets</li>
                      <li>Capital gains harvesting</li>
                      <li>Qualified business income deductions</li>
                      <li>Timing of income recognition</li>
                    </ul>
                    <Button className="mt-4" variant="outline">Learn More</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Deduction Strategies</CardTitle>
                    <CardDescription>Methods to maximize tax deductions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Itemization vs. standard deduction</li>
                      <li>Charitable contribution optimization</li>
                      <li>Business expense planning</li>
                      <li>Home office and property deductions</li>
                    </ul>
                    <Button className="mt-4" variant="outline">Learn More</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Investment Strategies</CardTitle>
                    <CardDescription>Tax-efficient investment approaches</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Tax-advantaged accounts utilization</li>
                      <li>Asset location optimization</li>
                      <li>Tax-loss harvesting techniques</li>
                      <li>Qualified Opportunity Zones</li>
                    </ul>
                    <Button className="mt-4" variant="outline">Learn More</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Retirement Strategies</CardTitle>
                    <CardDescription>Maximizing retirement tax benefits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Traditional vs. Roth conversions</li>
                      <li>Required minimum distribution planning</li>
                      <li>Social Security taxation management</li>
                      <li>SECURE Act implications</li>
                    </ul>
                    <Button className="mt-4" variant="outline">Learn More</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="roth-conversion" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="mr-2 h-5 w-5 text-primary" />
                      What is a Roth IRA Conversion?
                    </CardTitle>
                    <CardDescription>
                      Understanding the process and benefits of converting traditional retirement assets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                    <h4 className="font-medium mt-4 mb-2">Considerations:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      <li>Converted amounts are taxable in the year of conversion</li>
                      <li>May push you into a higher tax bracket</li>
                      <li>Ideal when you have funds to pay the tax without using retirement assets</li>
                      <li>5-year rule applies before tax-free withdrawals of converted amounts</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="mr-2 h-5 w-5 text-primary" />
                      Roth Conversion Calculator
                    </CardTitle>
                    <CardDescription>
                      Estimate the potential benefits and tax implications of a Roth conversion
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Our Roth Conversion Calculator helps you analyze the potential long-term benefits 
                      against the immediate tax costs. Enter a few details about your situation to get 
                      a preliminary analysis.
                    </p>
                    <div className="border rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-center mb-4">Roth Conversion Analysis Tool</h4>
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <Calculator className="mr-2 h-4 w-4" />
                        Open Roth Conversion Calculator
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-3 pt-0">
                    <InterestedButton assetName="Roth IRA Conversion" />
                    <ScheduleMeetingDialog assetName="Roth IRA Conversion" />
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-primary" />
                      Educational Resources
                    </CardTitle>
                    <CardDescription>
                      Learn more about Roth conversions through our curated resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium">Internal Courses</h4>
                        <ul className="mt-2 space-y-3 text-sm">
                          <li>
                            <Link to="/education?category=retirement" className="flex items-center text-primary hover:underline">
                              <ArrowRight className="h-3 w-3 mr-1" />
                              Roth IRA Fundamentals
                            </Link>
                          </li>
                          <li>
                            <Link to="/education?category=tax-planning" className="flex items-center text-primary hover:underline">
                              <ArrowRight className="h-3 w-3 mr-1" />
                              Tax-Efficient Retirement Planning
                            </Link>
                          </li>
                          <li>
                            <Link to="/education?category=tax-planning" className="flex items-center text-primary hover:underline">
                              <ArrowRight className="h-3 w-3 mr-1" />
                              Advanced Roth Conversion Strategies
                            </Link>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium">External Resources</h4>
                        <ul className="mt-2 space-y-3 text-sm">
                          <li>
                            <a href="https://www.irs.gov/retirement-plans/roth-iras" target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              IRS: Roth IRA Guidelines
                            </a>
                          </li>
                          <li>
                            <a href="https://www.investopedia.com/roth-ira-conversion-4770973" target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Investopedia: Roth Conversions
                            </a>
                          </li>
                          <li>
                            <a href="https://www.fidelity.com/viewpoints/retirement/convert-to-roth" target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Fidelity: Converting to a Roth IRA
                            </a>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium">Free Downloads</h4>
                        <ul className="mt-2 space-y-3 text-sm">
                          <li>
                            <Button variant="link" className="h-auto p-0 flex items-center text-primary hover:underline">
                              <FileText className="h-3 w-3 mr-1" />
                              Roth Conversion Checklist
                            </Button>
                          </li>
                          <li>
                            <Button variant="link" className="h-auto p-0 flex items-center text-primary hover:underline">
                              <FileText className="h-3 w-3 mr-1" />
                              Tax Bracket Strategy Guide
                            </Button>
                          </li>
                          <li>
                            <Button variant="link" className="h-auto p-0 flex items-center text-primary hover:underline">
                              <FileText className="h-3 w-3 mr-1" />
                              Roth vs. Traditional Comparison
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-primary" />
                      Tax Guides
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <h4 className="font-medium">Complete Tax Planning Guide</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Comprehensive overview of tax optimization strategies
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-1">Download PDF</Button>
                      </div>
                      <div className="border-b pb-3">
                        <h4 className="font-medium">Tax-Loss Harvesting Guide</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          How to optimize investment losses for tax benefits
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-1">Download PDF</Button>
                      </div>
                      <div>
                        <h4 className="font-medium">Retirement Tax Strategies</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Tax-efficient retirement planning techniques
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-1">Download PDF</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      Tax Forms & Worksheets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <h4 className="font-medium">Tax Planning Worksheet</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Fillable worksheet to organize your tax planning
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-1">Download</Button>
                      </div>
                      <div className="border-b pb-3">
                        <h4 className="font-medium">Charitable Giving Tracker</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Track your charitable contributions for tax purposes
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-1">Download</Button>
                      </div>
                      <div>
                        <h4 className="font-medium">Business Expense Log</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Template for tracking deductible business expenses
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-1">Download</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="mr-2 h-5 w-5 text-primary" />
                      Tax Calculators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <h4 className="font-medium">Income Tax Estimator</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Estimate your annual tax liability
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-1">Open Calculator</Button>
                      </div>
                      <div className="border-b pb-3">
                        <h4 className="font-medium">Capital Gains Calculator</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Calculate tax impact of investment sales
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-1">Open Calculator</Button>
                      </div>
                      <div>
                        <h4 className="font-medium">Roth Conversion Calculator</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Analyze the tax impact of Roth conversions
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-1">Open Calculator</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    2023 Tax Calendar
                  </CardTitle>
                  <CardDescription>
                    Key tax dates and deadlines to remember
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium">Q1 (Jan-Mar)</h4>
                        <ul className="mt-2 space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Jan 15</span>
                            <span className="text-muted-foreground">Q4 Estimated Tax</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Jan 31</span>
                            <span className="text-muted-foreground">W-2 & 1099 Deadline</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Mar 15</span>
                            <span className="text-muted-foreground">S-Corp/Partnership Returns</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium">Q2 (Apr-Jun)</h4>
                        <ul className="mt-2 space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Apr 15</span>
                            <span className="text-muted-foreground">Individual Tax Deadline</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Apr 15</span>
                            <span className="text-muted-foreground">Q1 Estimated Tax</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Jun 15</span>
                            <span className="text-muted-foreground">Q2 Estimated Tax</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium">Q3 (Jul-Sep)</h4>
                        <ul className="mt-2 space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Sep 15</span>
                            <span className="text-muted-foreground">Q3 Estimated Tax</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Sep 15</span>
                            <span className="text-muted-foreground">Extended Partnership Returns</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Sep 30</span>
                            <span className="text-muted-foreground">Trust Returns Due</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium">Q4 (Oct-Dec)</h4>
                        <ul className="mt-2 space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Oct 15</span>
                            <span className="text-muted-foreground">Extended Individual Returns</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Dec 31</span>
                            <span className="text-muted-foreground">Last Day for Tax Moves</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4 md:col-span-2">
                        <h4 className="font-medium">Year-End Tax Planning</h4>
                        <p className="text-sm text-muted-foreground mt-2">
                          December is the last opportunity to implement many tax-saving strategies for the current year. 
                          Schedule your year-end tax planning session at least 45 days before December 31st.
                        </p>
                        <Button className="mt-3" size="sm">Schedule Review</Button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        Download Complete Tax Calendar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </ThreeColumnLayout>
  );
}
