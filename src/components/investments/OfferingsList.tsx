
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import { OfferingCard } from "./OfferingCard";

interface Strategy {
  overview: string;
  approach: string;
  target: string;
  stage: string;
  geography: string;
  sectors: string[];
  expectedReturn: string;
  benchmarks: string[];
}

interface Offering {
  id: number;
  name: string;
  description: string;
  minimumInvestment: string;
  performance: string;
  lockupPeriod: string;
  lockUp: string;
  firm: string;
  tags: string[];
  strategy: Strategy;
  platform?: string;
  category?: string;
  investorQualification?: string;
  liquidity?: string;
  subscriptions?: string;
}

interface OfferingsListProps {
  offerings: Offering[];
  categoryId: string;
  isFullView?: boolean;
}

export const OfferingsList: React.FC<OfferingsListProps> = ({ offerings, categoryId, isFullView = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [minimumFilter, setMinimumFilter] = useState<string>("all");

  const filteredOfferings = offerings.filter(offering => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      offering.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offering.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offering.firm.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = filterType === "all" || 
      (filterType === "accredited" && offering.investorQualification?.includes("Accredited")) ||
      (filterType === "qualified" && offering.investorQualification?.includes("Qualified")) ||
      (filterType === "non-accredited" && offering.investorQualification?.includes("Non-Accredited"));
    
    // Minimum investment filter
    let matchesMinimum = true;
    if (minimumFilter !== "all") {
      const amount = parseInt(offering.minimumInvestment.replace(/[^0-9]/g, ''));
      if (minimumFilter === "under25k" && amount > 25000) matchesMinimum = false;
      if (minimumFilter === "25k-100k" && (amount < 25000 || amount > 100000)) matchesMinimum = false;
      if (minimumFilter === "100k-250k" && (amount < 100000 || amount > 250000)) matchesMinimum = false;
      if (minimumFilter === "250k-1m" && (amount < 250000 || amount > 1000000)) matchesMinimum = false;
      if (minimumFilter === "over1m" && amount < 1000000) matchesMinimum = false;
    }
    
    return matchesSearch && matchesType && matchesMinimum;
  });

  // For the initial view, show only 4 offerings unless in full view mode
  const displayedOfferings = isFullView ? filteredOfferings : filteredOfferings.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Available Offerings</h2>
          <p className="text-sm text-muted-foreground">Current investment opportunities</p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          Filters {showFilters ? "▲" : "▼"}
        </Button>
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
              <p className="text-sm font-medium mb-2">Investor Type</p>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Investor Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Investor Types</SelectItem>
                  <SelectItem value="accredited">Accredited Investor</SelectItem>
                  <SelectItem value="qualified">Qualified Purchaser/Client</SelectItem>
                  <SelectItem value="non-accredited">Non-Accredited</SelectItem>
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
            <OfferingCard key={offering.id} offering={offering} categoryId={categoryId} />
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
