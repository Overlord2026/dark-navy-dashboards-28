import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Star, X } from 'lucide-react';

interface AgencyFiltersProps {
  specializations: string[];
  selectedSpecializations: string[];
  onSpecializationsChange: (specializations: string[]) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
}

export const AgencyFilters: React.FC<AgencyFiltersProps> = ({
  specializations,
  selectedSpecializations,
  onSpecializationsChange,
  minRating,
  onMinRatingChange
}) => {
  const toggleSpecialization = (spec: string) => {
    if (selectedSpecializations.includes(spec)) {
      onSpecializationsChange(selectedSpecializations.filter(s => s !== spec));
    } else {
      onSpecializationsChange([...selectedSpecializations, spec]);
    }
  };

  const clearAllFilters = () => {
    onSpecializationsChange([]);
    onMinRatingChange(0);
  };

  const hasActiveFilters = selectedSpecializations.length > 0 || minRating > 0;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Specializations Filter */}
        <div>
          <h4 className="font-medium mb-3">Specializations</h4>
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => (
              <Badge
                key={spec}
                variant={selectedSpecializations.includes(spec) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedSpecializations.includes(spec)
                    ? 'bg-gold-primary text-primary-foreground hover:bg-gold-primary/80'
                    : 'hover:bg-gold-primary/10 hover:text-gold-primary hover:border-gold-primary'
                }`}
                onClick={() => toggleSpecialization(spec)}
              >
                {spec}
              </Badge>
            ))}
          </div>
          {selectedSpecializations.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {selectedSpecializations.length} selected
            </p>
          )}
        </div>

        {/* Rating Filter */}
        <div>
          <h4 className="font-medium mb-3">Minimum Rating</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-gold-primary text-gold-primary" />
              <span className="text-sm font-medium">
                {minRating === 0 ? 'Any rating' : `${minRating}+ stars`}
              </span>
            </div>
            <Slider
              value={[minRating]}
              onValueChange={(value) => onMinRatingChange(value[0])}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Any</span>
              <span>5 stars</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};