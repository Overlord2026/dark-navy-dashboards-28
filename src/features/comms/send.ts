export async function sendEmail({ 
  to, 
  subject, 
  markdown 
}: { 
  to: string; 
  subject: string; 
  markdown: string; 
}): Promise<{ ok: boolean; id?: string }> {
  // Check if email provider is enabled
  const emailProviderEnabled = localStorage.getItem('EMAIL_PROVIDER_ENABLED') === 'true';
  
  if (!emailProviderEnabled) {
    console.log('[Email] Stubbed send (EMAIL_PROVIDER_ENABLED=false):', { to, subject });
    return { ok: true, id: 'stub-' + Date.now() };
  }
  
  // In real implementation, would call Resend or other email provider
  console.log('[Email] Sending email:', { to, subject, content: markdown });
  
  // Mock successful send
  return { ok: true, id: 'email-' + Date.now() };
}