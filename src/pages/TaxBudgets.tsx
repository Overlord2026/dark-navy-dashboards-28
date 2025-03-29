import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { TaxPlanningSummary } from "@/components/dashboard/TaxPlanningSummary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Download, Upload, BarChart, Calculator, Clock, ArrowRight, HeartHandshake, BadgeDollarSign, BookCheck, Atom, Leaf, Users, PiggyBank, Landmark, AlarmClock, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

const TaxBudgets = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  
  const taxPlanningSubcategories = [
    { 
      id: "retirement",
      name: "Retirement Tax Planning", 
      description: "Strategies to minimize taxes during retirement",
      icon: <PiggyBank className="h-5 w-5" />
    },
    { 
      id: "preparation",
      name: "Tax Preparation & Filing Assistance", 
      description: "Professional help with tax return preparation and filing",
      icon: <BookCheck className="h-5 w-5" />
    },
    { 
      id: "business",
      name: "Business Tax Return Analysis", 
      description: "Comprehensive review of business tax returns",
      icon: <BadgeDollarSign className="h-5 w-5" />
    },
    { 
      id: "roth",
      name: "Roth IRA Conversion Analysis", 
      description: "Evaluation of traditional to Roth IRA conversion benefits",
      icon: <Atom className="h-5 w-5" />
    },
    { 
      id: "stock",
      name: "Highly Appreciated Stock", 
      description: "Tax-efficient strategies for appreciated securities",
      icon: <BarChart className="h-5 w-5" />
    },
    { 
      id: "gifting",
      name: "Family Gifting Strategies", 
      description: "Tax-efficient wealth transfer to family members",
      icon: <Users className="h-5 w-5" />
    },
    { 
      id: "charitable",
      name: "Magnify Charitable Gifting", 
      description: "Optimize tax benefits from charitable contributions",
      icon: <HeartHandshake className="h-5 w-5" />
    },
    { 
      id: "secure",
      name: "SECURE Act Impacts", 
      description: "Analysis of how the SECURE Act affects your retirement",
      icon: <Landmark className="h-5 w-5" />
    },
    { 
      id: "rmd",
      name: "RMD Tracking", 
      description: "Required Minimum Distribution monitoring and optimization",
      icon: <AlarmClock className="h-5 w-5" />
    },
    { 
      id: "traps",
      name: "Tax Traps Analysis", 
      description: "Identification and avoidance of potential tax pitfalls",
      icon: <AlertTriangle className="h-5 w-5" />
    }
  ];
  
  const taxSavingStrategies = [
    { 
      name: "Max Out 401(k)", 
      description: "Contribute the maximum to your 401(k) retirement plan", 
      potential: 5850,
      complexity: "Low",
      status: "In Progress"
    },
    { 
      name: "Tax-Loss Harvesting", 
      description: "Sell investments at a loss to offset capital gains", 
      potential: 3200,
      complexity: "Medium",
      status: "Not Started"
    },
    { 
      name: "Charitable Giving", 
      description: "Donate appreciated assets to qualified charities", 
      potential: 2400,
      complexity: "Medium",
      status: "Completed"
    },
    { 
      name: "HSA Contributions", 
      description: "Maximize Health Savings Account contributions", 
      potential: 1800,
      complexity: "Low",
      status: "In Progress"
    },
    { 
      name: "529 Plan Contributions", 
      description: "Contribute to 529 plans for education expenses", 
      potential: 1500,
      complexity: "Low",
      status: "Completed"
    }
  ];
  
  const upcomingDeadlines = [
    { date: "April 15, 2024", description: "Federal Tax Return Deadline", status: "Upcoming" },
    { date: "June 15, 2024", description: "Q2 Estimated Tax Payment Due", status: "Upcoming" },
    { date: "September 15, 2024", description: "Q3 Estimated Tax Payment Due", status: "Upcoming" },
    { date: "December 31, 2024", description: "Last day for tax-deductible donations", status: "Upcoming" },
    { date: "January 15, 2025", description: "Q4 Estimated Tax Payment Due", status: "Upcoming" }
  ];

  const renderSubcategoryContent = () => {
    if (!activeSubcategory) return null;
    
    const subcategory = taxPlanningSubcategories.find(s => s.id === activeSubcategory);
    if (!subcategory) return null;
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center">
            {subcategory.icon}
            <CardTitle className="ml-2">{subcategory.name}</CardTitle>
          </div>
          <CardDescription>{subcategory.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-[#121a2c] rounded-lg mb-6">
            <p className="text-blue-400">
              This is a personalized analysis based on your financial situation. Schedule a consultation with your advisor for a detailed discussion.
            </p>
          </div>
          
          <Button className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule a Consultation
          </Button>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <ThreeColumnLayout activeMainItem="tax-budgets" title="Proactive Tax Planning">
      <div className="animate-fade-in space-y-6">
        <h1 className="text-2xl font-semibold mb-6">Proactive Tax Planning</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Tax Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                Tax documents uploaded and processed
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Upload className="h-3.5 w-3.5 mr-2" />
                Upload Documents
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Next Review</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">April 15</div>
              <p className="text-xs text-muted-foreground">
                Scheduled tax strategy review with your advisor
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Schedule Review
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Tax Reports</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                Available tax reports for the current year
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Download className="h-3.5 w-3.5 mr-2" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-[#121a2c]/80 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tax Planning Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {taxPlanningSubcategories.map((category) => (
              <Button 
                key={category.id}
                variant={activeSubcategory === category.id ? "default" : "outline"} 
                className="h-auto py-3 justify-start"
                onClick={() => setActiveSubcategory(category.id)}
              >
                <div className="flex flex-col items-start text-left">
                  <span className="flex items-center">
                    {category.icon}
                    <span className="ml-2 font-medium">{category.name}</span>
                  </span>
                </div>
              </Button>
            ))}
          </div>
          
          {renderSubcategoryContent()}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="strategies">Tax Strategies</TabsTrigger>
            <TabsTrigger value="timeline">Tax Timeline</TabsTrigger>
            <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-6">
            <TaxPlanningSummary />
          </TabsContent>
          
          <TabsContent value="strategies" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Saving Strategies</CardTitle>
                <CardDescription>Personalized strategies to reduce your tax liability</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Strategy</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Potential Savings</TableHead>
                      <TableHead>Complexity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxSavingStrategies.map((strategy, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{strategy.name}</TableCell>
                        <TableCell>{strategy.description}</TableCell>
                        <TableCell>${strategy.potential.toLocaleString()}</TableCell>
                        <TableCell>{strategy.complexity}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            strategy.status === "Completed" 
                              ? "bg-green-500/20 text-green-500" 
                              : strategy.status === "In Progress"
                                ? "bg-amber-500/20 text-amber-500"
                                : "bg-blue-500/20 text-blue-500"
                          }`}>
                            {strategy.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Total Potential Tax Savings</h3>
                  <div className="p-4 bg-[#121a2c] rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span>Progress</span>
                      <span className="font-medium">
                        ${(5850 + 2400 + 1500).toLocaleString()} of ${taxSavingStrategies.reduce((sum, strat) => sum + strat.potential, 0).toLocaleString()}
                      </span>
                    </div>
                    <Progress value={65} className="h-2 bg-blue-500/20" indicatorClassName="bg-blue-500" />
                    <p className="text-sm text-muted-foreground mt-2">
                      You've implemented strategies that save $9,750 in taxes. Complete the remaining strategies to save an additional $5,000.
                    </p>
                  </div>
                </div>
                
                <Button className="mt-6 w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Schedule Tax Strategy Session
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Timeline</CardTitle>
                <CardDescription>Important tax dates and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingDeadlines.map((deadline, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{deadline.date}</TableCell>
                        <TableCell>{deadline.description}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs">
                            {deadline.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Clock className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-[#121a2c]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Historical Tax Filing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Year</TableHead>
                            <TableHead>Filed Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>2023</TableCell>
                            <TableCell>April 5, 2023</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs">
                                Completed
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>2022</TableCell>
                            <TableCell>April 12, 2022</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs">
                                Completed
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>2021</TableCell>
                            <TableCell>March 28, 2021</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs">
                                Completed
                              </span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#121a2c]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Quarterly Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Quarter</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Q1 2024</TableCell>
                            <TableCell>$12,850</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs">
                                Paid
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Q2 2024</TableCell>
                            <TableCell>$12,850</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs">
                                Upcoming
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Q3 2024</TableCell>
                            <TableCell>$12,850</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs">
                                Upcoming
                              </span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
                
                <Button className="mt-6 w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add Tax Events to Calendar
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calculator" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Calculator</CardTitle>
                <CardDescription>Estimate your tax liability with different scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-[#121a2c] rounded-lg mb-6">
                  <p className="text-amber-500 text-sm mb-2">
                    Note: This calculator provides estimates based on current tax laws and your financial situation.
                    For precise tax planning, consult with your tax advisor.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Current Year Tax Projection</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-[#121a2c] rounded-lg">
                        <p className="text-sm text-gray-400">Total Income</p>
                        <p className="text-xl font-semibold">$385,000</p>
                      </div>
                      <div className="p-4 bg-[#121a2c] rounded-lg">
                        <p className="text-sm text-gray-400">Estimated Deductions</p>
                        <p className="text-xl font-semibold">$48,500</p>
                      </div>
                      <div className="p-4 bg-[#121a2c] rounded-lg">
                        <p className="text-sm text-gray-400">Taxable Income</p>
                        <p className="text-xl font-semibold">$336,500</p>
                      </div>
                      <div className="p-4 bg-[#121a2c] rounded-lg">
                        <p className="text-sm text-gray-400">Estimated Tax</p>
                        <p className="text-xl font-semibold">$84,125</p>
                      </div>
                      <div className="p-4 bg-[#121a2c] rounded-lg">
                        <p className="text-sm text-gray-400">Effective Tax Rate</p>
                        <p className="text-xl font-semibold">21.85%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">With Optimized Tax Strategies</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-[#121a2c] rounded-lg">
                        <p className="text-sm text-gray-400">Total Income</p>
                        <p className="text-xl font-semibold">$385,000</p>
                      </div>
                      <div className="p-4 bg-[#121a2c] rounded-lg">
                        <p className="text-sm text-gray-400">Enhanced Deductions</p>
                        <p className="text-xl font-semibold">$72,750</p>
                        <p className="text-xs text-green-500 mt-1">+$24,250 from recommended strategies</p>
                      </div>
                      <div className="p-4 bg-[#121a2c] rounded-lg">
                        <p className="text-sm text-gray-400">Taxable Income</p>
                        <p className="text-xl font-semibold">$312,250</p>
                      </div>
                      <div className="p-4 bg-[#121a2c] rounded-lg">
                        <p className="text-sm text-gray-400">Estimated Tax</p>
                        <p className="text-xl font-semibold">$72,875</p>
                        <p className="text-xs text-green-500 mt-1">$11,250 in tax savings</p>
                      </div>
                      <div className="p-4 bg-[#121a2c] rounded-lg">
                        <p className="text-sm text-gray-400">Effective Tax Rate</p>
                        <p className="text-xl font-semibold">18.93%</p>
                        <p className="text-xs text-green-500 mt-1">2.92% reduction</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button className="mt-6 w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Run Custom Tax Scenario
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default TaxBudgets;
