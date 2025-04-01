
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
}

export const OfferingsList: React.FC<OfferingsListProps> = ({ offerings, categoryId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

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
    
    return matchesSearch && matchesType;
  });

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
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOfferings.length > 0 ? (
          filteredOfferings.map(offering => (
            <OfferingCard key={offering.id} offering={offering} categoryId={categoryId} />
          ))
        ) : (
          <div className="col-span-2 p-8 text-center border rounded-md">
            <h3 className="font-medium text-lg">No offerings match your criteria</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search filters</p>
            <Button variant="outline" className="mt-4" onClick={() => {
              setSearchTerm("");
              setFilterType("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
