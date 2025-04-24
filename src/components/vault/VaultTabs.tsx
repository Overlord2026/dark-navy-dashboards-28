
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VaultIcon, ArchiveIcon, HeartPulseIcon } from "lucide-react";
import { DocumentManagementTab } from "./DocumentManagementTab";
import { FamilyLegacyBox } from "@/components/estate-planning/FamilyLegacyBox";
import { HealthcareFolder } from "@/components/healthcare/HealthcareFolder";

export function VaultTabs() {
  return (
    <Tabs defaultValue="documents" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="documents" className="flex items-center gap-2">
          <VaultIcon className="h-4 w-4" />
          Important Documents
        </TabsTrigger>
        <TabsTrigger value="legacy-box" className="flex items-center gap-2">
          <ArchiveIcon className="h-4 w-4" />
          Family Legacy Box
        </TabsTrigger>
        <TabsTrigger value="healthcare" className="flex items-center gap-2">
          <HeartPulseIcon className="h-4 w-4" />
          Healthcare
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="documents">
        <DocumentManagementTab />
      </TabsContent>
      
      <TabsContent value="legacy-box">
        <FamilyLegacyBox />
      </TabsContent>

      <TabsContent value="healthcare">
        <HealthcareFolder />
      </TabsContent>
    </Tabs>
  );
}
