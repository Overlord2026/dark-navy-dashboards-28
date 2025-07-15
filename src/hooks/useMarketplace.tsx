import { useState, useEffect } from "react";

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

export function useMarketplace() {
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);

  useEffect(() => {
    // Simulate API call
    const loadData = () => {
      setTimeout(() => {
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
              logo: "/lovable-uploads/dc1ba115-9699-414c-b9d0-7521bf7e7224.png"
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
          },
          {
            id: "21",
            title: "Business Exit Strategy Planning",
            description: "Comprehensive exit planning for business owners seeking to maximize value and plan for the future.",
            price: "20,000",
            priceType: "one-time",
            category: "business-services",
            subcategory: "exit-planning",
            image: "/lovable-uploads/7f52d8e5-bf6b-4533-8c1b-f933a43cfce7.png",
            featured: true,
            provider: {
              name: "Legacy Business Advisors"
            }
          },
          {
            id: "22",
            title: "Liquidity Event Preparation",
            description: "Pre-transaction planning to optimize financial, tax, and personal outcomes from business liquidity events.",
            price: "15,000",
            priceType: "one-time",
            category: "business-services",
            subcategory: "liquidity-planning",
            image: "/lovable-uploads/8d710c1a-ccab-41d8-b202-41ad5cc5a735.png",
            featured: false,
            provider: {
              name: "Capital Horizon Partners"
            }
          },
          {
            id: "23",
            title: "Strategic CFO Services",
            description: "Fractional CFO services for family businesses and private companies seeking financial leadership.",
            price: "7,500",
            priceType: "monthly",
            category: "business-services",
            subcategory: "cfo-services",
            image: "/lovable-uploads/90781be1-cf1d-4b67-b35a-0e5c45072062.png",
            featured: true,
            provider: {
              name: "Elite Financial Leadership"
            }
          },
          {
            id: "24",
            title: "Advanced Business Owner Tax Strategy",
            description: "Specialized tax planning strategies designed specifically for business owners to minimize tax burden.",
            price: "12,000",
            priceType: "annual",
            category: "tax-planning",
            subcategory: "business-tax-strategy",
            image: "/lovable-uploads/7faf1d1a-8aff-4541-8400-18aa687704e7.png",
            featured: true,
            provider: {
              name: "Business Tax Advisors Group"
            }
          },
          {
            id: "25",
            title: "Family Meeting Facilitation",
            description: "Professional facilitation of family meetings to address governance, values, and legacy planning.",
            price: "5,000",
            priceType: "one-time",
            category: "family-governance",
            subcategory: "family-meetings",
            image: "/lovable-uploads/9d138e85-d6e9-4083-ad34-147b3fc524ab.png",
            featured: false,
            provider: {
              name: "Family Legacy Facilitators"
            }
          },
          {
            id: "26",
            title: "Family Conflict Resolution",
            description: "Specialized mediation and resolution services for family business conflicts.",
            price: null,
            priceType: "custom",
            category: "family-governance",
            subcategory: "conflict-resolution",
            image: "/lovable-uploads/86dc106a-1666-4334-909d-1ec7b1f114bc.png",
            featured: false,
            provider: {
              name: "Family Harmony Advisors"
            }
          },
          {
            id: "27",
            title: "Private Placement Life Insurance",
            description: "Tax-efficient investment structure using private placement life insurance.",
            price: null,
            priceType: "contact",
            category: "boutique-services",
            subcategory: "private-placement",
            image: "/lovable-uploads/de09b008-ad83-47b7-a3bf-d51532be0261.png",
            featured: true,
            provider: {
              name: "Sovereign Insurance Strategies"
            }
          },
          {
            id: "28",
            title: "Art Advisory & Collection Management",
            description: "Expert guidance on art acquisition, collection management, and art-based wealth planning.",
            price: "4,200",
            priceType: "monthly",
            category: "boutique-services",
            subcategory: "art-advisory",
            image: "/lovable-uploads/cfb9898e-86f6-43a4-816d-9ecd35536845.png",
            featured: false,
            provider: {
              name: "Fine Art Advisory Group"
            }
          },
          {
            id: "29",
            title: "Cross-Border Wealth Planning",
            description: "Specialized planning for families with international assets and multi-jurisdictional considerations.",
            price: "25,000",
            priceType: "annual",
            category: "boutique-services",
            subcategory: "cross-border",
            image: "/lovable-uploads/7f52d8e5-bf6b-4533-8c1b-f933a43cfce7.png",
            featured: true,
            provider: {
              name: "Global Family Advisors"
            }
          }
        ];

        // Generate categories with counts from the listings
        const categoryMap = new Map<string, number>();
        sampleListings.forEach(listing => {
          const count = categoryMap.get(listing.category) || 0;
          categoryMap.set(listing.category, count + 1);
        });

        const sampleCategories: MarketplaceCategory[] = [
          { id: "wealth-management", name: "Wealth Management", icon: "trending-up", count: categoryMap.get("wealth-management") || 0 },
          { id: "tax-planning", name: "Tax Planning", icon: "receipt", count: categoryMap.get("tax-planning") || 0 },
          { id: "estate-planning", name: "Estate Planning", icon: "scroll", count: categoryMap.get("estate-planning") || 0 },
          { id: "business-services", name: "Business Owner Services", icon: "building", count: categoryMap.get("business-services") || 0 },
          { id: "concierge-services", name: "Concierge Services", icon: "briefcase", count: categoryMap.get("concierge-services") || 0 },
          { id: "family-governance", name: "Family Governance", icon: "users", count: categoryMap.get("family-governance") || 0 },
          { id: "boutique-services", name: "Boutique Services", icon: "dollar-sign", count: categoryMap.get("boutique-services") || 0 }
        ];

        setListings(sampleListings);
        setCategories(sampleCategories);
        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  return {
    listings,
    categories,
    isLoading
  };
}
