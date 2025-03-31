
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, DollarSign, Star } from "lucide-react";

interface FamilyOfficeFiltersProps {
  filters: {
    location: string;
    serviceArea: string;
    wealthTier: string;
    rating: number;
  };
  onFilterChange: (key: string, value: string | number) => void;
}

export function FamilyOfficeFilters({ filters, onFilterChange }: FamilyOfficeFiltersProps) {
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

  const handleReset = () => {
    onFilterChange("location", "");
    onFilterChange("serviceArea", "");
    onFilterChange("wealthTier", "");
    onFilterChange("rating", 0);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Refine Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="location" className="font-medium">
              Location
            </Label>
          </div>
          <Input
            id="location"
            placeholder="City, State, or Region"
            value={filters.location}
            onChange={e => onFilterChange("location", e.target.value)}
          />
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
              <div key={service.id} className="flex items-center space-x-2">
                <RadioGroupItem value={service.id} id={`service-${service.id}`} />
                <Label htmlFor={`service-${service.id}`} className="text-sm">
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
              <div key={tier.id} className="flex items-center space-x-2">
                <RadioGroupItem value={tier.id} id={`tier-${tier.id}`} />
                <Label htmlFor={`tier-${tier.id}`} className="text-sm">
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
              defaultValue={[filters.rating]}
              max={5}
              step={1}
              onValueChange={handleRatingChange}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Any</span>
              <span>5 Stars</span>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleReset}>
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
