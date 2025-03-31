
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { WebsiteScraper } from "@/components/familyoffice/WebsiteScraper";
import { useToast } from "@/hooks/use-toast";
import { FolderUp, FileSpreadsheet, Globe, Database, RotateCw } from "lucide-react";
import { FamilyOffice } from "@/types/familyoffice";
import { ImportPreviewTable } from "@/components/familyoffice/ImportPreviewTable";

export function DataImportInterface() {
  const { toast } = useToast();
  const [importTab, setImportTab] = useState("file-upload");
  const [previewData, setPreviewData] = useState<Partial<FamilyOffice>[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [apiUrl, setApiUrl] = useState("");

  const handleFileUpload = (file: File) => {
    // Only allow CSV, JSON, or Excel files
    if (!file.name.match(/\.(csv|json|xlsx|xls)$/i)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV, JSON, or Excel file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // For demo purposes, we'll simulate parsing the file
        // In a real implementation, you would use a library like papaparse for CSV
        // or xlsx for Excel files
        
        // Sample data for demonstration
        const sampleData = [
          {
            name: "Wellington Family Office",
            location: "Boston, MA",
            description: "Comprehensive wealth management services for UHNW families",
            foundedYear: 1995,
            minimumAssets: 25,
            aum: 3.5,
            tier: "advanced" as const,
            wealthTiers: ["uhnw"],
          },
          {
            name: "Prosperity Partners Family Office",
            location: "Chicago, IL",
            description: "Midwest's premier multi-family office for entrepreneurs",
            foundedYear: 2003,
            minimumAssets: 10,
            aum: 1.2,
            tier: "intermediate" as const,
            wealthTiers: ["hnw", "uhnw"],
          }
        ];
        
        setPreviewData(sampleData);
        toast({
          title: "File parsed successfully",
          description: `Found ${sampleData.length} family office records for review`,
        });
      } catch (error) {
        console.error("Error parsing file:", error);
        toast({
          title: "Error parsing file",
          description: "The file format could not be processed. Please check the file and try again.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  };

  const handleApiImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiUrl) {
      toast({
        title: "API URL required",
        description: "Please enter a valid API URL to import data",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Sample data for demonstration
      const apiData = [
        {
          name: "Heritage Wealth Partners",
          location: "San Francisco, CA",
          description: "Tech-focused family office serving Silicon Valley executives",
          foundedYear: 2010,
          minimumAssets: 15,
          aum: 2.1,
          tier: "advanced" as const,
          wealthTiers: ["hnw", "uhnw"],
        },
        {
          name: "Coastal Family Advisors",
          location: "Miami, FL",
          description: "South Florida's leading family office for international clients",
          foundedYear: 2008,
          minimumAssets: 5,
          aum: 0.8,
          tier: "intermediate" as const,
          wealthTiers: ["affluent", "hnw"],
        }
      ];
      
      setPreviewData(apiData);
      setIsImporting(false);
      
      toast({
        title: "API data retrieved",
        description: `Found ${apiData.length} family office records for review`,
      });
    }, 1500);
  };

  const handleDataImport = () => {
    if (previewData.length === 0) {
      toast({
        title: "No data to import",
        description: "Please upload a file or fetch API data first",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      toast({
        title: "Data imported successfully",
        description: `${previewData.length} family office records have been added to the directory`,
      });
      
      // Clear preview data after successful import
      setPreviewData([]);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Family Office Directory Data Import</h1>
      <p className="text-muted-foreground">
        Import family office data from various sources to populate the directory. All imported data will be reviewed for compliance and accuracy.
      </p>

      <Tabs value={importTab} onValueChange={setImportTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="file-upload" className="flex items-center gap-2">
            <FolderUp className="h-4 w-4" />
            File Upload
          </TabsTrigger>
          <TabsTrigger value="api-import" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            API Import
          </TabsTrigger>
          <TabsTrigger value="website-scraper" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Website Scraper
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="file-upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Import from File</CardTitle>
              <CardDescription>
                Upload CSV, JSON, or Excel files containing family office data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="fileUpload">Upload Data File</Label>
                  <FileUpload
                    onFileChange={handleFileUpload}
                    accept=".csv,.json,.xlsx,.xls"
                    maxSize={10 * 1024 * 1024} // 10MB
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: CSV, JSON, Excel (.xlsx, .xls) up to 10MB
                  </p>
                </div>
                
                <div className="mt-4">
                  <Label>File Template</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Download CSV Template
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Download Excel Template
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-import" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Import from API</CardTitle>
              <CardDescription>
                Connect to external APIs to import family office data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApiImport} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="apiUrl">API Endpoint URL</Label>
                  <Input
                    id="apiUrl"
                    placeholder="https://api.example.com/family-offices"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the API URL endpoint that returns family office data in JSON format
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="apiKey">API Key (Optional)</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Your API key"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="mt-2"
                  disabled={isImporting}
                >
                  {isImporting ? (
                    <>
                      <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                      Fetching Data...
                    </>
                  ) : "Fetch API Data"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="website-scraper" className="mt-6">
          <WebsiteScraper onDataRetrieved={setPreviewData} />
        </TabsContent>
      </Tabs>

      {previewData.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold">Data Preview</h2>
          <p className="text-muted-foreground">
            Review the data before importing it into the directory. You can modify the data directly in the table.
          </p>
          
          <ImportPreviewTable 
            data={previewData} 
            onDataChange={setPreviewData} 
          />
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleDataImport} 
              className="flex items-center gap-2"
              disabled={isImporting}
            >
              {isImporting ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Import Data to Directory
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
