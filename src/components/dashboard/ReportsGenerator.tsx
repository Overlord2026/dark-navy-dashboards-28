import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart3, PieChart, Download, FileSpreadsheet, Clock, ListFilter } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssetsReportPreview } from "@/components/reports/AssetsReportPreview";
import { LiabilitiesReportPreview } from "@/components/reports/LiabilitiesReportPreview";
import { NetWorthReportPreview } from "@/components/reports/NetWorthReportPreview";
import { CashFlowReportPreview } from "@/components/reports/CashFlowReportPreview";
import { CustomReportPreview } from "@/components/reports/CustomReportPreview";

type ReportType = 'assets' | 'liabilities' | 'cashflow' | 'networth' | 'custom';

interface ReportConfig {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  icon: React.ReactNode;
}

export function ReportsGenerator() {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('assets');
  const [timeframe, setTimeframe] = useState<string>("monthly");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<boolean>(false);

  const reportConfigs: ReportConfig[] = [
    {
      id: 'assets-report',
      name: 'Assets Report',
      description: 'Comprehensive breakdown of all assets including properties, investments, cash, and valuables',
      type: 'assets',
      icon: <BarChart3 className="h-5 w-5 text-blue-500" />
    },
    {
      id: 'liabilities-report',
      name: 'Liabilities Report',
      description: 'Summary of all debts, mortgages, loans and financial obligations',
      type: 'liabilities',
      icon: <FileText className="h-5 w-5 text-red-500" />
    },
    {
      id: 'cashflow-report',
      name: 'Cash Flow Report',
      description: 'Analysis of income and expenses over selected time periods',
      type: 'cashflow',
      icon: <FileSpreadsheet className="h-5 w-5 text-green-500" />
    },
    {
      id: 'networth-report',
      name: 'Net Worth Report',
      description: 'Complete financial position including historical trends and projections',
      type: 'networth',
      icon: <PieChart className="h-5 w-5 text-purple-500" />
    },
    {
      id: 'custom-report',
      name: 'Custom Report',
      description: 'Create a tailored report with selected data points and categories',
      type: 'custom',
      icon: <ListFilter className="h-5 w-5 text-amber-500" />
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedReport(true);
      
      toast(`Your ${getSelectedReportConfig().name} has been successfully generated.`);
    }, 1500);
  };

  const handleDownload = (format: 'pdf' | 'csv' | 'excel') => {
    toast(`Your report is being prepared in ${format.toUpperCase()} format.`);
    
    setTimeout(() => {
      toast(`Your ${getSelectedReportConfig().name} has been downloaded.`);
    }, 1000);
  };

  const getSelectedReportConfig = (): ReportConfig => {
    return reportConfigs.find(report => report.type === selectedReportType) || reportConfigs[0];
  };

  const renderReportPreview = () => {
    switch(selectedReportType) {
      case 'assets':
        return <AssetsReportPreview formatCurrency={formatCurrency} />;
      case 'liabilities':
        return <LiabilitiesReportPreview formatCurrency={formatCurrency} />;
      case 'networth':
        return <NetWorthReportPreview formatCurrency={formatCurrency} />;
      case 'cashflow':
        return <CashFlowReportPreview formatCurrency={formatCurrency} />;
      case 'custom':
        return <CustomReportPreview formatCurrency={formatCurrency} />;
      default:
        return <div>Select a report type to preview</div>;
    }
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
          
          <TabsContent value="generate" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Available Reports</h3>
                  <div className="space-y-2">
                    {reportConfigs.map((report) => (
                      <div 
                        key={report.id}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedReportType === report.type 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedReportType(report.type)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 ${selectedReportType === report.type ? 'text-primary-foreground' : ''}`}>
                            {report.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{report.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="w-full" 
                    onClick={handleGenerateReport} 
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>Generating Report... <Clock className="ml-2 h-4 w-4 animate-spin" /></>
                    ) : (
                      <>Generate Report</>
                    )}
                  </Button>
                </div>
                
                {generatedReport && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-sm font-medium">Download Report</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload('pdf')}>
                        <FileText className="mr-2 h-4 w-4" /> PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload('csv')}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload('excel')}>
                        <Download className="mr-2 h-4 w-4" /> Excel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-3 border rounded-md p-4 bg-background/50">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  {getSelectedReportConfig().icon}
                  <span className="ml-2">{getSelectedReportConfig().name} Preview</span>
                </h3>
                {renderReportPreview()}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Q1 2025 Net Worth Report</TableCell>
                    <TableCell>April 1, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline">PDF</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024 Annual Assets Report</TableCell>
                    <TableCell>January 15, 2025</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="outline">PDF</Badge>
                        <Badge variant="outline">Excel</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
