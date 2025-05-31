
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import { OfferingCard } from "./OfferingCard";
import type { InvestmentOffering } from "@/hooks/useInvestmentData";

interface OfferingsListProps {
  offerings: (InvestmentOffering & {
    id?: string | number;
    minimumInvestment?: string;
    lockupPeriod?: string;
  })[];
  categoryId: string;
  isFullView?: boolean;
  onLike?: (assetName: string) => void;
}

export const OfferingsList: React.FC<OfferingsListProps> = ({ 
  offerings, 
  categoryId, 
  isFullView = false,
  onLike
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [minimumFilter, setMinimumFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name-asc");

  const filteredOfferings = offerings.filter(offering => {
    const matchesSearch = searchTerm === "" || 
      offering.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offering.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offering.firm.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || 
      (filterType === "featured" && offering.featured);
    
    let matchesMinimum = true;
    if (minimumFilter !== "all") {
      const minimumInvestment = offering.minimum_investment || offering.minimumInvestment || "0";
      const amount = parseInt(minimumInvestment.replace(/[^0-9]/g, ''));
      if (minimumFilter === "under25k" && amount > 25000) matchesMinimum = false;
      if (minimumFilter === "25k-100k" && (amount < 25000 || amount > 100000)) matchesMinimum = false;
      if (minimumFilter === "100k-250k" && (amount < 100000 || amount > 250000)) matchesMinimum = false;
      if (minimumFilter === "250k-1m" && (amount < 250000 || amount > 1000000)) matchesMinimum = false;
      if (minimumFilter === "over1m" && amount < 1000000) matchesMinimum = false;
    }
    
    return matchesSearch && matchesType && matchesMinimum;
  });

  // Sort filtered offerings
  const sortedOfferings = [...filteredOfferings].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    if (sortBy === "min-asc") {
      const aMin = a.minimum_investment || a.minimumInvestment || "0";
      const bMin = b.minimum_investment || b.minimumInvestment || "0";
      return parseInt(aMin.replace(/[^0-9]/g, '')) - parseInt(bMin.replace(/[^0-9]/g, ''));
    }
    if (sortBy === "min-desc") {
      const aMin = a.minimum_investment || a.minimumInvestment || "0";
      const bMin = b.minimum_investment || b.minimumInvestment || "0";
      return parseInt(bMin.replace(/[^0-9]/g, '')) - parseInt(aMin.replace(/[^0-9]/g, ''));
    }
    if (sortBy === "perf-desc") {
      const aPerf = parseFloat((a.performance || "0").replace('%', '').replace(/[^0-9.-]/g, ''));
      const bPerf = parseFloat((b.performance || "0").replace('%', '').replace(/[^0-9.-]/g, ''));
      return bPerf - aPerf;
    }
    if (sortBy === "perf-asc") {
      const aPerf = parseFloat((a.performance || "0").replace('%', '').replace(/[^0-9.-]/g, ''));
      const bPerf = parseFloat((b.performance || "0").replace('%', '').replace(/[^0-9.-]/g, ''));
      return aPerf - bPerf;
    }
    return 0;
  });

  const displayedOfferings = isFullView ? sortedOfferings : sortedOfferings.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Available Offerings</h2>
          <p className="text-sm text-muted-foreground">Current investment opportunities</p>
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="min-asc">Min Investment (Low-High)</SelectItem>
              <SelectItem value="min-desc">Min Investment (High-Low)</SelectItem>
              <SelectItem value="perf-desc">Performance (High-Low)</SelectItem>
              <SelectItem value="perf-asc">Performance (Low-High)</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters {showFilters ? "▲" : "▼"}
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <div className="p-4 border rounded-md bg-gray-50 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Search</p>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, firm, or keywords"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <p className="text-sm font-medium mb-2">Type</p>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="featured">Featured Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-64">
              <p className="text-sm font-medium mb-2">Minimum Investment</p>
              <Select value={minimumFilter} onValueChange={setMinimumFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Minimums" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Minimums</SelectItem>
                  <SelectItem value="under25k">Under $25,000</SelectItem>
                  <SelectItem value="25k-100k">$25,000 - $100,000</SelectItem>
                  <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                  <SelectItem value="250k-1m">$250,000 - $1,000,000</SelectItem>
                  <SelectItem value="over1m">Over $1,000,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedOfferings.length > 0 ? (
          displayedOfferings.map(offering => (
            <OfferingCard 
              key={offering.id} 
              offering={offering} 
            />
          ))
        ) : (
          <div className="col-span-2 p-8 text-center border rounded-md">
            <h3 className="font-medium text-lg">No offerings match your criteria</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search filters</p>
            <Button variant="outline" className="mt-4" onClick={() => {
              setSearchTerm("");
              setFilterType("all");
              setMinimumFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      
      {!isFullView && filteredOfferings.length > 4 && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" asChild>
            <Link to={`/investments/alternative/${categoryId}/view-all`}>
              View All Offerings ({filteredOfferings.length})
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};
