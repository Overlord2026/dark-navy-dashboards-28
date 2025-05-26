import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, Download, Briefcase, BarChart3, PieChart, LineChart, TrendingUp, AlertCircle, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ScheduleMeetingDialog } from "@/components/investments/ScheduleMeetingDialog";
import { InterestedButton } from "@/components/investments/InterestedButton";

interface PortfolioModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  returnRate: string;
  riskLevel: string;
  badge: {
    text: string;
    color: string;
  };
}

const portfolioModels: PortfolioModel[] = [
  {
    id: "income-focus",
    name: "Income Focus",
    provider: "Dimensional Fund Advisors",
    description: "Prioritizes stable income with lower volatility. This strategy focuses on high-quality fixed income and dividend-paying equities to provide consistent income with capital preservation.",
    returnRate: "+5.8%",
    riskLevel: "Low",
    badge: {
      text: "Conservative",
      color: "blue"
    }
  },
  {
    id: "growth-income",
    name: "Growth & Income",
    provider: "BlackRock",
    description: "Balance between growth and stable income. This balanced approach combines growth-oriented equities with income-producing assets to provide both capital appreciation and income generation.",
    returnRate: "+8.2%",
    riskLevel: "Medium",
    badge: {
      text: "Balanced",
      color: "indigo"
    }
  },
  {
    id: "maximum-growth",
    name: "Maximum Growth",
    provider: "Vanguard",
    description: "Focus on long-term capital appreciation. This aggressive strategy targets high-growth sectors and companies with strong potential for substantial long-term returns, suitable for investors with higher risk tolerance.",
    returnRate: "+12.5%",
    riskLevel: "High",
    badge: {
      text: "Aggressive",
      color: "purple"
    }
  },
  {
    id: "sustainable-future",
    name: "Sustainable Future",
    provider: "Alpha Architect",
    description: "ESG-focused investments with positive impact. This strategy prioritizes companies with strong environmental, social, and governance practices while seeking competitive financial returns.",
    returnRate: "+9.6%",
    riskLevel: "Medium",
    badge: {
      text: "ESG",
      color: "emerald"
    }
  },
  {
    id: "dynamic-allocation",
    name: "Dynamic Allocation",
    provider: "Boutique Family Office",
    description: "Active management with tactical shifts. This strategy employs a flexible approach, adjusting asset allocations based on market conditions and opportunities to optimize returns while managing risk.",
    returnRate: "+10.3%",
    riskLevel: "Medium-High",
    badge: {
      text: "Tactical",
      color: "amber"
    }
  },
  {
    id: "international-focus",
    name: "International Focus",
    provider: "BlackRock",
    description: "Diversified exposure to global markets. This strategy invests across international markets to capture growth opportunities worldwide while providing geographical diversification.",
    returnRate: "+7.8%",
    riskLevel: "Medium",
    badge: {
      text: "Global",
      color: "red"
    }
  },
];

