
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useAuth } from "@/context/AuthContext";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SupabaseAssetList } from "@/components/assets/SupabaseAssetList";
import { AddAssetDialog } from "@/components/assets/AddAssetDialog";
import { SupabaseAssetsSummary } from "@/components/assets/SupabaseAssetsSummary";
import { LiabilitiesList } from "@/components/liabilities/LiabilitiesList";
import { ComprehensiveAssetsSummary } from "@/components/assets/ComprehensiveAssetsSummary";
import { Card, CardContent } from "@/components/ui/card";

export default function AllAssets() {
  const { isAuthenticated } = useAuth();
  const [mainTab, setMainTab] = useState("summary");
  const [assetTab, setAssetTab] = useState("assets");
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <ThreeColumnLayout title="All Assets">
        <div className="container mx-auto p-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
              <p className="text-muted-foreground">Please log in to view and manage your assets.</p>
            </CardContent>
          </Card>
        </div>
      </ThreeColumnLayout>
    );
  }
  
  return (
    <ThreeColumnLayout title="All Assets">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <p className="text-muted-foreground">Comprehensive view of all your assets and liabilities</p>
          </div>
          <Button
            onClick={() => setIsAddAssetDialogOpen(true)}
            className="mt-4 md:mt-0"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Asset
          </Button>
        </div>
        
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="summary">Asset Summary</TabsTrigger>
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
            <TabsTrigger value="networth">Net Worth</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <div className="space-y-6">
              <SupabaseAssetsSummary />
              
              <Tabs value={assetTab} onValueChange={setAssetTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-10 w-full mb-6 overflow-auto">
                  <TabsTrigger value="assets" className="col-span-1">Assets</TabsTrigger>
                  <TabsTrigger value="liabilities" className="col-span-1">Liabilities</TabsTrigger>
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
                
                <TabsContent value="assets">
                  <SupabaseAssetList filter="all" />
                </TabsContent>

                <TabsContent value="liabilities">
                  <LiabilitiesList />
                </TabsContent>
                
                <TabsContent value="all">
                  <SupabaseAssetList filter="all" />
                </TabsContent>
                
                <TabsContent value="property">
                  <SupabaseAssetList filter="property" />
                </TabsContent>
                
                <TabsContent value="vehicles">
                  <SupabaseAssetList filter="vehicles" />
                </TabsContent>
                
                <TabsContent value="cash">
                  <SupabaseAssetList filter="cash" />
                </TabsContent>
                
                <TabsContent value="investment">
                  <SupabaseAssetList filter="investment" />
                </TabsContent>
                
                <TabsContent value="collectibles">
                  <SupabaseAssetList filter="collectibles" />
                </TabsContent>
                
                <TabsContent value="art">
                  <SupabaseAssetList filter="art" />
                </TabsContent>
                
                <TabsContent value="digital">
                  <SupabaseAssetList filter="digital" />
                </TabsContent>
                
                <TabsContent value="other">
                  <SupabaseAssetList filter="other" />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="allocation">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Asset Allocation</h2>
              <ComprehensiveAssetsSummary showTabs={false} />
            </div>
          </TabsContent>
          
          <TabsContent value="networth">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Net Worth Analysis</h2>
              <ComprehensiveAssetsSummary showTabs={false} />
            </div>
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
