import React from 'react';
import { renderInvite, renderReminder, renderComplete, type Persona, type Incumbent } from '@/features/migrate/email/templates';
import { sendEmail } from '@/features/migrate/email/sender';
import { recordReceipt } from '@/features/receipts/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/lib/toast';

const PERSONAS: Persona[] = ['advisor', 'accountant', 'attorney', 'realtor', 'nil', 'smb'];
const INCUMBENTS: Incumbent[] = [
  'emoney', 'moneyguidepro', 'rightcapital', 'ultratax', 'proseries', 'lacerte', 'drake',
  'qbo', 'xero', 'clio', 'mycase', 'dotloop', 'docusign_rooms', 'opendorse',
  'adp', 'gusto', 'rippling', 'custom_csv'
];

export default function MigrationHubInvite() {
  const [persona, setPersona] = React.useState<Persona>('advisor');
  const [incumbent, setIncumbent] = React.useState<Incumbent>('emoney');
  const [to, setTo] = React.useState('');
  const [recipientName, setRecipientName] = React.useState('');
  const [orgName, setOrgName] = React.useState('BFO');
  const [helpEmail, setHelpEmail] = React.useState('support@yourfirm.com');
  const [secureLink, setSecureLink] = React.useState('https://yourapp.com/upload');
  const [deadline, setDeadline] = React.useState('');
  const [sending, setSending] = React.useState(false);

  const tpl = renderInvite({ 
    recipientName, 
    orgName, 
    secureLink, 
    helpEmail, 
    deadline, 
    persona, 
    incumbent 
  });

  async function send(kind: 'invite' | 'reminder' | 'complete') {
    if (!to.trim()) {
      toast.err('Please enter recipient email');
      return;
    }

    setSending(true);
    try {
      const pack = kind === 'invite' ? tpl :
                   kind === 'reminder' ? renderReminder({ recipientName, orgName, secureLink, helpEmail, deadline, persona, incumbent }) :
                   renderComplete({ recipientName, orgName, secureLink, helpEmail, deadline, persona, incumbent });

      const res = await sendEmail({ 
        to, 
        subject: pack.subject, 
        text: pack.text, 
        html: pack.html, 
        template_id: `migration.${kind}` 
      });

      if (res.ok) {
        await recordReceipt({
          receipt_id: `decision_${new Date().toISOString()}`,
          type: 'Decision-RDS',
          ts: new Date().toISOString(),
          action: 'migrate.invite',
          reasons: [kind, persona, incumbent],
          inputs_hash: `sha256:${await hashString(JSON.stringify({ kind, persona, incumbent, to }))}`,
        });
        
        toast.ok(`Email (${kind}) sent to ${to}`);
      } else {
        toast.err(`Failed to send email: ${res.error}`);
      }
    } catch (error: any) {
      toast.err(`Error sending email: ${error.message}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Migration — Email Invite</h1>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Persona</label>
          <select 
            className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground"
            value={persona} 
            onChange={e => setPersona(e.target.value as Persona)}
          >
            {PERSONAS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Incumbent</label>
          <select 
            className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground"
            value={incumbent} 
            onChange={e => setIncumbent(e.target.value as Incumbent)}
          >
            {INCUMBENTS.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Recipient email</label>
          <Input 
            type="email"
            value={to} 
            onChange={e => setTo(e.target.value)}
            placeholder="client@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Recipient name (optional)</label>
          <Input 
            value={recipientName} 
            onChange={e => setRecipientName(e.target.value)}
            placeholder="John Smith"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Secure upload link</label>
          <Input 
            value={secureLink} 
            onChange={e => setSecureLink(e.target.value)}
            placeholder="https://yourapp.com/upload"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Deadline (optional)</label>
          <Input 
            value={deadline} 
            onChange={e => setDeadline(e.target.value)}
            placeholder="Friday, Dec 15"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Help email</label>
          <Input 
            type="email"
            value={helpEmail} 
            onChange={e => setHelpEmail(e.target.value)}
            placeholder="support@yourfirm.com"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Your org name</label>
          <Input 
            value={orgName} 
            onChange={e => setOrgName(e.target.value)}
            placeholder="BFO"
          />
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={() => send('invite')} 
          disabled={!to.trim() || sending}
          variant="default"
        >
          {sending ? 'Sending...' : 'Send Invite'}
        </Button>
        <Button 
          onClick={() => send('reminder')} 
          disabled={!to.trim() || sending}
          variant="outline"
        >
          Send Reminder
        </Button>
        <Button 
          onClick={() => send('complete')} 
          disabled={!to.trim() || sending}
          variant="outline"
        >
          Send Complete
        </Button>
      </div>

      <div className="border border-border rounded-lg p-4 bg-muted/20">
        <div className="text-sm font-medium mb-2 text-foreground">Preview</div>
        <div className="text-sm font-semibold mb-2 text-foreground">{tpl.subject}</div>
        <pre className="text-xs overflow-auto whitespace-pre-wrap font-mono text-muted-foreground bg-background border border-border rounded p-3">
          {tpl.text}
        </pre>
      </div>

      <div className="text-xs text-muted-foreground">
        Emails log <code>Comms-RDS</code> and a <code>Decision-RDS migrate.invite</code> (content-free).
      </div>
    </div>
  );
}

async function hashString(str: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const enc = new TextEncoder().encode(str);
    const dig = await window.crypto.subtle.digest("SHA-256", enc);
    return [...new Uint8Array(dig)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return btoa(str).slice(0, 32);
}