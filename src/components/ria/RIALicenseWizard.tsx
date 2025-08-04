import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  CheckCircle, 
  Upload, 
  FileText, 
  Clock, 
  AlertTriangle,
  Download,
  MessageSquare
} from 'lucide-react';

interface Checklist {
  id: string;
  requirement: string;
  doc_type: string;
  is_required: boolean;
  description: string;
  category: string;
  order_sequence: number;
  estimated_hours: number;
}

interface Document {
  id: string;
  doc_type: string;
  file_name: string;
  status: string;
  ai_review_score: number;
  ai_feedback: any;
  compliance_issues: any;
}

const US_STATES = [
  { code: 'TX', name: 'Texas' },
  { code: 'CA', name: 'California' },
  { code: 'FL', name: 'Florida' },
  { code: 'NY', name: 'New York' },
  { code: 'IL', name: 'Illinois' },
];

export default function RIALicenseWizard() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedState, setSelectedState] = useState<string>('');
  const [checklist, setChecklist] = useState<Checklist[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (selectedState) {
      fetchStateChecklist();
    }
  }, [selectedState]);

  useEffect(() => {
    if (requestId) {
      fetchExistingRequest();
    }
  }, [requestId]);

  const fetchExistingRequest = async () => {
    if (!requestId) return;
    
    try {
      const { data, error } = await supabase
        .from('ria_state_license_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (error) throw error;
      
      setSelectedState(data.state);
      setCurrentStep(2); // Skip state selection if editing existing
    } catch (error) {
      console.error('Error fetching request:', error);
      toast({
        title: 'Error',
        description: 'Failed to load license request',
        variant: 'destructive',
      });
    }
  };

  const fetchStateChecklist = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ria_state_checklists')
        .select('*')
        .eq('state', selectedState)
        .order('order_sequence');

      if (error) throw error;
      setChecklist(data || []);

      // If editing existing request, also fetch documents
      if (requestId) {
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error fetching checklist:', error);
      toast({
        title: 'Error',
        description: 'Failed to load state checklist',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!requestId) return;

    try {
      const { data, error } = await supabase
        .from('ria_state_docs')
        .select('*')
        .eq('license_request_id', requestId);

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const createLicenseRequest = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('ria_state_license_requests')
        .insert({
          ria_id: user.user.id,
          state: selectedState,
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;

      navigate(`/ria-license-wizard/${data.id}`);
      setCurrentStep(2);
      
      toast({
        title: 'License Request Created',
        description: `Started RIA licensing process for ${selectedState}`,
      });
    } catch (error) {
      console.error('Error creating license request:', error);
      toast({
        title: 'Error',
        description: 'Failed to create license request',
        variant: 'destructive',
      });
    }
  };

  const uploadDocument = async (file: File, docType: string) => {
    if (!requestId) return;

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${requestId}/${docType}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ria-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data, error } = await supabase
        .from('ria_state_docs')
        .insert({
          license_request_id: requestId,
          doc_type: docType,
          file_url: uploadData.path,
          file_name: file.name,
          file_size: file.size,
          status: 'uploaded'
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger AI review
      await reviewDocumentWithAI(data.id, file, docType);
      
      fetchDocuments(); // Refresh documents list
      
      toast({
        title: 'Document Uploaded',
        description: `${file.name} uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
    }
  };

  const reviewDocumentWithAI = async (documentId: string, file: File, docType: string) => {
    try {
      // Read file content
      const fileContent = await file.text();
      
      // Call AI review Edge Function
      const response = await fetch(`${window.location.origin}/api/ria-document-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: docType,
          documentContent: fileContent,
          state: selectedState,
          fileName: file.name
        })
      });

      if (!response.ok) throw new Error('AI review failed');
      
      const reviewResult = await response.json();

      // Update document with AI feedback
      await supabase
        .from('ria_state_docs')
        .update({
          ai_review_score: reviewResult.overallScore,
          ai_feedback: reviewResult,
          compliance_issues: reviewResult.complianceIssues,
          status: reviewResult.overallScore >= 80 ? 'approved' : 'needs_revision'
        })
        .eq('id', documentId);

    } catch (error) {
      console.error('Error in AI review:', error);
    }
  };

  const getDocumentStatus = (docType: string) => {
    const doc = documents.find(d => d.doc_type === docType);
    return doc?.status || 'pending';
  };

  const getCompletionProgress = () => {
    if (checklist.length === 0) return 0;
    
    const requiredItems = checklist.filter(item => item.is_required);
    const completedItems = requiredItems.filter(item => {
      const status = getDocumentStatus(item.doc_type);
      return status === 'approved' || status === 'uploaded';
    });
    
    return Math.round((completedItems.length / requiredItems.length) * 100);
  };

  const getCategoryItems = (category: string) => {
    return checklist.filter(item => item.category === category);
  };

  const categories = ['disclosure', 'legal', 'financial', 'operational', 'general'];

  if (currentStep === 1) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/ria-licensing')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Start RIA License Application</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Target State</CardTitle>
            <CardDescription>
              Choose the state where you want to register as an investment advisor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.code} value={state.code}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedState && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">
                  {US_STATES.find(s => s.code === selectedState)?.name} Requirements Preview
                </h3>
                <p className="text-sm text-muted-foreground">
                  You'll need to complete {checklist.length} requirements including document uploads,
                  fee payments, and compliance reviews.
                </p>
              </div>
            )}

            <Button 
              className="w-full" 
              disabled={!selectedState}
              onClick={createLicenseRequest}
            >
              Start License Process
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/ria-licensing')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {US_STATES.find(s => s.code === selectedState)?.name} RIA License
          </h1>
          <p className="text-muted-foreground">Complete your state registration requirements</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm">{getCompletionProgress()}%</span>
        </div>
        <Progress value={getCompletionProgress()} className="h-2" />
      </div>

      <div className="grid gap-6">
        {categories.map((category) => {
          const categoryItems = getCategoryItems(category);
          if (categoryItems.length === 0) return null;

          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize">{category} Requirements</CardTitle>
                <CardDescription>
                  {categoryItems.filter(item => item.is_required).length} required items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryItems.map((item) => {
                    const status = getDocumentStatus(item.doc_type);
                    const doc = documents.find(d => d.doc_type === item.doc_type);

                    return (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{item.requirement}</h3>
                              {item.is_required && (
                                <Badge variant="secondary" className="text-xs">Required</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {item.description}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              Est. time: {item.estimated_hours} hours
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            {status === 'approved' && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approved
                              </Badge>
                            )}
                            {status === 'uploaded' && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Clock className="h-3 w-3 mr-1" />
                                Under Review
                              </Badge>
                            )}
                            {status === 'needs_revision' && (
                              <Badge className="bg-orange-100 text-orange-800">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Needs Revision
                              </Badge>
                            )}
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = '.pdf,.doc,.docx,.txt';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    uploadDocument(file, item.doc_type);
                                  }
                                };
                                input.click();
                              }}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              {status === 'pending' ? 'Upload' : 'Replace'}
                            </Button>
                          </div>
                        </div>
                        
                        {doc && doc.ai_feedback && (
                          <div className="mt-3 p-3 bg-muted rounded-md">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">AI Compliance Review</span>
                              <Badge variant="outline">Score: {doc.ai_review_score}%</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {doc.ai_feedback.summary}
                            </p>
                            {doc.compliance_issues.length > 0 && (
                              <div className="mt-2">
                                <div className="text-xs font-medium text-orange-600 mb-1">
                                  Issues to Address:
                                </div>
                                <ul className="text-xs space-y-1">
                                  {doc.compliance_issues.map((issue: any, index: number) => (
                                    <li key={index} className="text-muted-foreground">
                                      • {issue.issue}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}