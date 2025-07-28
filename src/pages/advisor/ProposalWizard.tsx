import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Target, Eye, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface ProposalStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ParsedHolding {
  ticker: string;
  name: string;
  quantity: number;
  market_value: number;
  cost_basis?: number;
  asset_class: string;
}

interface ModelScore {
  model_id: string;
  score: number;
  model_name: string;
}

const steps: ProposalStep[] = [
  {
    id: 1,
    title: 'Upload Statement',
    description: 'Upload client account statement (PDF/CSV)',
    icon: <Upload className="h-5 w-5" />
  },
  {
    id: 2,
    title: 'Review Holdings',
    description: 'Verify parsed holdings and make corrections',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 3,
    title: 'Adjust Model',
    description: 'Customize investment model recommendations',
    icon: <Target className="h-5 w-5" />
  },
  {
    id: 4,
    title: 'Preview & Send',
    description: 'Review proposal and send to client',
    icon: <Eye className="h-5 w-5" />
  }
];

export const ProposalWizard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [prospectName, setProspectName] = useState('');
  const [prospectEmail, setProspectEmail] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedHoldings, setParsedHoldings] = useState<ParsedHolding[]>([]);
  const [modelScores, setModelScores] = useState<ModelScore[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [proposalId, setProposalId] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  const parseStatement = async () => {
    if (!uploadedFile || !prospectName) {
      toast.error('Please upload a file and enter prospect name');
      return;
    }

    setIsLoading(true);
    try {
      // Upload file to storage first
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `statements/${user?.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('proposals')
        .upload(fileName, uploadedFile);

      if (uploadError) throw uploadError;

      // Call parse-statement edge function
      const { data, error } = await supabase.functions.invoke('parse-statement', {
        body: {
          file_path: fileName,
          prospect_name: prospectName,
          prospect_email: prospectEmail
        }
      });

      if (error) throw error;

      setParsedHoldings(data.holdings || []);
      setModelScores(data.model_scores || []);
      setProposalId(data.proposal_id);
      
      if (data.model_scores?.length > 0) {
        setSelectedModelId(data.model_scores[0].model_id);
      }

      toast.success('Statement parsed successfully!');
      setCurrentStep(2);
    } catch (error) {
      console.error('Error parsing statement:', error);
      toast.error('Failed to parse statement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProposal = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('draft_proposals')
        .update({
          current_holdings: parsedHoldings,
          recommended_model_id: selectedModelId,
          advisor_overrides: {},
          status: 'finalized'
        })
        .eq('id', proposalId);

      if (error) throw error;

      toast.success('Proposal saved successfully!');
      navigate('/advisor/proposals');
    } catch (error) {
      console.error('Error saving proposal:', error);
      toast.error('Failed to save proposal');
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prospect-name">Prospect Name *</Label>
                <Input
                  id="prospect-name"
                  value={prospectName}
                  onChange={(e) => setProspectName(e.target.value)}
                  placeholder="Enter prospect name"
                />
              </div>
              <div>
                <Label htmlFor="prospect-email">Prospect Email</Label>
                <Input
                  id="prospect-email"
                  type="email"
                  value={prospectEmail}
                  onChange={(e) => setProspectEmail(e.target.value)}
                  placeholder="Enter prospect email"
                />
              </div>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              {uploadedFile ? (
                <div>
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium">
                    {isDragActive ? 'Drop the file here' : 'Drag & drop a statement here'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Or click to browse (PDF, CSV, Excel supported)
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={parseStatement}
              disabled={!uploadedFile || !prospectName || isLoading}
              className="w-full"
            >
              {isLoading ? 'Parsing Statement...' : 'Parse Statement'}
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">Parsed Holdings</h3>
              <p className="text-sm text-blue-700">
                Review the holdings parsed from the statement. Make any necessary corrections.
              </p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {parsedHoldings.map((holding, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                  <div>
                    <Label className="text-xs text-gray-500">Ticker</Label>
                    <p className="font-medium">{holding.ticker}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Asset Class</Label>
                    <p className="text-sm">{holding.asset_class}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Quantity</Label>
                    <p className="text-sm">{holding.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Market Value</Label>
                    <p className="text-sm">${holding.market_value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)} className="flex-1">
                Continue to Model Selection
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900">Recommended Models</h3>
              <p className="text-sm text-green-700">
                Based on current holdings, here are the best-fit investment models.
              </p>
            </div>

            <div className="space-y-3">
              {modelScores.map((model) => (
                <div
                  key={model.model_id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedModelId === model.model_id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedModelId(model.model_id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{model.model_name}</h4>
                      <p className="text-sm text-gray-500">
                        Compatibility Score: {(model.score * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 border-primary">
                      {selectedModelId === model.model_id && (
                        <div className="w-2 h-2 bg-primary rounded-full m-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(4)} className="flex-1">
                Generate Proposal
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900">Proposal Preview</h3>
              <p className="text-sm text-purple-700">
                Review the generated proposal before sending to your prospect.
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-gray-50">
              <h4 className="font-medium mb-4">Investment Proposal for {prospectName}</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Total Portfolio Value:</strong> ${parsedHoldings.reduce((sum, h) => sum + h.market_value, 0).toLocaleString()}</p>
                <p><strong>Number of Holdings:</strong> {parsedHoldings.length}</p>
                <p><strong>Recommended Model:</strong> {modelScores.find(m => m.model_id === selectedModelId)?.model_name}</p>
                <p><strong>Estimated Annual Fee:</strong> 1.25% of AUM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                Back
              </Button>
              <Button onClick={saveProposal} disabled={isLoading} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save & Send Proposal'}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Investment Proposal</h1>
        <p className="text-gray-600 mt-2">
          Generate a personalized investment proposal in under 10 minutes
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center space-x-2 ${
                step.id <= currentStep ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  step.id <= currentStep ? 'bg-primary text-white' : 'bg-gray-200'
                }`}
              >
                {step.icon}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};