
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceTests } from "./PerformanceTests";
import { NavigationTests } from "./NavigationTests";
import { PermissionTests } from "./PermissionTests";
import { SecurityTests } from "./SecurityTests";
import { FormValidationTests } from "./FormValidationTests";
import { QuickFix } from "@/hooks/useDiagnostics";
import { FixHistoryEntry } from "@/types/diagnostics";
import { IconTests } from "./IconTests";

interface DiagnosticsTabsProps {
  results: any;
  recommendations?: QuickFix[];
  isLoading?: boolean;
  fixHistory?: any[];
}

// The component now accepts all the props being passed to it
export const DiagnosticsTabs: React.FC<DiagnosticsTabsProps> = ({ 
  results,
  recommendations = [],
  isLoading = false,
  fixHistory = []
}) => {
  return (
    <Tabs defaultValue="navigation" className="w-full">
      <TabsList className="grid grid-cols-6 mb-4">
        <TabsTrigger value="navigation">Navigation</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="forms">Forms</TabsTrigger>
        <TabsTrigger value="icons">Icons</TabsTrigger>
      </TabsList>
      <TabsContent value="navigation">
        <NavigationTests tests={results.navigationTests || []} />
      </TabsContent>
      <TabsContent value="performance">
        <PerformanceTests tests={results.performanceTests || []} />
      </TabsContent>
      <TabsContent value="permissions">
        <PermissionTests tests={results.permissionTests || []} />
      </TabsContent>
      <TabsContent value="security">
        <SecurityTests tests={results.securityTests || []} />
      </TabsContent>
      <TabsContent value="forms">
        <FormValidationTests tests={results.formValidationTests || []} />
      </TabsContent>
      <TabsContent value="icons">
        <IconTests tests={results.iconTests || []} />
      </TabsContent>
    </Tabs>
  );
};
