
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, FileText, DollarSign, TrendingUp, Clock, Building } from "lucide-react";
import { InterestedButton } from "@/components/investments/InterestedButton";
import { ScheduleMeetingDialog } from "@/components/investments/ScheduleMeetingDialog";
import { StrategySection } from "@/components/investments/StrategySection";

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
  lockUp: string;
  firm: string;
  tags: string[];
  strategy: Strategy;
  platform?: string;
  category?: string;
  investorQualification?: string;
  liquidity?: string;
  subscriptions?: string;
}

interface OfferingDetailsTabsProps {
  offering: Offering;
}

export const OfferingDetailsTabs: React.FC<OfferingDetailsTabsProps> = ({ offering }) => {
  return (
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
        
        <StrategySection strategy={offering.strategy} />
        
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
  );
};
