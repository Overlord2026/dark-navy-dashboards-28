import React from 'react';
import { guardedAction } from '@/lib/policy/p5';

type Props = { 
  actionKey: string; 
  personaId: string; 
  context?: Record<string, unknown>; 
  children: (enabled: boolean, reason?: string) => React.ReactNode; 
};

export function GuardedAction({ actionKey, personaId, context = {}, children }: Props) {
  const [state, setState] = React.useState<{enabled: boolean; reason?: string}>({enabled: false});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!personaId) return;
    
    const checkAccess = async () => {
      setLoading(true);
      try {
        const res = await guardedAction(actionKey, personaId, context);
        setState({enabled: res.allow, reason: res.reason_code});
      } catch (error) {
        console.error('Error checking access:', error);
        setState({enabled: false, reason: 'ERROR'});
      } finally {
        setLoading(false);
      }
    };
    
    checkAccess();
  }, [actionKey, personaId, JSON.stringify(context)]);

  // Listen for persona switches
  React.useEffect(() => {
    const handlePersonaSwitch = (event: CustomEvent) => {
      const newPersonaId = event.detail.personaId;
      if (newPersonaId && newPersonaId !== personaId) {
        // Re-check access with new persona
        setState({enabled: false, reason: undefined});
      }
    };

    window.addEventListener('persona-switched', handlePersonaSwitch as EventListener);
    return () => window.removeEventListener('persona-switched', handlePersonaSwitch as EventListener);
  }, [personaId]);

  if (loading) {
    return <>{children(false, 'LOADING')}</>;
  }

  return <>{children(state.enabled, state.reason)}</>;
}