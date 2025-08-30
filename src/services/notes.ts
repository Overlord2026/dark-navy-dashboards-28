export async function saveMeetingNote({ persona, text }: { persona: string; text: string }) {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Auth required');

  const { error } = await supabase
    .from('meeting_notes')  // temporary generic
    .insert({ user_id: user.id, persona, text });

  if (error) throw error;
  return true;
}