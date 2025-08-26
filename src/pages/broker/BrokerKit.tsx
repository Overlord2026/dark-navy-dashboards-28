import React from 'react';
import { BROKER_EMAIL, BROKER_FOLLOWUP, BROKER_DEMO_SCRIPT } from '@/features/broker/kit/templates';
import { sendEmail } from '@/features/migrate/email/sender';
import { recordReceipt } from '@/features/receipts/record';

export default function BrokerKit() {
  const [contactName, setContactName] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [senderFirm, setSenderFirm] = React.useState('BFO');
  const [emailType, setEmailType] = React.useState<'initial' | 'followup'>('initial');
  const [sendStatus, setSendStatus] = React.useState<string>('');

  const currentTemplate = emailType === 'initial' 
    ? BROKER_EMAIL(contactName, senderFirm)
    : BROKER_FOLLOWUP(senderFirm);

  const handleSendEmail = async () => {
    if (!contactEmail) {
      setSendStatus('❌ Please enter contact email');
      return;
    }

    try {
      const result = await sendEmail({
        to: contactEmail,
        subject: currentTemplate.subject,
        text: currentTemplate.text,
        html: currentTemplate.html,
        template_id: `broker.${emailType}`
      });

      if (result.ok) {
        // Log Decision-RDS receipt
        await recordReceipt({
          type: 'Decision-RDS',
          action: 'broker.email.send',
          reasons: [emailType, 'broker_kit'],
          created_at: new Date().toISOString()
        } as any);

        setSendStatus(`✅ ${emailType === 'initial' ? 'Initial' : 'Follow-up'} email sent to ${contactEmail}`);
      } else {
        setSendStatus('❌ Failed to send email');
      }
    } catch (error) {
      setSendStatus(`❌ Error: ${error}`);
    }
  };

  const downloadDemoScript = () => {
    const blob = new Blob([BROKER_DEMO_SCRIPT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'broker-demo-script.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Benefits Broker Partner Kit</h1>
        <p className="text-muted-foreground">Email templates and demo scripts for 401(k) plan outreach</p>
      </div>

      {/* Email Sender */}
      <div className="space-y-4 bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold">Send Broker Email</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Contact Name</span>
            <input 
              type="text" 
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={contactName}
              onChange={e => setContactName(e.target.value)}
              placeholder="John Smith"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Contact Email</span>
            <input 
              type="email" 
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              placeholder="john@brokeragefirm.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Your Firm Name</span>
            <input 
              type="text" 
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={senderFirm}
              onChange={e => setSenderFirm(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Email Type</span>
            <select 
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={emailType}
              onChange={e => setEmailType(e.target.value as 'initial' | 'followup')}
            >
              <option value="initial">Initial Outreach</option>
              <option value="followup">Follow-up</option>
            </select>
          </label>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Email Preview:</h3>
          <div className="bg-muted p-4 rounded border">
            <div className="text-sm font-semibold mb-2">Subject: {currentTemplate.subject}</div>
            <div className="text-sm whitespace-pre-line">{currentTemplate.text}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleSendEmail}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
            disabled={!contactEmail}
          >
            Send Email
          </button>
        </div>

        {sendStatus && (
          <div className="p-3 rounded border bg-muted text-sm">
            {sendStatus}
          </div>
        )}
      </div>

      {/* Demo Script */}
      <div className="space-y-4 bg-card p-6 rounded-lg border">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Demo Script</h2>
          <button 
            onClick={downloadDemoScript}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90"
          >
            Download Script
          </button>
        </div>
        
        <div className="bg-muted p-4 rounded border">
          <pre className="text-sm whitespace-pre-wrap font-mono">{BROKER_DEMO_SCRIPT}</pre>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">ROI Calculator</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Calculate value proposition for prospects
          </p>
          <a 
            href="/broker/roi"
            className="inline-block bg-primary text-primary-foreground px-3 py-2 rounded text-sm hover:bg-primary/90"
          >
            Open ROI Calculator →
          </a>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">Provider Resources</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Access provider rules and forms
          </p>
          <a 
            href="/admin/k401/providers/search"
            className="inline-block bg-secondary text-secondary-foreground px-3 py-2 rounded text-sm hover:bg-secondary/90"
          >
            View Provider Rules →
          </a>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        All emails log content-free receipts (Comms-RDS + Decision-RDS). 
        Templates can be customized for your specific value proposition.
      </div>
    </div>
  );
}