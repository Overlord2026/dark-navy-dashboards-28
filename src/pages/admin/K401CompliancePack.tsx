import React from 'react';
import { generateCompliancePack, generateBrokerDemoPack } from '@/features/compliance/generator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function K401CompliancePack() {
  const [erisa, setErisa] = React.useState(localStorage.getItem('k401.compliancePack.ready') === 'true');
  const [demo, setDemo] = React.useState(localStorage.getItem('k401.brokerDemoPack.ready') === 'true');
  const [busy, setBusy] = React.useState(false);
  const [policyVersion, setPolicyVersion] = React.useState('K-2025.09');

  const erisaDate = localStorage.getItem('k401.compliancePack.date');
  const demoDate = localStorage.getItem('k401.brokerDemoPack.date');

  async function runCompliance() {
    setBusy(true);
    try {
      await generateCompliancePack(policyVersion);
      setErisa(true);
      alert('Compliance pack generated (PDFs downloaded + receipts logged).');
    } catch (error) {
      alert(`Error generating compliance pack: ${error}`);
    }
    setBusy(false);
  }

  async function runDemo() {
    setBusy(true);
    try {
      await generateBrokerDemoPack(policyVersion);
      setDemo(true);
      alert('Broker demo pack generated (PDF downloaded + receipts logged).');
    } catch (error) {
      alert(`Error generating demo pack: ${error}`);
    }
    setBusy(false);
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Compliance & Broker Packs</h1>
      
      <div className="rounded-xl border p-4 bg-card">
        <Label htmlFor="policy-version" className="text-sm font-medium">Policy Version</Label>
        <Input
          id="policy-version"
          value={policyVersion}
          onChange={(e) => setPolicyVersion(e.target.value)}
          placeholder="e.g., K-2025.09"
          className="mt-1 max-w-xs"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Version identifier for generated PDFs and receipts
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4 bg-card">
          <div className="text-sm font-medium mb-2">2-Page Compliance Overview (PDF)</div>
          <div className="text-xs text-muted-foreground mb-3">
            ERISA/PTE 2020-02 + Crypto policy memo → Server-generated PDFs with Vault storage, content-free receipts.
          </div>
          <button 
            className="rounded-xl border px-3 py-2 hover:bg-muted disabled:opacity-50" 
            onClick={runCompliance} 
            disabled={busy}
          >
            {busy ? 'Generating PDFs...' : 'Generate Compliance Pack'}
          </button>
          <div className="text-xs mt-2 flex items-center gap-2">
            <span className={erisa ? 'text-green-600' : 'text-muted-foreground'}>
              {erisa ? '✅ Ready' : '◷ Not yet generated'}
            </span>
            {erisaDate && <span className="text-muted-foreground">({erisaDate})</span>}
          </div>
        </div>

        <div className="rounded-xl border p-4 bg-card">
          <div className="text-sm font-medium mb-2">30-minute Broker Demo Pack (PDF)</div>
          <div className="text-xs text-muted-foreground mb-3">
            Demo script PDF + ROI materials; server-generated with Vault storage; receipts logged.
          </div>
          <button 
            className="rounded-xl border px-3 py-2 hover:bg-muted disabled:opacity-50" 
            onClick={runDemo} 
            disabled={busy}
          >
            {busy ? 'Generating PDF...' : 'Generate Broker Demo Pack'}
          </button>
          <div className="text-xs mt-2 flex items-center gap-2">
            <span className={demo ? 'text-green-600' : 'text-muted-foreground'}>
              {demo ? '✅ Ready' : '◷ Not yet generated'}
            </span>
            {demoDate && <span className="text-muted-foreground">({demoDate})</span>}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Generated Documents</h2>
        
        <div className="rounded-xl border p-4 bg-muted/30">
          <h3 className="font-medium mb-2">Compliance Pack Contents:</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• ERISA & PTE 2020-02 Overview (roles, requirements, platform benefits)</li>
            <li>• Crypto Policy Memo (custody, suitability, estate planning, tax)</li>
            <li>• Audit kit framework with content-free receipts</li>
            <li>• Advisor compliance checklist</li>
          </ul>
        </div>

        <div className="rounded-xl border p-4 bg-muted/30">
          <h3 className="font-medium mb-2">Broker Demo Pack Contents:</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• 30-minute structured demo script</li>
            <li>• Pain points and solution positioning</li>
            <li>• Platform demonstration flow</li>
            <li>• KPI metrics and value propositions</li>
            <li>• Pilot program closing framework</li>
          </ul>
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>✅ Server generates branded B/W PDFs (no PII/PHI in content or receipts)</p>
        <p>✅ Files saved to local vault with SHA256 naming</p>
        <p>✅ Decision-RDS and Vault-RDS receipts logged with content-free hashes</p>
        <p>📝 To customize: edit PDF templates in src/server/index.ts renderPdf() function</p>
      </div>
    </div>
  );
}