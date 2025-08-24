export const NUDGE_TEMPLATES = {
  signedNoFinal: {
    subject: 'Action Required: Complete Final Review Packet',
    body: `
Dear Attorney,

You have a signed review letter that requires completion of the final review packet.

Session Details:
- Client: {{clientName}}
- State: {{state}}
- Signed Date: {{signedDate}}
- Days Pending: {{daysPending}}

Please log in to complete the merge and stamp process for the final packet.

Best regards,
Estate Planning System
    `.trim()
  },
  
  deliveredNotLatest: {
    subject: 'Review Required: Updated Final Packet Available',
    body: `
Dear Attorney,

A final review packet has been updated after delivery. The family has the previous version.

Session Details:
- Client: {{clientName}}
- State: {{state}}
- Delivered Version: v{{deliveredVersion}}
- Current Version: v{{currentVersion}}
- Update Date: {{updateDate}}

Please review the changes and consider delivering the updated version.

Best regards,
Estate Planning System
    `.trim()
  },
  
  unassigned: {
    subject: 'Assignment Required: Review Session Pending',
    body: `
Dear Attorney,

A review session has been pending assignment for {{daysPending}} days.

Session Details:
- Client: {{clientName}}
- State: {{state}}
- Created Date: {{createdDate}}
- Document Count: {{documentCount}}

Please assign an attorney to complete the review.

Best regards,
Estate Planning System
    `.trim()
  }
};

export function renderTemplate(
  templateKey: keyof typeof NUDGE_TEMPLATES,
  variables: Record<string, string | number>
): { subject: string; body: string } {
  const template = NUDGE_TEMPLATES[templateKey];
  
  let subject = template.subject;
  let body = template.body;
  
  // Replace template variables
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
    body = body.replace(new RegExp(placeholder, 'g'), String(value));
  }
  
  return { subject, body };
}