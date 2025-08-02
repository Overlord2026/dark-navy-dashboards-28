import React, { useState, useEffect } from 'react';
import { AgencyCard, Agency } from './AgencyCard';
import { AgencyFilters } from './AgencyFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AgencyDirectoryProps {
  onBookCampaign: (agencyId: string) => void;
  onViewDetails: (agencyId: string) => void;
}

export const AgencyDirectory: React.FC<AgencyDirectoryProps> = ({
  onBookCampaign,
  onViewDetails
}) => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgencies();
  }, []);

  useEffect(() => {
    filterAgencies();
  }, [agencies, searchQuery, selectedSpecializations, minRating]);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      
      // Fetch agencies with their ratings and performance metrics
      const { data: agenciesData, error: agenciesError } = await supabase
        .from('marketing_agencies')
        .select(`
          *,
          agency_performance_metrics(
            average_cpl,
            conversion_rate
          ),
          agency_reviews(
            rating
          )
        `)
        .eq('status', 'approved')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (agenciesError) throw agenciesError;

      // Calculate average ratings and transform data
      const transformedAgencies: Agency[] = (agenciesData || []).map(agency => {
        const reviews = agency.agency_reviews || [];
        const avgRating = reviews.length > 0 
          ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
          : 0;
        
        const latestMetrics = agency.agency_performance_metrics?.[0];
        
        return {
          id: agency.id,
          name: agency.name,
          logo_url: agency.logo_url,
          description: agency.description,
          specializations: agency.specializations || [],
          average_rating: avgRating,
          total_reviews: reviews.length,
          average_cpl: latestMetrics?.average_cpl || 0,
          conversion_rate: latestMetrics?.conversion_rate || 0,
          is_featured: agency.is_featured,
          contact_email: agency.contact_email
        };
      });

      setAgencies(transformedAgencies);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load marketing agencies."
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAgencies = () => {
    let filtered = [...agencies];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(agency =>
        agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.specializations.some(spec => 
          spec.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Specialization filter
    if (selectedSpecializations.length > 0) {
      filtered = filtered.filter(agency =>
        selectedSpecializations.some(spec =>
          agency.specializations.includes(spec)
        )
      );
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(agency => agency.average_rating >= minRating);
    }

    setFilteredAgencies(filtered);
  };

  const allSpecializations = Array.from(
    new Set(agencies.flatMap(agency => agency.specializations))
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-12 bg-muted rounded-lg mb-4"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search agencies by name, description, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <AgencyFilters
          specializations={allSpecializations}
          selectedSpecializations={selectedSpecializations}
          onSpecializationsChange={setSelectedSpecializations}
          minRating={minRating}
          onMinRatingChange={setMinRating}
        />
      )}

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {filteredAgencies.length} agencies found
        </p>
      </div>

      {/* Agency Grid */}
      {filteredAgencies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No agencies found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecializations([]);
              setMinRating(0);
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgencies.map((agency) => (
            <AgencyCard
              key={agency.id}
              agency={agency}
              onBookCampaign={onBookCampaign}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};