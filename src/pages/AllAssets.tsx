
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
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function AllAssets() {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
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
        <div className={cn(
          "container mx-auto",
          isMobile ? "px-3 py-4" : "px-4 py-6"
        )}>
          <Card>
            <CardContent className={cn(
              "text-center",
              isMobile ? "pt-4" : "pt-6"
            )}>
              <h2 className={cn(
                "font-semibold mb-2",
                isMobile ? "text-lg" : "text-xl"
              )}>Authentication Required</h2>
              <p className={cn(
                "text-muted-foreground",
                isMobile ? "text-sm" : ""
              )}>Please log in to view and manage your assets.</p>
            </CardContent>
          </Card>
        </div>
      </ThreeColumnLayout>
    );
  }
  
  return (
    <ThreeColumnLayout title="All Assets">
      <div className={cn(
        "container mx-auto mt-4",
        isMobile ? "px-3 py-4" : "px-4 py-6"
      )}>
        <div className="mb-6">
          <p className={cn(
            "text-muted-foreground mb-4",
            isMobile ? "text-sm" : ""
          )}>Comprehensive view of all your assets and liabilities</p>
          <div className={cn(
            "flex gap-2",
            isMobile ? "flex-col" : "justify-end"
          )}>
            <Button
              onClick={() => setIsAddLiabilityDialogOpen(true)}
              variant="outline"
              className={cn(
                isMobile ? "w-full text-sm" : ""
              )}
            >
              <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Add Liability
            </Button>
            <Button
              onClick={() => setIsAddAssetDialogOpen(true)}
              className={cn(
                isMobile ? "w-full text-sm" : ""
              )}
            >
              <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Add Asset
            </Button>
          </div>
        </div>
        
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className={cn(
            "w-full mb-6",
            isMobile ? "h-auto flex-col p-1" : "grid grid-cols-3"
          )}>
            <TabsTrigger 
              value="summary" 
              className={cn(
                isMobile ? "w-full justify-center text-sm py-2" : ""
              )}
            >
              Asset Summary
            </TabsTrigger>
            <TabsTrigger 
              value="allocation"
              className={cn(
                isMobile ? "w-full justify-center text-sm py-2" : ""
              )}
            >
              Asset Allocation
            </TabsTrigger>
            <TabsTrigger 
              value="networth"
              className={cn(
                isMobile ? "w-full justify-center text-sm py-2" : ""
              )}
            >
              Net Worth
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-6">
            <SupabaseAssetsSummary />
            
            <div className={cn(
              "flex items-center",
              isMobile ? "flex-col gap-3 items-start" : "justify-between"
            )}>
              <h3 className={cn(
                "font-semibold",
                isMobile ? "text-base" : "text-lg"
              )}>Asset Details</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "flex items-center gap-2",
                      isMobile ? "w-full text-sm" : ""
                    )}
                  >
                    <Filter className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
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
            <h2 className={cn(
              "font-semibold",
              isMobile ? "text-xl" : "text-2xl"
            )}>Asset Allocation</h2>
            <ComprehensiveAssetsSummary showTabs={false} />
          </TabsContent>
          
          <TabsContent value="networth" className="space-y-6">
            <h2 className={cn(
              "font-semibold",
              isMobile ? "text-xl" : "text-2xl"
            )}>Net Worth Analysis</h2>
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
