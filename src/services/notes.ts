export async function saveMeetingNote({ persona, text }: { persona: string; text: string }) {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Auth required');

  type MeetingNoteInsert = { user_id: string; persona: string; text: string; created_at?: string };
  const payload: MeetingNoteInsert = { user_id: user.id, persona, text };
  
  const { error } = await supabase.from('meeting_notes').insert(payload);

  if (error) throw error;
  return true;
}