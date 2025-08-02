import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';

interface CSVImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: () => void;
}

interface ImportResult {
  success: number;
  errors: string[];
  warnings: string[];
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({
  open,
  onOpenChange,
  onImportComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ImportResult | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const csvFile = acceptedFiles[0];
    if (csvFile && csvFile.type === 'text/csv') {
      setFile(csvFile);
      setResults(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',');
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim() || '';
        });
        data.push(row);
      }
    }

    return data;
  };

  const validateRow = (row: any, index: number): string[] => {
    const errors: string[] = [];
    const rowNum = index + 2; // +2 because index starts at 0 and we skip header

    if (!row.name || row.name.length < 2) {
      errors.push(`Row ${rowNum}: Name is required and must be at least 2 characters`);
    }

    if (!row.email || !/\S+@\S+\.\S+/.test(row.email)) {
      errors.push(`Row ${rowNum}: Valid email is required`);
    }

    if (!row.phone || row.phone.length < 10) {
      errors.push(`Row ${rowNum}: Phone number is required and must be at least 10 digits`);
    }

    return errors;
  };

  const transformRow = (row: any) => {
    return {
      name: row.name,
      email: row.email,
      phone: row.phone,
      interest: row.interest || 'financial_planning',
      lead_value: parseFloat(row.budget || row.lead_value || '100000'),
      lead_source: row.source || row.lead_source || 'CSV Import',
      campaign_id: row.campaign_id || null,
      agency_id: row.agency_id || null,
      advisor_id: row.advisor_id || null,
      qualified: row.qualified === 'true' || row.qualified === '1',
      client_converted: row.client_converted === 'true' || row.client_converted === '1',
      qualification_notes: row.notes || row.qualification_notes || '',
      lead_status: row.lead_status || 'new',
    };
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      const errors: string[] = [];
      const warnings: string[] = [];
      const validRows: any[] = [];

      // Validate all rows first
      rows.forEach((row, index) => {
        const rowErrors = validateRow(row, index);
        if (rowErrors.length > 0) {
          errors.push(...rowErrors);
        } else {
          validRows.push(transformRow(row));
        }
      });

      if (errors.length > 0 && validRows.length === 0) {
        setResults({ success: 0, errors, warnings });
        setImporting(false);
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Add created_by to all rows
      const rowsWithUser = validRows.map(row => ({
        ...row,
        created_by: user?.id,
      }));

      // Import in batches
      const batchSize = 50;
      let successCount = 0;

      for (let i = 0; i < rowsWithUser.length; i += batchSize) {
        const batch = rowsWithUser.slice(i, i + batchSize);
        
        try {
          const { error } = await supabase
            .from('leads')
            .insert(batch);

          if (error) {
            errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
          } else {
            successCount += batch.length;
          }
        } catch (batchError) {
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${batchError}`);
        }

        setProgress(((i + batchSize) / rowsWithUser.length) * 100);
      }

      setResults({
        success: successCount,
        errors,
        warnings
      });

      if (successCount > 0) {
        toast({
          title: "Import Completed",
          description: `Successfully imported ${successCount} leads.`,
        });
        onImportComplete?.();
      }

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "An error occurred while importing the CSV file.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  const downloadTemplate = () => {
    const template = `name,email,phone,interest,budget,source,campaign_id,agency_id,advisor_id,notes
John Doe,john@example.com,5551234567,retirement_planning,500000,Google Ads,,,,"High net worth prospect"
Jane Smith,jane@example.com,5559876543,investment_management,250000,Referral,,,,"Referred by existing client"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads_import_template.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setFile(null);
    setResults(null);
    setProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetModal();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Leads from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import leads into your pipeline
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Need a Template?</CardTitle>
              <CardDescription>
                Download our CSV template with the correct column headers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadTemplate} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg">Drop the CSV file here...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">Drag & drop a CSV file here</p>
                  <p className="text-sm text-muted-foreground">or click to select</p>
                </div>
              )}
            </div>
          )}

          {/* File Selected */}
          {file && !results && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                {importing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Importing leads...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button onClick={handleImport} disabled={importing}>
                    {importing ? "Importing..." : "Import Leads"}
                  </Button>
                  <Button variant="outline" onClick={() => setFile(null)} disabled={importing}>
                    Choose Different File
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-4">
              {results.success > 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Successfully imported {results.success} leads.
                  </AlertDescription>
                </Alert>
              )}

              {results.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">{results.errors.length} errors occurred:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {results.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {results.errors.length > 5 && (
                          <li>... and {results.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {results.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">{results.warnings.length} warnings:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {results.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button onClick={resetModal}>Import Another File</Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};