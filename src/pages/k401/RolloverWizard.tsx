import React from 'react';
import { generatePdfFromTemplate, saveFormToVault, logFormGenerated } from '@/features/k401/forms/merge';
import { RULES_TOP8 } from '@/features/k401/forms/rulesTop8';
import { recordReceipt } from '@/features/receipts/record';
import { canWrite, getCurrentUserRole, getRoleDisplayName } from '@/features/auth/roles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function AdviceSummaryPDF({ ctx }: { ctx: any }) {
  // Create text summary → bytes (replace later with real PDF lib)
  const txt = `PTE 2020-02 Fee Comparison\nCurrent plan fees: ${ctx.currentFees}\nProposed fees: ${ctx.proposedFees}\nRationale: ${ctx.rationale}\n`;
  return new TextEncoder().encode(txt);
}

export default function RolloverWizard() {
  const [provider, setProvider] = React.useState('Fidelity');
  const [ctx, setCtx] = React.useState<any>({
    currentFees: '0.45%',
    proposedFees: '0.25%',
    rationale: 'Lower all-in costs and broader lineup',
    client: { id: 'C1', name: 'Client A' },
    account: { id: 'A1', provider: 'Fidelity' },
    advisor: { id: 'ADV1', name: 'Advisor A' },
    providerInfo: { name: 'Fidelity' }
  });
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedFiles, setGeneratedFiles] = React.useState<string[]>([]);
  const { toast } = useToast();
  const userRole = getCurrentUserRole();
  const writable = canWrite(userRole);

  async function generate() {
    setIsGenerating(true);
    try {
      // Advice Summary
      const pdf = AdviceSummaryPDF({ ctx });
      const { fileId } = await saveFormToVault(
        `Estate/401k/Rollover/${provider}/${new Date().getFullYear()}/PTE2020-02-${ctx.client.id}-v1.pdf`,
        pdf as any
      );
      
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'rollover.fee.compare',
        reasons: [provider, 'pte2020-02'],
        created_at: new Date().toISOString()
      } as any);

      const files = [fileId];

      // Forms
      const rule = RULES_TOP8.find(r => r.provider === provider);
      if (rule) {
        for (const p of rule.paperwork) {
          const merged = await generatePdfFromTemplate(p.templateId, {
            client: ctx.client,
            account: ctx.account,
            provider: { name: provider },
            advisor: ctx.advisor,
            rollover: { type: 'IRA' }
          } as any);
          
          const form = await saveFormToVault(
            `Estate/401k/Rollover/${provider}/${new Date().getFullYear()}/${p.templateId}-${ctx.client.id}-v1.pdf`,
            merged
          );
          
          await logFormGenerated(p.templateId, form.fileId);
          files.push(form.fileId);
        }
      }

      setGeneratedFiles(files);
      toast({
        title: "Success",
        description: "Advice Summary & forms generated to Vault",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate documents",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">401(k) Rollover Wizard</h1>
        <p className="text-muted-foreground">
          Generate PTE 2020-02 fee comparison and provider forms
          {!writable && <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs">Read-only ({getRoleDisplayName(userRole)})</span>}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Provider & Client Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="provider">Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {RULES_TOP8.map(r => (
                    <SelectItem key={r.provider} value={r.provider}>
                      {r.provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                value={ctx.client.name}
                onChange={(e) => setCtx(prev => ({
                  ...prev,
                  client: { ...prev.client, name: e.target.value }
                }))}
              />
            </div>

            <div>
              <Label htmlFor="advisor-name">Advisor Name</Label>
              <Input
                id="advisor-name"
                value={ctx.advisor.name}
                onChange={(e) => setCtx(prev => ({
                  ...prev,
                  advisor: { ...prev.advisor, name: e.target.value }
                }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee Comparison (PTE 2020-02)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-fees">Current Plan Fees</Label>
              <Input
                id="current-fees"
                value={ctx.currentFees}
                onChange={(e) => setCtx(prev => ({ ...prev, currentFees: e.target.value }))}
                placeholder="0.45%"
              />
            </div>

            <div>
              <Label htmlFor="proposed-fees">Proposed Fees</Label>
              <Input
                id="proposed-fees"
                value={ctx.proposedFees}
                onChange={(e) => setCtx(prev => ({ ...prev, proposedFees: e.target.value }))}
                placeholder="0.25%"
              />
            </div>

            <div>
              <Label htmlFor="rationale">Rationale</Label>
              <Textarea
                id="rationale"
                value={ctx.rationale}
                onChange={(e) => setCtx(prev => ({ ...prev, rationale: e.target.value }))}
                placeholder="Lower all-in costs and broader lineup"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Generate Documents</h3>
              <p className="text-sm text-muted-foreground">
                Creates PTE 2020-02 fee comparison PDF and required provider forms
              </p>
            </div>
            <Button 
              onClick={generate} 
              disabled={isGenerating || !writable}
              className="min-w-[200px]"
              title={!writable ? "Read-only access" : ""}
            >
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Advice Summary & Forms
                </>
              )}
            </Button>
          </div>

          {generatedFiles.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Documents Generated Successfully</span>
              </div>
              <div className="text-sm text-green-700">
                <p>{generatedFiles.length} files saved to Vault:</p>
                <ul className="list-disc ml-4 mt-1">
                  <li>PTE 2020-02 Fee Comparison PDF</li>
                  <li>Provider-specific rollover forms</li>
                  <li>Decision-RDS and Vault-RDS receipts logged</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground border-t pt-4">
        <p>
          This wizard generates required PTE 2020-02 documentation and provider-specific forms 
          for 401(k) rollover recommendations. All documents are saved to the Vault with 
          tamper-evident receipts for audit purposes.
        </p>
      </div>
    </div>
  );
}