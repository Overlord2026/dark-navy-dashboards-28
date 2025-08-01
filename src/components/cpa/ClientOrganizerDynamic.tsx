import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClipboardList, 
  Upload, 
  PenTool, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Download,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OrganizerQuestion {
  id: string;
  category: string;
  question: string;
  type: 'text' | 'number' | 'boolean' | 'file' | 'multiselect';
  required: boolean;
  options?: string[];
  response?: any;
}

interface DocumentUpload {
  id: string;
  name: string;
  category: string;
  required: boolean;
  uploaded: boolean;
  file?: File;
  url?: string;
}

const defaultQuestions: OrganizerQuestion[] = [
  {
    id: '1',
    category: 'Personal Information',
    question: 'Did your marital status change during the tax year?',
    type: 'boolean',
    required: true
  },
  {
    id: '2',
    category: 'Personal Information',
    question: 'Number of dependents claimed',
    type: 'number',
    required: true
  },
  {
    id: '3',
    category: 'Income',
    question: 'Did you receive unemployment compensation?',
    type: 'boolean',
    required: false
  },
  {
    id: '4',
    category: 'Income',
    question: 'Estimated total W-2 wages',
    type: 'number',
    required: true
  },
  {
    id: '5',
    category: 'Deductions',
    question: 'Do you plan to itemize deductions?',
    type: 'boolean',
    required: true
  },
  {
    id: '6',
    category: 'Deductions',
    question: 'Total charitable contributions',
    type: 'number',
    required: false
  }
];

const defaultDocuments: DocumentUpload[] = [
  { id: '1', name: 'W-2 Forms', category: 'Income', required: true, uploaded: false },
  { id: '2', name: '1099 Forms', category: 'Income', required: false, uploaded: false },
  { id: '3', name: 'Bank Statements', category: 'Records', required: true, uploaded: false },
  { id: '4', name: 'Charitable Receipts', category: 'Deductions', required: false, uploaded: false },
  { id: '5', name: 'Medical Expenses', category: 'Deductions', required: false, uploaded: false }
];

