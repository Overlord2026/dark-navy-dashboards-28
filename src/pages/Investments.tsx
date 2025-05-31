
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IntelligentAllocationTab } from "@/components/investments/IntelligentAllocationTab";
import { PrivateMarketsTab } from "@/components/investments/PrivateMarketsTab";

const Investments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "intelligent-allocation";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <ThreeColumnLayout activeMainItem="investments" title="Investments">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Investment Management</h1>
          <p className="text-muted-foreground">
            Manage your investments, explore opportunities, and track performance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="intelligent-allocation">Intelligent Alloc.</TabsTrigger>
            <TabsTrigger value="private-markets">Private Markets</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="intelligent-allocation">
            <IntelligentAllocationTab />
          </TabsContent>

          <TabsContent value="private-markets">
            <PrivateMarketsTab />
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="p-8 text-center border rounded-md">
              <h3 className="font-medium text-lg">Portfolio Overview</h3>
              <p className="text-muted-foreground mt-2">View and manage your investment portfolio</p>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="p-8 text-center border rounded-md">
              <h3 className="font-medium text-lg">Performance Analytics</h3>
              <p className="text-muted-foreground mt-2">Track and analyze your investment performance</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default Investments;
