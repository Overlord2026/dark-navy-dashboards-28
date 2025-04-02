
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, FileText, BookOpen, Clock, BarChart, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
            Stay ahead of tax changes and optimize your financial strategy with proactive tax planning.
          </p>
          
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="strategies">Tax Strategies</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="calendar">Tax Calendar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="mr-2 h-5 w-5 text-primary" />
                    Tax Planning Fundamentals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Proactive tax planning is about making strategic decisions throughout the year to minimize your tax 
                    burden legally and efficiently. Unlike tax preparation, which happens after the fact, tax planning 
                    allows you to take advantage of opportunities before tax season arrives.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2 flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-primary" />
                        Year-Round Approach
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Tax planning should be a continuous process, not just a year-end activity. Regular reviews help 
                        identify opportunities and avoid surprises.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2 flex items-center">
                        <BarChart className="mr-2 h-4 w-4 text-primary" />
                        Tax-Efficient Investing
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Learn how to structure your investments to minimize tax impact while maximizing returns 
                        through asset location and timing strategies.
                      </p>
                    </div>
                  </div>
                  
                  <Button className="mt-4">Schedule a Tax Planning Session</Button>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Tax-Loss Harvesting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Offset capital gains with strategic selling of underperforming investments.
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2">Learn more</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Retirement Contributions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Maximize tax-advantaged retirement accounts to reduce current tax liability.
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2">Learn more</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Income Shifting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Strategically time income and deductions to minimize tax brackets.
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2">Learn more</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="strategies" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Tax Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-lg mb-2">Charitable Giving Strategies</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Maximize the tax benefits of your charitable contributions through donor-advised 
                        funds, bunching, and qualified charitable distributions.
                      </p>
                      <Button variant="outline" size="sm">View Strategy Details</Button>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-lg mb-2">Estate and Gift Tax Planning</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Understand how to leverage annual gift tax exclusions, lifetime exemptions, 
                        and trusts to minimize estate taxes.
                      </p>
                      <Button variant="outline" size="sm">View Strategy Details</Button>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-lg mb-2">Business Entity Optimization</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Choose the right business structure (LLC, S-Corp, C-Corp) to optimize tax benefits 
                        for business owners.
                      </p>
                      <Button variant="outline" size="sm">View Strategy Details</Button>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-2">Tax Credits and Deductions</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Identify often-overlooked tax credits and deductions that apply to your specific situation.
                      </p>
                      <Button variant="outline" size="sm">View Strategy Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-primary" />
                      Educational Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                        <div>
                          <h4 className="font-medium">2024 Tax Planning Guide</h4>
                          <p className="text-sm text-muted-foreground">
                            Comprehensive overview of tax planning strategies for the current year.
                          </p>
                          <Button variant="link" className="p-0 h-auto mt-1">Download PDF</Button>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                        <div>
                          <h4 className="font-medium">Tax-Efficient Investing</h4>
                          <p className="text-sm text-muted-foreground">
                            Learn how to minimize taxes while maximizing investment returns.
                          </p>
                          <Button variant="link" className="p-0 h-auto mt-1">Download PDF</Button>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                        <div>
                          <h4 className="font-medium">Retirement Account Taxation</h4>
                          <p className="text-sm text-muted-foreground">
                            Guide to taxes for various retirement accounts and distribution strategies.
                          </p>
                          <Button variant="link" className="p-0 h-auto mt-1">Download PDF</Button>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CalendarDays className="mr-2 h-5 w-5 text-primary" />
                      Upcoming Webinars
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="border-b pb-3">
                        <h4 className="font-medium">Year-End Tax Planning Strategies</h4>
                        <p className="text-sm text-muted-foreground">October 15, 2024 • 1:00 PM EST</p>
                        <Button size="sm" className="mt-2">Register Now</Button>
                      </li>
                      
                      <li className="border-b pb-3">
                        <h4 className="font-medium">Tax-Efficient Estate Planning</h4>
                        <p className="text-sm text-muted-foreground">November 10, 2024 • 2:00 PM EST</p>
                        <Button size="sm" className="mt-2">Register Now</Button>
                      </li>
                      
                      <li>
                        <h4 className="font-medium">Preparing for Tax Season 2025</h4>
                        <p className="text-sm text-muted-foreground">December 5, 2024 • 1:00 PM EST</p>
                        <Button size="sm" className="mt-2">Register Now</Button>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>2024 Tax Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-lg mb-2">Q1 (January - March)</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Jan 16:</span>
                          <span className="text-sm text-muted-foreground">Q4 estimated tax payment due</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Jan 31:</span>
                          <span className="text-sm text-muted-foreground">W-2 and 1099 forms due to recipients</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Mar 15:</span>
                          <span className="text-sm text-muted-foreground">S-Corporation and partnership returns due</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-lg mb-2">Q2 (April - June)</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Apr 15:</span>
                          <span className="text-sm text-muted-foreground">Individual tax returns due</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Apr 15:</span>
                          <span className="text-sm text-muted-foreground">Q1 estimated tax payment due</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Jun 15:</span>
                          <span className="text-sm text-muted-foreground">Q2 estimated tax payment due</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-lg mb-2">Q3 (July - September)</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Sep 15:</span>
                          <span className="text-sm text-muted-foreground">Q3 estimated tax payment due</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Sep 15:</span>
                          <span className="text-sm text-muted-foreground">Extended S-Corporation and partnership returns due</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-2">Q4 (October - December)</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Oct 15:</span>
                          <span className="text-sm text-muted-foreground">Extended individual tax returns due</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Dec 31:</span>
                          <span className="text-sm text-muted-foreground">Last day for tax-loss harvesting and charitable contributions</span>
                        </li>
                      </ul>
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
