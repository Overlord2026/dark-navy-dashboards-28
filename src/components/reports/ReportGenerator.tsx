
import { Button } from "@/components/ui/button";
import { Clock, Download, FileText, FileSpreadsheet } from "lucide-react";
import { reportConfigs } from "@/config/reportConfigs";
import { ReportType } from "@/types/reports";
import { AssetsReportPreview } from "@/components/reports/AssetsReportPreview";
import { LiabilitiesReportPreview } from "@/components/reports/LiabilitiesReportPreview";
import { NetWorthReportPreview } from "@/components/reports/NetWorthReportPreview";
import { CashFlowReportPreview } from "@/components/reports/CashFlowReportPreview";
import { CustomReportPreview } from "@/components/reports/CustomReportPreview";

interface ReportGeneratorProps {
  selectedReportType: ReportType;
  setSelectedReportType: (type: ReportType) => void;
  isGenerating: boolean;
  generatedReport: boolean;
  onGenerate: (reportName: string) => void;
  onDownload: (format: 'pdf' | 'csv' | 'excel', reportName: string) => void;
  formatCurrency: (amount: number) => string;
}

export function ReportGenerator({
  selectedReportType,
  setSelectedReportType,
  isGenerating,
  generatedReport,
  onGenerate,
  onDownload,
  formatCurrency,
}: ReportGeneratorProps) {
  const selectedConfig = reportConfigs.find(report => report.type === selectedReportType) || reportConfigs[0];

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
            onClick={() => onGenerate(selectedConfig.name)} 
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
              <Button variant="outline" size="sm" onClick={() => onDownload('pdf', selectedConfig.name)}>
                <FileText className="mr-2 h-4 w-4" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDownload('csv', selectedConfig.name)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDownload('excel', selectedConfig.name)}>
                <Download className="mr-2 h-4 w-4" /> Excel
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="md:col-span-3 border rounded-md p-4 bg-background/50">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          {selectedConfig.icon}
          <span className="ml-2">{selectedConfig.name} Preview</span>
        </h3>
        {renderReportPreview()}
      </div>
    </div>
  );
}
