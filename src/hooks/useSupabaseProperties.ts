
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Property, PropertyFormData, Improvement, RentalDetails, BusinessDetails, PropertyValuation } from '@/types/property';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface DatabaseProperty {
  id: string;
  user_id: string;
  name: string;
  type: string;
  address: string;
  ownership: string;
  owner: string;
  purchase_date: string;
  original_cost: number;
  current_value: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  property_improvements?: Array<{
    id: string;
    description: string;
    date: string;
    cost: number;
  }>;
  property_rental_details?: Array<{
    id: string;
    monthly_income: number;
    monthly_expenses: number;
    occupied_since?: string;
    lease_end?: string;
    tenant_name?: string;
  }>;
  property_business_details?: Array<{
    id: string;
    company_name: string;
    usage_type: string;
    annual_expenses: number;
  }>;
  property_valuations?: Array<{
    id: string;
    estimated_value: number;
    last_updated: string;
    confidence?: string;
    source: string;
  }>;
}

export const useSupabaseProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const transformDatabaseProperty = (dbProperty: DatabaseProperty): Property => {
    const improvements: Improvement[] = dbProperty.property_improvements?.map(imp => ({
      description: imp.description,
      date: imp.date,
      cost: imp.cost
    })) || [];

    const rental: RentalDetails | undefined = dbProperty.property_rental_details?.[0] ? {
      monthlyIncome: dbProperty.property_rental_details[0].monthly_income,
      monthlyExpenses: dbProperty.property_rental_details[0].monthly_expenses,
      occupiedSince: dbProperty.property_rental_details[0].occupied_since || undefined,
      leaseEnd: dbProperty.property_rental_details[0].lease_end || undefined,
      tenantName: dbProperty.property_rental_details[0].tenant_name || undefined
    } : undefined;

    const business: BusinessDetails | undefined = dbProperty.property_business_details?.[0] ? {
      companyName: dbProperty.property_business_details[0].company_name,
      usageType: dbProperty.property_business_details[0].usage_type,
      annualExpenses: dbProperty.property_business_details[0].annual_expenses
    } : undefined;

    const valuation: PropertyValuation | undefined = dbProperty.property_valuations?.[0] ? {
      estimatedValue: dbProperty.property_valuations[0].estimated_value,
      lastUpdated: dbProperty.property_valuations[0].last_updated,
      confidence: dbProperty.property_valuations[0].confidence as 'high' | 'medium' | 'low' || 'medium',
      source: dbProperty.property_valuations[0].source
    } : undefined;

    return {
      id: dbProperty.id,
      name: dbProperty.name,
      type: dbProperty.type as Property['type'],
      address: dbProperty.address,
      ownership: dbProperty.ownership as Property['ownership'],
      owner: dbProperty.owner,
      purchaseDate: dbProperty.purchase_date,
      originalCost: dbProperty.original_cost,
      currentValue: dbProperty.current_value,
      improvements,
      rental,
      business,
      notes: dbProperty.notes,
      valuation
    };
  };

  const fetchProperties = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_improvements (*),
          property_rental_details (*),
          property_business_details (*),
          property_valuations (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedProperties = (data || []).map(transformDatabaseProperty);
      setProperties(transformedProperties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (propertyData: Omit<Property, "id">) => {
    if (!user) {
      toast.error('You must be logged in to add properties');
      return;
    }

    try {
      // Insert main property
      const { data: propertyResult, error: propertyError } = await supabase
        .from('properties')
        .insert({
          user_id: user.id,
          name: propertyData.name,
          type: propertyData.type,
          address: propertyData.address,
          ownership: propertyData.ownership,
          owner: propertyData.owner,
          purchase_date: propertyData.purchaseDate,
          original_cost: propertyData.originalCost,
          current_value: propertyData.currentValue,
          notes: propertyData.notes
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      const propertyId = propertyResult.id;

      // Insert improvements
      if (propertyData.improvements && propertyData.improvements.length > 0) {
        const { error: improvementsError } = await supabase
          .from('property_improvements')
          .insert(
            propertyData.improvements.map(imp => ({
              property_id: propertyId,
              description: imp.description,
              date: imp.date,
              cost: imp.cost
            }))
          );

        if (improvementsError) throw improvementsError;
      }

      // Insert rental details
      if (propertyData.rental) {
        const { error: rentalError } = await supabase
          .from('property_rental_details')
          .insert({
            property_id: propertyId,
            monthly_income: propertyData.rental.monthlyIncome,
            monthly_expenses: propertyData.rental.monthlyExpenses,
            occupied_since: propertyData.rental.occupiedSince,
            lease_end: propertyData.rental.leaseEnd,
            tenant_name: propertyData.rental.tenantName
          });

        if (rentalError) throw rentalError;
      }

      // Insert business details
      if (propertyData.business) {
        const { error: businessError } = await supabase
          .from('property_business_details')
          .insert({
            property_id: propertyId,
            company_name: propertyData.business.companyName,
            usage_type: propertyData.business.usageType,
            annual_expenses: propertyData.business.annualExpenses
          });

        if (businessError) throw businessError;
      }

      // Insert valuation
      if (propertyData.valuation) {
        const { error: valuationError } = await supabase
          .from('property_valuations')
          .insert({
            property_id: propertyId,
            estimated_value: propertyData.valuation.estimatedValue,
            last_updated: propertyData.valuation.lastUpdated,
            confidence: propertyData.valuation.confidence,
            source: propertyData.valuation.source
          });

        if (valuationError) throw valuationError;
      }

      toast.success(`${propertyData.name} has been added to your portfolio`);
      await fetchProperties();
    } catch (err) {
      console.error('Error adding property:', err);
      toast.error('Failed to add property');
      throw err;
    }
  };

  const updateProperty = async (updatedProperty: Property) => {
    if (!user) {
      toast.error('You must be logged in to update properties');
      return;
    }

    try {
      // Update main property
      const { error: propertyError } = await supabase
        .from('properties')
        .update({
          name: updatedProperty.name,
          type: updatedProperty.type,
          address: updatedProperty.address,
          ownership: updatedProperty.ownership,
          owner: updatedProperty.owner,
          purchase_date: updatedProperty.purchaseDate,
          original_cost: updatedProperty.originalCost,
          current_value: updatedProperty.currentValue,
          notes: updatedProperty.notes
        })
        .eq('id', updatedProperty.id)
        .eq('user_id', user.id);

      if (propertyError) throw propertyError;

      // Delete existing related records and re-insert them
      await supabase.from('property_improvements').delete().eq('property_id', updatedProperty.id);
      await supabase.from('property_rental_details').delete().eq('property_id', updatedProperty.id);
      await supabase.from('property_business_details').delete().eq('property_id', updatedProperty.id);
      await supabase.from('property_valuations').delete().eq('property_id', updatedProperty.id);

      // Re-insert improvements
      if (updatedProperty.improvements && updatedProperty.improvements.length > 0) {
        await supabase
          .from('property_improvements')
          .insert(
            updatedProperty.improvements.map(imp => ({
              property_id: updatedProperty.id,
              description: imp.description,
              date: imp.date,
              cost: imp.cost
            }))
          );
      }

      // Re-insert rental details
      if (updatedProperty.rental) {
        await supabase
          .from('property_rental_details')
          .insert({
            property_id: updatedProperty.id,
            monthly_income: updatedProperty.rental.monthlyIncome,
            monthly_expenses: updatedProperty.rental.monthlyExpenses,
            occupied_since: updatedProperty.rental.occupiedSince,
            lease_end: updatedProperty.rental.leaseEnd,
            tenant_name: updatedProperty.rental.tenantName
          });
      }

      // Re-insert business details
      if (updatedProperty.business) {
        await supabase
          .from('property_business_details')
          .insert({
            property_id: updatedProperty.id,
            company_name: updatedProperty.business.companyName,
            usage_type: updatedProperty.business.usageType,
            annual_expenses: updatedProperty.business.annualExpenses
          });
      }

      // Re-insert valuation
      if (updatedProperty.valuation) {
        await supabase
          .from('property_valuations')
          .insert({
            property_id: updatedProperty.id,
            estimated_value: updatedProperty.valuation.estimatedValue,
            last_updated: updatedProperty.valuation.lastUpdated,
            confidence: updatedProperty.valuation.confidence,
            source: updatedProperty.valuation.source
          });
      }

      toast.success(`${updatedProperty.name} has been updated successfully`);
      await fetchProperties();
    } catch (err) {
      console.error('Error updating property:', err);
      toast.error('Failed to update property');
      throw err;
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (!user) {
      toast.error('You must be logged in to delete properties');
      return;
    }

    try {
      const propertyToDelete = properties.find(p => p.id === propertyId);
      
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success(`${propertyToDelete?.name} has been removed from your portfolio`);
      await fetchProperties();
    } catch (err) {
      console.error('Error deleting property:', err);
      toast.error('Failed to delete property');
      throw err;
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  return {
    properties,
    loading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
    refetch: fetchProperties
  };
};
