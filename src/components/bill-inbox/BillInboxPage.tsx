
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUploadProcessor, ParsedBillData } from "./FileUploadProcessor";
import { BillReviewForm, BillFormData } from "./BillReviewForm";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, Inbox, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IntegrationStatusBadge } from "@/components/integrations/IntegrationStatusBadge";

interface ProcessedBill extends BillFormData {
  id: number;
  status: "processed" | "needs-review";
  dateProcessed: string;
}

export function BillInboxPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  const [currentStep, setCurrentStep] = useState<"upload" | "review" | "done">("upload");
  const [parsedData, setParsedData] = useState<ParsedBillData | null>(null);
  const [processedBills, setProcessedBills] = useState<ProcessedBill[]>([
    {
      id: 1,
      vendorName: "AT&T Mobile",
      amount: 89.99,
      dueDate: "2025-04-20",
      category: "Utilities",
      rememberVendor: true,
      status: "processed",
      dateProcessed: "2025-04-03",
    },
    {
      id: 2,
      vendorName: "City Water Services",
      amount: 65.45,
      dueDate: "2025-04-15",
      category: "Utilities",
      rememberVendor: true,
      status: "processed",
      dateProcessed: "2025-04-02",
    },
    {
      id: 3,
      vendorName: "Unknown Vendor",
      amount: 156.78,
      dueDate: "2025-05-01",
      category: "Other",
      rememberVendor: false,
      status: "needs-review",
      dateProcessed: "2025-04-04",
    }
  ]);
  const [needsReviewCount, setNeedsReviewCount] = useState(1);

  const handleProcessComplete = (data: ParsedBillData) => {
    setParsedData(data);
    setCurrentStep("review");
  };

  const handleConfirmBill = (data: BillFormData) => {
    // Would normally save this to a database
    const newProcessedBill: ProcessedBill = {
      ...data,
      id: Date.now(),
      status: "processed",
      dateProcessed: new Date().toISOString().split('T')[0],
    };

    setProcessedBills(prev => [newProcessedBill, ...prev]);
    
    toast({
      title: "Bill processed successfully",
      description: `${data.vendorName} bill has been added for $${data.amount}`,
      duration: 3000,
    });

    setCurrentStep("done");
    setActiveTab("processed");
  };

  const handleResetUpload = () => {
    setParsedData(null);
    setCurrentStep("upload");
  };

  const handleLearnCorrections = (billId: number) => {
    toast({
      title: "AI Learning Applied",
      description: "Our AI will remember your corrections for future bills from this vendor",
      duration: 3000,
    });
    
    // Update the bill status
    setProcessedBills(prev => 
      prev.map(bill => 
        bill.id === billId ? { ...bill, status: "processed" } : bill
      )
    );
    
    // Update the needs review count
    setNeedsReviewCount(prev => Math.max(0, prev - 1));
  };

  const renderUploadStep = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FileUploadProcessor onProcessComplete={handleProcessComplete} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-4 pl-5">
            <li className="text-sm">
              <span className="font-medium block">Upload Your Bill</span>
              <p className="text-muted-foreground">Upload a PDF or image of your bill. We accept most common file formats.</p>
            </li>
            <li className="text-sm">
              <span className="font-medium block">AI Extracts Data</span>
              <p className="text-muted-foreground">Our AI will automatically identify the vendor name, amount, due date, and suggest a category.</p>
            </li>
            <li className="text-sm">
              <span className="font-medium block">Review & Confirm</span>
              <p className="text-muted-foreground">Verify the extracted information and make any necessary corrections.</p>
            </li>
            <li className="text-sm">
              <span className="font-medium block">Improve Future Scans</span>
              <p className="text-muted-foreground">Our AI learns from your corrections, making future bill processing more accurate.</p>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );

  const renderReviewStep = () => (
    <div className="grid grid-cols-1 gap-6">
      {parsedData && (
        <BillReviewForm 
          parsedData={parsedData}
          onConfirm={handleConfirmBill}
          onCancel={handleResetUpload}
        />
      )}
    </div>
  );

  const renderProcessedBills = () => (
    <div className="space-y-4">
      {processedBills
        .filter(bill => bill.status === "processed")
        .map((bill) => (
          <Card key={bill.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{bill.vendorName}</h3>
                    <p className="text-sm text-muted-foreground">{bill.category} • Due {new Date(bill.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Processed on {new Date(bill.dateProcessed).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
      {processedBills.filter(bill => bill.status === "processed").length === 0 && (
        <div className="text-center py-10">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="font-medium text-lg mb-2">No processed bills</h3>
          <p className="text-muted-foreground mb-4">Upload a bill to get started</p>
          <Button onClick={() => setActiveTab("upload")}>
            Upload Bill
          </Button>
        </div>
      )}
    </div>
  );

  const renderNeedsReviewBills = () => (
    <div className="space-y-4">
      {processedBills
        .filter(bill => bill.status === "needs-review")
        .map((bill) => (
          <Card key={bill.id} className="hover:shadow-sm transition-shadow border-yellow-200">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{bill.vendorName}</h3>
                        <IntegrationStatusBadge status="low-confidence" className="ml-2" />
                      </div>
                      <p className="text-sm text-muted-foreground">{bill.category} • Due {new Date(bill.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Processed on {new Date(bill.dateProcessed).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    This bill needs review due to low confidence in vendor identification.
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleLearnCorrections(bill.id)}
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Learn
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
      {processedBills.filter(bill => bill.status === "needs-review").length === 0 && (
        <div className="text-center py-10">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 opacity-50 mb-4" />
          <h3 className="font-medium text-lg mb-2">No bills need review</h3>
          <p className="text-muted-foreground">All your bills have been processed successfully</p>
        </div>
      )}
    </div>
  );

  return (
    <ThreeColumnLayout title="Bill Inbox" activeMainItem="Cash Management">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <DashboardHeader 
          heading="Bill Inbox" 
          text="Upload your bills and let our AI help you process them automatically."
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upload">Upload & Process</TabsTrigger>
            <TabsTrigger value="processed">
              Processed
              <Badge variant="default" className="ml-2 bg-green-500">{processedBills.filter(b => b.status === "processed").length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="needs-review">
              Needs Review
              {needsReviewCount > 0 && (
                <Badge variant="destructive" className="ml-2">{needsReviewCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="upload" className="mt-0">
              {currentStep === "upload" && renderUploadStep()}
              {currentStep === "review" && renderReviewStep()}
              {currentStep === "done" && (
                <div className="text-center py-10">
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Bill Processed!</h2>
                  <p className="text-muted-foreground mb-6">Your bill has been successfully processed and added to your list</p>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={handleResetUpload}>
                      Process Another Bill
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("processed")}>
                      View All Bills
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="processed" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Inbox className="h-5 w-5" />
                    Processed Bills
                  </CardTitle>
                  <CardDescription>
                    Bills that have been successfully processed by our AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderProcessedBills()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="needs-review" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Bills Needing Review
                  </CardTitle>
                  <CardDescription>
                    Bills that our AI couldn't process with high confidence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderNeedsReviewBills()}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
