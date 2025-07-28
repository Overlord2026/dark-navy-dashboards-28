import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Loader2 } from "lucide-react";

interface ReportType {
  key: string;
  label: string;
  description: string;
  icon: any;
  roles: string[];
}

interface GenerateReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (reportType: string, format: 'pdf' | 'csv') => Promise<void>;
  availableReportTypes: ReportType[];
  generating: boolean;
}

export function GenerateReportModal({
  open,
  onOpenChange,
  onGenerate,
  availableReportTypes,
  generating,
}: GenerateReportModalProps) {
  const [selectedReportType, setSelectedReportType] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv'>('pdf');

  const handleGenerate = async () => {
    if (!selectedReportType) return;
    
    await onGenerate(selectedReportType, selectedFormat);
    
    // Reset form
    setSelectedReportType("");
    setSelectedFormat('pdf');
  };

  const selectedReport = availableReportTypes.find(rt => rt.key === selectedReportType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate New Report
          </DialogTitle>
          <DialogDescription>
            Create a new financial report with your selected parameters.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={selectedReportType} onValueChange={setSelectedReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select a report type" />
              </SelectTrigger>
              <SelectContent>
                {availableReportTypes.map((reportType) => (
                  <SelectItem key={reportType.key} value={reportType.key}>
                    <div className="flex items-center gap-2">
                      <reportType.icon className="h-4 w-4" />
                      <span>{reportType.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Report Preview */}
          {selectedReport && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <selectedReport.icon className="h-4 w-4" />
                  {selectedReport.label}
                </CardTitle>
                <CardDescription>
                  {selectedReport.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-muted-foreground">
                  This report will include your latest financial data and insights.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={selectedFormat} onValueChange={(value: 'pdf' | 'csv') => setSelectedFormat(value)}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="font-medium">PDF</div>
                      <div className="text-xs text-muted-foreground">
                        Professional formatted report
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <div>
                      <div className="font-medium">CSV</div>
                      <div className="text-xs text-muted-foreground">
                        Raw data for analysis
                      </div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generation Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">What to expect:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Report generation takes 10-30 seconds</li>
              <li>• Files are securely stored for 7 days</li>
              <li>• Download link will be available immediately</li>
              {selectedFormat === 'pdf' && (
                <li>• PDF includes charts and formatted data</li>
              )}
              {selectedFormat === 'csv' && (
                <li>• CSV provides raw data for custom analysis</li>
              )}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={generating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={!selectedReportType || generating}
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}