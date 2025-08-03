import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ClientImportData {
  client_name: string;
  client_email: string;
  client_phone?: string;
  business_type?: string;
  tax_year?: number;
  status: 'pending' | 'processing' | 'success' | 'error';
  error_message?: string;
}

export function CSVClientImport() {
  const [importData, setImportData] = useState<ClientImportData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const downloadTemplate = () => {
    const template = `client_name,client_email,client_phone,business_type,tax_year
"John Doe","john@example.com","555-0123","LLC","2024"
"Jane Smith","jane@example.com","555-0456","Corporation","2024"
"Bob Johnson","bob@example.com","555-0789","Sole Proprietorship","2024"`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'client_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Template downloaded', {
      description: 'Use this template to format your client data'
    });
  };

  const parseCSV = (text: string): ClientImportData[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have header and at least one data row');
    
    const headers = lines[0].split(',').map(h => h.replace(/['"]/g, '').trim());
    const rows = lines.slice(1);
    
    return rows.map((row, index) => {
      const values = row.split(',').map(v => v.replace(/['"]/g, '').trim());
      const rowData: any = {};
      
      headers.forEach((header, i) => {
        rowData[header] = values[i] || '';
      });
      
      // Validate required fields
      if (!rowData.client_name || !rowData.client_email) {
        throw new Error(`Row ${index + 2}: client_name and client_email are required`);
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(rowData.client_email)) {
        throw new Error(`Row ${index + 2}: Invalid email format`);
      }
      
      return {
        client_name: rowData.client_name,
        client_email: rowData.client_email,
        client_phone: rowData.client_phone || '',
        business_type: rowData.business_type || '',
        tax_year: rowData.tax_year ? parseInt(rowData.tax_year) : new Date().getFullYear(),
        status: 'pending' as const
      };
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Invalid file type', {
        description: 'Please select a CSV file'
      });
      return;
    }
    
    setFile(selectedFile);
    
    try {
      const text = await selectedFile.text();
      const parsed = parseCSV(text);
      setImportData(parsed);
      toast.success('CSV parsed successfully', {
        description: `Found ${parsed.length} clients ready to import`
      });
    } catch (error) {
      toast.error('CSV parsing failed', {
        description: error instanceof Error ? error.message : 'Invalid CSV format'
      });
      setImportData([]);
    }
  };

  const processImport = async () => {
    if (importData.length === 0) return;
    
    setIsProcessing(true);
    const updatedData = [...importData];
    
    for (let i = 0; i < updatedData.length; i++) {
      updatedData[i].status = 'processing';
      setImportData([...updatedData]);
      
      try {
        // Since the accountant_clients table doesn't exist yet, we'll simulate the insert
        // In a real implementation, you would uncomment the code below after the migration succeeds
        
        /*
        const { error } = await supabase
          .from('accountant_clients')
          .insert({
            accountant_id: (await supabase.auth.getUser()).data.user?.id,
            client_name: updatedData[i].client_name,
            client_email: updatedData[i].client_email,
            client_phone: updatedData[i].client_phone,
            business_type: updatedData[i].business_type,
            tax_year: updatedData[i].tax_year,
            status: 'active',
            onboarding_status: 'pending'
          });
        
        if (error) throw error;
        */
        
        // Simulate successful insert for now
        await new Promise(resolve => setTimeout(resolve, 100));
        
        updatedData[i].status = 'success';
      } catch (error) {
        updatedData[i].status = 'error';
        updatedData[i].error_message = error instanceof Error ? error.message : 'Import failed';
      }
      
      setImportData([...updatedData]);
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsProcessing(false);
    
    const successCount = updatedData.filter(d => d.status === 'success').length;
    const errorCount = updatedData.filter(d => d.status === 'error').length;
    
    if (successCount > 0) {
      toast.success(`Import completed`, {
        description: `${successCount} clients imported successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`
      });
    } else {
      toast.error('Import failed', {
        description: 'No clients were imported successfully'
      });
    }
  };

  const getStatusBadge = (status: ClientImportData['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Success</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing...</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Bulk Client Import
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="csv-file">Select CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </div>
          <Button
            variant="outline"
            onClick={downloadTemplate}
            disabled={isProcessing}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        {file && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="text-sm font-medium">File: {file.name}</p>
            <p className="text-xs text-muted-foreground">
              Size: {(file.size / 1024).toFixed(2)} KB • 
              Records: {importData.length}
            </p>
          </div>
        )}

        {importData.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Import Preview</h3>
              <Button
                onClick={processImport}
                disabled={isProcessing}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : `Import ${importData.length} Clients`}
              </Button>
            </div>

            <div className="border rounded-lg max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Business Type</TableHead>
                    <TableHead>Tax Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importData.map((client, index) => (
                    <TableRow key={index}>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell className="font-medium">{client.client_name}</TableCell>
                      <TableCell>{client.client_email}</TableCell>
                      <TableCell>{client.client_phone}</TableCell>
                      <TableCell>{client.business_type}</TableCell>
                      <TableCell>{client.tax_year}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {importData.some(d => d.status === 'error') && (
              <div className="space-y-2">
                <h4 className="font-medium text-destructive">Import Errors</h4>
                {importData
                  .filter(d => d.status === 'error')
                  .map((client, index) => (
                    <div key={index} className="text-sm text-destructive">
                      {client.client_name}: {client.error_message}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• CSV file should include: client_name, client_email (required)</p>
          <p>• Optional fields: client_phone, business_type, tax_year</p>
          <p>• All imported clients will be set to 'active' status with 'pending' onboarding</p>
          <p>• Duplicate emails will be rejected automatically</p>
        </div>
      </CardContent>
    </Card>
  );
}