import { useState, useEffect } from 'react';

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  provider: {
    name: string;
    rating?: number;
    verified?: boolean;
    logo?: string;
  };
  price?: string;
  priceType?: string;
  featured?: boolean;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  description: string;
  count?: number;
  icon?: any;
}

export function useMarketplace() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for now
  useEffect(() => {
    setListings([]);
    setCategories([]);
  }, []);

  return {
    listings,
    categories,
    isLoading
  };
}