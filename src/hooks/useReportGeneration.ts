
import { useState } from "react";
import { toast } from "sonner";
import { ReportType } from "@/types/reports";

export interface ReportConfig {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  icon: React.ReactNode;
}

export function useReportGeneration() {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('assets');
  const [timeframe, setTimeframe] = useState<string>("monthly");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<boolean>(false);

  const handleGenerateReport = (reportName: string) => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedReport(true);
      toast(`Your ${reportName} has been successfully generated.`);
    }, 1500);
  };

  const handleDownload = (format: 'pdf' | 'csv' | 'excel', reportName: string) => {
    toast(`Your report is being prepared in ${format.toUpperCase()} format.`);
    
    setTimeout(() => {
      toast(`Your ${reportName} has been downloaded.`);
    }, 1000);
  };

  return {
    selectedReportType,
    setSelectedReportType,
    timeframe,
    setTimeframe,
    isGenerating,
    generatedReport,
    handleGenerateReport,
    handleDownload,
  };
}
