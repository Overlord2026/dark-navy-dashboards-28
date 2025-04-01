import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ChevronRight, Briefcase, BarChart3, ArrowUpRight, ShieldCheck } from "lucide-react";
import { IntelligentAllocationTab } from "@/components/investments/IntelligentAllocationTab";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Investments = () => {
  return (
    <ThreeColumnLayout activeMainItem="investments" title="Investments">
      <div className="space-y-8">
        <Tabs defaultValue="private-market" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="private-market" className="flex-1">Private Market Alpha</TabsTrigger>
            <TabsTrigger value="model-portfolios" className="flex-1">Model Portfolios</TabsTrigger>
            <TabsTrigger value="intelligent" className="flex-1">Intelligent Allocation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="private-market" className="space-y-8">
            {/* Private Market Alpha Section (previously Alternative Assets) */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Private Market Alpha</h2>
                <Button variant="outline" asChild className="flex items-center gap-1">
                  <Link to="/investments/alternative/all">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground text-sm">Total Private Market Value</div>
                    <div className="text-3xl font-bold">$580,000</div>
                    <div className="text-emerald-500 text-sm">↑ 12.7% from last year</div>
                  </div>
                </div>
                
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground text-sm">Average Performance</div>
                    <div className="text-3xl font-bold text-emerald-500">+10.9%</div>
                    <div className="text-muted-foreground text-sm">Annualized returns</div>
                  </div>
                </div>
                
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground text-sm">Risk Assessment</div>
                    <div className="text-3xl font-bold">Medium-High</div>
                    <div className="text-muted-foreground text-sm">Overall portfolio risk level</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Private Market Categories</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link to="/investments/alternative/private-equity" className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500">
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 3V21" stroke="currentColor" strokeWidth="2" />
                          <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className="text-emerald-500">+12.4% YTD</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Private Equity</h4>
                        <p className="text-muted-foreground text-sm mt-1">Investments in non-public companies, buyouts, growth</p>
                      </div>
                      <div className="flex justify-end">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/investments/alternative/private-debt" className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                          <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M7 6V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M17 6V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M7 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M7 16H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-emerald-500">+8.7% YTD</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Private Debt</h4>
                        <p className="text-muted-foreground text-sm mt-1">Direct lending, mezzanine financing, distressed debt</p>
                      </div>
                      <div className="flex justify-end">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/investments/alternative/digital-assets" className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
                          <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className="text-red-500">-8.7% YTD</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Digital Assets</h4>
                        <p className="text-muted-foreground text-sm mt-1">Cryptocurrencies, NFTs, blockchain investments</p>
                      </div>
                      <div className="flex justify-end">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/investments/alternative/real-assets" className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500">
                          <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M5 21V7L13 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M19 21V10L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 9V9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 12V12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 15V15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-emerald-500">+9.1% YTD</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Real Assets</h4>
                        <p className="text-muted-foreground text-sm mt-1">Real estate, infrastructure, commodities</p>
                      </div>
                      <div className="flex justify-end">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* New Model Portfolios Tab */}
          <TabsContent value="model-portfolios" className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Model Portfolios</h2>
                <Button variant="outline" onClick={() => toast.info("Exploring all model portfolios")} className="flex items-center gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground text-sm">Portfolios Available</div>
                    <div className="text-3xl font-bold">12</div>
                    <div className="text-muted-foreground text-sm">Strategically designed allocations</div>
                  </div>
                </div>
                
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground text-sm">Historical Performance</div>
                    <div className="text-3xl font-bold text-emerald-500">+8.7%</div>
                    <div className="text-muted-foreground text-sm">Average 5-year return</div>
                  </div>
                </div>
                
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground text-sm">Customization Options</div>
                    <div className="text-3xl font-bold">6</div>
                    <div className="text-muted-foreground text-sm">Risk profiles to choose from</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Featured Model Portfolios</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 cursor-pointer">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <Briefcase className="h-10 w-10 text-blue-500" />
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                          Conservative
                        </Badge>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Income Focus</h4>
                        <p className="text-muted-foreground text-sm mt-1">Prioritizes stable income with lower volatility</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <p className="text-muted-foreground">Return (5Y)</p>
                          <p className="font-medium text-emerald-500">+5.8%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Risk Level</p>
                          <p className="font-medium">Low</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-2">View Details</Button>
                    </div>
                  </div>
                  
                  <div className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 cursor-pointer">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <BarChart3 className="h-10 w-10 text-indigo-500" />
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                          Balanced
                        </Badge>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Growth & Income</h4>
                        <p className="text-muted-foreground text-sm mt-1">Balance between growth and stable income</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <p className="text-muted-foreground">Return (5Y)</p>
                          <p className="font-medium text-emerald-500">+8.2%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Risk Level</p>
                          <p className="font-medium">Medium</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-2">View Details</Button>
                    </div>
                  </div>
                  
                  <div className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 cursor-pointer">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <ArrowUpRight className="h-10 w-10 text-purple-500" />
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                          Aggressive
                        </Badge>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Maximum Growth</h4>
                        <p className="text-muted-foreground text-sm mt-1">Focus on long-term capital appreciation</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <p className="text-muted-foreground">Return (5Y)</p>
                          <p className="font-medium text-emerald-500">+12.5%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Risk Level</p>
                          <p className="font-medium">High</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-2">View Details</Button>
                    </div>
                  </div>
                  
                  <div className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 cursor-pointer">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <ShieldCheck className="h-10 w-10 text-emerald-500" />
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                          ESG
                        </Badge>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Sustainable Future</h4>
                        <p className="text-muted-foreground text-sm mt-1">ESG-focused investments with positive impact</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <p className="text-muted-foreground">Return (5Y)</p>
                          <p className="font-medium text-emerald-500">+9.6%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Risk Level</p>
                          <p className="font-medium">Medium</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-2">View Details</Button>
                    </div>
                  </div>
                  
                  <div className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 cursor-pointer">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
                          <path d="M12 3V4M12 20V21M21 12H20M4 12H3M18.364 18.364L17.657 17.657M6.343 6.343L5.636 5.636M18.364 5.636L17.657 6.343M6.343 17.657L5.636 18.364M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                          Tactical
                        </Badge>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Dynamic Allocation</h4>
                        <p className="text-muted-foreground text-sm mt-1">Active management with tactical shifts</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <p className="text-muted-foreground">Return (5Y)</p>
                          <p className="font-medium text-emerald-500">+10.3%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Risk Level</p>
                          <p className="font-medium">Medium-High</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-2">View Details</Button>
                    </div>
                  </div>
                  
                  <div className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 cursor-pointer">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                          <path d="M8.5 14.5L15.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M7 10L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M14 17L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800">
                          Global
                        </Badge>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">International Focus</h4>
                        <p className="text-muted-foreground text-sm mt-1">Diversified exposure to global markets</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <p className="text-muted-foreground">Return (5Y)</p>
                          <p className="font-medium text-emerald-500">+7.8%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Risk Level</p>
                          <p className="font-medium">Medium</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-2">View Details</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-medium mb-4">Portfolio Builder</h3>
                <div className="bg-card border rounded-lg p-6">
                  <p className="text-muted-foreground mb-4">Create a customized model portfolio based on your risk tolerance and investment goals.</p>
                  <Button className="w-full sm:w-auto">Start Building</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="intelligent">
            <IntelligentAllocationTab />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default Investments;
