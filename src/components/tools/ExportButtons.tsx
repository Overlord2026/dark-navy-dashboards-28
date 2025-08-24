import React from 'react';
import { Download, Archive, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';

interface ExportButtonsProps {
  toolKey: string;
  csvEnabled?: boolean;
  zipEnabled?: boolean;
  onCsvExport?: () => void;
  onZipExport?: () => void;
  className?: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  toolKey,
  csvEnabled = true,
  zipEnabled = true,
  onCsvExport,
  onZipExport,
  className = ''
}) => {
  const handleCsvExport = () => {
    if (onCsvExport) {
      onCsvExport();
    } else {
      // Default CSV export stub
      toast.success('CSV summary exported');
      analytics.track('export.click', { kind: 'csv', tool: toolKey });
    }
  };

  const handleZipExport = () => {
    if (onZipExport) {
      onZipExport();
    } else {
      // Default ZIP export stub
      toast.success('Evidence ZIP exported');
      analytics.track('export.click', { kind: 'zip', tool: toolKey });
    }
  };

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                variant="outline"
                size="sm"
                disabled={!csvEnabled}
                onClick={handleCsvExport}
                className="focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                CSV Summary
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {csvEnabled ? 'Export data as CSV' : 'CSV export not available for this tool'}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                variant="outline"
                size="sm"
                disabled={!zipEnabled}
                onClick={handleZipExport}
                className="focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Archive className="w-4 h-4 mr-2" />
                Evidence ZIP
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {zipEnabled ? 'Export supporting documents as ZIP' : 'ZIP export not available for this tool'}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};