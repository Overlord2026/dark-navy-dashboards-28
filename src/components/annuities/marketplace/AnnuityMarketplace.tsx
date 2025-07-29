import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Award, RefreshCw, Star, Eye } from "lucide-react";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { FeatureAccessIndicator } from "@/components/navigation/FeatureAccessIndicator";

export const AnnuityMarketplace = () => {
  const { checkFeatureAccessByKey } = useFeatureAccess();
  const hasMarketplaceAccess = checkFeatureAccessByKey('advisor_marketplace');

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("fiduciary");

  const mockProducts = [
    {
      id: "1",
      name: "DPL Income Focus Plus",
      carrier: "DPL Financial Partners",
      type: "Fixed",
      currentRate: "4.85%",
      fiduciaryScore: 98,
      minInvestment: 25000,
      fees: 0.75,
      features: ["Commission-free", "RIA-friendly", "Transparent pricing"],
      rating: 4.9,
      reviews: 156
    }
  ];

  const getFiduciaryBadge = (score: number) => {
    if (score >= 95) return { label: "Fiduciary Gold", color: "bg-yellow-500" };
    if (score >= 85) return { label: "Fiduciary Silver", color: "bg-gray-400" };
    return { label: "Review Required", color: "bg-red-500" };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Annuity Marketplace</h1>
          <p className="text-muted-foreground">
            Live rates and fiduciary scoring from top providers. Updated daily.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Rates
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Search & Filter Products</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Input
              placeholder="Search products or carriers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Product Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="variable">Variable</SelectItem>
                <SelectItem value="index">Index</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiduciary">Fiduciary Score</SelectItem>
                <SelectItem value="fees">Lowest Fees</SelectItem>
                <SelectItem value="rate">Highest Rate</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-6">
        {mockProducts.map((product) => {
          const badge = getFiduciaryBadge(product.fiduciaryScore);
          
          return (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <FeatureAccessIndicator 
                        feature="advisor_marketplace"
                        className="ml-auto"
                      />
                    </div>
                    <CardDescription>{product.carrier} • {product.type} Annuity</CardDescription>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{product.currentRate}</div>
                    <Badge className={`${badge.color} text-white text-xs mt-1`}>
                      <Award className="h-3 w-3 mr-1" />
                      {badge.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button className="flex-1" size="sm" disabled={!hasMarketplaceAccess}>
                    Request Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};