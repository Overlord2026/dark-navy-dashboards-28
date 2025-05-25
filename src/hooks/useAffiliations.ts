
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";

// Export the interface so it can be used in other components
export interface Affiliation {
  id?: string;
  user_id: string;
  stock_exchange_or_finra?: boolean;
  public_company?: boolean;
  us_politically_exposed?: boolean;
  awm_employee?: boolean;
  custodian?: boolean;
  broker_dealer?: boolean;
  family_broker_dealer?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useAffiliations() {
  const { userProfile } = useUser();
  const [affiliations, setAffiliations] = useState<Affiliation | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Changed from 'loading' to 'isLoading'
  const [error, setError] = useState<string | null>(null); // Changed from Error to string

  useEffect(() => {
    const fetchAffiliations = async () => {
      if (!userProfile?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('user_affiliations')
          .select('*')
          .eq('user_id', userProfile.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setAffiliations(null);
          } else {
            console.error("Error fetching affiliations:", fetchError);
            setError(fetchError.message);
          }
        } else {
          setAffiliations(data);
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        console.error("Error handling affiliations:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAffiliations();
  }, [userProfile?.id]);

  const saveAffiliations = async (data: Partial<Affiliation>): Promise<boolean> => {
    if (!userProfile?.id) {
      setError("User not authenticated");
      return false;
    }
    
    try {
      setIsLoading(true);
      const affiliationData = {
        ...data,
        user_id: userProfile.id,
        updated_at: new Date().toISOString()
      };
      
      if (affiliations?.id) {
        const { error: updateError } = await supabase
          .from('user_affiliations')
          .update(affiliationData)
          .eq('id', affiliations.id);
          
        if (updateError) {
          console.error("Error updating affiliations:", updateError);
          setError(updateError.message);
          return false;
        }
      } else {
        const { error: insertError } = await supabase
          .from('user_affiliations')
          .insert([affiliationData]);
          
        if (insertError) {
          console.error("Error creating affiliations:", insertError);
          setError(insertError.message);
          return false;
        }
      }
      
      const { data: refreshedData, error: refreshError } = await supabase
        .from('user_affiliations')
        .select('*')
        .eq('user_id', userProfile.id)
        .single();
        
      if (refreshError) {
        console.error("Error refreshing affiliations:", refreshError);
        setError(refreshError.message);
      } else {
        setAffiliations(refreshedData);
      }
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      console.error("Error saving affiliations:", error);
      setError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    affiliations, 
    isLoading, // Changed from 'loading' to 'isLoading'
    error, 
    saveAffiliations 
  };
}
