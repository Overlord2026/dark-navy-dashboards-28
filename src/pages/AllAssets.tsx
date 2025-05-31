
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
import { PlusCircle, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SupabaseAssetList } from "@/components/assets/SupabaseAssetList";
import { AddAssetDialog } from "@/components/assets/AddAssetDialog";
import { AddLiabilityDialog } from "@/components/liabilities/AddLiabilityDialog";
import { SupabaseAssetsSummary } from "@/components/assets/SupabaseAssetsSummary";
import { LiabilitiesList } from "@/components/liabilities/LiabilitiesList";
import { ComprehensiveAssetsSummary } from "@/components/assets/ComprehensiveAssetsSummary";
import { NetWorthAnalysis } from "@/components/assets/NetWorthAnalysis";
import { Card, CardContent } from "@/components/ui/card";

export default function AllAssets() {
  const { isAuthenticated } = useAuth();
  const [mainTab, setMainTab] = useState("summary");
  const [assetFilter, setAssetFilter] = useState("assets");
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);
  const [isAddLiabilityDialogOpen, setIsAddLiabilityDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const filterOptions = [
    { value: "assets", label: "All Assets" },
    { value: "property", label: "Real Estate" },
    { value: "vehicle", label: "Vehicle (Car, RV, Camper)" },
    { value: "boat", label: "Boat/Watercraft" },
    { value: "cash", label: "Cash & Equivalents" },
    { value: "investment", label: "Investments" },
    { value: "retirement", label: "Retirement Accounts" },
    { value: "art", label: "Art" },
    { value: "antique", label: "Antiques" },
    { value: "jewelry", label: "Jewelry" },
    { value: "collectible", label: "Collectibles" },
    { value: "digital", label: "Digital Assets" },
    { value: "other", label: "Other" }
  ];

  const getSelectedFilterLabel = () => {
    const selected = filterOptions.find(option => option.value === assetFilter);
    return selected ? selected.label : "All Assets";
  };

  const handleLiabilityAdded = () => {
    // Trigger a refresh of the data by updating the refresh key
    setRefreshKey(prev => prev + 1);
  };

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
      <div className="container mx-auto p-4 mt-4">
        <div className="mb-6">
          <p className="text-muted-foreground mb-4">Comprehensive view of all your assets and liabilities</p>
          <div className="flex justify-end">
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAddLiabilityDialogOpen(true)}
                variant="outline"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Liability
              </Button>
              <Button
                onClick={() => setIsAddAssetDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="summary">Asset Summary</TabsTrigger>
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
            <TabsTrigger value="networth">Net Worth</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-6">
            <SupabaseAssetsSummary />
            
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Asset Details</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {getSelectedFilterLabel()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {filterOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setAssetFilter(option.value)}
                      className={assetFilter === option.value ? "bg-accent" : ""}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {assetFilter === "assets" ? (
              <div className="space-y-6">
                <SupabaseAssetList filter="all" />
                <LiabilitiesList />
              </div>
            ) : (
              <SupabaseAssetList filter={assetFilter} />
            )}
          </TabsContent>
          
          <TabsContent value="allocation" className="space-y-6">
            <h2 className="text-2xl font-semibold">Asset Allocation</h2>
            <ComprehensiveAssetsSummary showTabs={false} />
          </TabsContent>
          
          <TabsContent value="networth" className="space-y-6">
            <h2 className="text-2xl font-semibold">Net Worth Analysis</h2>
            <NetWorthAnalysis />
          </TabsContent>
        </Tabs>
      </div>
      
      <AddAssetDialog 
        open={isAddAssetDialogOpen} 
        onOpenChange={setIsAddAssetDialogOpen} 
      />
      
      <AddLiabilityDialog 
        open={isAddLiabilityDialogOpen} 
        onOpenChange={setIsAddLiabilityDialogOpen}
        onLiabilityAdded={handleLiabilityAdded}
      />
    </ThreeColumnLayout>
  );
}
