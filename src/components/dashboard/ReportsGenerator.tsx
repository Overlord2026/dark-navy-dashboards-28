
import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart3, PieChart, Download, FileSpreadsheet, Clock, ListFilter } from "lucide-react";
import { toast } from "sonner";
import { useNetWorth } from "@/context/NetWorthContext";
import { ReportsErrorBoundary } from "@/components/reports/ReportsErrorBoundary";
import { ReportGeneratorSkeleton } from "@/components/ui/skeletons/ReportsSkeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Report types
type ReportType = 'assets' | 'liabilities' | 'cashflow' | 'networth' | 'custom';

interface ReportConfig {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  icon: React.ReactNode;
}

export function ReportsGenerator() {
  const { assets, getTotalNetWorth, getTotalAssetsByType } = useNetWorth();
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('assets');
  const [timeframe, setTimeframe] = useState<string>("monthly");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<boolean>(false);

  // Memoized report configurations
  const reportConfigs = useMemo(() => [

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
  ], []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation with a delay
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedReport(true);
      
      toast.success(`Your ${getSelectedReportConfig().name} has been successfully generated.`);
    }, 1500);
  };

  const handleDownload = (format: 'pdf' | 'csv' | 'excel') => {
    toast.success(`Your report is being prepared in ${format.toUpperCase()} format.`);
    
    // Simulate download delay
    setTimeout(() => {
      toast.success(`Your ${getSelectedReportConfig().name} has been downloaded.`);
    }, 1000);
  };

  const getSelectedReportConfig = (): ReportConfig => {
    return reportConfigs.find(report => report.type === selectedReportType) || reportConfigs[0];
  };

  // Renders a placeholder report component based on the selected type
  const renderReportPreview = () => {
    switch(selectedReportType) {
      case 'assets':
        return <AssetsReportPreview assets={assets} formatCurrency={formatCurrency} />;
      case 'liabilities':
        return <LiabilitiesReportPreview formatCurrency={formatCurrency} />;
      case 'networth':
        return <NetWorthReportPreview 
          getTotalNetWorth={getTotalNetWorth} 
          getTotalAssetsByType={getTotalAssetsByType}
          formatCurrency={formatCurrency}
        />;
      case 'cashflow':
        return <CashFlowReportPreview timeframe={timeframe} formatCurrency={formatCurrency} />;
      case 'custom':
        return <CustomReportPreview />;
      default:
        return <div>Select a report type to preview</div>;
    }
  };

  return (
    <ReportsErrorBoundary>
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
                
                {selectedReportType === 'cashflow' && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Report Timeframe</h3>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="ytd">Year to Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
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
    </ReportsErrorBoundary>
  );
}

// Individual report preview components

interface AssetsReportPreviewProps {
  assets: any[];
  formatCurrency: (amount: number) => string;
}

