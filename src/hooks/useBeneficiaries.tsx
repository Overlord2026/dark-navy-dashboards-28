
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

// Define interface for beneficiaries since we can't modify the types.ts file
export interface Beneficiary {
  id?: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  relationship: string;
  date_of_birth?: string;
  ssn?: string;
  email?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
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
        
        setBeneficiaries(data as Beneficiary[] || []);
      } catch (err) {
        console.error("Unexpected error loading beneficiaries:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBeneficiaries();
  }, [userProfile?.id]);

  // Add a new beneficiary
  const addBeneficiary = async (beneficiary: Omit<Beneficiary, 'id' | 'user_id'>) => {
    if (!userProfile?.id) {
      setError("User not authenticated");
      return null;
    }
    
    try {
      const newBeneficiary = {
        ...beneficiary,
        user_id: userProfile.id
      };
      
      // Type assertion to work around the type constraints
      const { data, error } = await supabase
        .from('user_beneficiaries' as any)
        .insert([newBeneficiary])
        .select();
        
      if (error) {
        throw new Error(error.message);
      }
      
      const insertedData = data as Beneficiary[];
      setBeneficiaries(prev => [...prev, insertedData[0]]);
      return insertedData[0];
    } catch (err) {
      console.error("Error adding beneficiary:", err);
      setError("Failed to add beneficiary");
      return null;
    }
  };

  // Update an existing beneficiary
  const updateBeneficiary = async (id: string, beneficiary: Partial<Beneficiary>) => {
    if (!userProfile?.id) {
      setError("User not authenticated");
      return false;
    }
    
    try {
      // Type assertion to work around the type constraints
      const { error } = await supabase
        .from('user_beneficiaries' as any)
        .update(beneficiary)
        .eq('id', id)
        .eq('user_id', userProfile.id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      setBeneficiaries(prev => 
        prev.map(b => b.id === id ? { ...b, ...beneficiary } : b)
      );
      
      return true;
    } catch (err) {
      console.error("Error updating beneficiary:", err);
      setError("Failed to update beneficiary");
      return false;
    }
  };

  // Delete a beneficiary
  const deleteBeneficiary = async (id: string) => {
    if (!userProfile?.id) {
      setError("User not authenticated");
      return false;
    }
    
    try {
      // Type assertion to work around the type constraints
      const { error } = await supabase
        .from('user_beneficiaries' as any)
        .delete()
        .eq('id', id)
        .eq('user_id', userProfile.id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      setBeneficiaries(prev => prev.filter(b => b.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting beneficiary:", err);
      setError("Failed to delete beneficiary");
      return false;
    }
  };

  // Save multiple beneficiaries
  const saveBeneficiaries = async (beneficiaries: Beneficiary[]) => {
    if (!userProfile?.id) {
      setError("User not authenticated");
      return false;
    }
    
    try {
      // Add user_id to each beneficiary
      const beneficiariesWithUserID = beneficiaries.map(b => ({
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
        setBeneficiaries(refreshedData as Beneficiary[] || []);
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
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    saveBeneficiaries,
    setBeneficiaries
  };
}
