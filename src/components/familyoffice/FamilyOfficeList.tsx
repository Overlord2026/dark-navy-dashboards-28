
import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FamilyOfficeDetailsSheet } from "@/components/familyoffice/FamilyOfficeDetailsSheet";
import { FamilyOffice } from "@/types/familyoffice";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin, DollarSign, Briefcase, Star, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FamilyOfficeListProps {
  searchQuery: string;
  filters: {
    location: string;
    serviceArea: string;
    wealthTier: string;
    rating: number;
  };
  familyOffices: FamilyOffice[];
  isLoading: boolean;
}

export function FamilyOfficeList({ searchQuery, filters, familyOffices, isLoading }: FamilyOfficeListProps) {
  const [selectedOffice, setSelectedOffice] = useState<FamilyOffice | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'tier'>('all');

  const filteredOffices = useMemo(() => {
    return familyOffices.filter(office => {
      // Search query filter
      const matchesSearch = searchQuery === "" || 
        office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Location filter
      const matchesLocation = filters.location === "" || 
        office.location.toLowerCase().includes(filters.location.toLowerCase());
      
      // Service area filter
      const matchesService = filters.serviceArea === "" || 
        office.services.some(service => service.id === filters.serviceArea);
      
      // Wealth tier filter
      const matchesWealthTier = filters.wealthTier === "" || 
        office.wealthTiers.includes(filters.wealthTier);
      
      // Rating filter
      const matchesRating = filters.rating === 0 || 
        office.rating >= filters.rating;
      
      return matchesSearch && matchesLocation && matchesService && matchesWealthTier && matchesRating;
    });
  }, [familyOffices, searchQuery, filters]);

  const handleViewDetails = (office: FamilyOffice) => {
    setSelectedOffice(office);
    setIsDetailsOpen(true);
  };

  // Group offices by tier for tiered view
  const groupedByTier = useMemo(() => {
    const groups = {
      foundational: filteredOffices.filter(o => o.tier === 'foundational'),
      intermediate: filteredOffices.filter(o => o.tier === 'intermediate'),
      advanced: filteredOffices.filter(o => o.tier === 'advanced')
    };
    return groups;
  }, [filteredOffices]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex space-x-2 pt-2">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
                <div className="pt-2">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredOffices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <User className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No family offices found</h3>
        <p className="text-muted-foreground mt-1 max-w-md">
          Try adjusting your filters or search terms to find family offices that match your criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          Results <span className="text-sm font-normal text-muted-foreground">({filteredOffices.length} offices)</span>
        </h2>
        <Tabs defaultValue="all" onValueChange={(v) => setViewMode(v as 'all' | 'tier')}>
          <TabsList>
            <TabsTrigger value="all">All Offices</TabsTrigger>
            <TabsTrigger value="tier">By Tier</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === 'all' ? (
        <div className="space-y-4">
          {filteredOffices.map((office) => (
            <OfficeCard 
              key={office.id} 
              office={office} 
              onViewDetails={handleViewDetails} 
            />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Advanced Tier */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Advanced Family Office Tier</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Multi-Family Offices (MFOs), Single-Family Offices (SFOs), and services for Ultra-High-Net-Worth clients with complex needs
            </p>
            {groupedByTier.advanced.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No advanced tier offices match your criteria</p>
            ) : (
              groupedByTier.advanced.map((office) => (
                <OfficeCard 
                  key={office.id} 
                  office={office} 
                  onViewDetails={handleViewDetails} 
                />
              ))
            )}
          </div>
          
          {/* Intermediate Tier */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Intermediate Tier</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive Advisory Firms specializing in growing wealth complexity and business owner strategies
            </p>
            {groupedByTier.intermediate.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No intermediate tier offices match your criteria</p>
            ) : (
              groupedByTier.intermediate.map((office) => (
                <OfficeCard 
                  key={office.id} 
                  office={office} 
                  onViewDetails={handleViewDetails} 
                />
              ))
            )}
          </div>
          
          {/* Foundational Tier */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Foundational Tier</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Independent RIAs, CPAs, Estate Planners, and Insurance Advisors for emerging wealth
            </p>
            {groupedByTier.foundational.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No foundational tier offices match your criteria</p>
            ) : (
              groupedByTier.foundational.map((office) => (
                <OfficeCard 
                  key={office.id} 
                  office={office} 
                  onViewDetails={handleViewDetails} 
                />
              ))
            )}
          </div>
        </div>
      )}

      <FamilyOfficeDetailsSheet
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        familyOffice={selectedOffice}
      />
    </div>
  );
}

interface OfficeCardProps {
  office: FamilyOffice;
  onViewDetails: (office: FamilyOffice) => void;
}

function OfficeCard({ office, onViewDetails }: OfficeCardProps) {
  return (
    <Card className="w-full hover:border-primary transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-lg">{office.name}</h3>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{office.location}</span>
                </div>
              </div>
              <TierBadge tier={office.tier} />
            </div>
            
            <p className="my-3 text-sm line-clamp-2">{office.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {office.services.slice(0, 3).map(service => (
                <Badge key={service.id} variant="secondary" className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {service.name}
                </Badge>
              ))}
              {office.services.length > 3 && (
                <Badge variant="outline">+{office.services.length - 3} more</Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Min Assets: ${office.minimumAssets}M+
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                {office.rating.toFixed(1)} ({office.reviewCount} reviews)
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-between md:w-1/4">
            <Button 
              onClick={() => onViewDetails(office)}
              className="w-full"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TierBadge({ tier }: { tier: 'foundational' | 'intermediate' | 'advanced' }) {
  let color = "bg-blue-100 text-blue-800";
  let label = "Foundational";
  
  if (tier === 'intermediate') {
    color = "bg-purple-100 text-purple-800";
    label = "Intermediate";
  } else if (tier === 'advanced') {
    color = "bg-green-100 text-green-800";
    label = "Advanced";
  }
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
