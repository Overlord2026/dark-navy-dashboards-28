
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OfferingsList from "@/components/investments/OfferingsList";
import ModelPortfoliosTab from "@/components/investments/ModelPortfoliosTab";
import AlternativeAssetsTab from "@/components/investments/AlternativeAssetsTab";

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
            <TabsList className="w-full grid grid-cols-2 mb-8 bg-[#1a283e]">
              <TabsTrigger 
                value="model-portfolios"
                className="py-3 data-[state=active]:bg-primary"
              >
                Model Portfolios
              </TabsTrigger>
              <TabsTrigger 
                value="alternative-assets"
                className="py-3 data-[state=active]:bg-primary"
              >
                Alternative Assets
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="model-portfolios">
              <ModelPortfoliosTab />
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
