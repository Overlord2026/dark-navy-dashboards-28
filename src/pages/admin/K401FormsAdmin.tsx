import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RULES_TOP8, getProviderRule } from '@/features/k401/forms/rulesTop8';
import { generatePdfFromTemplate, mergeTags } from '@/features/k401/forms/merge';
import type { ProviderRule, MergeCtx } from '@/features/k401/forms/types';
import { Upload, Mail, Send, Download, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';

const K401FormsAdmin = () => {
  const [selectedProvider, setSelectedProvider] = React.useState(RULES_TOP8[0].provider);
  const [editingRule, setEditingRule] = React.useState<ProviderRule | null>(null);
  const [previewCtx, setPreviewCtx] = React.useState<MergeCtx>({
    client: {
      id: 'C12345',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '555-0123',
      address: '123 Main St, Anytown, ST 12345',
      ssnLast4: '1234'
    },
    account: {
      id: 'ACC789',
      provider: selectedProvider,
      planId: 'PLAN001',
      balance: 85000,
      sdb: 'Self-directed brokerage'
    },
    advisor: {
      id: 'ADV456',
      name: 'Jane Advisor',
      firm: 'Wealth Management LLC',
      email: 'jane@wealthmgmt.com',
      phone: '555-0456'
    },
    provider: {
      name: selectedProvider,
      phone: getProviderRule(selectedProvider)?.phone || ''
    },
    rollover: {
      type: 'IRA',
      reason: 'Job change',
      feeSummaryId: 'FEES123'
    }
  });

  const currentRule = getProviderRule(selectedProvider);

  const handlePreviewForm = async (templateId: string) => {
    try {
      const pdfBytes = await generatePdfFromTemplate(templateId, previewCtx);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success('Form preview opened in new tab');
    } catch (error) {
      toast.error('Failed to generate preview');
    }
  };

  const getSubmissionIcon = (how: string) => {
    switch (how) {
      case 'upload': return <Upload className="h-4 w-4" />;
      case 'mail': return <Mail className="h-4 w-4" />;
      case 'fax': return <Send className="h-4 w-4" />;
      case 'esubmit': return <Download className="h-4 w-4" />;
      default: return <Download className="h-4 w-4" />;
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">401(k) Provider Forms Kit</h1>
          <p className="text-muted-foreground">
            Manage rollover forms for top 8 providers with smart merge tags
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          {RULES_TOP8.length} Providers Configured
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Provider Overview</TabsTrigger>
          <TabsTrigger value="preview">Form Preview</TabsTrigger>
          <TabsTrigger value="rules">Edit Rules</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RULES_TOP8.map((rule) => (
              <Card key={rule.provider} className="relative">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    {rule.provider}
                    <Badge variant={rule.acceptsESign ? 'default' : 'secondary'}>
                      {rule.acceptsESign ? 'eSign' : 'Paper'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <strong>Phone:</strong> {rule.phone}
                  </div>
                  
                  <div className="text-sm">
                    <strong>Rollover Types:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rule.rolloverTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm">
                    <strong>Forms ({rule.paperwork.length}):</strong>
                    <div className="space-y-1 mt-1">
                      {rule.paperwork.map((paper, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span>{paper.name}</span>
                          <Badge className={`${getSubmissionColor(paper.how)} text-xs`}>
                            {getSubmissionIcon(paper.how)}
                            <span className="ml-1">{paper.how}</span>
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {rule.notes && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {rule.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select a provider and preview generated forms with sample data
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider-select">Provider</Label>
                  <select
                    id="provider-select"
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {RULES_TOP8.map((rule) => (
                      <option key={rule.provider} value={rule.provider}>
                        {rule.provider}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input
                    id="client-name"
                    value={previewCtx.client.name}
                    onChange={(e) => setPreviewCtx(ctx => ({
                      ...ctx,
                      client: { ...ctx.client, name: e.target.value }
                    }))}
                  />
                </div>
              </div>

              {currentRule && (
                <div className="space-y-3">
                  <h4 className="font-medium">Available Forms:</h4>
                  {currentRule.paperwork.map((paper, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{paper.name}</div>
                        <div className="text-sm text-gray-600">Template: {paper.templateId}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSubmissionColor(paper.how)}>
                          {getSubmissionIcon(paper.how)}
                          <span className="ml-1">{paper.how}</span>
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreviewForm(paper.templateId)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provider Rules Editor</CardTitle>
              <p className="text-sm text-muted-foreground">
                Edit submission channels, forms, and provider-specific settings
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Save className="h-8 w-8 mx-auto mb-2 opacity-50" />
                Rules editor coming soon. Currently using static configuration.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Templates</CardTitle>
              <p className="text-sm text-muted-foreground">
                Merge tags available: client, account, advisor, provider, rollover
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono">
                <div className="font-bold mb-2">Available Merge Tags:</div>
                <div className="text-xs text-gray-600 mb-2">
                  Use double curly braces around these tags in templates
                </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <div className="font-semibold">Client:</div>
                      <div>client.name, client.email</div>
                      <div>client.phone, client.address</div>
                      <div>client.ssnLast4</div>
                    </div>
                    <div>
                      <div className="font-semibold">Account:</div>
                      <div>account.id, account.provider</div>
                      <div>account.planId, account.balance</div>
                    </div>
                    <div>
                      <div className="font-semibold">Advisor:</div>
                      <div>advisor.name, advisor.firm</div>
                      <div>advisor.email, advisor.phone</div>
                    </div>
                    <div>
                      <div className="font-semibold">Rollover:</div>
                      <div>rollover.type, rollover.reason</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default K401FormsAdmin;