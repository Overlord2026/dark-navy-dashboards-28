
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useMarketplaceData, MarketplaceListing, MarketplaceCategory } from '../hooks/useMarketplaceData';
import { useFamilyOfficeData } from '../hooks/useFamilyOfficeData';
import { FamilyOffice } from '@/types/familyoffice';

type MarketplaceContextType = {
  listings: MarketplaceListing[];
  categories: MarketplaceCategory[];
  familyOffices: FamilyOffice[];
  activeCategory: string;
  activeSubcategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  setActiveCategory: (category: string) => void;
  setActiveSubcategory: (subcategory: string | null) => void;
  setSearchQuery: (query: string) => void;
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { listings, categories, isLoading: marketplaceLoading } = useMarketplaceData();
  const { familyOffices, isLoading: familyOfficesLoading } = useFamilyOfficeData();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isLoading = marketplaceLoading || familyOfficesLoading;

  const value = {
    listings,
    categories,
    familyOffices,
    activeCategory,
    activeSubcategory,
    searchQuery,
    isLoading,
    setActiveCategory,
    setActiveSubcategory,
    setSearchQuery
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
