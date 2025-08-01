import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCSVOperations, CSVParseResult, LeadCSVRow, CampaignCSVRow } from '@/hooks/useCSVOperations';

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: 'leads' | 'campaigns';
}

export function CSVImportDialog({ open, onOpenChange, defaultType }: CSVImportDialogProps) {
  const { toast } = useToast();
  const { 
    parseLeadsCSV, 
    parseCampaignsCSV, 
    importLeadsFromCSV, 
    importCampaignsFromCSV, 
    isImporting 
  } = useCSVOperations();
  
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [importType, setImportType] = React.useState<string>(defaultType || '');
  const [parseResult, setParseResult] = React.useState<CSVParseResult<LeadCSVRow | CampaignCSVRow> | null>(null);
  const [showPreview, setShowPreview] = React.useState(false);

  React.useEffect(() => {
    if (defaultType) {
      setImportType(defaultType);
    }
  }, [defaultType]);

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setParseResult(null);
    setShowPreview(false);

    if (!importType) {
      toast({
        title: "Select Import Type",
        description: "Please select whether you're importing leads or campaigns first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await file.text();
      let result: CSVParseResult<LeadCSVRow | CampaignCSVRow>;
      
      if (importType === 'leads') {
        result = parseLeadsCSV(text);
      } else {
        result = parseCampaignsCSV(text);
      }
      
      setParseResult(result);
      setShowPreview(true);
    } catch (error) {
      toast({
        title: "Parse Error",
        description: "Failed to parse CSV file. Please check the format.",
        variant: "destructive",
      });
    }
  };

  const handleImportTypeChange = (type: string) => {
    setImportType(type);
    setSelectedFile(null);
    setParseResult(null);
    setShowPreview(false);
  };

  const handleDownloadSample = () => {
    const fileName = importType === 'leads' ? 'leads-sample.csv' : 'campaigns-sample.csv';
    const link = document.createElement('a');
    link.href = `/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = async () => {
    if (!parseResult || !parseResult.data.length) return;

    try {
      if (importType === 'leads') {
        await importLeadsFromCSV(parseResult.data as LeadCSVRow[]);
      } else {
        await importCampaignsFromCSV(parseResult.data as CampaignCSVRow[]);
      }
      onOpenChange(false);
      setSelectedFile(null);
      setParseResult(null);
      setShowPreview(false);
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import CSV Data</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import {importType || 'leads or campaign'} data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="importType">Import Type</Label>
            <Select value={importType} onValueChange={handleImportTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select what to import" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="leads">Leads</SelectItem>
                <SelectItem value="campaigns">Campaigns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {importType && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>CSV File</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownloadSample}
                  className="text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download Sample CSV
                </Button>
              </div>
              <FileUpload 
                onFileChange={handleFileChange}
                accept=".csv,text/csv"
                maxSize={5 * 1024 * 1024}
              />
            </div>
          )}
          
          {showPreview && parseResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-medium">Preview Results</span>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Found {parseResult.validRows} valid rows out of {parseResult.totalRows} total rows.
                  {parseResult.errors.length > 0 && ` ${parseResult.errors.length} rows have errors.`}
                </AlertDescription>
              </Alert>

              {parseResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-destructive">Import Errors:</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {parseResult.errors.slice(0, 10).map((error, index) => (
                      <p key={index} className="text-xs text-destructive">{error}</p>
                    ))}
                    {parseResult.errors.length > 10 && (
                      <p className="text-xs text-muted-foreground">
                        ...and {parseResult.errors.length - 10} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}

              {parseResult.validRows > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-success">
                    {parseResult.validRows} {importType} ready to import
                  </h4>
                  <div className="max-h-32 overflow-y-auto">
                    {parseResult.data.slice(0, 3).map((item, index) => (
                      <div key={index} className="text-xs p-2 bg-muted rounded">
                        {importType === 'leads' ? (
                          <span>{(item as LeadCSVRow).firstName} {(item as LeadCSVRow).lastName} - {(item as LeadCSVRow).email}</span>
                        ) : (
                          <span>{(item as CampaignCSVRow).name} - {(item as CampaignCSVRow).source}</span>
                        )}
                      </div>
                    ))}
                    {parseResult.data.length > 3 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ...and {parseResult.data.length - 3} more {importType}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Required CSV Columns:</p>
            {importType === 'leads' && (
              <ul className="list-disc list-inside space-y-1">
                <li>First Name, Last Name, Email, Lead Date, Status</li>
                <li>Optional: Phone, Source, Campaign, Amount Closed, LTV, Notes</li>
              </ul>
            )}
            {importType === 'campaigns' && (
              <ul className="list-disc list-inside space-y-1">
                <li>Campaign Name, Source, Start Date</li>
                <li>Optional: End Date, Budget/Spend, Notes</li>
              </ul>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {parseResult && parseResult.validRows > 0 && (
              <Button 
                onClick={handleConfirmImport} 
                disabled={isImporting}
              >
                {isImporting ? 'Importing...' : `Import ${parseResult.validRows} ${importType}`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}