const AssetsReportPreview: React.FC<AssetsReportPreviewProps> = ({ assets, formatCurrency }) => {
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-500/10 rounded-md">
          <div className="text-sm text-blue-700 dark:text-blue-400">Total Assets</div>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
        </div>
        <div className="p-4 bg-green-500/10 rounded-md">
          <div className="text-sm text-green-700 dark:text-green-400">Asset Count</div>
          <div className="text-2xl font-bold">{assets.length}</div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {asset.type}
                  </Badge>
                </TableCell>
                <TableCell>{asset.owner}</TableCell>
                <TableCell className="text-right">{formatCurrency(asset.value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

interface LiabilitiesReportPreviewProps {
  formatCurrency: (amount: number) => string;
}

const LiabilitiesReportPreview: React.FC<LiabilitiesReportPreviewProps> = ({ formatCurrency }) => {
  // Mock liabilities data
  const liabilities = [
    { id: 'liab1', name: 'Primary Mortgage', type: 'mortgage', balance: 685000, owner: 'Tom Brady', interestRate: 3.75 },
    { id: 'liab2', name: 'Auto Loan', type: 'auto', balance: 48210, owner: 'Tom Brady', interestRate: 4.25 },
    { id: 'liab3', name: 'Student Loan', type: 'education', balance: 72000, owner: 'Tom Brady', interestRate: 5.5 },
    { id: 'liab4', name: 'Credit Card', type: 'revolving', balance: 40000, owner: 'Tom Brady', interestRate: 18.99 }
  ];
  
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.balance, 0);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-red-500/10 rounded-md">
          <div className="text-sm text-red-700 dark:text-red-400">Total Liabilities</div>
          <div className="text-2xl font-bold">{formatCurrency(totalLiabilities)}</div>
        </div>
        <div className="p-4 bg-orange-500/10 rounded-md">
          <div className="text-sm text-orange-700 dark:text-orange-400">Average Interest Rate</div>
          <div className="text-2xl font-bold">
            {(liabilities.reduce((sum, liability) => sum + liability.interestRate, 0) / liabilities.length).toFixed(2)}%
          </div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Liability</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liabilities.map((liability) => (
              <TableRow key={liability.id}>
                <TableCell className="font-medium">{liability.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {liability.type}
                  </Badge>
                </TableCell>
                <TableCell>{liability.interestRate}%</TableCell>
                <TableCell className="text-right">{formatCurrency(liability.balance)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

interface NetWorthReportPreviewProps {
  getTotalNetWorth: () => number;
  getTotalAssetsByType: (type: string) => number;
  formatCurrency: (amount: number) => string;
}

const NetWorthReportPreview: React.FC<NetWorthReportPreviewProps> = ({ 
  getTotalNetWorth, 
  getTotalAssetsByType,
  formatCurrency 
}) => {
  const totalAssets = getTotalNetWorth();
  const totalLiabilities = 845210; // Mock value to match existing functionality
  const netWorth = totalAssets - totalLiabilities;
  
  const propertyValue = getTotalAssetsByType('property');
  const investmentsValue = getTotalAssetsByType('investment');
  const cashValue = getTotalAssetsByType('cash');
  const retirementValue = getTotalAssetsByType('retirement');
  const otherValue = getTotalAssetsByType('other');
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-500/10 rounded-md">
          <div className="text-sm text-blue-700 dark:text-blue-400">Total Assets</div>
          <div className="text-2xl font-bold">{formatCurrency(totalAssets)}</div>
        </div>
        <div className="p-4 bg-red-500/10 rounded-md">
          <div className="text-sm text-red-700 dark:text-red-400">Total Liabilities</div>
          <div className="text-2xl font-bold">{formatCurrency(totalLiabilities)}</div>
        </div>
        <div className="p-4 bg-purple-500/10 rounded-md">
          <div className="text-sm text-purple-700 dark:text-purple-400">Net Worth</div>
          <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Asset Allocation</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span>Real Estate</span>
              <span>{formatCurrency(propertyValue)}</span>
            </div>
            <Progress value={(propertyValue / totalAssets) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span>Investments</span>
              <span>{formatCurrency(investmentsValue)}</span>
            </div>
            <Progress value={(investmentsValue / totalAssets) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span>Cash & Equivalents</span>
              <span>{formatCurrency(cashValue)}</span>
            </div>
            <Progress value={(cashValue / totalAssets) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span>Retirement Accounts</span>
              <span>{formatCurrency(retirementValue)}</span>
            </div>
            <Progress value={(retirementValue / totalAssets) * 100} className="h-2" />
          </div>
          {otherValue > 0 && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span>Other Assets</span>
                <span>{formatCurrency(otherValue)}</span>
              </div>
              <Progress value={(otherValue / totalAssets) * 100} className="h-2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface CashFlowReportPreviewProps {
  timeframe: string;
  formatCurrency: (amount: number) => string;
}

const CashFlowReportPreview: React.FC<CashFlowReportPreviewProps> = ({ timeframe, formatCurrency }) => {
  // Mock cash flow data
  const cashFlowData = {
    income: [
      { name: 'Primary Salary', amount: 25000 },
      { name: 'Secondary Income', amount: 5000 },
      { name: 'Investment Income', amount: 3500 },
      { name: 'Rental Income', amount: 4200 }
    ],
    expenses: [
      { name: 'Housing', amount: 8500 },
      { name: 'Transportation', amount: 1200 },
      { name: 'Food & Dining', amount: 2000 },
      { name: 'Utilities', amount: 850 },
      { name: 'Healthcare', amount: 1500 },
      { name: 'Education', amount: 750 },
      { name: 'Entertainment', amount: 1000 },
      { name: 'Travel', amount: 1200 }
    ]
  };
  
  const totalIncome = cashFlowData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = cashFlowData.expenses.reduce((sum, item) => sum + item.amount, 0);
  const netCashFlow = totalIncome - totalExpenses;
  
  const timeframeMultiplier = timeframe === 'monthly' ? 1 : 
                              timeframe === 'quarterly' ? 3 : 
                              timeframe === 'annual' ? 12 : 
                              timeframe === 'ytd' ? 4 : 1;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-500/10 rounded-md">
          <div className="text-sm text-green-700 dark:text-green-400">Total Income</div>
          <div className="text-2xl font-bold">{formatCurrency(totalIncome * timeframeMultiplier)}</div>
        </div>
        <div className="p-4 bg-red-500/10 rounded-md">
          <div className="text-sm text-red-700 dark:text-red-400">Total Expenses</div>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses * timeframeMultiplier)}</div>
        </div>
        <div className="p-4 bg-blue-500/10 rounded-md">
          <div className="text-sm text-blue-700 dark:text-blue-400">Net Cash Flow</div>
          <div className="text-2xl font-bold">{formatCurrency(netCashFlow * timeframeMultiplier)}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-medium mb-2">Income Sources</h4>
          <div className="space-y-3">
            {cashFlowData.income.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span>{item.name}</span>
                  <span>{formatCurrency(item.amount * timeframeMultiplier)}</span>
                </div>
                <Progress 
                  value={(item.amount / totalIncome) * 100} 
                  className="h-2 bg-green-100 dark:bg-green-950" 
                  indicatorClassName="bg-green-500"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium mb-2">Expense Categories</h4>
          <div className="space-y-3">
            {cashFlowData.expenses.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span>{item.name}</span>
                  <span>{formatCurrency(item.amount * timeframeMultiplier)}</span>
                </div>
                <Progress 
                  value={(item.amount / totalExpenses) * 100} 
                  className="h-2 bg-red-100 dark:bg-red-950" 
                  indicatorClassName="bg-red-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomReportPreview: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-md h-[300px]">
      <ListFilter className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Custom Report Configuration</h3>
      <p className="text-muted-foreground mb-4">
        Select the data points and components you'd like to include in your custom report.
      </p>
      <Button variant="outline">Configure Custom Report</Button>
    </div>
  );
};
