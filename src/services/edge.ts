export async function callFunction(name: string, payload: unknown) {
  const token = (await (await import('@/integrations/supabase/client')).supabase.auth.getSession())
    .data.session?.access_token ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjbXFqa3Z5dnVob3NsYnptbGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjQ5MjUsImV4cCI6MjA2MjA0MDkyNX0.x0UM2ezINls7QytsvURR5zYitUiZ52G8Pl5s78ILDfU';

  const res = await fetch(
    `https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/${name}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );
  if (!res.ok) {
    const msg = await res.text().catch(()=>'');
    throw new Error(`Function ${name} failed: ${res.status} ${msg}`);
  }
  return res.json();
}