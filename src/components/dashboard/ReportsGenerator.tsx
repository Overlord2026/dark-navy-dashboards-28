
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { ReportHistory } from "@/components/reports/ReportHistory";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { useReportGeneration } from "@/hooks/useReportGeneration";

export function ReportsGenerator() {
  const {
    selectedReportType,
    setSelectedReportType,
    isGenerating,
    generatedReport,
    handleGenerateReport,
    handleDownload,
  } = useReportGeneration();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Financial Reports
        </CardTitle>
        <CardDescription>
          Generate comprehensive reports of your family's financial assets, liabilities and cash flows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Reports</TabsTrigger>
            <TabsTrigger value="history">Report History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate">
            <ReportGenerator 
              selectedReportType={selectedReportType}
              setSelectedReportType={setSelectedReportType}
              isGenerating={isGenerating}
              generatedReport={generatedReport}
              onGenerate={handleGenerateReport}
              onDownload={handleDownload}
              formatCurrency={formatCurrency}
            />
          </TabsContent>
          
          <TabsContent value="history">
            <ReportHistory />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
