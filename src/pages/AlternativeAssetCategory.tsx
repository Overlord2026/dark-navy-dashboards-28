
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { CategoryOverview } from "@/components/investments/CategoryOverview";
import { OfferingsList } from "@/components/investments/OfferingsList";

// Updated database of offerings for each category
const CATEGORY_DATA = {
  "private-equity": {
    name: "Private Equity",
    description: "Investment in companies not listed on a public exchange, aiming for substantial long-term returns through active management and eventual sale or public offering.",
    icon: "Briefcase",
    color: "text-purple-500",
    offerings: [
      {
        id: 1,
        name: "AMG Pantheon Fund, LLC",
        description: "Provides Accredited Investors unique exposure to a diversified private equity portfolio assembled by Pantheon's Global Investment Team. The Fund offers differentiated private equity solutions.",
        minimumInvestment: "$25,000",
        performance: "+15.7% IRR",
        lockupPeriod: "Quarterly liquidity",
        lockUp: "Quarterly liquidity",
        firm: "AMG Funds",
        tags: ["Private Equity", "Multi-Strategy", "Accredited Investor"],
        platform: "CAIS",
        category: "Multi-Strategy",
        investorQualification: "Accredited Investor",
        liquidity: "Quarterly",
        subscriptions: "Monthly",
        strategy: {
          overview: "Diversified private equity portfolio",
          approach: "Multi-manager approach",
          target: "Various private equity strategies",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      },
      {
        id: 2,
        name: "Arcs Private Markets Fund",
        description: "The Fund seeks to build a diversified private equity investment solution that aims to deliver attractive, long-term capital appreciation. The Fund's differentiated solution provides access to a diversified portfolio of private companies through a professional investment team with the oversight of an experienced manager and investment firm.",
        minimumInvestment: "$25,000",
        performance: "+18.2% IRR",
        lockupPeriod: "Semi-annual liquidity",
        lockUp: "Semi-annual liquidity",
        firm: "Arcs",
        tags: ["Private Equity", "Secondaries", "Non-Accredited"],
        platform: "Arcs",
        category: "Diversified",
        investorQualification: "Non-Accredited",
        liquidity: "Semi-annual",
        subscriptions: "Monthly",
        strategy: {
          overview: "Diversified private equity investment solution",
          approach: "Multi-manager approach",
          target: "Private companies across stages",
          stage: "Various",
          geography: "North America, Europe",
          sectors: ["Diversified"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      },
      {
        id: 3,
        name: "Blackstone Private Equity Strategies Fund, (TE) L.P. ("BXPE Tax Exempt")",
        description: "BXPE seeks to provide institutional-quality exposure to Blackstone's private equity platform designed for tax-exempt investors such as IRAs, 401(k)s and other retirement accounts. Access to Blackstone's private capital platform with $300+ billion in AUM.",
        minimumInvestment: "$10,000",
        performance: "+17.5% IRR",
        lockupPeriod: "Quarterly after 2-year lock-up",
        lockUp: "2-year initial, then quarterly",
        firm: "Blackstone",
        tags: ["Private Equity", "Buyout & Growth Equity", "Qualified Purchaser"],
        platform: "CAIS",
        category: "Buyout & Growth",
        investorQualification: "Qualified Purchaser",
        liquidity: "Quarterly after 2-year lock-up",
        subscriptions: "Monthly",
        strategy: {
          overview: "Institutional-quality exposure to Blackstone's private equity platform",
          approach: "Multi-manager approach",
          target: "Buyout and growth equity investments",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      },
      {
        id: 4,
        name: "CAIS Vista Foundation Fund V, L.P.",
        description: "Vista Foundation Fund V, L.P. ("the Partnership", the "Fund" or "VFF V") was formed by Vista Equity Partners Management, LLC (and, when the context requires, together with its affiliates, "Vista" or the "Firm") primarily to pursue controlling interests in small- and middle-market enterprise software, data and technology-enabled solutions companies with enterprise values generally between $200 million and $750 million.",
        minimumInvestment: "$100,000",
        performance: "+22.3% IRR",
        lockupPeriod: "7-10 years",
        lockUp: "7-10 years",
        firm: "Vista Equity Partners",
        tags: ["Private Equity", "Buyout", "Qualified Purchaser"],
        platform: "CAIS",
        category: "Technology Buyout",
        investorQualification: "Qualified Purchaser",
        liquidity: "Limited",
        subscriptions: "Closed-end fund",
        strategy: {
          overview: "Technology-focused buyout fund",
          approach: "Control investments",
          target: "Enterprise software companies",
          stage: "Small and middle-market",
          geography: "North America",
          sectors: ["Enterprise Software", "Technology-enabled Services"],
          expectedReturn: "20-25% IRR",
          benchmarks: ["Cambridge US Tech PE Index"],
        }
      },
      {
        id: 5,
        name: "JP Morgan Private Markets Fund",
        description: "JP Morgan Private Markets Fund has a small-mid market PE focus, multi-manager approach, simplified structure & terms, and between 8 depth of resources offered by one of the largest investment managers in the world.",
        minimumInvestment: "$250,000",
        performance: "+16.8% IRR",
        lockupPeriod: "Limited liquidity",
        lockUp: "Limited liquidity",
        firm: "JP Morgan",
        tags: ["Private Equity", "Equity", "Qualified Client"],
        platform: "JP Morgan",
        category: "Multi-Strategy",
        investorQualification: "Qualified Client",
        liquidity: "Limited",
        subscriptions: "Quarterly",
        strategy: {
          overview: "Small-mid market PE focus",
          approach: "Multi-manager approach",
          target: "Small and mid-market companies",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      },
      {
        id: 6,
        name: "AMG Pantheon Fund, LLC (Class I)",
        description: "AMG Pantheon Fund, LLC (The Fund) seeks to provide Accredited Investors exposure to a diversified private equity portfolio sourced by Pantheon's Global Investment Team. The Fund works to offer benefits like enhanced liquidity, unique strategy mix and necessary through a single allocation. With a lower investment minimum, a simplified 1099 tax report, and streamlined onboarding process, the Fund aims to deliver private equity portfolios while addressing practical challenges.",
        minimumInvestment: "$50,000",
        performance: "+15.7% IRR",
        lockupPeriod: "Quarterly liquidity",
        lockUp: "Quarterly liquidity",
        firm: "AMG Funds",
        tags: ["Private Equity", "Buyout", "Qualified Purchaser"],
        platform: "CAIS",
        category: "Multi-Strategy",
        investorQualification: "Qualified Purchaser",
        liquidity: "Quarterly",
        subscriptions: "Monthly",
        strategy: {
          overview: "Diversified private equity portfolio",
          approach: "Multi-manager approach",
          target: "Various private equity strategies",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      },
      {
        id: 7,
        name: "Arcs Private Markets Fund iCapital Offshore Access Fund SP1",
        description: "Arcs Private Markets Fund (APMF) is a diversified private equity investment solution, anchored in secondary investments, that seeks to deliver attractive, long-term capital appreciation through a professionally-managed, diversified portfolio of private companies.",
        minimumInvestment: "$50,000",
        performance: "+18.2% IRR",
        lockupPeriod: "Limited liquidity",
        lockUp: "Limited liquidity",
        firm: "Arcs/iCapital",
        tags: ["Private Equity", "Buyout & Growth Equity", "Qualified Client"],
        platform: "iCapital",
        category: "Diversified",
        investorQualification: "Qualified Client",
        liquidity: "Limited",
        subscriptions: "Monthly",
        strategy: {
          overview: "Diversified private equity investment solution",
          approach: "Secondary investments focus",
          target: "Private companies across stages",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      },
      {
        id: 8,
        name: "BlackRock Private Investment Fund",
        description: "With stocks at all-time highs and bond yields at sustained lows, we expect long-term public market gains to be more muted. Look to potentially amplify returns through BlackRock Private Investment Fund (BPIF), which offers investors the opportunity to access private investments in a continuously offered fund.",
        minimumInvestment: "$50,000",
        performance: "+16.9% IRR",
        lockupPeriod: "Quarterly after 1-year lock-up",
        lockUp: "1-year initial, then quarterly",
        firm: "BlackRock",
        tags: ["Private Equity", "Fund of Funds", "Accredited Investor"],
        platform: "BlackRock",
        category: "Fund of Funds",
        investorQualification: "Accredited Investor",
        liquidity: "Quarterly after 1-year",
        subscriptions: "Monthly",
        strategy: {
          overview: "Multi-asset private market exposure",
          approach: "Fund of funds",
          target: "Private equity, credit, and real assets",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "12-15% IRR",
          benchmarks: ["Cambridge Global Private Equity Index"],
        }
      },
      {
        id: 9,
        name: "BlackRock Private Investments Fund iCapital Offshore Access Fund, L.P.",
        description: "With stocks at all-time highs and bond yields at sustained lows, we expect long-term public market gains to be more muted. Look to potentially amplify returns through BlackRock Private Investment Fund (BPIF), which offers investors the opportunity to access private investments in a continuously offered fund.",
        minimumInvestment: "$100,000",
        performance: "+16.9% IRR",
        lockupPeriod: "Quarterly after 1-year lock-up",
        lockUp: "1-year initial, then quarterly",
        firm: "BlackRock/iCapital",
        tags: ["Private Equity", "Fund of Funds", "Accredited Investor"],
        platform: "iCapital",
        category: "Fund of Funds",
        investorQualification: "Accredited Investor",
        liquidity: "Quarterly after 1-year",
        subscriptions: "Monthly",
        strategy: {
          overview: "Multi-asset private market exposure",
          approach: "Fund of funds",
          target: "Private equity, credit, and real assets",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "12-15% IRR",
          benchmarks: ["Cambridge Global Private Equity Index"],
        }
      },
      {
        id: 10,
        name: "Bonaccord Capital Partners Fund III",
        description: "Bonaccord Capital Partners II ("the Fund") is a middle market GP stakes fund with a focus on making growth capital investments in mid-market private markets sponsors across private equity, private credit, real assets, and real estate. The fund aims to deliver attractive risk-adjusted returns driven by both dividend yields and capital appreciation.",
        minimumInvestment: "$250,000",
        performance: "+19.5% IRR",
        lockupPeriod: "8-10 years",
        lockUp: "8-10 years",
        firm: "Bonaccord Capital Partners",
        tags: ["Private Equity", "GP Stakes", "Accredited Investor"],
        platform: "CAIS",
        category: "GP Stakes",
        investorQualification: "Accredited Investor",
        liquidity: "Limited",
        subscriptions: "Closed-end fund",
        strategy: {
          overview: "GP stakes investment in middle market managers",
          approach: "Growth capital investments",
          target: "Private markets sponsors",
          stage: "Middle market",
          geography: "North America, Europe",
          sectors: ["Private Equity", "Private Credit", "Real Assets", "Real Estate"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      }
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