export function ClientOrganizerDynamic() {
  const [questions, setQuestions] = useState<OrganizerQuestion[]>(defaultQuestions);
  const [documents, setDocuments] = useState<DocumentUpload[]>(defaultDocuments);
  const [engagementSigned, setEngagementSigned] = useState(false);
  const [currentTab, setCurrentTab] = useState('questions');
  const { toast } = useToast();

  const answeredQuestions = questions.filter(q => q.response !== undefined && q.response !== '').length;
  const uploadedDocuments = documents.filter(d => d.uploaded).length;
  const requiredAnswered = questions.filter(q => q.required).every(q => q.response !== undefined && q.response !== '');
  const requiredUploaded = documents.filter(d => d.required).every(d => d.uploaded);

  const overallProgress = Math.round(
    ((answeredQuestions + uploadedDocuments + (engagementSigned ? 1 : 0)) / 
     (questions.length + documents.length + 1)) * 100
  );

  const updateQuestionResponse = (questionId: string, response: any) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, response } : q
    ));
  };

  const handleFileUpload = async (documentId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('client-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('client-documents')
        .getPublicUrl(fileName);

      setDocuments(prev => prev.map(d => 
        d.id === documentId ? { 
          ...d, 
          uploaded: true, 
          file, 
          url: publicUrl 
        } : d
      ));

      toast({
        title: "Document uploaded",
        description: `${file.name} has been successfully uploaded.`,
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitOrganizer = async () => {
    try {
      const organizerData = {
        questions: questions.reduce((acc, q) => ({
          ...acc,
          [q.id]: q.response
        }), {}),
        documents: documents.filter(d => d.uploaded).map(d => ({
          id: d.id,
          name: d.name,
          url: d.url
        })),
        engagement_signed: engagementSigned,
        completed_at: new Date().toISOString()
      };

      // Submit organizer responses
      const { error } = await supabase
        .from('client_organizers')
        .update({
          responses: organizerData.questions,
          status: 'completed',
          completed_at: organizerData.completed_at
        })
        .eq('client_user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Organizer submitted",
        description: "Your tax organizer has been successfully submitted to your CPA.",
      });
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderQuestionInput = (question: OrganizerQuestion) => {
    switch (question.type) {
      case 'text':
        return (
          <Textarea
            value={question.response || ''}
            onChange={(e) => updateQuestionResponse(question.id, e.target.value)}
            placeholder="Enter your response..."
            rows={3}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={question.response || ''}
            onChange={(e) => updateQuestionResponse(question.id, e.target.value)}
            placeholder="Enter amount..."
          />
        );
      case 'boolean':
        return (
          <div className="flex gap-2">
            <Button
              variant={question.response === true ? 'default' : 'outline'}
              onClick={() => updateQuestionResponse(question.id, true)}
              size="sm"
            >
              Yes
            </Button>
            <Button
              variant={question.response === false ? 'default' : 'outline'}
              onClick={() => updateQuestionResponse(question.id, false)}
              size="sm"
            >
              No
            </Button>
          </div>
        );
      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(question.response || []).includes(option)}
                  onChange={(e) => {
                    const current = question.response || [];
                    const updated = e.target.checked
                      ? [...current, option]
                      : current.filter((o: string) => o !== option);
                    updateQuestionResponse(question.id, updated);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const categories = [...new Set(questions.map(q => q.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            2024 Tax Organizer
          </h3>
          <p className="text-muted-foreground">
            Complete your tax information and upload required documents
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {overallProgress}% Complete
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>
            Track your organizer completion status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{overallProgress}% Complete</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Questions: {answeredQuestions}/{questions.length}</span>
                {requiredAnswered ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-500" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Documents: {uploadedDocuments}/{documents.length}</span>
                {requiredUploaded ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-green-500" />
                <span className="text-sm">Engagement Letter</span>
                {engagementSigned ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-500" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="signature">E-Signature</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-6">
          {categories.map((category) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-base">{category}</CardTitle>
                <CardDescription>
                  {questions.filter(q => q.category === category).length} questions in this section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions
                  .filter(q => q.category === category)
                  .map((question) => (
                    <div key={question.id} className="space-y-2 p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">
                          {question.question}
                        </Label>
                        {question.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        {question.response !== undefined && question.response !== '' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      {renderQuestionInput(question)}
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((document) => (
              <Card key={document.id} className={`${document.uploaded ? 'border-green-500' : document.required ? 'border-red-300' : 'border-muted'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    {document.name}
                    {document.required && !document.uploaded && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                    {document.uploaded && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        Uploaded
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Category: {document.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {document.uploaded ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>{document.file?.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          Replace
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(document.id, file);
                          }
                        }}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <p className="text-xs text-muted-foreground">
                        Accepted formats: PDF, DOC, DOCX, JPG, PNG
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="signature" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Engagement Letter
              </CardTitle>
              <CardDescription>
                Review and sign the engagement letter to authorize tax preparation services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!engagementSigned ? (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">Tax Preparation Engagement Letter</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      This engagement letter outlines the terms and conditions for our tax preparation services...
                    </p>
                    <div className="space-y-2 text-sm">
                      <p><strong>Services:</strong> Individual tax return preparation (Form 1040)</p>
                      <p><strong>Fee:</strong> $500 for standard return, additional fees may apply for complex situations</p>
                      <p><strong>Timeline:</strong> Returns will be completed within 10 business days of receiving all required documents</p>
                      <p><strong>Client Responsibilities:</strong> Provide complete and accurate information, review return before filing</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="agreement"
                      checked={engagementSigned}
                      onChange={(e) => setEngagementSigned(e.target.checked)}
                    />
                    <Label htmlFor="agreement" className="text-sm">
                      I agree to the terms and conditions outlined in the engagement letter
                    </Label>
                  </div>
                  
                  <Button 
                    onClick={() => setEngagementSigned(true)}
                    disabled={!engagementSigned}
                    className="w-full"
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    Sign Engagement Letter
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <div>
                    <h4 className="font-medium text-green-700">Engagement Letter Signed</h4>
                    <p className="text-sm text-muted-foreground">
                      Signed on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Signed Copy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className={`${requiredAnswered && requiredUploaded && engagementSigned ? 'border-green-500 bg-green-50' : 'border-muted'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                {requiredAnswered && requiredUploaded && engagementSigned 
                  ? 'Ready to Submit' 
                  : 'Complete Required Items'
                }
              </h4>
              <p className="text-sm text-muted-foreground">
                {requiredAnswered && requiredUploaded && engagementSigned 
                  ? 'All required items completed. You can submit your organizer.'
                  : 'Please complete all required questions, documents, and sign the engagement letter.'
                }
              </p>
            </div>
            <Button 
              onClick={handleSubmitOrganizer}
              disabled={!requiredAnswered || !requiredUploaded || !engagementSigned}
              className="ml-4"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Organizer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}