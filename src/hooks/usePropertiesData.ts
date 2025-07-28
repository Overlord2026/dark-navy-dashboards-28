import { useState, useEffect, useMemo, useCallback } from "react";
import { Property } from "@/types/property";
import { useSupabaseProperties } from "@/hooks/useSupabaseProperties";

export interface PropertyStats {
  totalValue: number;
  totalCount: number;
  monthlyIncome: number;
  totalAppreciation: number;
  appreciationPercentage: number;
  propertyBreakdown: {
    primary: number;
    vacation: number;
    rental: number;
    business: number;
  };
}

export interface UsePropertiesDataReturn {
  properties: Property[];
  stats: PropertyStats;
  filteredProperties: Property[];
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshData: () => void;
  addProperty: (property: Omit<Property, "id">) => Promise<void>;
  updateProperty: (property: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  
  // Filters
  setFilter: (filter: string | null) => void;
  currentFilter: string | null;
  
  // Computed values
  getFilteredProperties: (filter?: string | null) => Property[];
  getPropertyStats: (properties?: Property[]) => PropertyStats;
}

export const usePropertiesData = (initialFilter?: string | null): UsePropertiesDataReturn => {
  const { 
    properties, 
    loading, 
    error, 
    addProperty: addPropertySupabase, 
    updateProperty: updatePropertySupabase, 
    deleteProperty: deletePropertySupabase,
    refetch
  } = useSupabaseProperties();
  
  const [currentFilter, setCurrentFilter] = useState<string | null>(initialFilter || null);

  // Memoized property statistics calculation
  const getPropertyStats = useCallback((propsToAnalyze: Property[] = properties): PropertyStats => {
    if (!propsToAnalyze.length) {
      return {
        totalValue: 0,
        totalCount: 0,
        monthlyIncome: 0,
        totalAppreciation: 0,
        appreciationPercentage: 0,
        propertyBreakdown: {
          primary: 0,
          vacation: 0,
          rental: 0,
          business: 0
        }
      };
    }

    const totalValue = propsToAnalyze.reduce((sum, prop) => sum + prop.currentValue, 0);
    const originalCost = propsToAnalyze.reduce((sum, prop) => sum + prop.originalCost, 0);
    const totalAppreciation = totalValue - originalCost;
    const appreciationPercentage = originalCost > 0 ? (totalAppreciation / originalCost) * 100 : 0;
    
    const monthlyIncome = propsToAnalyze
      .filter(prop => prop.type === 'rental' && prop.rental)
      .reduce((sum, prop) => sum + (prop.rental?.monthlyIncome || 0), 0);

    const propertyBreakdown = propsToAnalyze.reduce((breakdown, prop) => {
      breakdown[prop.type as keyof typeof breakdown] = (breakdown[prop.type as keyof typeof breakdown] || 0) + 1;
      return breakdown;
    }, {
      primary: 0,
      vacation: 0,
      rental: 0,
      business: 0
    });

    return {
      totalValue,
      totalCount: propsToAnalyze.length,
      monthlyIncome,
      totalAppreciation,
      appreciationPercentage,
      propertyBreakdown
    };
  }, [properties]);

  // Memoized property filtering
  const getFilteredProperties = useCallback((filter?: string | null): Property[] => {
    const filterToUse = filter !== undefined ? filter : currentFilter;
    
    if (!filterToUse || filterToUse === 'all') {
      return properties;
    }
    
    return properties.filter(property => property.type === filterToUse);
  }, [properties, currentFilter]);

  // Memoized filtered properties for current filter
  const filteredProperties = useMemo(() => {
    return getFilteredProperties();
  }, [getFilteredProperties]);

  // Memoized stats for current properties
  const stats = useMemo(() => {
    return getPropertyStats(properties);
  }, [getPropertyStats, properties]);

  // Optimized action handlers with useCallback
  const addProperty = useCallback(async (property: Omit<Property, "id">) => {
    await addPropertySupabase(property);
  }, [addPropertySupabase]);

  const updateProperty = useCallback(async (property: Property) => {
    await updatePropertySupabase(property);
  }, [updatePropertySupabase]);

  const deleteProperty = useCallback(async (id: string) => {
    await deletePropertySupabase(id);
  }, [deletePropertySupabase]);

  const refreshData = useCallback(() => {
    refetch();
  }, [refetch]);

  const setFilter = useCallback((filter: string | null) => {
    setCurrentFilter(filter);
  }, []);

  // Performance tracking for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && (window as any).propertiesPerformance) {
      (window as any).propertiesPerformance.trackCalculation();
    }
  }, [stats, filteredProperties]);

  return {
    properties,
    stats,
    filteredProperties,
    loading,
    error,
    
    // Actions
    refreshData,
    addProperty,
    updateProperty,
    deleteProperty,
    
    // Filters
    setFilter,
    currentFilter,
    
    // Computed values
    getFilteredProperties,
    getPropertyStats
  };
};