import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Star, 
  MapPin, 
  DollarSign, 
  Check, 
  UserPlus, 
  MessageCircle, 
  Mail,
  Phone,
  Globe,
  Filter,
  ChevronDown
} from "lucide-react";
import { EnhancedProfessional, PROFESSIONAL_RELATIONSHIPS } from "@/types/professionalTeam";
import { useProfessionalTeam } from "@/hooks/useProfessionalTeam";
import { ProfessionalType } from "@/types/professional";

interface MarketplaceDashboardProps {
  onViewTeam: () => void;
  onViewProfile: (professional: EnhancedProfessional) => void;
}

export function MarketplaceDashboard({ onViewTeam, onViewProfile }: MarketplaceDashboardProps) {
  const { allProfessionals, loading, assignProfessional, saving } = useProfessionalTeam();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");

  // Get unique locations and types for filters
  const uniqueLocations = useMemo(() => {
    const locations = allProfessionals
      .map(p => p.location)
      .filter(Boolean)
      .filter((location, index, array) => array.indexOf(location) === index);
    return locations;
  }, [allProfessionals]);

  const uniqueTypes = useMemo(() => {
    const types = allProfessionals
      .map(p => p.type)
      .filter((type, index, array) => array.indexOf(type) === index);
    return types;
  }, [allProfessionals]);

  // Filter and sort professionals
  const filteredProfessionals = useMemo(() => {
    let filtered = allProfessionals.filter(professional => {
      const matchesSearch = searchQuery === "" || 
        professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professional.firm?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professional.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professional.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === "all" || professional.type === selectedType;
      const matchesLocation = selectedLocation === "all" || professional.location === selectedLocation;

      return matchesSearch && matchesType && matchesLocation;
    });

    // Sort professionals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.ratings_average - a.ratings_average;
        case "reviews":
          return b.reviews_count - a.reviews_count;
        case "name":
          return a.name.localeCompare(b.name);
        case "verified":
          return Number(b.verified) - Number(a.verified);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProfessionals, searchQuery, selectedType, selectedLocation, sortBy]);

  const handleAssign = async (professional: EnhancedProfessional, relationship: string) => {
    await assignProfessional(professional.id, relationship);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="p-6">
              <div className="space-y-3">
                <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professional Marketplace & Network</h1>
          <p className="text-muted-foreground mt-1">
            Discover and connect with verified professionals for your family office team
          </p>
        </div>
        <Button variant="outline" onClick={onViewTeam}>
          View Your Team
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, firm, specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="verified">Verified First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredProfessionals.length} professionals found
        </p>
      </div>

      {/* Professional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessionals.map((professional) => (
          <Card key={professional.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={professional.photo_url} />
                    <AvatarFallback>
                      {professional.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {professional.name}
                      {professional.verified && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{professional.firm || professional.company}</CardDescription>
                  </div>
                </div>
                {professional.accepting_new_clients && (
                  <Badge variant="outline" className="text-xs">
                    Accepting Clients
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Type and Location */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{professional.type}</Badge>
                  {professional.location && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{professional.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {professional.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {professional.bio}
                </p>
              )}

              {/* Specialties */}
              {professional.specialties && professional.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {professional.specialties.slice(0, 3).map((specialty, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {professional.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{professional.specialties.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Rating and Reviews */}
              <div className="flex items-center justify-between">
                {professional.ratings_average > 0 ? (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{professional.ratings_average.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">
                      ({professional.reviews_count} reviews)
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">No reviews yet</span>
                )}

                {professional.fee_model && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span>{professional.fee_model}</span>
                  </div>
                )}
              </div>

              {/* Languages */}
              {professional.languages && professional.languages.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <strong>Languages:</strong> {professional.languages.join(', ')}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => onViewProfile(professional)}
                  variant="outline"
                  className="flex-1"
                >
                  View Profile
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAssign(professional, 'other')}
                  disabled={saving}
                  className="flex-1"
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  {saving ? 'Adding...' : 'Add to Team'}
                </Button>
              </div>

              {/* Quick Contact */}
              <div className="flex gap-1 pt-1">
                {professional.email && (
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Mail className="h-3 w-3" />
                  </Button>
                )}
                {professional.phone && (
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Phone className="h-3 w-3" />
                  </Button>
                )}
                {professional.website && (
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Globe className="h-3 w-3" />
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MessageCircle className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProfessionals.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No professionals found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or browse all professionals.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setSelectedLocation("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}