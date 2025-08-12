import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Persona } from '@/types/p5';
import { Button } from '@/components/ui/button';

export default function PersonaSwitcher() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [active, setActive] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    const { data } = await supabase.from('personas').select('*').order('created_at');
    setPersonas((data || []).map(p => ({ ...p, kind: p.kind as any })));
    
    // Find active session
    const { data: session } = await supabase
      .from('persona_sessions')
      .select('persona_id')
      .eq('active', true)
      .limit(1)
      .single();
    
    if (session) {
      setActive(session.persona_id);
    }
  };

  const activate = async (id: string) => {
    setLoading(true);
    try {
      // Deactivate all sessions
      await supabase.from('persona_sessions').update({ active: false }).eq('active', true);
      
      // Create new active session
      await supabase.from('persona_sessions').insert({ 
        persona_id: id,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
      
      setActive(id);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('persona-switched', { detail: { personaId: id } }));
    } catch (error) {
      console.error('Error switching persona:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-muted-foreground">Persona:</span>
      {personas.map(p => (
        <Button
          key={p.id}
          onClick={() => activate(p.id)}
          disabled={loading}
          variant={active === p.id ? "default" : "outline"}
          size="sm"
        >
          {p.kind}
        </Button>
      ))}
    </div>
  );
}