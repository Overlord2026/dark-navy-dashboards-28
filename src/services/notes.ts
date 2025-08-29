export async function saveMeetingNote({ persona, text }: { persona: string; text: string }) {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Auth required');
  
  // Use any type temporarily until Supabase types are regenerated
  const { error } = await (supabase as any).from('meeting_notes').insert({ 
    user_id: user.id, 
    persona, 
    text 
  });
  
  if (error) throw error;
  return true;
}