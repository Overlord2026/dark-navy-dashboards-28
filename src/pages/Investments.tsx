
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OfferingsList from "@/components/investments/OfferingsList";
import ModelPortfoliosTab from "@/components/investments/ModelPortfoliosTab";
import AlternativeAssetsTab from "@/components/investments/AlternativeAssetsTab";
import IntelligentAllocationTab from "@/components/investments/IntelligentAllocationTab";

const Investments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("model-portfolios");
  
  return (
    <ThreeColumnLayout title="Investments">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Investment Management</h2>
          <p className="text-gray-400 mb-6">
            Explore a curated selection of investment options tailored to your financial goals.
            Our solutions range from model portfolios to exclusive alternative assets.
          </p>
          
          <Tabs 
            defaultValue="model-portfolios" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3 mb-8 bg-[#1a283e] rounded-md overflow-hidden">
              <TabsTrigger 
                value="model-portfolios"
                className="py-5 px-4 text-center border-r border-[#2a3854] data-[state=active]:bg-black data-[state=active]:text-white transition-colors focus:outline-none sm:text-sm md:text-base"
              >
                BFO Model Portfolios
              </TabsTrigger>
              <TabsTrigger 
                value="intelligent-allocation"
                className="py-5 px-4 text-center border-r border-[#2a3854] data-[state=active]:bg-black data-[state=active]:text-white transition-colors focus:outline-none sm:text-sm md:text-base"
              >
                Intelligent Allocation
              </TabsTrigger>
              <TabsTrigger 
                value="alternative-assets"
                className="py-5 px-4 text-center data-[state=active]:bg-black data-[state=active]:text-white transition-colors focus:outline-none sm:text-sm md:text-base"
              >
                Private Market Alpha
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="model-portfolios">
              <ModelPortfoliosTab />
            </TabsContent>
            
            <TabsContent value="intelligent-allocation">
              <IntelligentAllocationTab />
            </TabsContent>
            
            <TabsContent value="alternative-assets">
              <AlternativeAssetsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Investments;
