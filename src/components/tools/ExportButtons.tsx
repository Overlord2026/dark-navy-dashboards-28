import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileArchive, FileText } from 'lucide-react';
import { trackExportClick } from '@/lib/analytics';
import { toast } from 'sonner';

interface ExportButtonsProps {
  exports: {
    csv?: boolean;
    zip?: boolean;
    pdf?: boolean;
    qr?: boolean;
  };
  onExport?: (type: 'csv' | 'zip' | 'pdf' | 'qr') => void;
  disabled?: boolean;
  className?: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  exports, 
  onExport,
  disabled = false,
  className = ''
}) => {
  const handleExport = (type: 'csv' | 'zip' | 'pdf' | 'qr') => {
    trackExportClick(type);
    
    if (onExport) {
      onExport(type);
    } else {
      // Default export behavior
      toast.success(`${type.toUpperCase()} export started`);
    }
  };

  const exportButtons = [
    {
      type: 'csv' as const,
      label: 'CSV',
      icon: FileText,
      enabled: exports.csv,
      description: 'Export data as spreadsheet'
    },
    {
      type: 'zip' as const,
      label: 'ZIP',
      icon: FileArchive,
      enabled: exports.zip,
      description: 'Export documents as archive'
    },
    {
      type: 'pdf' as const,
      label: 'PDF',
      icon: FileText,
      enabled: exports.pdf,
      description: 'Export as PDF report'
    },
    {
      type: 'qr' as const,
      label: 'QR',
      icon: Download,
      enabled: exports.qr,
      description: 'Export QR verification code'
    }
  ].filter(btn => btn.enabled);

  if (exportButtons.length === 0) return null;

  return (
    <div className={`flex gap-2 ${className}`}>
      {exportButtons.map(({ type, label, icon: Icon, description }) => (
        <Button
          key={type}
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => handleExport(type)}
          className="min-h-[44px] focus-visible:ring-2 focus-visible:ring-cyan-400"
          title={disabled ? 'Export not available' : description}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  );
};