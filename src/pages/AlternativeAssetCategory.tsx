import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  PieChart, 
  Globe, 
  Info, 
  ChevronRight, 
  DollarSign,
  Clock,
  TrendingUp,
  Building,
  ShieldCheck,
  Award,
  ArrowRight,
  ExternalLink,
  Calendar,
  FileText,
  BarChart3,
  PlusCircle,
  ChevronLeft,
  Briefcase,
  Heart,
  Target,
  Star,
  Filter,
  CalendarClock
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { InterestedButton } from "@/components/investments/InterestedButton";
import { ScheduleMeetingDialog } from "@/components/investments/ScheduleMeetingDialog";

const CATEGORY_DATA = {
  "private-equity": {
    name: "Private Equity",
    description: "Investment in companies not listed on a public exchange",
    icon: Briefcase,
    color: "text-purple-500",
    offerings: [
      {
        id: 1,
        name: "Growth Equity Fund III",
        description: "Late-stage growth equity investments in technology companies",
        minimumInvestment: "$250,000",
        performance: "+18.5% IRR",
        lockupPeriod: "7-10 years",
        firm: "Vista Equity Partners",
        tags: ["Technology", "Growth Stage", "North America"],
        strategy: {
          overview: "Focus on high-growth technology companies",
          approach: "Value-add operational improvements",
          target: "Enterprise software companies",
          stage: "Growth equity",
          geography: "North America",
          sectors: ["Enterprise Software", "FinTech", "Healthcare IT"],
          expectedReturn: "20-25% IRR",
          benchmarks: ["Cambridge US PE Index", "S&P 500"],
        }
      },
      // Additional offerings...
    ]
  },
  // Additional categories...
};

interface Strategy {
  overview: string;
  approach: string;
  target: string;
  stage: string;
  geography: string;
  sectors: string[];
  expectedReturn: string;
  benchmarks: string[];
}

interface Offering {
  id: number;
  name: string;
  description: string;
  minimumInvestment: string;
  performance: string;
  lockupPeriod: string;
  firm: string;
  tags: string[];
  strategy: Strategy;
  platform?: string;
  category?: string;
  investorQualification?: string;
  liquidity?: string;
  subscriptions?: string;
  lockUp?: string;
}

interface CategoryData {
  name: string;
  description: string;
  icon: any;
  color: string;
  offerings: Offering[];
}

