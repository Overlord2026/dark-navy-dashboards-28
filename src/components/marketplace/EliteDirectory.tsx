import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VipProfileCard, VipProfile } from "./VipProfileCard";
import { 
  Filter, 
  Users, 
  Crown, 
  Star, 
  MapPin, 
  Building, 
  Heart, 
  Plane,
  Scale,
  Shield,
  TrendingUp,
  Stethoscope
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { id: "all", name: "All Categories", icon: Users },
  { id: "wealth", name: "Wealth Management", icon: TrendingUp },
  { id: "health", name: "Health & Longevity", icon: Stethoscope },
  { id: "legal", name: "Legal Services", icon: Scale },
  { id: "insurance", name: "Insurance & Risk", icon: Shield },
  { id: "concierge", name: "Concierge Services", icon: Heart },
  { id: "travel", name: "Elite Travel", icon: Plane },
  { id: "real-estate", name: "Real Estate", icon: Building }
];

const locations = [
  "All Locations", "New York", "London", "Singapore", "Hong Kong", 
  "Los Angeles", "Miami", "Dubai", "Zurich", "Monaco"
];

const tiers = [
  { value: "all", label: "All Tiers" },
  { value: "platinum", label: "Platinum" },
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" }
];

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: "reserved", label: "Reserved" },
  { value: "founding_member", label: "Founding Members" },
  { value: "partner", label: "Equity Partners" },
  { value: "active", label: "Active Members" }
];

// Mock VIP profiles data
const mockVipProfiles: VipProfile[] = [
  {
    id: "1",
    name: "Michael Jordan",
    title: "Chairman & Principal Owner",
    organization: "Charlotte Hornets",
    category: "health",
    location: "Charlotte, NC",
    status: "reserved",
    specialties: ["Sports Medicine", "Peak Performance", "Legacy Building"],
    tier: "platinum",
    isVerified: true,
    description: "Global icon in sports and business, focusing on peak performance optimization and generational wealth strategies.",
    achievements: ["6x NBA Champion", "Business Mogul"]
  },
  {
    id: "2",
    name: "Tony Robbins",
    title: "Life & Business Strategist",
    organization: "Robbins Research International",
    category: "wealth",
    location: "Palm Beach, FL",
    status: "founding_member",
    specialties: ["Life Coaching", "Business Strategy", "Wealth Building"],
    tier: "platinum",
    isVerified: true,
    description: "World-renowned peak performance coach helping families and businesses achieve extraordinary results.",
    achievements: ["50+ Million Lives Impacted", "NYT Bestselling Author"]
  },
  {
    id: "3",
    name: "Goldman Sachs Private Wealth",
    title: "Investment Management",
    organization: "Goldman Sachs Group",
    category: "wealth",
    location: "New York, NY",
    status: "partner",
    specialties: ["Portfolio Management", "Alternative Investments", "Family Office Services"],
    tier: "platinum",
    isVerified: true,
    description: "Premier investment management and advisory services for ultra-high-net-worth families globally.",
    achievements: ["$2.5T Assets Under Management", "150+ Years Experience"]
  },
  {
    id: "4",
    name: "Mayo Clinic Executive Health",
    title: "Preventive Medicine",
    organization: "Mayo Clinic",
    category: "health",
    location: "Rochester, MN",
    status: "active",
    specialties: ["Executive Physicals", "Preventive Care", "Longevity Medicine"],
    tier: "gold",
    isVerified: true,
    description: "World-class preventive healthcare and executive health services for discerning families.",
    achievements: ["#1 Hospital Ranking", "Comprehensive Executive Health"]
  },
  {
    id: "5",
    name: "Kirkland & Ellis LLP",
    title: "Elite Legal Services",
    organization: "Kirkland & Ellis",
    category: "legal",
    location: "Chicago, IL",
    status: "reserved",
    specialties: ["Estate Planning", "Tax Law", "Corporate Transactions"],
    tier: "gold",
    isVerified: true,
    description: "Leading global law firm providing sophisticated legal services to families and businesses.",
    achievements: ["AmLaw 100 Firm", "Global Legal Excellence"]
  },
  {
    id: "6",
    name: "Four Seasons Private Residences",
    title: "Luxury Real Estate",
    organization: "Four Seasons Hotels",
    category: "real-estate",
    location: "Global",
    status: "active",
    specialties: ["Luxury Properties", "Concierge Services", "Investment Properties"],
    tier: "gold",
    isVerified: true,
    description: "Ultra-luxury residential properties with world-class Four Seasons service and amenities.",
    achievements: ["Global Luxury Leader", "Unparalleled Service Standards"]
  }
];

interface EliteDirectoryProps {
  searchQuery?: string;
}

export function EliteDirectory({ searchQuery = "" }: EliteDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProfiles = useMemo(() => {
    return mockVipProfiles.filter(profile => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          profile.name.toLowerCase().includes(searchLower) ||
          profile.organization.toLowerCase().includes(searchLower) ||
          profile.title.toLowerCase().includes(searchLower) ||
          profile.specialties.some(s => s.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== "all" && profile.category !== selectedCategory) return false;

      // Location filter
      if (selectedLocation !== "All Locations" && !profile.location.includes(selectedLocation)) return false;

      // Tier filter
      if (selectedTier !== "all" && profile.tier !== selectedTier) return false;

      // Status filter
      if (selectedStatus !== "all" && profile.status !== selectedStatus) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, selectedLocation, selectedTier, selectedStatus]);

  const getCategoryStats = () => {
    const stats = categories.map(category => {
      const count = category.id === "all" 
        ? mockVipProfiles.length 
        : mockVipProfiles.filter(p => p.category === category.id).length;
      return { ...category, count };
    });
    return stats;
  };

  const handleClaimProfile = (profile: VipProfile) => {
    console.log("Claiming profile:", profile);
    // Navigate to VIP claim flow
  };

  const handleViewProfile = (profile: VipProfile) => {
    console.log("Viewing profile:", profile);
    // Navigate to profile detail
  };

  const handleRequestInvite = (profile: VipProfile) => {
    console.log("Requesting invite:", profile);
    // Open invite request modal
  };

  return (
    <div className="space-y-6">
      {/* Category overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-gold" />
              Elite Interactive Directory
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {getCategoryStats().map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>

          {/* Filters panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border"
            >
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {location}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tier</label>
                <Select value={selectedTier} onValueChange={setSelectedTier}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiers.map((tier) => (
                      <SelectItem key={tier.value} value={tier.value}>
                        {tier.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {searchQuery ? `Search Results (${filteredProfiles.length})` : `Elite Directory (${filteredProfiles.length})`}
        </h2>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            {filteredProfiles.filter(p => p.status === "founding_member").length} Founding Members
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Crown className="h-3 w-3 mr-1" />
            {filteredProfiles.filter(p => p.status === "reserved").length} Reserved
          </Badge>
        </div>
      </div>

      {/* Profile grid */}
      {filteredProfiles.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Crown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No profiles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <VipProfileCard
                profile={profile}
                onClaimProfile={handleClaimProfile}
                onViewProfile={handleViewProfile}
                onRequestInvite={handleRequestInvite}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}