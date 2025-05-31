
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { OfferingCard } from "@/components/investments/OfferingCard";
import { Badge } from "@/components/ui/badge";

const PrivateEquity = () => {
  const navigate = useNavigate();
  
  const privateEquityOfferings = [
    {
      id: 1,
      name: "Healthcare Growth Partners III",
      description: "Focused on growth-stage healthcare companies with proven business models and strong management teams.",
      firm: "Healthcare Growth Partners",
      minimumInvestment: "$250,000",
      performance: "+18.5%",
      lockupPeriod: "5-7 years",
      tags: ["Healthcare", "Growth", "Mid-Market"],
      featured: true
    },
    {
      id: 2,
      name: "Technology Innovation Fund IV",
      description: "Invests in B2B software companies with recurring revenue models and scalable platforms.",
      firm: "TechVenture Capital",
      minimumInvestment: "$500,000",
      performance: "+22.3%",
      lockupPeriod: "7-10 years",
      tags: ["Technology", "B2B Software", "SaaS"]
    },
    {
      id: 3,
      name: "Consumer Brands Equity Fund",
      description: "Partners with established consumer brands seeking capital for expansion and operational improvements.",
      firm: "Brand Equity Partners",
      minimumInvestment: "$100,000",
      performance: "+14.7%",
      lockupPeriod: "4-6 years",
      tags: ["Consumer", "Brands", "Retail"],
      featured: true
    },
    {
      id: 4,
      name: "Industrial Growth Partners II",
      description: "Focuses on middle-market industrial companies with strong competitive positions.",
      firm: "Industrial Capital Group",
      minimumInvestment: "$1,000,000",
      performance: "+16.9%",
      lockupPeriod: "6-8 years",
      tags: ["Industrial", "Manufacturing", "B2B"]
    },
    {
      id: 5,
      name: "Energy Transition Fund",
      description: "Invests in companies driving the transition to clean energy and sustainable technologies.",
      firm: "Green Energy Ventures",
      minimumInvestment: "$250,000",
      performance: "+19.2%",
      lockupPeriod: "8-12 years",
      tags: ["Energy", "ESG", "Clean Tech"]
    },
    {
      id: 6,
      name: "Financial Services Growth",
      description: "Targets fintech and financial services companies with innovative business models.",
      firm: "FinTech Capital Partners",
      minimumInvestment: "$500,000",
      performance: "+21.1%",
      lockupPeriod: "5-7 years",
      tags: ["FinTech", "Financial Services", "Innovation"]
    }
  ];

  const alternativeCategories = [
    {
      id: "private-equity",
      title: "Private Equity",
      description: "Investments in private companies or buyouts of public companies resulting in a delisting of public equity.",
      path: "/client-investments/alternative/private-equity"
    },
    {
      id: "private-debt",
      title: "Private Debt", 
      description: "Loans made by non-bank institutions to private companies or commercial real estate owners with complex needs.",
      path: "/client-investments/alternative/private-debt"
    },
    {
      id: "hedge-fund",
      title: "Hedge Fund",
      description: "Alternative investment vehicles employing different strategies to earn returns regardless of market direction.",
      path: "/client-investments/alternative/hedge-fund"
    },
    {
      id: "venture-capital",
      title: "Venture Capital",
      description: "Investments in early stage companies with high growth potential across various industries.",
      path: "/client-investments/alternative/venture-capital"
    },
    {
      id: "collectibles",
      title: "Collectibles",
      description: "Investments in rare physical assets including art, wine, classic cars, watches and other luxury items.",
      path: "/client-investments/alternative/collectibles"
    },
    {
      id: "digital-assets",
      title: "Digital Assets",
      description: "Investments in blockchain technology, cryptocurrencies, and other digital asset infrastructure.",
      path: "/client-investments/alternative/digital-assets"
    },
    {
      id: "real-assets",
      title: "Real Assets",
      description: "Investments in physical assets including real estate, infrastructure, natural resources, and commodities.",
      path: "/client-investments/alternative/real-assets"
    },
    {
      id: "structured-investments",
      title: "Structured Investments",
      description: "Customized investment products with specific risk/return profiles using derivatives and financial engineering.",
      path: "/client-investments/alternative/structured-investments"
    }
  ];

  const handleAssetClick = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/client-investments?tab=private-markets")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Investments
        </Button>
      </div>
      
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Investment Management</h1>
        <p className="text-muted-foreground text-lg">
          Explore a curated selection of investment options tailored to your financial goals. 
          Our solutions range from model portfolios to exclusive alternative assets.
        </p>
      </div>

      <Tabs value="private-markets" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="intelligent-alloc" className="flex-1" onClick={() => navigate("/client-investments?tab=intelligent-alloc")}>
            Intelligent Alloc.
          </TabsTrigger>
          <TabsTrigger value="private-markets" className="flex-1">
            Private Markets
          </TabsTrigger>
          <TabsTrigger value="bfo-models" className="flex-1 relative cursor-not-allowed opacity-60" disabled>
            <span className="flex items-center gap-2">
              BFO Models
              <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                Coming Soon
              </Badge>
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="private-markets" className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Alternative Investment Categories</h2>
              <p className="text-muted-foreground">
                Explore exclusive private market investment opportunities within these alternative asset classes. 
                Click on a category to view available offerings.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternativeCategories.map((category) => (
                <div 
                  key={category.id}
                  onClick={() => handleAssetClick(category.path)} 
                  className={`${
                    category.id === 'private-equity' 
                      ? 'bg-blue-900 border-blue-700' 
                      : 'bg-slate-900 hover:bg-slate-800'
                  } text-white rounded-lg border border-slate-700 p-6 cursor-pointer transition-all duration-200 group`}
                >
                  <div className="flex flex-col gap-4 h-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                        {category.title}
                      </h3>
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-yellow-400 transition-colors" />
                    </div>
                    
                    <p className="text-slate-300 text-sm leading-relaxed flex-1">
                      {category.description}
                    </p>
                    
                    <div className="flex justify-start">
                      <Badge 
                        variant="outline" 
                        className={`${
                          category.id === 'private-equity'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        } text-xs font-medium px-3 py-1`}
                      >
                        {category.id === 'private-equity' ? 'Selected' : 'Private Market Alpha'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Private Equity Investments</h2>
                <p className="text-muted-foreground text-lg">
                  Explore exclusive private equity investment opportunities across various sectors and stages.
                  Our carefully curated offerings provide access to institutional-quality investments.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {privateEquityOfferings.map((offering) => (
                  <OfferingCard key={offering.id} offering={offering} />
                ))}
              </div>
              
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Why Private Equity?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Private equity investments offer the potential for attractive returns through direct ownership 
                    in high-quality companies. Our platform provides access to top-tier fund managers and 
                    exclusive investment opportunities typically reserved for institutional investors.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Diversification beyond public markets</li>
                    <li>Access to experienced fund managers</li>
                    <li>Potential for enhanced returns over time</li>
                    <li>Direct impact on company operations and strategy</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrivateEquity;