const AlternativeAssetCategory = () => {
  const { category } = useParams<{ category: string }>();
  const [activeTab, setActiveTab] = useState("offerings");
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);

  useEffect(() => {
    if (category && CATEGORY_DATA[category as keyof typeof CATEGORY_DATA]) {
      setCategoryData(CATEGORY_DATA[category as keyof typeof CATEGORY_DATA]);
    }
  }, [category]);

  const renderOfferingCard = (offering: Offering) => (
    <Card key={offering.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-xl mb-1">{offering.name}</CardTitle>
            <CardDescription className="line-clamp-2">{offering.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {offering.tags.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Minimum</p>
            <p className="font-medium">{offering.minimumInvestment}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Performance</p>
            <p className="font-medium text-green-500">{offering.performance}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lock-up Period</p>
            <p className="font-medium">{offering.lockupPeriod}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Firm</p>
            <p className="font-medium">{offering.firm}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Info className="h-4 w-4" />
                Details
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/investments/alternative/${category}`}>
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                  <SheetTitle className="text-xl">{offering.name}</SheetTitle>
                </div>
                <SheetDescription>
                  {offering.description}
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6">
                <Tabs defaultValue="overview">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            Minimum Investment
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <p className="text-lg font-semibold">{offering.minimumInvestment}</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <p className="text-lg font-semibold text-green-500">{offering.performance}</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Lock-up Period
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <p className="text-lg font-semibold">{offering.lockUp}</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            Firm
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <p className="text-lg font-semibold">{offering.firm}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="pb-6">
                      <h3 className="text-lg font-bold mb-3 flex items-center">
                        <span className="mr-2"><Target className="h-4 w-4" /></span>
                        Investment Strategy
                      </h3>
                      <div className="bg-slate-100 dark:bg-slate-800/50 p-5 rounded-md">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <h4 className="text-sm font-medium text-blue-400 mb-2">Investment Approach</h4>
                          <p className="text-gray-300 leading-relaxed mb-4">{offering.strategy.overview}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/50">
                            <div className="bg-slate-800/30 p-3 rounded hover:bg-slate-800/40 transition-colors">
                              <h5 className="text-sm font-medium text-blue-400 mb-1">Focus Areas</h5>
                              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                                <li>{offering.strategy.approach}</li>
                                <li>{offering.strategy.target}</li>
                              </ul>
                            </div>
                            <div className="bg-slate-800/30 p-3 rounded hover:bg-slate-800/40 transition-colors">
                              <h5 className="text-sm font-medium text-blue-400 mb-1">Key Differentiators</h5>
                              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                                <li>{offering.strategy.stage}</li>
                                <li>{offering.strategy.geography}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4 pt-4">
                      <h3 className="text-lg font-medium">Investment Details</h3>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Platform</p>
                          <p className="font-medium">{offering.platform}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="font-medium">{offering.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Investor Qualification</p>
                          <p className="font-medium">{offering.investorQualification}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Liquidity</p>
                          <p className="font-medium">{offering.liquidity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Subscriptions</p>
                          <p className="font-medium">{offering.subscriptions}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Alert className="bg-blue-500/10 border-blue-500/30 text-foreground mt-6">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertTitle>Important Note</AlertTitle>
                      <AlertDescription className="text-sm">
                        Private investments are illiquid and intended for long-term investors. 
                        Please consult with your advisor before making any investment decisions.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex flex-col gap-3 pt-4">
                      <ScheduleMeetingDialog assetName={offering.name} />
                      <InterestedButton assetName={offering.name} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4 pt-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Investment Strategy</h3>
                        <div className="space-y-4">
                          <p className="text-sm">{offering.strategy.overview}</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Investment Approach</p>
                              <p className="text-sm text-muted-foreground">{offering.strategy.approach}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Target Companies</p>
                              <p className="text-sm text-muted-foreground">{offering.strategy.target}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Risk Factors</h3>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger>Investment Risk</AccordionTrigger>
                            <AccordionContent>
                              Risk of loss of capital due to poor investment performance or market conditions.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-2">
                            <AccordionTrigger>Liquidity Risk</AccordionTrigger>
                            <AccordionContent>
                              Limited ability to sell or transfer investment during the lock-up period.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-3">
                            <AccordionTrigger>Market Risk</AccordionTrigger>
                            <AccordionContent>
                              Changes in market conditions affecting investment value.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Terms & Conditions</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Management Fee</p>
                              <p className="text-sm text-muted-foreground">2% per annum</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Performance Fee</p>
                              <p className="text-sm text-muted-foreground">20% over hurdle rate</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Hurdle Rate</p>
                              <p className="text-sm text-muted-foreground">8% per annum</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Distribution Policy</p>
                              <p className="text-sm text-muted-foreground">Quarterly distributions</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documents" className="space-y-4 pt-4">
                    <div className="space-y-4">
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
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </SheetContent>
          </Sheet>
          <InterestedButton assetName={offering.name} />
        </div>
      </CardContent>
    </Card>
  );

  const renderCategoryOverview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>{categoryData?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#121a2c] rounded-lg">
              <h3 className="text-sm font-medium mb-2">Average Returns</h3>
              <div className="text-2xl font-bold text-green-500">+18.5%</div>
              <p className="text-xs text-muted-foreground mt-1">Past 3 years</p>
            </div>
            <div className="p-4 bg-[#121a2c] rounded-lg">
              <h3 className="text-sm font-medium mb-2">Total AUM</h3>
              <div className="text-2xl font-bold">$2.8B</div>
              <p className="text-xs text-muted-foreground mt-1">Across all offerings</p>
            </div>
            <div className="p-4 bg-[#121a2c] rounded-lg">
              <h3 className="text-sm font-medium mb-2">Active Investments</h3>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">Current offerings</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Key Characteristics</CardTitle>
          <CardDescription>Important features of this investment category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="mt-1">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Long-term Investment Horizon</h3>
                <p className="text-sm text-muted-foreground">
                  Typical investment periods of 5-10 years with limited liquidity
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Higher Return Potential</h3>
                <p className="text-sm text-muted-foreground">
                  Targeting returns above public market equivalents
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Investor Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  Limited to accredited and qualified purchasers
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <Globe className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Global Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Access to investments across different regions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOfferingsList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Available Offerings</h2>
          <p className="text-sm text-muted-foreground">Current investment opportunities</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryData?.offerings.map(renderOfferingCard)}
      </div>
    </div>
  );

  if (!categoryData) {
    return <div>Loading...</div>;
  }

  return (
    <ThreeColumnLayout activeMainItem="investments" title={categoryData.name}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/investments/alternative">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">{categoryData.name}</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="offerings">Offerings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            {renderCategoryOverview()}
          </TabsContent>
          
          <TabsContent value="offerings" className="mt-6">
            {renderOfferingsList()}
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default AlternativeAssetCategory;
