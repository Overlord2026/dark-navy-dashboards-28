
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

interface Affiliations {
  id?: string;
  user_id?: string;
  stock_exchange_or_finra: boolean;
  public_company: boolean;
  us_politically_exposed: boolean;
  awm_employee: boolean;
  custodian: boolean;
  broker_dealer: boolean;
  family_broker_dealer: boolean;
}

export function useAffiliations() {
  const { userProfile } = useUser();
  const [affiliations, setAffiliations] = useState<Affiliations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load affiliations from Supabase
  useEffect(() => {
    const loadAffiliations = async () => {
      if (!userProfile?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Using any type to work around the type constraints since we can't modify types.ts
        const { data, error } = await (supabase as any)
          .from('user_affiliations')
          .select('*')
          .eq('user_id', userProfile.id)
          .single();
          
        if (error && error.code !== 'PGRST116') { // Not found error is ok
          console.error("Error loading affiliations:", error);
          setError("Failed to load affiliations");
          return;
        }
        
        setAffiliations(data || {
          user_id: userProfile.id,
          stock_exchange_or_finra: false,
          public_company: false,
          us_politically_exposed: false,
          awm_employee: false,
          custodian: false,
          broker_dealer: false,
          family_broker_dealer: false
        });
      } catch (err) {
        console.error("Unexpected error loading affiliations:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAffiliations();
  }, [userProfile?.id]);

  // Save affiliations to Supabase
  const saveAffiliations = async (data: Partial<Affiliations>) => {
    if (!userProfile?.id) {
      setError("User not authenticated");
      return false;
    }
    
    try {
      const affiliationData = {
        ...data,
        user_id: userProfile.id
      };
      
      // Using any type to work around the type constraints
      const { error } = await (supabase as any)
        .from('user_affiliations')
        .upsert([affiliationData], { onConflict: 'user_id' });
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Update local state
      setAffiliations(prev => prev ? { ...prev, ...data } : null);
      return true;
    } catch (err) {
      console.error("Error saving affiliations:", err);
      setError("Failed to save affiliations");
      return false;
    }
  };

  return {
    affiliations,
    isLoading,
    error,
    saveAffiliations,
    setAffiliations
  };
}
