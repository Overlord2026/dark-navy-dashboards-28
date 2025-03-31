
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ArrowLeft, 
  Filter, 
  Search 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data for alternative assets
const alternativeAssets = [
  {
    type: "Private Equity",
    description: "Investments in private companies or buyouts of public companies, aiming for substantial long-term returns through active management and eventual sale or public offering.",
    link: "/investments/private-equity"
  },
  {
    type: "Private Debt",
    description: "Lending funds to private companies or projects, often yielding higher returns than public debt due to increased risk and reduced liquidity.",
    link: "/investments/private-debt"
  },
  {
    type: "Hedge Fund",
    description: "Pooled investment funds that can employ diverse strategies, including leveraging, short-selling, and trading non-traditional investments, to achieve high returns which are often uncorrelated with traditional market performance.",
    link: "/investments/hedge-fund"
  },
  {
    type: "Venture Capital",
    description: "Investments in early-stage startups with high growth potential, either as individual startups or funds of startups.",
    link: "/investments/venture-capital"
  },
  {
    type: "Collectibles",
    description: "Investments in art, wine and spirits, and other rare items, which have potential to appreciate in value over time, driven by rarity and demand.",
    link: "/investments/collectibles"
  },
  {
    type: "Digital Assets",
    description: "Digital forms of value or ownership including cryptocurrency, tokenized assets, and NFTs, attracting investors for their potential high returns and innovative technology.",
    link: "/investments/digital-assets"
  },
  {
    type: "Real Assets",
    description: "Purchasing property to generate rental income or capital appreciation, often seen as a stable, long-term investment with potential tax benefits.",
    link: "/investments/real-assets"
  },
  {
    type: "Structured Investments",
    description: "Structured investments consist of with fixed income and equity derivative components to achieve a more defined outcome: yield, equity exposure and protection against downturns.",
    link: "/investments/structured-investments"
  }
];

// Mock data for fund offerings
const fundOfferings = [
  {
    id: "fund-1",
    name: "AMG Pantheon Fund, LLC",
    description: "AMG Pantheon Fund, LLC provides Accredited Investors unique exposure to a diversified private equity portfolio sourced by Pantheon's Global Investment Team. The Fund offers diversification by manager, stage, vintage year and industry through a single allocation.",
    tags: ["Private Equity", "Multi-Strategy", "$50K Minimum", "Accredited Investor"],
    featured: true
  },
  {
    id: "fund-2",
    name: "Ares Private Markets Fund",
    description: "Ares Private Markets Fund (\"The Fund\") seeks to build a diversified private equity investment solution that aims to deliver attractive, long-term capital appreciation. The Fund's dynamic and flexible allocation to private equity, anchored principally in traditional secondaries, aims to potentially reduce J-curve and vintage risk, while aiming to provide enhanced manager and investment diversification.",
    tags: ["Private Equity", "Multi-Strategy", "$50K Minimum", "Accredited Investor"],
    featured: true
  }
];

