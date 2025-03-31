
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImportPreviewTable } from "./ImportPreviewTable";
import { WebsiteScraper } from "./WebsiteScraper";
import { Database, FileSpreadsheet, Upload, RefreshCw, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { FamilyOffice } from "@/types/familyoffice";

export function DataImportInterface() {
  const [activeTab, setActiveTab] = useState<string>("file-upload");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [previewData, setPreviewData] = useState<Partial<FamilyOffice>[]>([
    {
      name: "Example Family Office",
      location: "New York, NY",
      tier: "advanced",
      minimumAssets: 25,
      aum: 3.5,
      foundedYear: 2005,
      wealthTiers: ["uhnw"]
    }
  ]);
  const isMobile = useIsMobile();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Simulate processing
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setFileUploaded(true);
        toast.success("File uploaded successfully");
      }, 1500);
    }
  };
  
  const handleImport = () => {
    setIsLoading(true);
    // Simulate import process
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Data imported successfully to the directory");
      setFileUploaded(false);
      setFileName("");
    }, 2000);
  };
  
  const resetForm = () => {
    setFileUploaded(false);
    setFileName("");
  };

  const handleDataChange = (newData: Partial<FamilyOffice>[]) => {
    setPreviewData(newData);
  };

  const handleDataRetrieved = (data: Partial<FamilyOffice>[]) => {
    setPreviewData(data);
    setFileUploaded(true);
    setActiveTab("file-upload");
    toast.success(`Retrieved ${data.length} family office records`);
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Family Office Data Import Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 mb-4">
            <TabsTrigger value="file-upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>File Upload</span>
            </TabsTrigger>
            <TabsTrigger value="scraper" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Website Scraper</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Manual Entry</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="file-upload" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Supported Formats</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Excel (.xlsx, .xls)</li>
                  <li>CSV (.csv)</li>
                  <li>JSON (.json)</li>
                </ul>
              </div>
              
              {!fileUploaded ? (
                <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">Drag and drop your file here or click to browse</p>
                    <Label
                      htmlFor="file-upload"
                      className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      Select File
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls,.csv,.json"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Check className="h-6 w-6 text-green-500" />
                    <div>
                      <h4 className="font-medium">File Ready for Import</h4>
                      <p className="text-sm text-muted-foreground">{fileName}</p>
                    </div>
                  </div>
                  
                  <ImportPreviewTable 
                    data={previewData}
                    onDataChange={handleDataChange}
                  />
                  
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button onClick={handleImport} disabled={isLoading} className="flex items-center gap-2">
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                      {isLoading ? "Importing..." : "Import to Directory"}
                    </Button>
                    <Button variant="outline" onClick={resetForm} disabled={isLoading}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="scraper">
            <WebsiteScraper onDataRetrieved={handleDataRetrieved} />
          </TabsContent>
          
          <TabsContent value="manual">
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  Manual entry should be used only for data that cannot be imported through other methods. 
                  For bulk imports, please use the file upload feature.
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firm-name">Family Office Name</Label>
                  <Input id="firm-name" placeholder="Enter family office name" />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="City, State, or Region" />
                </div>
                <div>
                  <Label htmlFor="aum">Assets Under Management</Label>
                  <Input id="aum" placeholder="e.g. $500M-$1B" />
                </div>
                <div>
                  <Label htmlFor="service-area">Primary Service Area</Label>
                  <Input id="service-area" placeholder="e.g. Wealth Management" />
                </div>
              </div>
              
              <Button className="mt-2">Add Family Office</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
