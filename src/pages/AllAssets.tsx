
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useNetWorth } from "@/context/NetWorthContext";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AssetList } from "@/components/assets/AssetList";
import { AddAssetDialog } from "@/components/assets/AddAssetDialog";
import { ComprehensiveAssetsSummary } from "@/components/assets/ComprehensiveAssetsSummary";

export default function AllAssets() {
  const { assets, getTotalNetWorth } = useNetWorth();
  const [activeTab, setActiveTab] = useState("all");
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);
  
  const totalNetWorth = getTotalNetWorth();
  
  return (
    <ThreeColumnLayout title="All Assets">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Family Assets</h1>
            <p className="text-muted-foreground">Comprehensive view of all your family's assets</p>
          </div>

          <Button
            onClick={() => setIsAddAssetDialogOpen(true)}
            className="mt-4 md:mt-0"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Asset
          </Button>
        </div>
        
        <ComprehensiveAssetsSummary />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-8 w-full mb-6 overflow-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="property">Real Estate</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="cash">Cash</TabsTrigger>
            <TabsTrigger value="investment">Investments</TabsTrigger>
            <TabsTrigger value="collectibles">Collectibles</TabsTrigger>
            <TabsTrigger value="art">Art</TabsTrigger>
            <TabsTrigger value="digital">Digital</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <AssetList filter="all" />
          </TabsContent>
          
          <TabsContent value="property">
            <AssetList filter="property" />
          </TabsContent>
          
          <TabsContent value="vehicles">
            <AssetList filter="vehicles" />
          </TabsContent>
          
          <TabsContent value="cash">
            <AssetList filter="cash" />
          </TabsContent>
          
          <TabsContent value="investment">
            <AssetList filter="investment" />
          </TabsContent>
          
          <TabsContent value="collectibles">
            <AssetList filter="collectibles" />
          </TabsContent>
          
          <TabsContent value="art">
            <AssetList filter="art" />
          </TabsContent>
          
          <TabsContent value="digital">
            <AssetList filter="digital" />
          </TabsContent>
          
          <TabsContent value="other">
            <AssetList filter="other" />
          </TabsContent>
        </Tabs>
      </div>
      
      <AddAssetDialog 
        open={isAddAssetDialogOpen} 
        onOpenChange={setIsAddAssetDialogOpen} 
      />
    </ThreeColumnLayout>
  );
}
