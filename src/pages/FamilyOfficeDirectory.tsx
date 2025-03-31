
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { FamilyOfficeFilters } from "@/components/familyoffice/FamilyOfficeFilters";
import { FamilyOfficeList } from "@/components/familyoffice/FamilyOfficeList";
import { useFamilyOffices } from "@/hooks/useFamilyOffices";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, FilterX, Search, History } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [showFilters, setShowFilters] = useState(false);
  
  const { familyOffices, isLoading } = useFamilyOffices();
  const isMobile = useIsMobile();
  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Searching for "${searchQuery}"`);
  };
  
  return (
    <ThreeColumnLayout title="Family Office Directory">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild className="self-start">
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
        
        <form onSubmit={handleSubmit}>
          <MarketplaceHeader 
            searchQuery={searchQuery}
            setSearchQuery={handleSearch}
            customTitle="Nationwide Family Office Directory"
            customDescription="Connect with the right Family Office for your wealth management needs"
          />
        </form>
        
        {searchHistory.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <History className="h-3.5 w-3.5" />
              Recent:
            </span>
            {searchHistory.map((term) => (
              <Badge 
                key={term} 
                variant="outline" 
                className="cursor-pointer transition-colors hover:bg-muted"
                onClick={() => setSearchQuery(term)}
              >
                {term}
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-6 px-2" 
              onClick={() => setSearchHistory([])}
            >
              Clear
            </Button>
          </div>
        )}

        {isMobile && (
          <div className="flex justify-between items-center mb-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterX className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            
            {Object.values(filters).some(value => value !== "" && value !== 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`${isMobile && !showFilters ? 'hidden' : ''} md:col-span-1`}>
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