const PortfolioModelDetail = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const navigate = useNavigate();
  
  const portfolioModel = portfolioModels.find(model => model.id === modelId);
  
  if (!portfolioModel) {
    return (
      <ThreeColumnLayout activeMainItem="investments" title="Portfolio Not Found">
        <div className="p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Portfolio Not Found</h2>
          <p className="text-muted-foreground mb-6">The portfolio model you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate('/investments')}>Return to Investments</Button>
        </div>
      </ThreeColumnLayout>
    );
  }

  const handleDownloadFactsheet = () => {
    toast.success(`Downloading fact sheet for ${portfolioModel!.name}`);
    // In a real implementation, this would trigger a download
  };

  const handleScheduleConsultation = () => {
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    toast.success("Opening scheduling calendar");
  };

  return (
    <ThreeColumnLayout activeMainItem="investments" title={`${portfolioModel!.name} | Model Portfolio`}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigate('/investments')} className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Back to Investments
          </Button>
          <Badge 
            className={`bg-${portfolioModel!.badge.color}-50 text-${portfolioModel!.badge.color}-700 dark:bg-${portfolioModel!.badge.color}-900 dark:text-${portfolioModel!.badge.color}-300 border-${portfolioModel!.badge.color}-200 dark:border-${portfolioModel!.badge.color}-800 py-1 px-3`}
          >
            {portfolioModel!.badge.text}
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">{portfolioModel!.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      Provided by {portfolioModel!.provider}
                    </CardDescription>
                  </div>
                  <Briefcase className="h-12 w-12 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <p className="text-sm">{portfolioModel!.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground">5-Year Return</h3>
                    <div className="text-xl font-bold text-emerald-500 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" /> {portfolioModel!.returnRate}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground">Risk Level</h3>
                    <div className="text-xl font-bold">{portfolioModel!.riskLevel}</div>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <InterestedButton assetName={portfolioModel!.name} />
                    <Button className="flex-1" variant="outline">
                      Let your advisor know you're interested
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleDownloadFactsheet}>
                    <Download className="h-4 w-4 mr-2" /> Download Fact Sheet
                  </Button>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleScheduleConsultation}>
                    <CalendarClock className="h-4 w-4" /> Schedule Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Key Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ul className="space-y-2">
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Inception Date:</span>
                    <span className="font-medium">Jan 15, 2020</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Minimum Investment:</span>
                    <span className="font-medium">$25,000</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Management Fee:</span>
                    <span className="font-medium">0.35% annually</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rebalancing Frequency:</span>
                    <span className="font-medium">Quarterly</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Benchmark:</span>
                    <span className="font-medium">Blended Index</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-2/3">
            <Tabs defaultValue="performance">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="performance" className="flex-1">Performance</TabsTrigger>
                <TabsTrigger value="holdings" className="flex-1">Holdings</TabsTrigger>
                <TabsTrigger value="allocation" className="flex-1">Allocation</TabsTrigger>
                <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-primary" />
                      Historical Performance
                    </CardTitle>
                    <CardDescription>Returns over different time periods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
                      <div className="text-center text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Performance chart visualization would appear here</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">1 Year</div>
                        <div className="text-lg font-bold text-emerald-500">+7.2%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">3 Year</div>
                        <div className="text-lg font-bold text-emerald-500">+24.5%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">5 Year</div>
                        <div className="text-lg font-bold text-emerald-500">{portfolioModel!.returnRate}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Since Inception</div>
                        <div className="text-lg font-bold text-emerald-500">+38.9%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Quarterly Returns (%)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium text-muted-foreground">Year</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Q1</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Q2</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Q3</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Q4</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Annual</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 font-medium">2024</td>
                            <td className="text-right py-2 text-emerald-500">+2.1%</td>
                            <td className="text-right py-2 text-emerald-500">+1.8%</td>
                            <td className="text-right py-2 text-muted-foreground">-</td>
                            <td className="text-right py-2 text-muted-foreground">-</td>
                            <td className="text-right py-2 font-medium text-emerald-500">+3.9%</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">2023</td>
                            <td className="text-right py-2 text-emerald-500">+3.2%</td>
                            <td className="text-right py-2 text-red-500">-0.7%</td>
                            <td className="text-right py-2 text-emerald-500">+2.5%</td>
                            <td className="text-right py-2 text-emerald-500">+1.9%</td>
                            <td className="text-right py-2 font-medium text-emerald-500">+7.0%</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">2022</td>
                            <td className="text-right py-2 text-red-500">-2.1%</td>
                            <td className="text-right py-2 text-red-500">-1.5%</td>
                            <td className="text-right py-2 text-emerald-500">+0.8%</td>
                            <td className="text-right py-2 text-emerald-500">+1.2%</td>
                            <td className="text-right py-2 font-medium text-red-500">-1.6%</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">2021</td>
                            <td className="text-right py-2 text-emerald-500">+4.7%</td>
                            <td className="text-right py-2 text-emerald-500">+3.2%</td>
                            <td className="text-right py-2 text-emerald-500">+2.9%</td>
                            <td className="text-right py-2 text-emerald-500">+3.5%</td>
                            <td className="text-right py-2 font-medium text-emerald-500">+15.0%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="holdings" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Top Holdings</CardTitle>
                    <CardDescription>Primary positions in this model portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 font-medium text-muted-foreground">Name</th>
                              <th className="text-left py-2 font-medium text-muted-foreground">Ticker</th>
                              <th className="text-right py-2 font-medium text-muted-foreground">Weight</th>
                              <th className="text-right py-2 font-medium text-muted-foreground">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2 font-medium">Vanguard Total Stock Market ETF</td>
                              <td className="py-2">VTI</td>
                              <td className="text-right py-2">18.5%</td>
                              <td className="text-right py-2">$46,250</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 font-medium">iShares Core MSCI EAFE ETF</td>
                              <td className="py-2">IEFA</td>
                              <td className="text-right py-2">12.0%</td>
                              <td className="text-right py-2">$30,000</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 font-medium">Vanguard Total Bond Market ETF</td>
                              <td className="py-2">BND</td>
                              <td className="text-right py-2">10.5%</td>
                              <td className="text-right py-2">$26,250</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 font-medium">Schwab U.S. REIT ETF</td>
                              <td className="py-2">SCHH</td>
                              <td className="text-right py-2">8.0%</td>
                              <td className="text-right py-2">$20,000</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-medium">iShares TIPS Bond ETF</td>
                              <td className="py-2">TIP</td>
                              <td className="text-right py-2">7.5%</td>
                              <td className="text-right py-2">$18,750</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <Button variant="outline" className="w-full">View All Holdings</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="allocation" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Asset Allocation
                    </CardTitle>
                    <CardDescription>Distribution across asset classes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
                      <div className="text-center text-muted-foreground">
                        <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Asset allocation chart would appear here</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">US Equities</span>
                        </div>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                          <span className="text-sm">International Equities</span>
                        </div>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-sm">Fixed Income</span>
                        </div>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">Real Estate</span>
                        </div>
                        <span className="font-medium">8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <span className="text-sm">Cash & Equivalents</span>
                        </div>
                        <span className="font-medium">2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Risk Metrics</CardTitle>
                    <CardDescription>Statistical measures of risk and return</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Sharpe Ratio (3Y)</h3>
                        <div className="text-2xl font-bold">1.24</div>
                        <p className="text-xs text-muted-foreground mt-1">Risk-adjusted return</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Standard Deviation</h3>
                        <div className="text-2xl font-bold">9.2%</div>
                        <p className="text-xs text-muted-foreground mt-1">Volatility measure</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Beta (vs S&P 500)</h3>
                        <div className="text-2xl font-bold">0.85</div>
                        <p className="text-xs text-muted-foreground mt-1">Market sensitivity</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Alpha (3Y)</h3>
                        <div className="text-2xl font-bold text-emerald-500">1.8%</div>
                        <p className="text-xs text-muted-foreground mt-1">Excess return</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Maximum Drawdown</h3>
                        <div className="text-2xl font-bold text-red-500">-14.3%</div>
                        <p className="text-xs text-muted-foreground mt-1">Largest peak-to-trough decline</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Sortino Ratio</h3>
                        <div className="text-2xl font-bold">1.68</div>
                        <p className="text-xs text-muted-foreground mt-1">Downside risk-adjusted return</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default PortfolioModelDetail;
