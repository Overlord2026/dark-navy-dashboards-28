
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { FileUploadProcessor } from "./FileUploadProcessor";
import { BillReviewForm } from "./BillReviewForm";
import { AIConfidenceIndicator } from "./AIConfidenceIndicator";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CircleDollarSign, FileText, Clock, AlertCircle, Inbox, Upload, CheckCircle, X } from "lucide-react";

// Define bill types
interface Bill {
  id: string;
  fileName: string;
  uploadDate: string;
  vendor: string;
  amount: number;
  dueDate: string;
  category: string;
  status: "reviewing" | "processed" | "needs_review";
  confidenceScores: {
    vendor: number;
    amount: number;
    dueDate: number;
    category: number;
  };
}

export function BillInboxPage() {
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>([
    {
      id: "bill-1",
      fileName: "Electric_Bill_April.pdf",
      uploadDate: "2025-04-03",
      vendor: "Electric Company",
      amount: 142.50,
      dueDate: "2025-04-18",
      category: "Utilities",
      status: "needs_review",
      confidenceScores: {
        vendor: 92,
        amount: 98,
        dueDate: 85,
        category: 95
      }
    },
    {
      id: "bill-2",
      fileName: "Water_Bill_Q2.pdf",
      uploadDate: "2025-04-02",
      vendor: "City Water Services",
      amount: 78.25,
      dueDate: "2025-04-22",
      category: "Utilities",
      status: "processed",
      confidenceScores: {
        vendor: 97,
        amount: 96,
        dueDate: 94,
        category: 98
      }
    },
    {
      id: "bill-3",
      fileName: "Office_Supplies_Invoice.pdf",
      uploadDate: "2025-04-01",
      vendor: "Office Depot",
      amount: 235.87,
      dueDate: "2025-04-15",
      category: "Office Supplies",
      status: "reviewing",
      confidenceScores: {
        vendor: 74,
        amount: 88,
        dueDate: 65,
        category: 58
      }
    }
  ]);
  
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  
  const handleReviewBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsReviewing(true);
  };
  
  const handleUpdateBill = (updatedBill: Bill) => {
    setBills(bills.map(bill => bill.id === updatedBill.id ? updatedBill : bill));
    setIsReviewing(false);
    setSelectedBill(null);
    toast({
      title: "Bill updated",
      description: "The bill has been processed successfully.",
    });
  };
  
  const handleUploadComplete = (newBill: Bill) => {
    setBills(prev => [...prev, newBill]);
    toast({
      title: "Bill uploaded",
      description: "The bill has been uploaded and is being processed.",
    });
  };
  
  const needsReviewCount = bills.filter(bill => bill.status === "needs_review").length;
  
  const getConfidenceLevel = (score: number) => {
    if (score >= 85) return "high";
    if (score >= 70) return "medium";
    return "low";
  };

  return (
    <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Bill Inbox</h1>
        <p className="text-muted-foreground">
          Upload, review, and process your bills with AI assistance.
        </p>
      </div>
      
      {isReviewing && selectedBill ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Review Bill: {selectedBill.fileName}</CardTitle>
              <Button variant="ghost" onClick={() => setIsReviewing(false)}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <BillReviewForm 
              bill={selectedBill} 
              onSave={handleUpdateBill}
              onCancel={() => setIsReviewing(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard 
              title="Total Bills" 
              icon={<FileText className="h-5 w-5" />}
              className="bg-white"
            >
              <p className="text-2xl font-semibold">{bills.length}</p>
            </DashboardCard>
            
            <DashboardCard 
              title="Needs Review" 
              icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
              className="bg-white"
            >
              <p className="text-2xl font-semibold">{needsReviewCount}</p>
            </DashboardCard>
            
            <DashboardCard 
              title="Processed" 
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
              className="bg-white"
            >
              <p className="text-2xl font-semibold">
                {bills.filter(bill => bill.status === "processed").length}
              </p>
            </DashboardCard>
            
            <DashboardCard 
              title="Total Amount" 
              icon={<CircleDollarSign className="h-5 w-5 text-blue-500" />}
              className="bg-white"
            >
              <p className="text-2xl font-semibold">
                ${bills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
              </p>
            </DashboardCard>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => setActiveTab("upload")}>
              <Upload className="h-4 w-4 mr-2" /> Upload New Bill
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="inbox">
                <Inbox className="h-4 w-4 mr-2" /> Bill Inbox
                {needsReviewCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {needsReviewCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" /> Upload Bills
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="inbox" className="space-y-4">
              {bills.length === 0 ? (
                <Card className="flex flex-col items-center justify-center h-60">
                  <CardContent className="p-6 text-center">
                    <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No bills yet</h3>
                    <p className="text-muted-foreground mt-1">
                      Upload your first bill to get started
                    </p>
                    <Button className="mt-4" onClick={() => setActiveTab("upload")}>
                      <Upload className="h-4 w-4 mr-2" /> Upload Bill
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bills.map((bill) => (
                    <Card key={bill.id} className={`transition-colors ${
                      bill.status === "needs_review" ? "border-amber-300 bg-amber-50" : 
                      bill.status === "reviewing" ? "border-blue-300 bg-blue-50" : 
                      "bg-white"
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-slate-100 rounded-full">
                              <FileText className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{bill.fileName}</h3>
                              <div className="text-sm text-muted-foreground">
                                {new Date(bill.uploadDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {bill.status === "needs_review" && (
                              <Badge variant="warning">Needs Review</Badge>
                            )}
                            {bill.status === "reviewing" && (
                              <Badge variant="secondary">Reviewing</Badge>
                            )}
                            {bill.status === "processed" && (
                              <Badge variant="success">Processed</Badge>
                            )}
                            
                            <Button 
                              variant={bill.status === "needs_review" ? "default" : "outline"} 
                              size="sm"
                              onClick={() => handleReviewBill(bill)}
                            >
                              {bill.status === "needs_review" ? "Review Now" : "View"}
                            </Button>
                          </div>
                        </div>
                        
                        {bill.status !== "processed" && (
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Vendor</div>
                              <div className="text-sm font-medium flex items-center">
                                {bill.vendor}
                                <AIConfidenceIndicator
                                  level={getConfidenceLevel(bill.confidenceScores.vendor)}
                                  score={bill.confidenceScores.vendor}
                                  className="ml-2 w-24"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Amount</div>
                              <div className="text-sm font-medium flex items-center">
                                ${bill.amount.toFixed(2)}
                                <AIConfidenceIndicator
                                  level={getConfidenceLevel(bill.confidenceScores.amount)}
                                  score={bill.confidenceScores.amount}
                                  className="ml-2 w-24"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Due Date</div>
                              <div className="text-sm font-medium flex items-center">
                                {new Date(bill.dueDate).toLocaleDateString()}
                                <AIConfidenceIndicator
                                  level={getConfidenceLevel(bill.confidenceScores.dueDate)}
                                  score={bill.confidenceScores.dueDate}
                                  className="ml-2 w-24"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Category</div>
                              <div className="text-sm font-medium flex items-center">
                                {bill.category}
                                <AIConfidenceIndicator
                                  level={getConfidenceLevel(bill.confidenceScores.category)}
                                  score={bill.confidenceScores.category}
                                  className="ml-2 w-24"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {bill.status === "processed" && (
                          <div className="mt-4 grid grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Vendor</div>
                              <div className="text-sm font-medium">{bill.vendor}</div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Amount</div>
                              <div className="text-sm font-medium">${bill.amount.toFixed(2)}</div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Due Date</div>
                              <div className="text-sm font-medium">
                                {new Date(bill.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Category</div>
                              <div className="text-sm font-medium">{bill.category}</div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upload">
              <Card>
                <CardContent className="p-6">
                  <FileUploadProcessor onUploadComplete={handleUploadComplete} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
