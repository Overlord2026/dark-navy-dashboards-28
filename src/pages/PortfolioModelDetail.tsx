
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  Download, 
  Briefcase, 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  AlertCircle, 
  CalendarClock,
  Shield,
  Clock,
  DollarSign,
  Building,
  FileText,
  BarChart,
  Users,
  Percent,
  BadgePercent
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ScheduleMeetingDialog } from "@/components/investments/ScheduleMeetingDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface HoldingInfo {
  name: string;
  ticker: string;
  weight: string;
  value: string;
  sectorExposure?: string;
  yearlyReturn?: string;
}

interface HistoricalReturn {
  year: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  annual: string;
}

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
  // Additional details for enhanced view
  launchDate?: string;
  managementFee?: string;
  minimumInvestment?: string;
  rebalancingFrequency?: string;
  benchmark?: string;
  holdingCount?: number;
  strategy?: string;
  riskScore?: number;
  suitableFor?: string[];
  taxEfficiency?: string;
  sectorAllocations?: Array<{sector: string, percentage: number, color: string}>;
  holdings?: HoldingInfo[];
  historicalReturns?: HistoricalReturn[];
  documents?: Array<{name: string, description: string, type: string}>;
  pros?: string[];
  cons?: string[];
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
    },
    launchDate: "January 15, 2020",
    managementFee: "0.35% annually",
    minimumInvestment: "$25,000",
    rebalancingFrequency: "Quarterly",
    benchmark: "Bloomberg US Aggregate Bond Index",
    holdingCount: 78,
    strategy: "This conservative strategy prioritizes preservation of capital and generation of income. It invests primarily in high-quality bonds, dividend-paying stocks, and money market instruments. The portfolio maintains a conservative asset allocation with approximately 70% in fixed income securities and 30% in equities, focusing on large-cap value stocks with strong dividend histories.",
    riskScore: 3,
    suitableFor: ["Retirees", "Conservative investors", "Income-focused investors", "Short-term (3-5 year) goals"],
    taxEfficiency: "Moderate - includes some tax-exempt municipal bonds",
    sectorAllocations: [
      {sector: "Fixed Income", percentage: 65, color: "blue-500"},
      {sector: "Dividend Equities", percentage: 25, color: "indigo-500"},
      {sector: "Real Estate", percentage: 5, color: "purple-500"},
      {sector: "Cash", percentage: 5, color: "green-500"}
    ],
    holdings: [
      {name: "Vanguard Total Bond Market ETF", ticker: "BND", weight: "18.5%", value: "$46,250"},
      {name: "iShares iBoxx Investment Grade", ticker: "LQD", weight: "15.2%", value: "$38,000"},
      {name: "Vanguard High Dividend Yield ETF", ticker: "VYM", weight: "12.0%", value: "$30,000"},
      {name: "Schwab U.S. REIT ETF", ticker: "SCHH", weight: "8.0%", value: "$20,000"},
      {name: "iShares TIPS Bond ETF", ticker: "TIP", weight: "7.5%", value: "$18,750"}
    ],
    historicalReturns: [
      {year: "2024", q1: "+2.1%", q2: "+1.8%", q3: "-", q4: "-", annual: "+3.9%"},
      {year: "2023", q1: "+3.2%", q2: "-0.7%", q3: "+2.5%", q4: "+1.9%", annual: "+7.0%"},
      {year: "2022", q1: "-2.1%", q2: "-1.5%", q3: "+0.8%", q4: "+1.2%", annual: "-1.6%"},
      {year: "2021", q1: "+4.7%", q2: "+3.2%", q3: "+2.9%", q4: "+3.5%", annual: "+15.0%"},
    ],
    documents: [
      {name: "Income Focus Prospectus", description: "Detailed investment information", type: "PDF"},
      {name: "Income Focus Fact Sheet", description: "Key statistics and performance", type: "PDF"},
      {name: "Dividend History", description: "Historical dividend payments", type: "Excel"},
      {name: "Investment Commentary", description: "Quarterly investment outlook", type: "PDF"}
    ],
    pros: [
      "Consistent income generation",
      "Lower volatility than growth-focused portfolios",
      "Historically stable during market downturns",
      "Low correlation with growth assets"
    ],
    cons: [
      "Lower long-term growth potential",
      "May underperform during bull markets",
      "Limited inflation protection",
      "Sensitive to interest rate changes"
    ]
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
    },
    launchDate: "March 5, 2019",
    managementFee: "0.40% annually",
    minimumInvestment: "$50,000",
    rebalancingFrequency: "Quarterly",
    benchmark: "60% S&P 500 / 40% Bloomberg US Aggregate Bond Index",
    holdingCount: 92,
    strategy: "This balanced strategy aims to provide a mix of capital growth and income. It maintains a moderate risk profile with approximately 60% in equities and 40% in fixed income securities. The equity portion focuses on quality companies with strong cash flows and growth potential, while the fixed income allocation provides stability and income.",
    riskScore: 5,
    suitableFor: ["Mid-career professionals", "Balanced investors", "Pre-retirees (5-10 years from retirement)", "Medium-term (5-7 year) goals"],
    taxEfficiency: "Moderate - includes some tax-managed strategies",
    sectorAllocations: [
      {sector: "US Equities", percentage: 45, color: "blue-500"},
      {sector: "International Equities", percentage: 15, color: "indigo-500"},
      {sector: "Fixed Income", percentage: 30, color: "purple-500"},
      {sector: "Real Estate", percentage: 5, color: "green-500"},
      {sector: "Cash", percentage: 5, color: "amber-500"}
    ],
    holdings: [
      {name: "Vanguard Total Stock Market ETF", ticker: "VTI", weight: "18.5%", value: "$46,250"},
      {name: "iShares Core MSCI EAFE ETF", ticker: "IEFA", weight: "12.0%", value: "$30,000"},
      {name: "Vanguard Total Bond Market ETF", ticker: "BND", weight: "10.5%", value: "$26,250"},
      {name: "Schwab U.S. REIT ETF", ticker: "SCHH", weight: "8.0%", value: "$20,000"},
      {name: "iShares TIPS Bond ETF", ticker: "TIP", weight: "7.5%", value: "$18,750"}
    ],
    historicalReturns: [
      {year: "2024", q1: "+3.2%", q2: "+2.1%", q3: "-", q4: "-", annual: "+5.3%"},
      {year: "2023", q1: "+4.5%", q2: "+1.8%", q3: "+3.2%", q4: "+2.7%", annual: "+12.8%"},
      {year: "2022", q1: "-4.2%", q2: "-3.5%", q3: "+2.1%", q4: "+2.8%", annual: "-3.1%"},
      {year: "2021", q1: "+5.8%", q2: "+4.7%", q3: "+3.5%", q4: "+4.2%", annual: "+19.3%"},
    ],
    documents: [
      {name: "Growth & Income Prospectus", description: "Detailed investment information", type: "PDF"},
      {name: "Growth & Income Fact Sheet", description: "Key statistics and performance", type: "PDF"},
      {name: "Asset Allocation Study", description: "Historical allocation analysis", type: "PDF"},
      {name: "Investment Commentary", description: "Quarterly investment outlook", type: "PDF"}
    ],
    pros: [
      "Balanced approach provides stability with growth potential",
      "Moderate income generation",
      "Diversification across asset classes",
      "Lower volatility than pure growth strategies"
    ],
    cons: [
      "May lag during strong bull markets",
      "Not fully protected against inflation",
      "Lower income than income-focused strategies",
      "May experience moderate drawdowns during market corrections"
    ]
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
    },
    launchDate: "April 10, 2018",
    managementFee: "0.50% annually",
    minimumInvestment: "$100,000",
    rebalancingFrequency: "Semi-Annually",
    benchmark: "MSCI World Growth Index",
    holdingCount: 65,
    strategy: "This aggressive growth strategy aims to maximize capital appreciation over the long term. It invests primarily in equities across global markets, with a focus on sectors and companies with high growth potential. The portfolio maintains an aggressive asset allocation with approximately 90% in equities and 10% in more tactical positions including some alternative investments.",
    riskScore: 8,
    suitableFor: ["Young investors", "High risk tolerance individuals", "Long-term (10+ year) investors", "Wealth accumulation phase"],
    taxEfficiency: "Low-to-moderate - higher turnover may generate capital gains",
    sectorAllocations: [
      {sector: "US Equities", percentage: 55, color: "blue-500"},
      {sector: "International Equities", percentage: 30, color: "indigo-500"},
      {sector: "Emerging Markets", percentage: 10, color: "purple-500"},
      {sector: "Cash & Alternatives", percentage: 5, color: "amber-500"}
    ],
    holdings: [
      {name: "Vanguard Growth ETF", ticker: "VUG", weight: "22.5%", value: "$56,250"},
      {name: "iShares MSCI EAFE Growth ETF", ticker: "EFG", weight: "15.0%", value: "$37,500"},
      {name: "Vanguard Information Technology ETF", ticker: "VGT", weight: "12.5%", value: "$31,250"},
      {name: "iShares Russell 1000 Growth ETF", ticker: "IWF", weight: "10.0%", value: "$25,000"},
      {name: "Vanguard Emerging Markets ETF", ticker: "VWO", weight: "8.5%", value: "$21,250"}
    ],
    historicalReturns: [
      {year: "2024", q1: "+5.8%", q2: "+3.2%", q3: "-", q4: "-", annual: "+9.2%"},
      {year: "2023", q1: "+7.5%", q2: "+2.8%", q3: "+5.2%", q4: "+4.7%", annual: "+21.8%"},
      {year: "2022", q1: "-8.2%", q2: "-7.5%", q3: "+4.1%", q4: "+5.8%", annual: "-6.7%"},
      {year: "2021", q1: "+8.8%", q2: "+7.7%", q3: "+6.5%", q4: "+7.2%", annual: "+33.9%"},
    ],
    documents: [
      {name: "Maximum Growth Prospectus", description: "Detailed investment information", type: "PDF"},
      {name: "Growth Strategy Fact Sheet", description: "Key statistics and performance", type: "PDF"},
      {name: "Sector Analysis", description: "Sector allocation and performance", type: "Excel"},
      {name: "Investment Commentary", description: "Quarterly investment outlook", type: "PDF"}
    ],
    pros: [
      "Highest long-term growth potential",
      "Exposure to innovative sectors and companies",
      "Global diversification across growth markets",
      "Strong historical performance in bull markets"
    ],
    cons: [
      "Highest volatility among all portfolios",
      "Significant drawdowns during market corrections",
      "Limited income generation",
      "Requires longer investment horizon to smooth out volatility"
    ]
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
  const [riskInfoExpanded, setRiskInfoExpanded] = useState(false);
  
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

  const handleInvest = () => {
    toast.success(`Starting investment process for ${portfolioModel!.name}`);
    // In a real implementation, this would navigate to an investment flow
  };

  const handleDownloadFactsheet = () => {
    toast.success(`Downloading fact sheet for ${portfolioModel!.name}`);
    // In a real implementation, this would trigger a download
  };

  const handleScheduleConsultation = () => {
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    toast.success("Opening scheduling calendar");
  };

  // Function to render the risk score visualization
  const renderRiskScore = () => {
    if (!portfolioModel.riskScore) return null;
    
    const score = portfolioModel.riskScore;
    const maxScore = 10;
    const percentage = (score / maxScore) * 100;
    
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Risk Score: {score}/10</span>
          <span 
            className="text-xs text-blue-600 cursor-pointer"
            onClick={() => setRiskInfoExpanded(!riskInfoExpanded)}
          >
            {riskInfoExpanded ? "Hide details" : "What is this?"}
          </span>
        </div>
        
        <Progress value={percentage} className="h-2" />
        
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Conservative</span>
          <span>Moderate</span>
          <span>Aggressive</span>
        </div>
        
        {riskInfoExpanded && (
          <div className="mt-3 p-3 bg-muted/20 rounded-md text-sm">
            <p className="mb-2 font-medium">Understanding Risk Score</p>
            <p className="text-xs text-muted-foreground">
              The risk score is a measure of the portfolio's overall risk level on a scale of 1-10.
              A higher score indicates greater potential volatility but also potentially higher returns.
              This portfolio's score of {score} suggests a {score <= 3 ? "conservative" : score <= 6 ? "moderate" : "aggressive"} risk profile.
            </p>
          </div>
        )}
      </div>
    );
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

                {portfolioModel.riskScore && renderRiskScore()}

                {portfolioModel.suitableFor && (
                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Suitable For</h3>
                    <div className="flex flex-wrap gap-2">
                      {portfolioModel.suitableFor.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 space-y-3">
                  <Button className="w-full" onClick={handleInvest}>
                    Invest in this Model
                  </Button>
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
                    <span className="font-medium">{portfolioModel.launchDate || "Jan 15, 2020"}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Minimum Investment:</span>
                    <span className="font-medium">{portfolioModel.minimumInvestment || "$25,000"}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Management Fee:</span>
                    <span className="font-medium">{portfolioModel.managementFee || "0.35% annually"}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rebalancing Frequency:</span>
                    <span className="font-medium">{portfolioModel.rebalancingFrequency || "Quarterly"}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Benchmark:</span>
                    <span className="font-medium">{portfolioModel.benchmark || "Blended Index"}</span>
                  </li>
                  {portfolioModel.holdingCount && (
                    <li className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Number of Holdings:</span>
                      <span className="font-medium">{portfolioModel.holdingCount}</span>
                    </li>
                  )}
                  {portfolioModel.taxEfficiency && (
                    <li className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax Efficiency:</span>
                      <span className="font-medium">{portfolioModel.taxEfficiency}</span>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
            
            {(portfolioModel.pros || portfolioModel.cons) && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pros & Cons</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  {portfolioModel.pros && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-emerald-600 mb-2">Advantages</h3>
                      <ul className="space-y-1">
                        {portfolioModel.pros.map((pro, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {portfolioModel.cons && (
                    <div>
                      <h3 className="text-sm font-medium text-red-600 mb-2">Considerations</h3>
                      <ul className="space-y-1">
                        {portfolioModel.cons.map((con, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="w-full md:w-2/3">
            <Tabs defaultValue="performance">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="performance" className="flex-1">Performance</TabsTrigger>
                <TabsTrigger value="holdings" className="flex-1">Holdings</TabsTrigger>
                <TabsTrigger value="allocation" className="flex-1">Allocation</TabsTrigger>
                <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
                <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
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
                          {portfolioModel.historicalReturns ? (
                            portfolioModel.historicalReturns.map((year, index) => (
                              <tr key={index} className={index === portfolioModel.historicalReturns!.length - 1 ? "" : "border-b"}>
                                <td className="py-2 font-medium">{year.year}</td>
                                <td className={`text-right py-2 ${year.q1.includes('+') ? 'text-emerald-500' : year.q1.includes('-') ? 'text-red-500' : 'text-muted-foreground'}`}>
                                  {year.q1}
                                </td>
                                <td className={`text-right py-2 ${year.q2.includes('+') ? 'text-emerald-500' : year.q2.includes('-') ? 'text-red-500' : 'text-muted-foreground'}`}>
                                  {year.q2}
                                </td>
                                <td className={`text-right py-2 ${year.q3.includes('+') ? 'text-emerald-500' : year.q3.includes('-') ? 'text-red-500' : 'text-muted-foreground'}`}>
                                  {year.q3}
                                </td>
                                <td className={`text-right py-2 ${year.q4.includes('+') ? 'text-emerald-500' : year.q4.includes('-') ? 'text-red-500' : 'text-muted-foreground'}`}>
                                  {year.q4}
                                </td>
                                <td className={`text-right py-2 font-medium ${year.annual.includes('+') ? 'text-emerald-500' : year.annual.includes('-') ? 'text-red-500' : 'text-muted-foreground'}`}>
                                  {year.annual}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <>
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
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                
                <Alert className="bg-blue-500/10 border-blue-500/30 text-foreground">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Investment Disclaimer</AlertTitle>
                  <AlertDescription className="text-sm">
                    Past performance is not indicative of future results. Investment returns and principal value will fluctuate so that an investor's shares, when redeemed, may be worth more or less than their original cost.
                  </AlertDescription>
                </Alert>
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
                            {portfolioModel.holdings ? (
                              portfolioModel.holdings.map((holding, index) => (
                                <tr key={index} className={index === portfolioModel.holdings!.length - 1 ? "" : "border-b"}>
                                  <td className="py-2 font-medium">{holding.name}</td>
                                  <td className="py-2">{holding.ticker}</td>
                                  <td className="text-right py-2">{holding.weight}</td>
                                  <td className="text-right py-2">{holding.value}</td>
                                </tr>
                              ))
                            ) : (
                              <>
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
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <Button variant="outline" className="w-full">View All Holdings</Button>
                    </div>
                  </CardContent>
                </Card>
                
                {portfolioModel.strategy && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Investment Strategy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{portfolioModel.strategy}</p>
                    </CardContent>
                  </Card>
                )}
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
                      {portfolioModel.sectorAllocations ? (
                        portfolioModel.sectorAllocations.map((sector, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full bg-${sector.color}`}></div>
                              <span className="text-sm">{sector.sector}</span>
                            </div>
                            <span className="font-medium">{sector.percentage}%</span>
                          </div>
                        ))
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Geographic Exposure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-center justify-center bg-muted/20 rounded-md mb-4">
                      <div className="text-center text-muted-foreground">
                        <Building className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Geographic exposure map would appear here</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-2 bg-muted/20 rounded">
                        <p className="text-xs text-muted-foreground mb-1">North America</p>
                        <p className="font-medium">65%</p>
                      </div>
                      <div className="text-center p-2 bg-muted/20 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Europe</p>
                        <p className="font-medium">20%</p>
                      </div>
                      <div className="text-center p-2 bg-muted/20 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Asia-Pacific</p>
                        <p className="font-medium">10%</p>
                      </div>
                      <div className="text-center p-2 bg-muted/20 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Emerging Markets</p>
                        <p className="font-medium">5%</p>
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
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Performance Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Comparative Performance vs Benchmark</h3>
                        <div className="h-40 flex items-center justify-center bg-muted/20 rounded-md">
                          <div className="text-center text-muted-foreground">
                            <LineChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Comparative performance chart would appear here</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Calendar Year Performance (%)</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 font-medium text-muted-foreground"></th>
                                <th className="text-right py-2 font-medium text-muted-foreground">2021</th>
                                <th className="text-right py-2 font-medium text-muted-foreground">2022</th>
                                <th className="text-right py-2 font-medium text-muted-foreground">2023</th>
                                <th className="text-right py-2 font-medium text-muted-foreground">YTD 2024</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="py-2 font-medium">{portfolioModel.name}</td>
                                <td className="text-right py-2 text-emerald-500">+15.0%</td>
                                <td className="text-right py-2 text-red-500">-1.6%</td>
                                <td className="text-right py-2 text-emerald-500">+7.0%</td>
                                <td className="text-right py-2 text-emerald-500">+3.9%</td>
                              </tr>
                              <tr>
                                <td className="py-2 font-medium">Benchmark</td>
                                <td className="text-right py-2 text-emerald-500">+13.2%</td>
                                <td className="text-right py-2 text-red-500">-2.1%</td>
                                <td className="text-right py-2 text-emerald-500">+6.5%</td>
                                <td className="text-right py-2 text-emerald-500">+3.6%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Portfolio Documents</CardTitle>
                    <CardDescription>Supporting documentation and resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portfolioModel.documents ? (
                        portfolioModel.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-sm text-muted-foreground">{doc.description}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Private Placement Memorandum</p>
                                <p className="text-sm text-muted-foreground">Detailed investment information</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Subscription Agreement</p>
                                <p className="text-sm text-muted-foreground">Investment documentation</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Due Diligence Report</p>
                                <p className="text-sm text-muted-foreground">Independent analysis</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Performance History</p>
                                <p className="text-sm text-muted-foreground">Historical returns</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Alert className="bg-amber-500/10 border-amber-500/30 text-foreground">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertTitle>Important Notice</AlertTitle>
                  <AlertDescription className="text-sm">
                    Please read all documents carefully before making any investment decisions. Consult with your financial advisor regarding the suitability of this model portfolio for your specific financial situation.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default PortfolioModelDetail;
