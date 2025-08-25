import React from 'react';
import { RULES_TOP8, getProviderRule } from '@/features/k401/forms/rulesTop8';
import { generatePdfFromTemplate, mergeTags } from '@/features/k401/forms/merge';
import type { ProviderRule, MergeCtx } from '@/features/k401/forms/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Settings } from 'lucide-react';

export default function K401FormsAdmin() {
  const [selectedProvider, setSelectedProvider] = React.useState('Vanguard');
  const [previewData, setPreviewData] = React.useState<string>('');
  const [sampleCtx] = React.useState<MergeCtx>({
    client: {
      id: 'C123',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '555-0123',
      address: '123 Main St, Anytown, ST 12345',
      ssnLast4: '1234'
    },
    account: {
      id: 'ACC456',
      provider: selectedProvider,
      planId: 'PLAN789',
      balance: 125000,
      sdb: 'SDB001'
    },
    advisor: {
      id: 'ADV789',
      name: 'Sarah Johnson',
      firm: 'Johnson Financial Advisors',
      email: 'sarah@johnsonfa.com',
      phone: '555-0456'
    },
    provider: {
      name: selectedProvider,
      phone: getProviderRule(selectedProvider)?.phone || '',
      uploadUrl: getProviderRule(selectedProvider)?.addresses?.uploadUrl || '',
      fax: getProviderRule(selectedProvider)?.addresses?.fax || '',
      mail: getProviderRule(selectedProvider)?.addresses?.mail || ''
    },
    rollover: {
      type: 'IRA',
      reason: 'Lower fees and better investment options'
    }
  });

  const selectedRule = getProviderRule(selectedProvider);

  const handlePreviewForm = async (templateId: string) => {
    try {
      const template = await fetch(`/api/templates/${templateId}`).catch(() => null);
      if (template) {
        const content = await template.text();
        setPreviewData(mergeTags(content, sampleCtx));
      } else {
        // Fallback to generating with current system
        const pdf = await generatePdfFromTemplate(templateId, sampleCtx);
        const text = new TextDecoder().decode(pdf);
        setPreviewData(text);
      }
    } catch (error) {
      console.error('Preview failed:', error);
      setPreviewData('Preview unavailable');
    }
  };

  const handleDownloadSample = async (templateId: string) => {
    try {
      const pdf = await generatePdfFromTemplate(templateId, sampleCtx);
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateId}-sample.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">401(k) Forms Kit Administration</h1>
        <p className="text-muted-foreground">
          Manage provider rules, templates, and preview form generation for the top 8 401(k) providers
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Provider Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Provider</label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RULES_TOP8.map(rule => (
                      <SelectItem key={rule.provider} value={rule.provider}>
                        {rule.provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRule && (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">E-Sign Support:</span>
                    <Badge variant={selectedRule.acceptsESign ? "default" : "secondary"} className="ml-2">
                      {selectedRule.acceptsESign ? 'Yes' : 'No'}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-sm font-medium">Rollover Types:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRule.rolloverTypes.map(type => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium">Contact:</span>
                    <p className="text-sm text-muted-foreground">{selectedRule.phone}</p>
                  </div>

                  {selectedRule.addresses && (
                    <div>
                      <span className="text-sm font-medium">Addresses:</span>
                      <div className="text-xs text-muted-foreground space-y-1 mt-1">
                        {selectedRule.addresses.uploadUrl && (
                          <div>Upload: {selectedRule.addresses.uploadUrl}</div>
                        )}
                        {selectedRule.addresses.fax && (
                          <div>Fax: {selectedRule.addresses.fax}</div>
                        )}
                        {selectedRule.addresses.mail && (
                          <div>Mail: {selectedRule.addresses.mail}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedRule.notes && (
                    <div>
                      <span className="text-sm font-medium">Notes:</span>
                      <p className="text-xs text-muted-foreground">{selectedRule.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Available Forms & Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRule ? (
                <div className="space-y-4">
                  {selectedRule.paperwork.map((form, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{form.name}</h3>
                          <p className="text-sm text-muted-foreground">Template ID: {form.templateId}</p>
                          {form.note && (
                            <p className="text-xs text-muted-foreground mt-1">{form.note}</p>
                          )}
                        </div>
                        <Badge variant={
                          form.how === 'esubmit' ? 'default' :
                          form.how === 'upload' ? 'secondary' :
                          'outline'
                        }>
                          {form.how}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePreviewForm(form.templateId)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadSample(form.templateId)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download Sample
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Select a provider to view available forms</p>
              )}
            </CardContent>
          </Card>

          {previewData && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Form Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={previewData}
                  readOnly
                  className="min-h-[300px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground border-t pt-4">
        <p>
          This administration interface allows you to preview and test 401(k) rollover forms 
          for the top 8 providers. Forms are generated using merge tags and saved to the Vault 
          with content-free receipts for audit compliance.
        </p>
        <p className="mt-2">
          <strong>Merge Tags Available:</strong> {'{{'}client.name{'}}'},  {'{{'}account.id{'}}'},  {'{{'}provider.name{'}}'},  
          {'{{'}advisor.firm{'}}'},  {'{{'}rollover.type{'}}'},  and more.
        </p>
      </div>
    </div>
  );
}