
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryOverview } from "@/components/investments/CategoryOverview";
import { OfferingsList } from "@/components/investments/OfferingsList";
import { useInvestmentData } from "@/hooks/useInvestmentData";
import { adaptLegacyOffering, type LegacyOffering } from "@/utils/investmentDataAdapter";

const StructuredInvestments = () => {
  const { offerings: dbOfferings, loading } = useInvestmentData();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Legacy static data for fallback
  const staticOfferings: LegacyOffering[] = [
    {
      id: 1,
      name: "Goldman Sachs Structured Notes",
      description: "Customized structured products with defined risk/return profiles based on underlying assets.",
      firm: "Goldman Sachs",
      minimumInvestment: "$10,000",
      performance: "+8.4%",
      lockupPeriod: "3-5 years",
      tags: ["Structured Notes", "Tailored", "Defined Outcome"],
      featured: true
    },
    {
      id: 2,
      name: "JPMorgan Principal Protected Notes",
      description: "Principal-protected structured notes that provide downside protection while participating in market upside. These investments combine the security of principal protection with exposure to various market indices.",
      firm: "JPMorgan Chase",
      minimumInvestment: "$25,000",
      performance: "+7.2%",
      lockupPeriod: "2-4 years",
      tags: ["Principal Protection", "Market-Linked", "Downside Buffer"],
      featured: true
    },
    {
      id: 3,
      name: "Morgan Stanley Buffered PLUS",
      description: "Buffered Performance Leveraged Upside Securities (PLUS) offering enhanced returns on the upside with limited downside risk through a buffer zone that protects against moderate market declines.",
      firm: "Morgan Stanley",
      minimumInvestment: "$15,000",
      performance: "+9.8%",
      lockupPeriod: "2-3 years",
      tags: ["Buffered", "Enhanced Upside", "Market-Linked"],
      featured: false
    },
    {
      id: 4,
      name: "Barclays Autocallable Notes",
      description: "Structured investments that automatically call (redeem) if the underlying asset reaches a predetermined level on specified observation dates, potentially providing above-market returns for sideways or slightly bullish markets.",
      firm: "Barclays",
      minimumInvestment: "$10,000",
      performance: "+6.5%",
      lockupPeriod: "1-2 years",
      tags: ["Autocallable", "Early Redemption", "Enhanced Yield"],
      featured: false
    },
    {
      id: 5,
      name: "Citigroup Callable Yield Notes",
      description: "Income-focused structured products that offer above-market coupon rates with issuer call features, providing investors with enhanced yield potential in exchange for giving the issuer redemption flexibility.",
      firm: "Citigroup",
      minimumInvestment: "$10,000",
      performance: "+5.8%",
      lockupPeriod: "1-3 years",
      tags: ["Income", "Callable", "Enhanced Yield"],
      featured: true
    }
  ];

  // Use database offerings if available, otherwise use adapted static data
  const offerings = dbOfferings.length > 0 
    ? dbOfferings.filter(offering => offering.category_id === 'structured-investments')
    : staticOfferings.map(offering => adaptLegacyOffering(offering, 'structured-investments'));

  const categoryData = {
    title: "Structured Investments",
    description: "Customized investment products with specific risk/return profiles using derivatives and financial engineering.",
    totalOfferings: offerings.length,
    featuredOfferings: offerings.filter(o => o.featured).length,
    avgMinimum: "$15,000",
    ytdPerformance: 7.5
  };

  return (
    <ThreeColumnLayout activeMainItem="investments" title="Structured Investments">
      <div className="space-y-8">
        <CategoryOverview 
          category="structured-investments"
          data={categoryData}
        />
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="offerings">All Offerings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">About Structured Investments</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Structured investments are sophisticated financial products that combine traditional securities 
                  with derivatives to create customized risk-return profiles. These products are designed to meet 
                  specific investment objectives, such as principal protection, enhanced yield, or leveraged exposure 
                  to underlying assets.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Key Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Customized risk/return profiles tailored to specific market views</li>
                  <li>• Principal protection options available</li>
                  <li>• Enhanced yield potential through structured coupons</li>
                  <li>• Exposure to various underlying assets (indices, commodities, currencies)</li>
                  <li>• Defined outcome scenarios with predetermined payoff structures</li>
                </ul>
              </div>

              <OfferingsList 
                offerings={offerings} 
                categoryId="structured-investments"
                isFullView={false}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="offerings">
            <OfferingsList 
              offerings={offerings} 
              categoryId="structured-investments"
              isFullView={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default StructuredInvestments;
