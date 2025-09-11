import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, MapPin, TrendingUp } from 'lucide-react';
import { GoldOutlineButton } from '@/components/ui/brandButtons';
import { recordReceipt } from '@/features/receipts/record';
import * as Canonical from '@/lib/canonical';
import { toast } from 'sonner';
import type { DecisionRDS } from '@/features/receipts/types';

interface BrandSuggestion {
  id: string;
  name: string;
  category: string;
  type: 'local' | 'national';
  location?: string;
  whyMatch: string;
  hashtags: string[];
  logoInitials: string;
}

const BRAND_SUGGESTIONS: BrandSuggestion[] = [
  {
    id: 'brand_local_1',
    name: 'Campus Coffee Co.',
    category: 'Food & Beverage',
    type: 'local',
    location: 'Downtown Campus',
    whyMatch: 'Matches #LocalBusiness, near your school',
    hashtags: ['#LocalBusiness', '#Coffee', '#Campus'],
    logoInitials: 'CC'
  },
  {
    id: 'brand_local_2', 
    name: 'State Street Fitness',
    category: 'Health & Wellness',
    type: 'local',
    location: 'University District',
    whyMatch: 'Student athlete focus, wellness content',
    hashtags: ['#Fitness', '#StudentAthlete', '#Wellness'],
    logoInitials: 'SF'
  },
  {
    id: 'brand_local_3',
    name: 'Gameday Gear Shop',
    category: 'Athletic Apparel',
    type: 'local',
    location: 'Stadium District',
    whyMatch: 'Local sports apparel, team partnerships',
    hashtags: ['#Gameday', '#LocalTeam', '#Apparel'],
    logoInitials: 'GG'
  },
  {
    id: 'brand_local_4',
    name: 'Student Eats Delivery',
    category: 'Food Delivery',
    type: 'local',
    location: 'Campus Area',
    whyMatch: 'Student-focused, meal plans available',
    hashtags: ['#StudentLife', '#FoodDelivery', '#Campus'],
    logoInitials: 'SE'
  },
  {
    id: 'brand_national_1',
    name: 'Nike',
    category: 'Athletic Apparel',
    type: 'national',
    whyMatch: 'Major athletic brand, student athlete program',
    hashtags: ['#JustDoIt', '#Athletics', '#Performance'],
    logoInitials: 'NK'
  },
  {
    id: 'brand_national_2',
    name: 'Gatorade',
    category: 'Sports Nutrition',
    type: 'national',
    whyMatch: 'Sports performance, hydration focus',
    hashtags: ['#FuelYourFire', '#Sports', '#Performance'],
    logoInitials: 'GT'
  }
];

interface BrandMatchPanelProps {
  searchQuery?: string;
}

export function BrandMatchPanel({ searchQuery = '' }: BrandMatchPanelProps) {
  const handleContactBrand = async (brand: BrandSuggestion) => {
    try {
      // Create Decision-RDS receipt for brand contact
      const contactReceipt: DecisionRDS = {
        id: `rds_brand_contact_${Date.now()}`,
        type: 'Decision-RDS',
        action: 'brand.contact',
        policy_version: 'NIL-2025.01',
        inputs_hash: await Canonical.hash({ brand_id: brand.id, brand_name: brand.name }),
        reasons: ['BRAND_CONTACT_INITIATED'],
        result: 'approve',
        anchor_ref: null,
        ts: new Date().toISOString()
      };

      recordReceipt(contactReceipt);
      
      toast.success('Contact initiated', {
        description: `Reached out to ${brand.name} • Receipt generated`,
        action: {
          label: 'View Receipt',
          onClick: () => window.location.href = '/nil/receipts'
        }
      });
    } catch (error) {
      console.error('Failed to create contact receipt:', error);
      toast.error('Failed to log contact attempt');
    }
  };

  // Filter suggestions based on search query if provided
  const filteredSuggestions = searchQuery
    ? BRAND_SUGGESTIONS.filter(brand => 
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : BRAND_SUGGESTIONS;

  return (
    <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
      <CardHeader className="border-b border-bfo-gold/30">
        <CardTitle className="flex items-center gap-2 text-white font-semibold">
          <Building2 className="h-5 w-5 text-bfo-gold" />
          Brand Matches
        </CardTitle>
        <CardDescription className="text-white/70">
          Suggested brand partnerships based on your content and location
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredSuggestions.map((brand) => (
          <div 
            key={brand.id}
            className="p-4 border border-bfo-gold/20 rounded-lg bg-bfo-black/30 hover:bg-bfo-black/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 border border-bfo-gold/30">
                <AvatarFallback className="bg-bfo-gold/20 text-bfo-gold text-xs font-semibold">
                  {brand.logoInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-white text-sm">{brand.name}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      brand.type === 'national' 
                        ? 'border-blue-500/40 text-blue-400' 
                        : 'border-green-500/40 text-green-400'
                    }`}
                  >
                    {brand.type}
                  </Badge>
                </div>
                
                <p className="text-xs text-white/60 mb-1">{brand.category}</p>
                
                {brand.location && (
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3 text-white/40" />
                    <span className="text-xs text-white/50">{brand.location}</span>
                  </div>
                )}
                
                <p className="text-xs text-white/70 mb-3">{brand.whyMatch}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {brand.hashtags.slice(0, 2).map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs border-bfo-gold/30 text-bfo-gold/70"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <GoldOutlineButton
                    onClick={() => handleContactBrand(brand)}
                    className="text-xs py-1 px-3"
                  >
                    Contact
                  </GoldOutlineButton>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-xs text-white/50 bg-bfo-black/30 p-3 rounded-lg">
          <p className="font-medium mb-1">🎯 Matching Logic:</p>
          <p>Based on hashtags, location proximity, and content category alignment</p>
        </div>
      </CardContent>
    </Card>
  );
}