const Investments = () => {
  const [activeTab, setActiveTab] = useState("alternative-assets");
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(null);
  const [fundDetailOpen, setFundDetailOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<any>(null);

  const handleAssetClick = (assetType: string) => {
    setSelectedAssetType(assetType);
  };

  const handleFundClick = (fund: any) => {
    setSelectedFund(fund);
    setFundDetailOpen(true);
  };

  const handleBackToAssets = () => {
    setSelectedAssetType(null);
  };

  return (
    <ThreeColumnLayout title="Investments" activeMainItem="investments">
      <div className="w-full h-full bg-[#080C24] text-white">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          {/* Tabs */}
          <div className="border-b border-gray-800">
            <Tabs 
              defaultValue={activeTab} 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-between items-center">
                <TabsList className="bg-transparent h-12 p-0 space-x-8">
                  <TabsTrigger 
                    value="model-portfolios" 
                    className="text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none bg-transparent h-12 px-0"
                  >
                    Model Portfolios
                  </TabsTrigger>
                  <TabsTrigger 
                    value="alternative-assets" 
                    className="text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none bg-transparent h-12 px-0"
                  >
                    Alternative Assets
                  </TabsTrigger>
                </TabsList>
                
                <div>
                  {activeTab === "alternative-assets" && !selectedAssetType && (
                    <Button variant="link" className="gap-2 text-white">
                      View All <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <TabsContent value="model-portfolios">
                <div className="py-6">
                  <h2 className="text-2xl font-semibold mb-4">Model Portfolios</h2>
                  <p className="text-gray-400 mb-6">
                    Select from professionally designed portfolios tailored to various investment goals and risk profiles.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="alternative-assets" className="pt-6">
                {selectedAssetType ? (
                  <div>
                    {/* Asset Type Header */}
                    <div className="mb-6">
                      <div className="flex items-center">
                        <Button variant="ghost" onClick={handleBackToAssets} className="mr-2 p-2">
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-2xl font-semibold">{selectedAssetType}</h1>
                      </div>
                      <p className="text-gray-400 mt-2">
                        {alternativeAssets.find(asset => asset.type === selectedAssetType)?.description}
                      </p>
                    </div>
                    
                    {/* Search and Filters */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Search By Fund or Firm..." 
                          className="bg-transparent border-gray-700 pl-10 text-white"
                        />
                      </div>
                      <Button variant="outline" className="flex items-center gap-2 bg-transparent border-gray-700 text-white">
                        <Filter className="h-4 w-4" />
                        Filters
                      </Button>
                    </div>
                    
                    {/* Fund Listings */}
                    <div className="space-y-6">
                      {fundOfferings.map((fund) => (
                        <div 
                          key={fund.id} 
                          className="bg-[#0F1630] border border-gray-800 rounded-lg p-6 cursor-pointer hover:border-gray-600"
                          onClick={() => handleFundClick(fund)}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-semibold">{fund.name}</h3>
                            {fund.featured && (
                              <Badge className="bg-white text-black">Featured</Badge>
                            )}
                          </div>
                          <p className="text-gray-300 mb-4">{fund.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {fund.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="border-gray-600 text-gray-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alternativeAssets.map((asset, index) => (
                      <Card 
                        key={index} 
                        className="bg-[#0F1630] border-gray-800 hover:border-gray-600 cursor-pointer transition-colors"
                        onClick={() => handleAssetClick(asset.type)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center text-xl text-white">
                            {asset.type} <ArrowRight className="h-5 w-5 ml-2" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-300">
                            {asset.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Footer button if needed */}
          {activeTab === "alternative-assets" && selectedAssetType === null && (
            <div className="flex justify-end mt-8">
              <Button variant="outline" className="bg-transparent border-gray-700 text-white">
                Update Investor Status
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Fund Detail Dialog */}
      <Dialog open={fundDetailOpen} onOpenChange={setFundDetailOpen}>
        <DialogContent className="bg-[#1A1F36] text-white border-gray-700 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedFund?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Private Equity Offering</h3>
              <p className="text-gray-300">
                Investments in private companies or buyouts of public companies, aiming for substantial long-term returns through active management and eventual sale or public offering.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">About</h3>
              <p className="text-gray-300">{selectedFund?.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">How it Works</h3>
              <p className="text-gray-300">
                Your advisor will work with you to select the best offering and fill out the required information. You may be required to sign certain documents. Once completed, your advisor will help you transfer assets to fund the investment.
              </p>
            </div>
            
            <div className="bg-[#1C2347] p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Get Started</h3>
              <p className="text-gray-300 mb-4">
                To get started, schedule a meeting with your advisor or tell them you're interested in this offering.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="bg-transparent border-gray-600 text-white">
                  I'm Interested
                </Button>
                <Button className="bg-white text-black hover:bg-gray-200">
                  Schedule a Meeting
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ThreeColumnLayout>
  );
};

export default Investments;
