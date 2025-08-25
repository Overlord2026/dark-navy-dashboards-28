import React from 'react';
import { RULES_TOP8, getProviderRule } from '@/features/k401/forms/rulesTop8';
import { generatePdfFromTemplate, saveFormToVault, logFormGenerated, anchorFormIfEnabled } from '@/features/k401/forms/merge';
import type { MergeCtx, ProviderRule } from '@/features/k401/forms/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Mail, Send, AlertCircle } from 'lucide-react';

interface GeneratedForm {
  name: string;
  how: 'esubmit' | 'upload' | 'mail' | 'fax';
  fileId: string;
  uploadUrl?: string;
  fax?: string;
  mail?: string;
  templateId: string;
}

export async function createRolloverForms(provider: string, ctx: MergeCtx): Promise<GeneratedForm[]> {
  const rule = getProviderRule(provider) || RULES_TOP8[0];
  const out: GeneratedForm[] = [];
  
  for (const paperwork of rule.paperwork) {
    try {
      const pdf = await generatePdfFromTemplate(paperwork.templateId, ctx);
      const timestamp = new Date().toISOString().split('T')[0];
      const path = `Estate/401k/Rollover/${provider}/${new Date().getFullYear()}/${paperwork.templateId}-${ctx.client.id}-${timestamp}.pdf`;
      
      const { fileId } = await saveFormToVault(path, pdf);
      await logFormGenerated(paperwork.templateId, fileId, provider);
      
      // Optional anchoring
      const sha256 = await crypto.subtle.digest('SHA-256', pdf).then(buf => 
        Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
      );
      await anchorFormIfEnabled(fileId, sha256);
      
      out.push({ 
        name: paperwork.name, 
        how: paperwork.how, 
        fileId, 
        uploadUrl: rule.addresses?.uploadUrl || '', 
        fax: rule.addresses?.fax, 
        mail: rule.addresses?.mail,
        templateId: paperwork.templateId
      });
    } catch (error) {
      console.error(`Failed to generate form ${paperwork.templateId}:`, error);
    }
  }
  
  return out;
}

interface RolloverFormsGeneratorProps {
  provider: string;
  mergeContext: MergeCtx;
  onFormsGenerated?: (forms: GeneratedForm[]) => void;
}

export const RolloverFormsGenerator: React.FC<RolloverFormsGeneratorProps> = ({
  provider,
  mergeContext,
  onFormsGenerated
}) => {
  const [forms, setForms] = React.useState<GeneratedForm[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const rule = getProviderRule(provider);
  
  const handleGenerateForms = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const generatedForms = await createRolloverForms(provider, mergeContext);
      setForms(generatedForms);
      onFormsGenerated?.(generatedForms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate forms');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const getSubmissionIcon = (how: string) => {
    switch (how) {
      case 'upload': return <Upload className="h-4 w-4" />;
      case 'mail': return <Mail className="h-4 w-4" />;
      case 'fax': return <Send className="h-4 w-4" />;
      case 'esubmit': return <Download className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  const getSubmissionColor = (how: string) => {
    switch (how) {
      case 'upload': return 'bg-blue-100 text-blue-800';
      case 'esubmit': return 'bg-green-100 text-green-800';
      case 'mail': return 'bg-yellow-100 text-yellow-800';
      case 'fax': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (!rule) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            Provider "{provider}" not supported yet
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{provider} Rollover Forms</span>
          <Badge variant={rule.acceptsESign ? 'default' : 'secondary'}>
            {rule.acceptsESign ? 'eSign Ready' : 'Paper Only'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rule.notes && (
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            <AlertCircle className="h-4 w-4 inline mr-2" />
            {rule.notes}
          </div>
        )}
        
        <div className="space-y-2">
          <h4 className="font-medium">Required Paperwork:</h4>
          {rule.paperwork.map((paper, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">{paper.name}</span>
              <Badge className={getSubmissionColor(paper.how)}>
                {getSubmissionIcon(paper.how)}
                <span className="ml-1 capitalize">{paper.how}</span>
              </Badge>
            </div>
          ))}
        </div>
        
        {forms.length === 0 ? (
          <Button 
            onClick={handleGenerateForms} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generating Forms...' : 'Generate Rollover Forms'}
          </Button>
        ) : (
          <div className="space-y-3">
            <h4 className="font-medium text-green-800">✓ Forms Generated</h4>
            {forms.map((form, idx) => (
              <div key={idx} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{form.name}</span>
                  <Badge className={getSubmissionColor(form.how)}>
                    {getSubmissionIcon(form.how)}
                    <span className="ml-1 capitalize">{form.how}</span>
                  </Badge>
                </div>
                
                {form.how === 'upload' && form.uploadUrl && (
                  <div className="text-sm text-blue-600">
                    Upload to: <a href={form.uploadUrl} target="_blank" rel="noopener noreferrer" className="underline">{form.uploadUrl}</a>
                  </div>
                )}
                
                {form.how === 'mail' && form.mail && (
                  <div className="text-sm text-gray-600">
                    Mail to: {form.mail}
                  </div>
                )}
                
                {form.how === 'fax' && form.fax && (
                  <div className="text-sm text-gray-600">
                    Fax to: {form.fax}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-1">
                  File: {form.fileId.split('/').pop()}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 p-3 rounded-lg text-sm text-red-800">
            <AlertCircle className="h-4 w-4 inline mr-2" />
            {error}
          </div>
        )}
        
        {rule.phone && (
          <div className="text-sm text-gray-600 pt-2 border-t">
            <strong>Support:</strong> {rule.phone}
          </div>
        )}
      </CardContent>
    </Card>
  );
};