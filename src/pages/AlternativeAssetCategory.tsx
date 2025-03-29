
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { CategoryOverview } from "@/components/investments/CategoryOverview";
import { OfferingsList } from "@/components/investments/OfferingsList";

const CATEGORY_DATA = {
  "private-equity": {
    name: "Private Equity",
    description: "Investment in companies not listed on a public exchange",
    icon: "Briefcase",
    color: "text-purple-500",
    offerings: [
      {
        id: 1,
        name: "Growth Equity Fund III",
        description: "Late-stage growth equity investments in technology companies",
        minimumInvestment: "$250,000",
        performance: "+18.5% IRR",
        lockupPeriod: "7-10 years",
        lockUp: "7-10 years",
        firm: "Vista Equity Partners",
        tags: ["Technology", "Growth Stage", "North America"],
        platform: "CAIS",
        category: "Growth Equity",
        investorQualification: "Qualified Purchaser",
        liquidity: "Quarterly after 2-year lock-up",
        subscriptions: "Monthly",
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

interface CategoryData {
  name: string;
  description: string;
  icon: string;
  color: string;
  offerings: Offering[];
}

const AlternativeAssetCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [activeTab, setActiveTab] = useState("offerings");
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);

  useEffect(() => {
    if (categoryId && CATEGORY_DATA[categoryId as keyof typeof CATEGORY_DATA]) {
      setCategoryData(CATEGORY_DATA[categoryId as keyof typeof CATEGORY_DATA]);
    }
  }, [categoryId]);

  if (!categoryData) {
    return <div>Loading...</div>;
  }

  return (
    <ThreeColumnLayout activeMainItem="investments" title={categoryData.name}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/investments">
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
            <CategoryOverview name={categoryData.name} description={categoryData.description} />
          </TabsContent>
          
          <TabsContent value="offerings" className="mt-6">
            <OfferingsList offerings={categoryData.offerings} categoryId={categoryId || ""} />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default AlternativeAssetCategory;
