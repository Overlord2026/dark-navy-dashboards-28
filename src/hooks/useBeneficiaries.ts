
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

// Define and export the beneficiary interface
export interface Beneficiary {
  id?: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  relationship: string;
  percentage: number;
  is_primary: boolean;
  contact_info?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export function useBeneficiaries() {
  const { userProfile } = useUser();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load beneficiaries from Supabase
  useEffect(() => {
    const loadBeneficiaries = async () => {
      if (!userProfile?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Type assertion to work around the type constraints
        const { data, error } = await supabase
          .from('user_beneficiaries' as any)
          .select('*')
          .eq('user_id', userProfile.id);
          
        if (error) {
          console.error("Error loading beneficiaries:", error);
          setError("Failed to load beneficiaries");
          return;
        }
        
        // Use type assertion to ensure the right type
        setBeneficiaries((data as unknown as Beneficiary[]) || []);
      } catch (err) {
        console.error("Unexpected error loading beneficiaries:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBeneficiaries();
  }, [userProfile?.id]);

  // Save a beneficiary to Supabase
  const saveBeneficiary = async (data: Beneficiary) => {
    if (!userProfile?.id) {
      setError("User not authenticated");
      return false;
    }
    
    try {
      const beneficiaryData = {
        ...data,
        user_id: userProfile.id
      };
      
      // Type assertion to work around the type constraints
      const { error, data: newData } = await supabase
        .from('user_beneficiaries' as any)
        .upsert([beneficiaryData], { 
          onConflict: 'id'
        });
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Update local state
      if (data.id) {
        // Update existing
        setBeneficiaries(prev => prev.map(b => b.id === data.id ? {...beneficiaryData, id: data.id} : b));
      } else {
        // Add new and safely handle potential null newData
        const addedData = newData as unknown as any[];
        const newBeneficiary = addedData && addedData.length > 0 ? 
          {...beneficiaryData, id: addedData[0]?.id} : 
          beneficiaryData;
        setBeneficiaries(prev => [...prev, newBeneficiary as Beneficiary]);
      }
      
      return true;
    } catch (err) {
      console.error("Error saving beneficiary:", err);
      setError("Failed to save beneficiary");
      return false;
    }
  };

  // Delete a beneficiary
  const deleteBeneficiary = async (id: string) => {
    try {
      // Type assertion to work around the type constraints
      const { error } = await supabase
        .from('user_beneficiaries' as any)
        .delete()
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Update local state
      setBeneficiaries(prev => prev.filter(b => b.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting beneficiary:", err);
      setError("Failed to delete beneficiary");
      return false;
    }
  };

  // Save multiple beneficiaries
  const saveBeneficiaries = async (beneficiariesData: Beneficiary[]) => {
    if (!userProfile?.id) {
      setError("User not authenticated");
      return false;
    }
    
    try {
      // Add user_id to each beneficiary
      const beneficiariesWithUserID = beneficiariesData.map(b => ({
        ...b,
        user_id: userProfile.id
      }));
      
      // Type assertion to work around the type constraints
      const { error } = await supabase
        .from('user_beneficiaries' as any)
        .upsert(beneficiariesWithUserID, {
          onConflict: 'id'
        });
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Reload beneficiaries after save
      const { data: refreshedData, error: refreshError } = await supabase
        .from('user_beneficiaries' as any)
        .select('*')
        .eq('user_id', userProfile.id);
        
      if (!refreshError) {
        setBeneficiaries(refreshedData as unknown as Beneficiary[] || []);
      }
      
      return true;
    } catch (err) {
      console.error("Error saving beneficiaries:", err);
      setError("Failed to save beneficiaries");
      return false;
    }
  };

  return {
    beneficiaries,
    isLoading,
    error,
    saveBeneficiary,
    deleteBeneficiary,
    saveBeneficiaries,
    setBeneficiaries
  };
}
