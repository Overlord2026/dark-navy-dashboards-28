export type Persona = 'advisor'|'accountant'|'attorney'|'realtor'|'nil'|'smb';
export type Incumbent =
  | 'emoney'|'moneyguidepro'|'rightcapital'
  | 'ultratax'|'proseries'|'lacerte'|'drake'|'qbo'|'xero'
  | 'clio'|'mycase'
  | 'dotloop'|'docusign_rooms'
  | 'opendorse'
  | 'adp'|'gusto'|'rippling'
  | 'custom_csv';

type TemplateCtx = {
  recipientName?: string;
  orgName?: string;           // your firm
  secureLink: string;         // to your upload page / migration hub
  helpEmail?: string;
  deadline?: string;
  persona: Persona;
  incumbent: Incumbent;
};

const HOWTO: Record<Incumbent,string[]> = {
  emoney: [
    "Open eMoney → Client List → Select client(s).",
    "Export → CSV or JSON (include goals, expenses, assets if available).",
    "Do not include SSNs or DOBs.", "Upload via your secure link below."
  ],
  moneyguidepro: [
    "Open MoneyGuidePro → Reports → Export Clients → CSV.",
    "Include retirement inputs; omit SSNs.", "Upload via secure link below."
  ],
  rightcapital: [
    "RightCapital → Client List → Export → CSV.",
    "Include MonthlySpending column; omit SSNs.", "Upload via secure link below."
  ],
  qbo: [
    "QuickBooks Online → Reports → Export (Transactions) → CSV.",
    "Include Date, Customer, Amount; omit PII.", "Upload via secure link below."
  ],
  xero: [
    "Xero → Reports → Export (General Ledger/Invoices) → CSV.",
    "Omit PII; upload via secure link below."
  ],
  ultratax: [
    "UltraTax → Utilities → Export Client List → CSV.",
    "Upload to the secure link; do not email attachments."
  ],
  proseries: [
    "ProSeries → HomeBase → Export Client List → CSV.",
    "Upload via secure link below."
  ],
  lacerte: [
    "Lacerte → Clients → Export → CSV.",
    "Upload via secure link below."
  ],
  drake: [
    "Drake → Reports → Client List → Export CSV.",
    "Upload via secure link below."
  ],
  clio: [
    "Clio → Contacts/Matters → Export → CSV.",
    "Upload via secure link below."
  ],
  mycase: [
    "MyCase → Clients/Matters → Export CSV.",
    "Upload via secure link below."
  ],
  dotloop: [
    "dotloop → Loops → Export CSV (loops).",
    "Upload via secure link below."
  ],
  docusign_rooms: [
    "DocuSign Rooms → Rooms → Export CSV.",
    "Upload via secure link below."
  ],
  opendorse: [
    "Opendorse → Deals → Export CSV (deals & value).",
    "Upload via secure link below."
  ],
  adp: [
    "ADP → Reports → Employee list / Comp → Export CSV.",
    "Upload via secure link below."
  ],
  gusto: [
    "Gusto → Reports → Employee / Payroll → Export CSV.",
    "Upload via secure link below."
  ],
  rippling: [
    "Rippling → Reports → Employee/Comp → Export CSV.",
    "Upload via secure link below."
  ],
  custom_csv: [
    "Export a CSV with labeled columns.",
    "We'll help you map fields during import."
  ]
};

export function renderInvite(ctx: TemplateCtx) {
  const steps = HOWTO[ctx.incumbent] || [];
  const subj = `[${ctx.orgName||'BFO'}] Quick data export to set up your new portal`;
  const body = [
    `Hi ${ctx.recipientName||'there'},`,
    ``,
    `We're moving your ${ctx.persona} data into your new ${ctx.orgName||'BFO'} portal.`,
    `Please export from: ${ctx.incumbent}`,
    ``,
    `Step-by-step:`,
    ...steps.map((s,i) => `${i+1}. ${s}`),
    ``,
    `Secure upload: ${ctx.secureLink}`,
    `${ctx.deadline ? `Deadline: ${ctx.deadline}` : ''}`,
    ``,
    `Questions? ${ctx.helpEmail || 'support@yourfirm.com'}`,
    `— ${ctx.orgName||'BFO'}`
  ].join('\n');

  const html = `<p>Hi ${ctx.recipientName||'there'},</p>
<p>We're moving your ${ctx.persona} data into your new ${ctx.orgName||'BFO'} portal.</p>
<p><strong>Please export from:</strong> ${ctx.incumbent}</p>
<ol>${steps.map(s=>`<li>${s}</li>`).join('')}</ol>
<p><a href="${ctx.secureLink}" target="_blank" rel="noopener">Secure upload →</a></p>
${ctx.deadline ? `<p><strong>Deadline:</strong> ${ctx.deadline}</p>` : ''}
<p>Questions? ${ctx.helpEmail || 'support@yourfirm.com'}</p>
<p>— ${ctx.orgName||'BFO'}</p>`;

  return { subject: subj, text: body, html };
}

export function renderReminder(ctx: TemplateCtx) {
  const subj = `[${ctx.orgName||'BFO'}] Reminder: upload your export to complete migration`;
  const body = `Quick reminder to upload your ${ctx.incumbent} export.\n\nSecure upload: ${ctx.secureLink}\n\n— ${ctx.orgName||'BFO'}`;
  const html = `<p>Quick reminder to upload your ${ctx.incumbent} export.</p><p><a href="${ctx.secureLink}">Secure upload →</a></p><p>— ${ctx.orgName||'BFO'}</p>`;
  return { subject: subj, text: body, html };
}

export function renderComplete(ctx: TemplateCtx) {
  const subj = `[${ctx.orgName||'BFO'}] Migration complete`;
  const body = `Your data import is complete. You can log in now.\n— ${ctx.orgName||'BFO'}`;
  const html = `<p>Your data import is complete. You can log in now.</p><p>— ${ctx.orgName||'BFO'}</p>`;
  return { subject: subj, text: body, html };
}