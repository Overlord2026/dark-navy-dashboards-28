
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

// Define the Affiliation interface and export it
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
        
        const { data, error } = await supabase
          .from('user_affiliations' as any)
          .select('*')
          .eq('user_id', userProfile.id)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') { // No rows returned
            // Create default affiliations object
            const defaultAffiliations: Omit<Affiliation, 'id' | 'user_id'> = {
              stock_exchange_or_finra: false,
              public_company: false,
              us_politically_exposed: false,
              awm_employee: false,
              custodian: false,
              broker_dealer: false,
              family_broker_dealer: false,
            };
            setAffiliations(defaultAffiliations as Affiliation);
          } else {
            console.error("Error loading affiliations:", error);
            setError("Failed to load affiliations");
          }
          return;
        }
        
        // Adding a type assertion to handle the conversion safely
        setAffiliations(data as unknown as Affiliation);
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
        user_id: userProfile.id,
      };
      
      if (affiliations?.id) {
        // Update existing
        const { error } = await supabase
          .from('user_affiliations' as any)
          .update(affiliationData)
          .eq('id', affiliations.id);
          
        if (error) {
          throw new Error(error.message);
        }
      } else {
        // Insert new
        const { error } = await supabase
          .from('user_affiliations' as any)
          .insert([affiliationData]);
          
        if (error) {
          throw new Error(error.message);
        }
      }
      
      // Update local state
      setAffiliations(prev => prev ? { ...prev, ...affiliationData } : affiliationData as Affiliation);
      
      return true;
    } catch (err) {
      console.error("Error saving affiliations:", err);
      setError(err instanceof Error ? err.message : "Failed to save affiliations");
      return false;
    }
  };

  return {
    affiliations,
    isLoading,
    error,
    saveAffiliations
  };
}
