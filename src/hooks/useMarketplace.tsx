
import { useState, useEffect } from "react";

// Types for our marketplace data
export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  provider: string;
  rating: number;
  reviewCount: number;
  image: string;
  featured: boolean;
  tags: string[];
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// Mock data - in a real app, this would come from an API
const mockListings: MarketplaceListing[] = [
  {
    id: "1",
    title: "Tax Optimization Strategy",
    description: "Comprehensive tax planning package for high net worth individuals",
    price: 2500,
    category: "tax-planning",
    provider: "Elite Tax Advisors",
    rating: 4.8,
    reviewCount: 124,
    image: "/lovable-uploads/9d138e85-d6e9-4083-ad34-147b3fc524ab.png",
    featured: true,
    tags: ["Tax Planning", "Estate", "Retirement"]
  },
  {
    id: "2",
    title: "Retirement Portfolio Analysis",
    description: "In-depth analysis of your retirement portfolio with recommendations",
    price: 1800,
    category: "retirement",
    provider: "Wealth Horizon",
    rating: 4.9,
    reviewCount: 89,
    image: "/lovable-uploads/7f52d8e5-bf6b-4533-8c1b-f933a43cfce7.png",
    featured: true,
    tags: ["Retirement", "Portfolio", "Analysis"]
  },
  {
    id: "3",
    title: "Estate Planning Package",
    description: "Comprehensive estate planning services for wealth preservation",
    price: 3200,
    category: "estate-planning",
    provider: "Legacy Wealth",
    rating: 4.7,
    reviewCount: 56,
    image: "/lovable-uploads/3f1d0ac5-00e5-48cc-a437-944e8580ff51.png",
    featured: false,
    tags: ["Estate", "Planning", "Trusts"]
  },
  {
    id: "4",
    title: "Private Equity Opportunity",
    description: "Exclusive private equity investment opportunity in healthcare tech",
    price: 50000,
    category: "investments",
    provider: "Venture Partners",
    rating: 4.6,
    reviewCount: 32,
    image: "/lovable-uploads/90781be1-cf1d-4b67-b35a-0e5c45072062.png",
    featured: true,
    tags: ["Private Equity", "Healthcare", "Tech"]
  },
  {
    id: "5",
    title: "Insurance Portfolio Review",
    description: "Comprehensive analysis of your insurance coverage and needs",
    price: 900,
    category: "insurance",
    provider: "Shield Advisors",
    rating: 4.5,
    reviewCount: 76,
    image: "/lovable-uploads/cfb9898e-86f6-43a4-816d-9ecd35536845.png",
    featured: false,
    tags: ["Insurance", "Risk Management", "Review"]
  },
  {
    id: "6",
    title: "Family Office Service Package",
    description: "Complete family office services for high net worth families",
    price: 5000,
    category: "family-office",
    provider: "Elite Family Services",
    rating: 4.9,
    reviewCount: 42,
    image: "/lovable-uploads/6b80c4ed-a513-491e-b6f8-1a78c48dced5.png",
    featured: true,
    tags: ["Family Office", "Wealth Management", "Concierge"]
  }
];

const mockCategories: MarketplaceCategory[] = [
  {
    id: "tax-planning",
    name: "Tax Planning",
    icon: "receipt",
    count: 12
  },
  {
    id: "retirement",
    name: "Retirement",
    icon: "piggy-bank",
    count: 8
  },
  {
    id: "estate-planning",
    name: "Estate Planning",
    icon: "scroll",
    count: 6
  },
  {
    id: "investments",
    name: "Investments",
    icon: "trending-up",
    count: 15
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: "shield",
    count: 9
  },
  {
    id: "family-office",
    name: "Family Office",
    icon: "home",
    count: 4
  }
];

export function useMarketplace() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a delay
    const timer = setTimeout(() => {
      setListings(mockListings);
      setCategories(mockCategories);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return {
    listings,
    categories,
    isLoading
  };
}
