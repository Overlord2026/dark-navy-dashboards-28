
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function MarketplaceFilters() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Price Range</h3>
          <div className="space-y-5">
            <Slider defaultValue={[5000]} max={10000} step={500} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$10,000+</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Provider Rating</h3>
          <div className="space-y-2">
            {[4, 3, 2].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox id={`rating-${rating}`} />
                <Label htmlFor={`rating-${rating}`} className="text-sm">
                  {rating}+ Stars
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Features</h3>
          <div className="space-y-2">
            {['Featured', 'New Listings', 'Special Offers'].map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox id={`feature-${feature}`} />
                <Label htmlFor={`feature-${feature}`} className="text-sm">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
