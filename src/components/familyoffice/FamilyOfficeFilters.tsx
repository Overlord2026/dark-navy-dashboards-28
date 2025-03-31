
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, DollarSign, Star, FilterX } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FamilyOfficeFiltersProps {
  filters: {
    location: string;
    serviceArea: string;
    wealthTier: string;
    rating: number;
  };
  onFilterChange: (key: string, value: string | number) => void;
  onClearFilters: () => void;
}

export function FamilyOfficeFilters({ filters, onFilterChange, onClearFilters }: FamilyOfficeFiltersProps) {
  const serviceAreas = [
    { id: "wealth-management", name: "Wealth Management" },
    { id: "estate-planning", name: "Estate & Legacy Planning" },
    { id: "tax-optimization", name: "Tax Optimization" },
    { id: "private-investments", name: "Private Investments" },
    { id: "philanthropy", name: "Philanthropy" },
    { id: "risk-management", name: "Risk Management" },
    { id: "family-governance", name: "Family Governance" },
  ];

  const wealthTiers = [
    { id: "emerging", name: "Emerging Wealth ($1M-$5M)" },
    { id: "affluent", name: "Affluent ($5M-$10M)" },
    { id: "hnw", name: "High-Net-Worth ($10M-$30M)" },
    { id: "uhnw", name: "Ultra-High-Net-Worth ($30M+)" },
  ];

  const handleRatingChange = (value: number[]) => {
    onFilterChange("rating", value[0]);
  };
  
  const isMobile = useIsMobile();

  return (
    <Card className="sticky top-4 border shadow-sm transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Refine Results</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearFilters} 
          className="h-8 px-2 text-sm hover:bg-muted"
          aria-label="Clear all filters"
        >
          <FilterX className="h-4 w-4 mr-1" />
          <span className={isMobile ? "sr-only" : ""}>Clear All</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="location" className="font-medium">
              Location
            </Label>
          </div>
          <div className="relative">
            <Input
              id="location"
              placeholder="City, State, or Region"
              value={filters.location}
              onChange={e => onFilterChange("location", e.target.value)}
              className="pr-8"
            />
            {filters.location && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0" 
                onClick={() => onFilterChange("location", "")}
                aria-label="Clear location filter"
              >
                ✕
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <Label className="font-medium">Service Areas</Label>
          </div>
          <RadioGroup
            value={filters.serviceArea}
            onValueChange={value => onFilterChange("serviceArea", value)}
            className="flex flex-col space-y-2"
          >
            {serviceAreas.map(service => (
              <div key={service.id} className="flex items-center space-x-2 transition-colors hover:bg-muted/50 p-1 rounded-md">
                <RadioGroupItem value={service.id} id={`service-${service.id}`} />
                <Label htmlFor={`service-${service.id}`} className="text-sm cursor-pointer">
                  {service.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <Label className="font-medium">Wealth Tier</Label>
          </div>
          <RadioGroup
            value={filters.wealthTier}
            onValueChange={value => onFilterChange("wealthTier", value)}
            className="flex flex-col space-y-2"
          >
            {wealthTiers.map(tier => (
              <div key={tier.id} className="flex items-center space-x-2 transition-colors hover:bg-muted/50 p-1 rounded-md">
                <RadioGroupItem value={tier.id} id={`tier-${tier.id}`} />
                <Label htmlFor={`tier-${tier.id}`} className="text-sm cursor-pointer">
                  {tier.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <Label className="font-medium">Minimum Rating</Label>
          </div>
          <div className="pt-2 px-1">
            <Slider
              value={[filters.rating]}
              max={5}
              step={1}
              onValueChange={handleRatingChange}
              className="[&_.control]:data-[state=active]:bg-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Any</span>
              <span>5 Stars</span>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full transition-colors hover:bg-primary hover:text-primary-foreground" 
          onClick={onClearFilters}
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
