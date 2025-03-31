
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { FamilyOfficeFilters } from "@/components/familyoffice/FamilyOfficeFilters";
import { FamilyOfficeList } from "@/components/familyoffice/FamilyOfficeList";
import { useFamilyOffices } from "@/hooks/useFamilyOffices";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function FamilyOfficeDirectory() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState({
    location: "",
    serviceArea: "",
    wealthTier: "",
    rating: 0
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const { familyOffices, isLoading } = useFamilyOffices();
  
  // Track search analytics
  useEffect(() => {
    if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
      if (searchTimeout) clearTimeout(searchTimeout);
      
      const timeout = setTimeout(() => {
        setSearchHistory(prev => {
          const newHistory = [searchQuery.trim(), ...prev].slice(0, 5);
          return newHistory;
        });
      }, 1000); // Save search after 1 second of inactivity
      
      setSearchTimeout(timeout);
    }
  }, [searchQuery]);
  
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    toast.success(`Filter updated: ${key} = ${value}`);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching family offices for:", query);
  };
  
  const clearFilters = () => {
    setFilters({
      location: "",
      serviceArea: "",
      wealthTier: "",
      rating: 0
    });
    toast.success("All filters cleared");
  };
  
  return (
    <ThreeColumnLayout title="Family Office Directory">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/marketplace" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> 
              Back to Marketplace
            </Link>
          </Button>
          
          <Button variant="outline" size="sm" asChild>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdJQxCS6WfzmfFN_ByTdkKrVCfHRmxQ5n7DDCFKlqz3MQ-8vA/viewform" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Submit Family Office
            </a>
          </Button>
        </div>
        
        <MarketplaceHeader 
          searchQuery={searchQuery}
          setSearchQuery={handleSearch}
          customTitle="Nationwide Family Office Directory"
          customDescription="Connect with the right Family Office for your wealth management needs"
        />
        
        {searchHistory.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center text-sm">
            <span className="text-muted-foreground">Recent searches:</span>
            {searchHistory.map((term) => (
              <Badge 
                key={term} 
                variant="outline" 
                className="cursor-pointer"
                onClick={() => setSearchQuery(term)}
              >
                {term}
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSearchHistory([])}>
              Clear history
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <FamilyOfficeFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onClearFilters={clearFilters}
            />
          </div>
          
          <div className="md:col-span-3">
            <FamilyOfficeList 
              searchQuery={searchQuery}
              filters={filters}
              familyOffices={familyOffices}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
