
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";

interface Affiliation {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAffiliations = async () => {
      if (!userProfile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Query user affiliations from the new table
        const { data, error: fetchError } = await supabase
          .from('user_affiliations')
          .select('*')
          .eq('user_id', userProfile.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') { // No rows returned
            // No affiliations found, this is a valid state for new users
            setAffiliations(null);
          } else {
            console.error("Error fetching affiliations:", fetchError);
            setError(new Error(fetchError.message));
          }
        } else {
          setAffiliations(data);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("Error handling affiliations:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliations();
  }, [userProfile?.id]);

  const saveAffiliations = async (data: Partial<Affiliation>): Promise<boolean> => {
    if (!userProfile?.id) {
      setError(new Error("User not authenticated"));
      return false;
    }
    
    try {
      setLoading(true);
      const affiliationData = {
        ...data,
        user_id: userProfile.id,
        updated_at: new Date().toISOString()
      };
      
      if (affiliations?.id) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_affiliations')
          .update(affiliationData)
          .eq('id', affiliations.id);
          
        if (updateError) {
          console.error("Error updating affiliations:", updateError);
          setError(new Error(updateError.message));
          return false;
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('user_affiliations')
          .insert([affiliationData]);
          
        if (insertError) {
          console.error("Error creating affiliations:", insertError);
          setError(new Error(insertError.message));
          return false;
        }
      }
      
      // Refresh the data
      const { data: refreshedData, error: refreshError } = await supabase
        .from('user_affiliations')
        .select('*')
        .eq('user_id', userProfile.id)
        .single();
        
      if (refreshError) {
        console.error("Error refreshing affiliations:", refreshError);
        setError(new Error(refreshError.message));
      } else {
        setAffiliations(refreshedData);
      }
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Error saving affiliations:", error);
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { 
    affiliations, 
    loading, 
    error, 
    saveAffiliations 
  };
}
