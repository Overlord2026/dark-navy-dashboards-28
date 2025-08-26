export const BROKER_EMAIL = (contact: string, senderFirm = 'BFO') => ({
  subject: `[${senderFirm}] 401(k) Control Plane — pilot that proves value in 2 weeks`,
  text: `Hi ${contact || 'there'},\n\nWe help plans capture full employer match, reduce fee drag, and close rollovers — all with audit-ready proof slips.\n\nIn 30 minutes we can connect a pilot plan and show concrete lift:\n• Match capture ↑\n• Fee drag ↓\n• Rollover cycle time ↓\n\nIf helpful, we'll run the Rollover Studio (PTE 2020-02 docs) and deliver a tidy Vault packet.\n\nInterested in a quick call this week?\n— ${senderFirm}\n`,
  html: `<p>Hi ${contact || 'there'},</p><p>We help plans capture full employer match, reduce fee drag, and close rollovers — all with audit-ready proof slips.</p><ul><li>Match capture ↑</li><li>Fee drag ↓</li><li>Rollover cycle time ↓</li></ul><p>We can connect a pilot plan and show value in two weeks. Interested in a quick call?</p><p>— ${senderFirm}</p>`
});

export const BROKER_FOLLOWUP = (senderFirm = 'BFO') => ({
  subject: `[${senderFirm}] quick bump on 401(k) pilot`,
  text: `Circling back — happy to connect a pilot plan and share a short proof-of-value report. Open to a 20–30 min call?`,
  html: `<p>Circling back — happy to connect a pilot plan and share a short proof-of-value report. Open to a 20–30 min call?</p>`
});

export const BROKER_DEMO_SCRIPT = `
30-Minute Broker Demo
1) Opening: Control Plane → Connect · Optimize · Advise · Trade (SDBA) · Rollover · Audit
2) Pain: fragmented plans, under-match, fee drag, rollovers stall
3) Family view: link plan, show full-match guardrail, Roadmap probability
4) Advisor book: risk flags, bulk nudges; receipts (content-free) visible
5) Rollover Studio: PTE 2020-02 fee compare + forms to Vault; (optional) anchors
6) SDBA (optional): explainable model + policy gates
7) Results: KPIs; pilot within two weeks
8) Close: schedule pilot call
`;