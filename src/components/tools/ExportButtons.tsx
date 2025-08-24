import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileArchive, FileText } from 'lucide-react';
import { trackExportClick } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';

export interface ExportButtonsProps {
  csvEnabled?: boolean;
  zipEnabled?: boolean;
  onCsvExport?: () => void;
  onZipExport?: () => void;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  csvEnabled = true,
  zipEnabled = true,
  onCsvExport,
  onZipExport
}) => {
  const handleCsvExport = () => {
    trackExportClick('csv');
    
    if (onCsvExport) {
      onCsvExport();
    } else {
      toast({
        title: 'CSV export started',
        description: 'Your export is being prepared'
      });
    }
  };

  const handleZipExport = () => {
    trackExportClick('zip');
    
    if (onZipExport) {
      onZipExport();
    } else {
      toast({
        title: 'ZIP export started',
        description: 'Your export is being prepared'
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {csvEnabled && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCsvExport}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Export CSV
        </Button>
      )}
      
      {zipEnabled && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleZipExport}
          className="flex items-center gap-2"
        >
          <FileArchive className="w-4 h-4" />
          Export ZIP
        </Button>
      )}
    </div>
  );
};