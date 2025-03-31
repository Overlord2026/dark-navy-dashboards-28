import { useState, useEffect } from "react";
import { fetchMarketplaceListings, fetchMarketplaceCategories } from '../api/marketplaceApiService';

export type MarketplaceListing = {
  id: string;
  title: string;
  description: string;
  price: string | null;
  priceType: "one-time" | "monthly" | "annual" | "custom" | "contact";
  category: string;
  subcategory: string | null;
  image: string;
  featured: boolean;
  provider: {
    name: string;
    logo?: string;
  };
};

export type MarketplaceCategory = {
  id: string;
  name: string;
  icon: string;
  count: number;
};

export function useMarketplaceData() {
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In future phases, these will call the actual API
        // For now, we'll use mock data but through our API service placeholders
        
        // Note: Since our API placeholders currently return empty arrays,
        // we'll use local mock data until real integration
        
        // Try to fetch from API placeholder (which will return empty for now)
        const apiListings = await fetchMarketplaceListings();
        
        // If API returns data in the future, use it. Otherwise use mock data for now.
        if (apiListings.length > 0) {
          setListings(apiListings);
        } else {
          // Sample listings based on our category structure
          const sampleListings: MarketplaceListing[] = [
            {
              id: "1",
              title: "Premium Portfolio Management",
              description: "Personalized portfolio management with regular rebalancing and performance reporting.",
              price: "2,500",
              priceType: "monthly",
              category: "wealth-management",
              subcategory: "portfolio-management",
              image: "/lovable-uploads/8d710c1a-ccab-41d8-b202-41ad5cc5a735.png",
              featured: true,
              provider: {
                name: "Elite Investment Advisors",
                logo: "/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png"
              }
            },
            {
              id: "2",
              title: "Private Equity Fund Access",
              description: "Exclusive access to top-tier private equity funds typically closed to individual investors.",
              price: null,
              priceType: "custom",
              category: "wealth-management",
              subcategory: "private-markets",
              image: "/lovable-uploads/7f52d8e5-bf6b-4533-8c1b-f933a43cfce7.png",
              featured: true,
              provider: {
                name: "Private Capital Partners"
              }
            },
            {
              id: "3",
              title: "Multi-State Tax Strategy",
              description: "Comprehensive tax planning for clients with residences in multiple states.",
              price: "5,000",
              priceType: "annual",
              category: "tax-planning",
              subcategory: "multi-state",
              image: "/lovable-uploads/7faf1d1a-8aff-4541-8400-18aa687704e7.png",
              featured: false,
              provider: {
                name: "Strategic Tax Advisors"
              }
            },
            {
              id: "4",
              title: "Dynasty Trust Planning",
              description: "Long-term trust structures designed to preserve wealth across multiple generations.",
              price: "10,000",
              priceType: "one-time",
              category: "estate-planning",
              subcategory: "estate-trust",
              image: "/lovable-uploads/90781be1-cf1d-4b67-b35a-0e5c45072062.png",
              featured: false,
              provider: {
                name: "Legacy Trust Services"
              }
            },
            {
              id: "5",
              title: "VIP Concierge Bill Pay",
              description: "Comprehensive bill payment and personal accounting services.",
              price: "1,200",
              priceType: "monthly",
              category: "concierge-services",
              subcategory: "bill-pay",
              image: "/lovable-uploads/86dc106a-1666-4334-909d-1ec7b1f114bc.png",
              featured: true,
              provider: {
                name: "Elite Concierge Services"
              }
            },
            {
              id: "6",
              title: "Family Council Formation",
              description: "Structured approach to creating a family governance system with ongoing facilitation.",
              price: null,
              priceType: "contact",
              category: "family-governance",
              subcategory: "governance-succession",
              image: "/lovable-uploads/9d138e85-d6e9-4083-ad34-147b3fc524ab.png",
              featured: false,
              provider: {
                name: "Family Legacy Advisors"
              }
            },
            {
              id: "7",
              title: "Philanthropic Strategy Development",
              description: "Create a personalized charitable giving strategy aligned with your values and goals.",
              price: "8,500",
              priceType: "one-time",
              category: "estate-planning",
              subcategory: "philanthropy",
              image: "/lovable-uploads/de09b008-ad83-47b7-a3bf-d51532be0261.png",
              featured: false,
              provider: {
                name: "Impact Giving Consultants"
              }
            },
            {
              id: "8",
              title: "Exclusive Member Events",
              description: "Access to invitation-only cultural, sporting, and networking events worldwide.",
              price: "25,000",
              priceType: "annual",
              category: "concierge-services",
              subcategory: "exclusive-experiences",
              image: "/lovable-uploads/cfb9898e-86f6-43a4-816d-9ecd35536845.png",
              featured: true,
              provider: {
                name: "Global Elite Experiences"
              }
            }
          ];
          
          setListings(sampleListings);
        }
        
        // Similar approach for categories
        const apiCategories = await fetchMarketplaceCategories();
        
        if (apiCategories.length > 0) {
          setCategories(apiCategories);
        } else {
          // Generate categories with counts from the listings
          const categoryMap = new Map<string, number>();
          listings.forEach(listing => {
            const count = categoryMap.get(listing.category) || 0;
            categoryMap.set(listing.category, count + 1);
          });

          const sampleCategories: MarketplaceCategory[] = [
            { id: "wealth-management", name: "Wealth Management", icon: "trending-up", count: categoryMap.get("wealth-management") || 0 },
            { id: "tax-planning", name: "Tax Planning", icon: "receipt", count: categoryMap.get("tax-planning") || 0 },
            { id: "estate-planning", name: "Estate Planning", icon: "scroll", count: categoryMap.get("estate-planning") || 0 },
            { id: "concierge-services", name: "Concierge Services", icon: "briefcase", count: categoryMap.get("concierge-services") || 0 },
            { id: "family-governance", name: "Family Governance", icon: "users", count: categoryMap.get("family-governance") || 0 }
          ];
          
          setCategories(sampleCategories);
        }
      } catch (err) {
        console.error("Error loading marketplace data:", err);
        setError("Failed to load marketplace data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    listings,
    categories,
    isLoading,
    error,
    // API functionality we'll implement in future phases:
    refetch: async () => {
      // Will refetch data from the API in future phases
      console.log("API Integration Placeholder: refetch marketplace data");
    }
  };
}
