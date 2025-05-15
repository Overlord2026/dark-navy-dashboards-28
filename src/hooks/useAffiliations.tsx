
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

// Define interface for affiliations and export it
export interface Affiliation {
  id?: string;
  user_id?: string;
  stock_exchange_or_finra: boolean;
  public_company: boolean;
  us_politically_exposed: boolean;
  awm_employee: boolean;
  custodian: boolean;
  broker_dealer: boolean;
  family_broker_dealer: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useAffiliations() {
  const { userProfile } = useUser();
  const [affiliations, setAffiliations] = useState<Affiliation | null>(null);
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
        
        // Type assertion to work around the type constraints
        const { data, error } = await supabase
          .from('user_affiliations' as any)
          .select('*')
          .eq('user_id', userProfile.id)
          .single();
          
        if (error && error.code !== 'PGRST116') { // Not found error is ok
          console.error("Error loading affiliations:", error);
          setError("Failed to load affiliations");
          return;
        }
        
        setAffiliations(data as Affiliation || {
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
  const saveAffiliations = async (data: Partial<Affiliation>) => {
    if (!userProfile?.id) {
      setError("User not authenticated");
      return false;
    }
    
    try {
      const affiliationData = {
        ...data,
        user_id: userProfile.id
      };
      
      // Type assertion to work around the type constraints
      const { error } = await supabase
        .from('user_affiliations' as any)
        .upsert([affiliationData], { 
          onConflict: 'user_id' 
        });
        
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
