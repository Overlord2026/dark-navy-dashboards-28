import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Users, Star, MapPin, ExternalLink, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { VIPBadge } from '@/components/badges/VIPBadgeSystem';

interface VIPFounder {
  id: string;
  organization_name: string;
  organization_type: string;
  vip_tier: string;
  contact_name: string;
  location?: string;
  specialties?: string[];
  logo_url?: string;
  website_url?: string;
  linkedin_url?: string;
  member_count: number;
  referral_network_size: number;
  joined_date: string;
  is_featured: boolean;
}

export const VIPFoundersWall: React.FC = () => {
  const [founders, setFounders] = useState<VIPFounder[]>([]);
  const [filteredFounders, setFilteredFounders] = useState<VIPFounder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const { toast } = useToast();

  const personaTypes = [
    { value: 'all', label: 'All Personas' },
    { value: 'advisor', label: 'Financial Advisors' },
    { value: 'attorney', label: 'Attorneys' },
    { value: 'cpa', label: 'CPAs/Accountants' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'imo_fmo', label: 'IMO/FMO' },
    { value: 'mastermind', label: 'Masterminds' },
    { value: 'thought_leader', label: 'Thought Leaders' }
  ];

  const vipTiers = [
    { value: 'all', label: 'All Tiers' },
    { value: 'founding_member', label: 'Founding Members' },
    { value: 'early_adopter', label: 'Early Adopters' },
    { value: 'partner', label: 'Strategic Partners' },
    { value: 'thought_leader', label: 'Thought Leaders' }
  ];

  useEffect(() => {
    fetchFounders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [founders, selectedPersona, selectedTier]);

  const fetchFounders = async () => {
    try {
      // Get VIP organizations with member and referral counts
      const { data, error } = await supabase
        .from('vip_organizations')
        .select(`
          *,
          member_count:vip_organization_members(count),
          referral_count:vip_referral_networks(count)
        `)
        .eq('status', 'activated')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const processedFounders = data?.map(org => ({
        id: org.id,
        organization_name: org.organization_name,
        organization_type: org.organization_type,
        vip_tier: org.vip_tier,
        contact_name: org.contact_name,
        location: org.location,
        specialties: org.specialties || [],
        logo_url: org.logo_url,
        website_url: org.website_url,
        linkedin_url: org.linkedin_url,
        member_count: org.member_count?.[0]?.count || 0,
        referral_network_size: org.referral_count?.[0]?.count || 0,
        joined_date: org.created_at,
        is_featured: org.vip_tier === 'founding_member' || org.vip_tier === 'thought_leader'
      })) || [];

      setFounders(processedFounders);
    } catch (error: any) {
      console.error('Error fetching founders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load founding members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...founders];

    if (selectedPersona !== 'all') {
      filtered = filtered.filter(founder => founder.organization_type === selectedPersona);
    }

    if (selectedTier !== 'all') {
      filtered = filtered.filter(founder => founder.vip_tier === selectedTier);
    }

    // Sort featured first, then by join date
    filtered.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(a.joined_date).getTime() - new Date(b.joined_date).getTime();
    });

    setFilteredFounders(filtered);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="h-8 w-8 text-gold" />
          <h1 className="text-4xl font-bold">VIP Founding Members</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet the industry leaders who are shaping the future of family office services. 
          These founding members were selected as the first 100 VIPs to join our marketplace.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filter by:</span>
            </div>
            
            <Tabs value={selectedPersona} onValueChange={setSelectedPersona}>
              <TabsList className="h-8">
                {personaTypes.slice(0, 5).map((type) => (
                  <TabsTrigger key={type.value} value={type.value} className="text-xs">
                    {type.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Tabs value={selectedTier} onValueChange={setSelectedTier}>
              <TabsList className="h-8">
                {vipTiers.map((tier) => (
                  <TabsTrigger key={tier.value} value={tier.value} className="text-xs">
                    {tier.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Badge variant="outline">
              {filteredFounders.length} members
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gold">{founders.length}</div>
            <div className="text-sm text-muted-foreground">Total Founders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {founders.filter(f => f.vip_tier === 'founding_member').length}
            </div>
            <div className="text-sm text-muted-foreground">Founding Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {founders.reduce((sum, f) => sum + f.member_count, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Team Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {founders.reduce((sum, f) => sum + f.referral_network_size, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Network Size</div>
          </CardContent>
        </Card>
      </div>

      {/* Founders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFounders.map((founder) => (
          <Card key={founder.id} className={`relative overflow-hidden ${
            founder.is_featured ? 'ring-2 ring-gold/50 shadow-lg' : ''
          }`}>
            {founder.is_featured && (
              <div className="absolute top-0 right-0 bg-gradient-gold text-gold-foreground px-3 py-1 text-xs font-bold">
                FEATURED
              </div>
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={founder.logo_url} alt={founder.organization_name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {getInitials(founder.organization_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">
                      {founder.organization_name}
                    </h3>
                    <VIPBadge type={founder.vip_tier as any} size="sm" animated={false} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {founder.contact_name}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1 capitalize">
                    {founder.organization_type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
              {founder.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {founder.location}
                </div>
              )}

              {founder.specialties && founder.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {founder.specialties.slice(0, 2).map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {founder.specialties.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{founder.specialties.length - 2} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {founder.member_count} members
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {founder.referral_network_size} network
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {founder.website_url && (
                  <Button size="sm" variant="outline" className="flex-1 text-xs" asChild>
                    <a href={founder.website_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Website
                    </a>
                  </Button>
                )}
                {founder.linkedin_url && (
                  <Button size="sm" variant="outline" className="flex-1 text-xs" asChild>
                    <a href={founder.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>

              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                Founding member since {new Date(founder.joined_date).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFounders.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No founders found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more founding members.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};