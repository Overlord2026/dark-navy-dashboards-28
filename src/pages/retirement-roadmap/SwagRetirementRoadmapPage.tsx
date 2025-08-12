import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function SwagRetirementRoadmapPage() {
  const [uploading, setUploading] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImportRA = async (file: File) => {
    try {
      setUploading(true);
      
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data URL prefix
        };
        reader.readAsDataURL(file);
      });

      // Call the ra-to-swag edge function
      const { data, error } = await supabase.functions.invoke('ra-to-swag', {
        body: { pdfBase64: `data:application/pdf;base64,${base64}` }
      });

      if (error) throw error;

      toast({
        title: "RA Import Complete",
        description: `Successfully imported retirement analysis. Run ID: ${data.runId}`
      });

      setRunId(data.runId);

      // TODO: Continue with optimizer, scenarios, and report builder
      console.log('Parsed inputs:', data.inputs);
      
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import RA PDF",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      handleImportRA(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PDF file",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              SWAG Retirement Roadmap™
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Strategic Wealth Allocation & Growth - Your personalized 4-phase retirement framework
            </p>
          </div>

          {/* Import RA PDF Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Import Retirement Analysis PDF
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Upload Your RA PDF</h3>
                  <p className="text-muted-foreground">
                    Import your existing Retirement Analysis PDF to automatically populate the SWAG framework
                  </p>
                </div>
                
                <div className="mt-6">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload">
                    <Button disabled={uploading} className="cursor-pointer">
                      {uploading ? 'Processing...' : 'Select PDF File'}
                    </Button>
                  </label>
                </div>
              </div>

              {runId && (
                <div className="bg-emerald/10 border border-emerald/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-emerald rounded-full"></div>
                    <span className="font-semibold text-emerald">Import Complete</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Run ID: <code className="bg-muted px-1 rounded">{runId}</code>
                  </p>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm">
                      Run Optimizer
                    </Button>
                    <Button size="sm" variant="outline">
                      View Scenarios
                    </Button>
                    <Button size="sm" variant="outline">
                      Download Report
                    </Button>
                    <Button size="sm" variant="outline">
                      Anchor Receipt
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Demo Flow Status */}
          <Card>
            <CardHeader>
              <CardTitle>Demo Flow Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { step: 'Upload RA PDF', status: runId ? 'complete' : 'pending', description: 'Parse retirement analysis from PDF' },
                  { step: 'Run Optimizer', status: 'pending', description: 'Execute portfolio optimization engine' },
                  { step: 'Generate Scenarios', status: 'pending', description: 'Monte Carlo simulation and stress testing' },
                  { step: 'Create Receipt', status: 'pending', description: 'Generate regulatory data store receipt' },
                  { step: 'Build Report', status: 'pending', description: 'Generate branded client PDF report' },
                  { step: 'Anchor Receipt', status: 'pending', description: 'Optional blockchain anchoring' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded border">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'complete' ? 'bg-emerald' : 
                      item.status === 'active' ? 'bg-blue-500' : 'bg-muted'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium">{item.step}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}