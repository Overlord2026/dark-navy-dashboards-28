
export interface FamilyOffice {
  id: string;
  name: string;
  description: string;
  location: string;
  foundedYear: number;
  clientCount: number;
  aum: number; // Assets Under Management in billions
  minimumAssets: number; // Minimum client assets in millions
  tier: 'foundational' | 'intermediate' | 'advanced';
  wealthTiers: string[]; // 'emerging', 'affluent', 'hnw', 'uhnw'
  rating: number;
  reviewCount: number;
  services: Service[];
  team: TeamMember[];
  reviews: Review[];
  website?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  highlights?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  date: string;
  comment: string;
  response: string | null;
}
