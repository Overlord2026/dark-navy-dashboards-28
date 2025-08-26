import { recordReceipt } from '@/features/receipts/store';

export type SendArgs = { 
  to: string; 
  subject: string; 
  text: string; 
  html?: string; 
  template_id?: string; 
};

export async function sendEmail(args: SendArgs) {
  try {
    // Call edge function to send email
    const response = await fetch('/functions/v1/send-migration-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });

    if (!response.ok) {
      throw new Error(`Email sending failed: ${response.statusText}`);
    }

    const result = await response.json();

    // Log successful send
    await recordReceipt({
      receipt_id: `comms_${new Date().toISOString()}`,
      type: 'Comms-RDS',
      ts: new Date().toISOString(),
      channel: 'email',
      persona: 'client',
      template_id: args.template_id || 'migration.invite',
      result: 'sent',
      policy_ok: true,
      inputs_hash: `sha256:${await hashString(JSON.stringify(args))}`,
    });

    return { ok: true, result };
  } catch (error: any) {
    // Log failed send
    await recordReceipt({
      receipt_id: `comms_${new Date().toISOString()}`,
      type: 'Comms-RDS',
      ts: new Date().toISOString(),
      channel: 'email',
      persona: 'client',
      template_id: args.template_id || 'migration.invite',
      result: 'failed',
      policy_ok: false,
      inputs_hash: `sha256:${await hashString(JSON.stringify(args))}`,
      reasons: [error.message],
    });

    return { ok: false, error: error.message };
  }
}

async function hashString(str: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const enc = new TextEncoder().encode(str);
    const dig = await window.crypto.subtle.digest("SHA-256", enc);
    return [...new Uint8Array(dig)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback for non-browser environments
  return btoa(str).slice(0, 32);
}