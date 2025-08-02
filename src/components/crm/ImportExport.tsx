import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Upload, Download, FileText, Users, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ImportExport() {
  const { user } = useAuth();
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [csvData, setCsvData] = useState('');
  const [importResults, setImportResults] = useState<any>(null);

  const handleImportContacts = async () => {
    if (!csvData.trim()) {
      toast.error('Please paste CSV data first');
      return;
    }

    setImporting(true);
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      
      const contacts = [];
      const errors = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length !== headers.length) {
          errors.push(`Line ${i + 1}: Column count mismatch`);
          continue;
        }

        const contact: any = { user_id: user?.id };
        
        headers.forEach((header, index) => {
          const value = values[index];
          switch (header) {
            case 'name':
              contact.name = value;
              break;
            case 'email':
              contact.email = value;
              break;
            case 'phone':
              contact.phone = value;
              break;
            case 'company':
              contact.company = value;
              break;
            case 'role':
              contact.role = value;
              break;
            case 'status':
              contact.status = ['lead', 'prospect', 'client', 'inactive'].includes(value) ? value : 'lead';
              break;
            case 'tags':
              contact.tags = value ? value.split(';').map(t => t.trim()) : [];
              break;
            case 'notes':
              contact.notes = value;
              break;
          }
        });

        if (!contact.name || !contact.email) {
          errors.push(`Line ${i + 1}: Name and email are required`);
          continue;
        }

        contacts.push(contact);
      }

      if (contacts.length === 0) {
        throw new Error('No valid contacts to import');
      }

      const { data, error } = await supabase
        .from('crm_contacts')
        .insert(contacts)
        .select();

      if (error) throw error;

      setImportResults({
        success: data?.length || 0,
        errors: errors.length,
        errorDetails: errors
      });

      toast.success(`Successfully imported ${data?.length || 0} contacts`);
      setCsvData('');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import contacts');
    } finally {
      setImporting(false);
    }
  };

  const handleExportContacts = async () => {
    setExporting(true);
    try {
      const { data: contacts, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!contacts || contacts.length === 0) {
        toast.error('No contacts to export');
        return;
      }

      // Generate CSV
      const headers = ['name', 'email', 'phone', 'company', 'role', 'status', 'tags', 'notes', 'created_at'];
      const csvContent = [
        headers.join(','),
        ...contacts.map(contact => 
          headers.map(header => {
            let value = contact[header] || '';
            if (header === 'tags' && Array.isArray(value)) {
              value = value.join(';');
            }
            if (header === 'created_at') {
              value = new Date(value).toLocaleDateString();
            }
            return `"${value}"`;
          }).join(',')
        )
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crm_contacts_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported ${contacts.length} contacts`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export contacts');
    } finally {
      setExporting(false);
    }
  };

  const handleExportActivities = async () => {
    setExporting(true);
    try {
      const { data: activities, error } = await supabase
        .from('crm_activities')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!activities || activities.length === 0) {
        toast.error('No activities to export');
        return;
      }

      // Generate CSV
      const headers = ['contact_name', 'contact_email', 'activity_type', 'title', 'description', 'duration_minutes', 'outcome', 'next_steps', 'created_at'];
      const csvContent = [
        headers.join(','),
        ...activities.map(activity => 
          headers.map(header => {
            let value = activity[header] || '';
            if (header === 'created_at') {
              value = new Date(value).toLocaleDateString();
            }
            return `"${value}"`;
          }).join(',')
        )
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crm_activities_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported ${activities.length} activities`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export activities');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Import & Export</h2>
        <p className="text-muted-foreground">Manage your CRM data with CSV import and export</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="csv-data">CSV Data</Label>
              <Textarea
                id="csv-data"
                placeholder="Paste your CSV data here...
Expected format:
name,email,phone,company,role,status,tags,notes
John Doe,john@example.com,555-1234,Acme Corp,CEO,client,vip;important,Great client"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium mb-2">Required Columns:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>name</strong>: Contact name (required)</li>
                <li>• <strong>email</strong>: Email address (required)</li>
                <li>• <strong>phone</strong>: Phone number (optional)</li>
                <li>• <strong>company</strong>: Company name (optional)</li>
                <li>• <strong>role</strong>: Job title (optional)</li>
                <li>• <strong>status</strong>: lead/prospect/client/inactive (optional)</li>
                <li>• <strong>tags</strong>: Semicolon-separated tags (optional)</li>
                <li>• <strong>notes</strong>: Additional notes (optional)</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleImportContacts} 
              disabled={importing || !csvData.trim()}
              className="w-full"
            >
              {importing ? 'Importing...' : 'Import Contacts'}
            </Button>
            
            {importResults && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Successfully imported {importResults.success} contacts
                </div>
                {importResults.errors > 0 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertCircle className="h-4 w-4" />
                    {importResults.errors} errors encountered
                  </div>
                )}
                {importResults.errorDetails.length > 0 && (
                  <details className="bg-red-50 p-3 rounded-lg">
                    <summary className="cursor-pointer text-sm font-medium text-red-800">View Errors</summary>
                    <ul className="mt-2 text-sm text-red-700 space-y-1">
                      {importResults.errorDetails.map((error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={handleExportContacts}
                disabled={exporting}
                variant="outline"
                className="w-full justify-start"
              >
                <Users className="h-4 w-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export Contacts'}
              </Button>
              
              <Button
                onClick={handleExportActivities}
                disabled={exporting}
                variant="outline"
                className="w-full justify-start"
              >
                <Database className="h-4 w-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export Activities'}
              </Button>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium mb-2">Export Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All data exported in CSV format</li>
                <li>• Compatible with Excel, Google Sheets</li>
                <li>• Includes all contact fields and metadata</li>
                <li>• Activity history with timestamps</li>
                <li>• Ready for backup or migration</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Data Integration Ready</p>
                  <p className="text-blue-700 mt-1">Exported data can be imported into most CRM systems and marketing automation platforms.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}