
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InterestedButton from "@/components/common/InterestedButton";
import ScheduleMeetingDialog from "@/components/common/ScheduleMeetingDialog";

interface FundDetailPanelProps {
  offering: any;
  onClose: () => void;
}

const FundDetailPanel: React.FC<FundDetailPanelProps> = ({ offering, onClose }) => {
  if (!offering) return null;

  // Handle click outside
  const handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const formatTextWithTitle = (text: string) => {
    if (!text) return null;

    // Check if text has parenthesis to extract a potential title
    const matches = text.match(/^([^(]+)\(["']?([^)"']+)["']?\)/);
    if (matches && matches.length >= 3) {
      const mainText = matches[1].trim();
      const title = matches[2].trim();
      return (
        <>
          <span className="font-semibold">{mainText}</span>
          <span className="text-gray-300">({title})</span>
        </>
      );
    }
    
    return text;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-40 flex justify-end overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="relative w-full md:w-[500px] bg-[#0a1122] border-l border-gray-800 shadow-xl z-50 overflow-y-auto animate-slide-in-right"
        onClick={handlePanelClick}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">{offering.name}</h2>
                {offering.featured && (
                  <Badge className="bg-primary text-white">Featured</Badge>
                )}
              </div>
              <p className="text-gray-400">{offering.firm}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
              aria-label="Close panel"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <InterestedButton 
              assetName={offering.name} 
              variant="default"
              className="w-full"
            />
            <ScheduleMeetingDialog 
              assetName={offering.name}
              variant="outline"
              className="w-full"
            />
          </div>

          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="w-full mb-6 bg-[#1a283e] grid grid-cols-3">
              <TabsTrigger 
                value="details"
                className="py-2 data-[state=active]:bg-primary"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="about"
                className="py-2 data-[state=active]:bg-primary"
              >
                About
              </TabsTrigger>
              <TabsTrigger 
                value="strategy"
                className="py-2 data-[state=active]:bg-primary"
              >
                Strategy
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="focus-visible:outline-none">
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-white mb-3">Fund Details</h3>
                  
                  <div className="bg-[#0f1628] rounded-lg border border-gray-800 divide-y divide-gray-800">
                    <div className="flex justify-between py-3 px-4">
                      <span className="text-gray-400">Firm</span>
                      <span className="text-white font-medium">{offering.firm}</span>
                    </div>
                    <div className="flex justify-between py-3 px-4">
                      <span className="text-gray-400">Category</span>
                      <span className="text-white font-medium">{
                        offering.category === "private-equity" ? "Private Equity" :
                        offering.category === "private-debt" ? "Private Debt" :
                        offering.category === "hedge-fund" ? "Hedge Fund" :
                        offering.category === "venture-capital" ? "Venture Capital" :
                        offering.category === "digital-assets" ? "Digital Assets" :
                        offering.category === "real-assets" ? "Real Assets" :
                        offering.category === "collectibles" ? "Collectibles" :
                        offering.category === "structured-investments" ? "Structured Investments" :
                        offering.category
                      }</span>
                    </div>
                    <div className="flex justify-between py-3 px-4">
                      <span className="text-gray-400">Minimum Investment</span>
                      <span className="text-white font-medium">{offering.minimumInvestment}</span>
                    </div>
                    <div className="flex justify-between py-3 px-4">
                      <span className="text-gray-400">Liquidity</span>
                      <span className="text-white font-medium">{offering.lockUp || "Quarterly"}</span>
                    </div>
                    <div className="flex justify-between py-3 px-4">
                      <span className="text-gray-400">Investor Qualification</span>
                      <span className="text-white font-medium">{offering.investorQualification || "Accredited Investor"}</span>
                    </div>
                    <div className="flex justify-between py-3 px-4">
                      <span className="text-gray-400">Subscriptions</span>
                      <span className="text-white font-medium">{offering.subscriptions || "Monthly"}</span>
                    </div>
                  </div>
                </div>

                {offering.tags && offering.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {offering.tags.map((tag: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="bg-secondary/10 text-secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="about" className="focus-visible:outline-none">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">About</h3>
                  <p className="text-gray-300 leading-relaxed">{offering.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">How It Works</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our advisor will work with you to select the best offering and fill out the required
                    information. You may be required to sign certain documents. Once completed, your
                    advisor will help you transfer assets to fund the investment.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="strategy" className="focus-visible:outline-none">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Investment Strategy</h3>
                  {offering.strategy ? (
                    <div className="space-y-4">
                      {offering.strategy.overview && (
                        <div className="bg-[#0f1628] p-4 rounded-lg border border-gray-800">
                          <h4 className="font-medium text-white mb-2">Overview</h4>
                          <p className="text-gray-300">{offering.strategy.overview}</p>
                        </div>
                      )}
                      
                      {offering.strategy.approach && (
                        <div className="bg-[#0f1628] p-4 rounded-lg border border-gray-800">
                          <h4 className="font-medium text-white mb-2">Approach</h4>
                          <p className="text-gray-300">{offering.strategy.approach}</p>
                        </div>
                      )}

                      {offering.strategy.target && (
                        <div className="bg-[#0f1628] p-4 rounded-lg border border-gray-800">
                          <h4 className="font-medium text-white mb-2">Target Investments</h4>
                          <p className="text-gray-300">{offering.strategy.target}</p>
                        </div>
                      )}
                      
                      {offering.strategy.sectors && offering.strategy.sectors.length > 0 && (
                        <div className="bg-[#0f1628] p-4 rounded-lg border border-gray-800">
                          <h4 className="font-medium text-white mb-2">Target Sectors</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {offering.strategy.sectors.map((sector: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="bg-primary/10 text-primary">
                                {sector}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {offering.strategy.expectedReturn && (
                        <div className="bg-[#0f1628] p-4 rounded-lg border border-gray-800">
                          <h4 className="font-medium text-white mb-2">Expected Returns</h4>
                          <p className="text-gray-300">{offering.strategy.expectedReturn}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400">Detailed strategy information not available.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-6 mt-6 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              This information is provided for educational purposes only and does not constitute an offer to sell or solicitation of an offer to buy securities. Investment involves risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundDetailPanel;
