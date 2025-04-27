
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HSAManagement } from "@/components/healthcare/HSAManagement";
import { HealthcareFolder } from "@/components/healthcare/HealthcareFolder";
import { HealthInsuranceTab } from "@/components/insurance/HealthInsuranceTab";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulseIcon, FolderIcon, WalletIcon } from "lucide-react";
import { ProfessionalsProvider } from "@/context/ProfessionalsContext";

export default function Healthcare() {
  const [activeTab, setActiveTab] = useState("hsa");
  const [documents, setDocuments] = useState<any[]>([]);
  
  const handleAddDocument = (document: any) => {
    setDocuments(prev => [...prev, document]);
  };
  
  const handleCreateFolder = (folderName: string, category: string = "general") => {
    const newFolder = {
      id: Math.random().toString(36).substring(2, 9),
      name: folderName,
      type: "folder",
      category: category,
      created: new Date().toISOString(),
    };
    
    setDocuments(prev => [...prev, newFolder]);
  };
  
  return (
    <ThreeColumnLayout activeMainItem="healthcare" title="Healthcare Management">
      <ProfessionalsProvider>
        <div className="container mx-auto p-4 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">Healthcare Management</h1>
              <p className="text-muted-foreground">Manage your family's healthcare finances and documents</p>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="hsa" className="flex items-center gap-2">
                <WalletIcon className="h-4 w-4" />
                HSA Management
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FolderIcon className="h-4 w-4" />
                Healthcare Documents
              </TabsTrigger>
              <TabsTrigger value="insurance" className="flex items-center gap-2">
                <HeartPulseIcon className="h-4 w-4" />
                Health Insurance
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="hsa" className="space-y-4">
              <HSAManagement />
            </TabsContent>
            
            <TabsContent value="documents">
              <HealthcareFolder 
                documents={documents} 
                onAddDocument={handleAddDocument}
                onCreateFolder={handleCreateFolder}
              />
            </TabsContent>
            
            <TabsContent value="insurance">
              <HealthInsuranceTab />
            </TabsContent>
          </Tabs>
        </div>
      </ProfessionalsProvider>
    </ThreeColumnLayout>
  );
}
