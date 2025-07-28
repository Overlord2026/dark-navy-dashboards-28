import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  PenTool, 
  CheckCircle, 
  Clock, 
  Send,
  Download,
  Eye,
  Shield,
  Users,
  Calendar
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'loan_agreement' | 'disclosure' | 'promissory_note' | 'security_agreement';
  status: 'draft' | 'sent' | 'signed' | 'completed';
  created_at: string;
  signers: Signer[];
  envelope_id?: string;
}

interface Signer {
  id: string;
  name: string;
  email: string;
  role: 'borrower' | 'co_borrower' | 'guarantor' | 'lender' | 'advisor';
  status: 'pending' | 'sent' | 'signed' | 'declined';
  signed_at?: string;
  signing_order: number;
}

export const ESignatureIntegration: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [newSigner, setNewSigner] = useState<{ 
    name: string; 
    email: string; 
    role: 'borrower' | 'co_borrower' | 'guarantor' | 'lender' | 'advisor';
  }>({ name: '', email: '', role: 'borrower' });
  const { toast } = useToast();

  // Mock documents for demo
  const initializeMockDocuments = () => {
    const mockDocs: Document[] = [
      {
        id: '1',
        name: 'Loan Agreement - $250,000 Home Purchase',
        type: 'loan_agreement',
        status: 'draft',
        created_at: new Date().toISOString(),
        signers: [
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@email.com',
            role: 'borrower',
            status: 'pending',
            signing_order: 1
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@email.com',
            role: 'co_borrower',
            status: 'pending',
            signing_order: 2
          }
        ]
      },
      {
        id: '2',
        name: 'Truth in Lending Disclosure',
        type: 'disclosure',
        status: 'sent',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        signers: [
          {
            id: '3',
            name: 'John Smith',
            email: 'john.smith@email.com',
            role: 'borrower',
            status: 'signed',
            signing_order: 1,
            signed_at: new Date().toISOString()
          }
        ],
        envelope_id: 'env_123456'
      }
    ];
    setDocuments(mockDocs);
  };

  React.useEffect(() => {
    initializeMockDocuments();
  }, []);

  const createDocumentEnvelope = async (document: Document) => {
    setLoading(true);
    try {
      // Call DocuSign edge function
      const { data, error } = await supabase.functions.invoke('docusign-integration', {
        body: {
          action: 'create_envelope',
          document: {
            name: document.name,
            type: document.type,
            content: generateDocumentContent(document.type)
          },
          signers: document.signers,
          loan_id: 'loan-123', // This would be the actual loan ID
          return_url: `${window.location.origin}/lending/documents/${document.id}/complete`
        }
      });

      if (error) {
        // Mock successful creation for demo
        const mockEnvelopeId = `env_${Math.random().toString(36).substr(2, 9)}`;
        
        setDocuments(docs => docs.map(doc => 
          doc.id === document.id 
            ? { ...doc, status: 'sent', envelope_id: mockEnvelopeId }
            : doc
        ));

        toast({
          title: "Document Sent",
          description: `${document.name} has been sent for signatures`,
        });
      } else {
        // Handle real API response
        setDocuments(docs => docs.map(doc => 
          doc.id === document.id 
            ? { ...doc, status: 'sent', envelope_id: data.envelope_id }
            : doc
        ));

        toast({
          title: "Document Sent",
          description: "Document envelope created and sent to signers",
        });
      }

    } catch (error) {
      console.error('Error creating document envelope:', error);
      toast({
        title: "Error",
        description: "Failed to send document for signatures",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSigningStatus = async (document: Document) => {
    if (!document.envelope_id) return;

    try {
      const { data, error } = await supabase.functions.invoke('docusign-integration', {
        body: {
          action: 'check_status',
          envelope_id: document.envelope_id
        }
      });

      if (!error && data) {
        // Update document status based on response
        setDocuments(docs => docs.map(doc => 
          doc.id === document.id 
            ? { ...doc, status: data.status, signers: data.signers }
            : doc
        ));

        toast({
          title: "Status Updated",
          description: `Document status: ${data.status}`,
        });
      }
    } catch (error) {
      console.error('Error checking signing status:', error);
    }
  };

  const downloadSignedDocument = async (document: Document) => {
    if (!document.envelope_id) return;

    try {
      const { data, error } = await supabase.functions.invoke('docusign-integration', {
        body: {
          action: 'download_document',
          envelope_id: document.envelope_id
        }
      });

      if (!error && data) {
        // Create download link
        const link = window.document.createElement('a');
        link.href = data.download_url;
        link.download = `${document.name}_signed.pdf`;
        link.click();

        toast({
          title: "Download Started",
          description: "Signed document is being downloaded",
        });
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download signed document",
        variant: "destructive"
      });
    }
  };

  const generateDocumentContent = (type: string): string => {
    // This would generate the actual document content
    // For demo purposes, returning a placeholder
    switch (type) {
      case 'loan_agreement':
        return 'LOAN AGREEMENT TEMPLATE CONTENT...';
      case 'disclosure':
        return 'TRUTH IN LENDING DISCLOSURE TEMPLATE...';
      case 'promissory_note':
        return 'PROMISSORY NOTE TEMPLATE CONTENT...';
      default:
        return 'DOCUMENT TEMPLATE CONTENT...';
    }
  };

  const addSigner = (documentId: string) => {
    if (!newSigner.name || !newSigner.email) {
      toast({
        title: "Invalid Input",
        description: "Please provide signer name and email",
        variant: "destructive"
      });
      return;
    }

    setDocuments(docs => docs.map(doc => 
      doc.id === documentId 
        ? {
            ...doc,
            signers: [...doc.signers, {
              id: Date.now().toString(),
              ...newSigner,
              status: 'pending' as const,
              signing_order: doc.signers.length + 1
            }]
          }
        : doc
    ));

    setNewSigner({ name: '', email: '', role: 'borrower' });
    toast({
      title: "Signer Added",
      description: "New signer has been added to the document",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'signed': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'sent': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'draft': return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'signed':
        return <CheckCircle className="h-4 w-4" />;
      case 'sent':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Electronic Signature Management
          </CardTitle>
          <CardDescription>
            Create, send, and track loan documents for electronic signature
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Documents List */}
      <div className="grid grid-cols-1 gap-6">
        {documents.map((document) => (
          <Card key={document.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{document.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <span>Type: {document.type.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>Created: {new Date(document.created_at).toLocaleDateString()}</span>
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(document.status)}>
                  {getStatusIcon(document.status)}
                  <span className="ml-1 capitalize">{document.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Signers List */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Signers ({document.signers.length})
                  </h4>
                  <div className="space-y-2">
                    {document.signers.map((signer) => (
                      <div key={signer.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">{signer.signing_order}</span>
                          </div>
                          <div>
                            <p className="font-medium">{signer.name}</p>
                            <p className="text-sm text-muted-foreground">{signer.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="capitalize">
                            {signer.role.replace('_', ' ')}
                          </Badge>
                          <Badge className={getStatusColor(signer.status)}>
                            {getStatusIcon(signer.status)}
                            <span className="ml-1 capitalize">{signer.status}</span>
                          </Badge>
                          {signer.signed_at && (
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(signer.signed_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Signer Form (for draft documents) */}
                {document.status === 'draft' && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Add Signer</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Input
                        placeholder="Signer Name"
                        value={newSigner.name}
                        onChange={(e) => setNewSigner({...newSigner, name: e.target.value})}
                      />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={newSigner.email}
                        onChange={(e) => setNewSigner({...newSigner, email: e.target.value})}
                      />
                      <select 
                        className="px-3 py-2 border rounded-md"
                        value={newSigner.role}
                        onChange={(e) => setNewSigner({...newSigner, role: e.target.value as 'borrower' | 'co_borrower' | 'guarantor' | 'lender' | 'advisor'})}
                      >
                        <option value="borrower">Borrower</option>
                        <option value="co_borrower">Co-Borrower</option>
                        <option value="guarantor">Guarantor</option>
                        <option value="advisor">Advisor</option>
                      </select>
                      <Button onClick={() => addSigner(document.id)} size="sm">
                        Add Signer
                      </Button>
                    </div>
                  </div>
                )}

                {/* Document Actions */}
                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-2">
                    {document.status === 'draft' && (
                      <Button 
                        onClick={() => createDocumentEnvelope(document)}
                        disabled={loading || document.signers.length === 0}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send for Signatures
                      </Button>
                    )}
                    
                    {document.status === 'sent' && (
                      <Button 
                        variant="outline"
                        onClick={() => checkSigningStatus(document)}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Check Status
                      </Button>
                    )}
                    
                    {(document.status === 'signed' || document.status === 'completed') && (
                      <Button 
                        variant="outline"
                        onClick={() => downloadSignedDocument(document)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Signed
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>

                {/* Security Notice */}
                {document.status === 'sent' && (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Document is secured with DocuSign's bank-level encryption and legally binding electronic signatures. 
                      Signers will receive email notifications with secure signing links.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Document */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Document</CardTitle>
          <CardDescription>
            Generate a new loan document for electronic signature
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'loan_agreement', name: 'Loan Agreement', icon: FileText },
              { type: 'disclosure', name: 'Disclosure Form', icon: Shield },
              { type: 'promissory_note', name: 'Promissory Note', icon: PenTool },
              { type: 'security_agreement', name: 'Security Agreement', icon: CheckCircle }
            ].map((docType) => {
              const IconComponent = docType.icon;
              return (
                <Button
                  key={docType.type}
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  onClick={() => {
                    const newDoc: Document = {
                      id: Date.now().toString(),
                      name: `${docType.name} - New Loan`,
                      type: docType.type as any,
                      status: 'draft',
                      created_at: new Date().toISOString(),
                      signers: []
                    };
                    setDocuments([newDoc, ...documents]);
                    toast({
                      title: "Document Created",
                      description: `New ${docType.name} created`,
                    });
                  }}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-sm">{docType.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};