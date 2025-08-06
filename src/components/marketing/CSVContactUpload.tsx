import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Download,
  Users,
  Merge,
  UserCheck
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  title?: string;
  linkedinUrl?: string;
  phone?: string;
  persona: string;
  notes?: string;
  status: 'new' | 'duplicate' | 'enriched' | 'error';
  duplicateOf?: string;
}

interface UploadStatus {
  total: number;
  processed: number;
  duplicates: number;
  errors: number;
  enriched: number;
}

export function CSVContactUpload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'review' | 'assign'>('upload');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      processCSV(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const processCSV = async (file: File) => {
    setIsProcessing(true);
    setStep('review');
    
    // Simulate CSV processing
    setTimeout(() => {
      const mockContacts: Contact[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@wealth.com',
          organization: 'Smith Wealth Advisors',
          title: 'Senior Advisor',
          linkedinUrl: 'https://linkedin.com/in/johnsmith',
          persona: 'advisor',
          status: 'new'
        },
        {
          id: '2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah@duplicatetest.com',
          organization: 'Johnson CPA',
          persona: 'accountant',
          status: 'duplicate',
          duplicateOf: 'existing-contact-123'
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Wilson',
          email: 'mike.wilson@law.com',
          organization: 'Wilson & Associates',
          persona: 'attorney',
          status: 'enriched'
        }
      ];

      setContacts(mockContacts);
      setUploadStatus({
        total: 3,
        processed: 3,
        duplicates: 1,
        errors: 0,
        enriched: 1
      });
      setIsProcessing(false);
    }, 2000);
  };

  const handleContactUpdate = (contactId: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId ? { ...contact, ...updates } : contact
    ));
  };

  const handleBulkAssign = (persona: string) => {
    setContacts(prev => prev.map(contact => 
      contact.status === 'new' ? { ...contact, persona } : contact
    ));
  };

  const downloadTemplate = () => {
    const csvContent = "First Name,Last Name,Email,Organization,Title,LinkedIn URL,Phone,Persona,Notes\n" +
      "John,Smith,john@example.com,Smith Advisors,Senior Advisor,https://linkedin.com/in/johnsmith,555-0123,advisor,VIP contact\n" +
      "Sarah,Johnson,sarah@example.com,Johnson CPA,CPA,https://linkedin.com/in/sarahjohnson,,accountant,Referred by client";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (step === 'upload') {
    return (
      <div className="space-y-6">
        {/* Upload Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Bulk Contact Upload
            </CardTitle>
            <CardDescription>
              Upload CSV files to add multiple contacts at once. System will auto-deduplicate and enrich data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              <div className="text-sm text-muted-foreground">
                Required columns: First Name, Last Name, Email, Organization, Persona
              </div>
            </div>

            {/* Drop Zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-primary">Drop the CSV file here...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">Drop CSV file here or click to browse</p>
                  <p className="text-sm text-muted-foreground">
                    Supports .csv files up to 10MB with unlimited contacts
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-medium">Prepare Your CSV</h4>
                  <p className="text-sm text-muted-foreground">Download template and format your contacts with required columns</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-medium">Upload & Review</h4>
                  <p className="text-sm text-muted-foreground">System will check for duplicates and enrich missing data</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-medium">Assign to Campaigns</h4>
                  <p className="text-sm text-muted-foreground">Choose persona and campaign for each contact group</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="space-y-6">
        {/* Processing Status */}
        {isProcessing && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  <span>Processing {uploadedFile?.name}...</span>
                </div>
                <Progress value={66} />
                <p className="text-sm text-muted-foreground">
                  Checking for duplicates and enriching contact data...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Summary */}
        {uploadStatus && !isProcessing && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Upload Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{uploadStatus.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{uploadStatus.processed}</div>
                  <div className="text-sm text-muted-foreground">Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{uploadStatus.duplicates}</div>
                  <div className="text-sm text-muted-foreground">Duplicates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{uploadStatus.enriched}</div>
                  <div className="text-sm text-muted-foreground">Enriched</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{uploadStatus.errors}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Review */}
        {contacts.length > 0 && !isProcessing && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Review Contacts</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleBulkAssign('advisor')}>
                    Assign All to Advisors
                  </Button>
                  <Button size="sm" onClick={() => setStep('assign')}>
                    Continue to Assignment
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                        <div className="text-sm text-muted-foreground">{contact.email}</div>
                        <div className="text-xs text-muted-foreground">{contact.organization}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        contact.status === 'new' ? 'default' :
                        contact.status === 'duplicate' ? 'secondary' :
                        contact.status === 'enriched' ? 'outline' : 'destructive'
                      }>
                        {contact.status}
                      </Badge>
                      <select 
                        value={contact.persona}
                        onChange={(e) => handleContactUpdate(contact.id, { persona: e.target.value })}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="advisor">Advisor</option>
                        <option value="accountant">Accountant</option>
                        <option value="attorney">Attorney</option>
                        <option value="property_manager">Property Manager</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="family_office">Family Office</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return null;
}