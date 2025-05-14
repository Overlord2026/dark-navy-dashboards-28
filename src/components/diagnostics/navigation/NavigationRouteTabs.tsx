import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusIcon, getStatusColor } from "../StatusIcon";
import { Badge } from "@/components/ui/badge-extended";
import { DiagnosticTestStatus } from "@/types/diagnostics";

interface NavigationTestItem {
  route: string;
  status: DiagnosticTestStatus;
  message?: string;
  component?: string;
  errorType?: string;
  attemptCount?: number;
  lastTested?: string;
  relatedFiles?: string[];
}

interface NavigationRouteTabsProps {
  results: Record<string, NavigationTestItem[]>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function NavigationRouteTabs({ 
  results, 
  activeTab, 
  setActiveTab 
}: NavigationRouteTabsProps) {
  const renderTabContent = (categoryKey: string) => {
    if (!results) {
      return <p>No results available</p>;
    }
    
    const testResults = 
      categoryKey === "all" 
        ? Object.values(results).flat() 
        : results[categoryKey] || [];
    
    return (
      <div className="space-y-3">
        {testResults.map((test, index) => (
          <div key={index} className={`p-3 rounded-md border ${getStatusColor(test.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon status={test.status} />
                <span className="font-medium">{test.route}</span>
              </div>
              <Badge variant={
                test.status === "success" ? "success" : 
                test.status === "warning" ? "outline" : "destructive"
              }>
                {test.status}
              </Badge>
            </div>
            <p className="text-sm mt-1">{test.message}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-6">
        <TabsTrigger value="all">All Routes</TabsTrigger>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="educationSolutions">Education</TabsTrigger>
        <TabsTrigger value="familyWealth">Family Wealth</TabsTrigger>
        <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        <TabsTrigger value="investments">Investments</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-4">
        {renderTabContent("all")}
      </TabsContent>
      
      <TabsContent value="home" className="mt-4">
        {renderTabContent("home")}
      </TabsContent>
      
      <TabsContent value="educationSolutions" className="mt-4">
        {renderTabContent("educationSolutions")}
      </TabsContent>
      
      <TabsContent value="familyWealth" className="mt-4">
        {renderTabContent("familyWealth")}
      </TabsContent>
      
      <TabsContent value="collaboration" className="mt-4">
        {renderTabContent("collaboration")}
      </TabsContent>
      
      <TabsContent value="investments" className="mt-4">
        {renderTabContent("investments")}
      </TabsContent>
    </Tabs>
  );
}
