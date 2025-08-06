import { useState, useEffect } from 'react';
import { ClientPersona, PERSONA_CONFIGS, PersonaConfig } from '@/types/personas';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const usePersona = () => {
  const { user } = useAuth();
  const [persona, setPersona] = useState<ClientPersona>('hnw_client');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectPersona = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to get persona from user metadata first
        const storedPersona = user.user_metadata?.persona as ClientPersona;
        if (storedPersona && PERSONA_CONFIGS[storedPersona]) {
          setPersona(storedPersona);
          setIsLoading(false);
          return;
        }

        // For now, default to HNW client since we don't have persona fields in the database yet
        setPersona('hnw_client');
      } catch (error) {
        console.error('Error detecting persona:', error);
        setPersona('hnw_client');
      }

      setIsLoading(false);
    };

    detectPersona();
  }, [user]);

  const updatePersona = async (newPersona: ClientPersona) => {
    if (!user) return false;

    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: { persona: newPersona }
      });

      if (error) throw error;

      setPersona(newPersona);
      return true;
    } catch (error) {
      console.error('Error updating persona:', error);
      return false;
    }
  };

  const getPersonaConfig = (): PersonaConfig => {
    return PERSONA_CONFIGS[persona];
  };

  return {
    persona,
    personaConfig: getPersonaConfig(),
    isLoading,
    updatePersona,
    availablePersonas: Object.keys(PERSONA_CONFIGS) as ClientPersona[]
  };
};