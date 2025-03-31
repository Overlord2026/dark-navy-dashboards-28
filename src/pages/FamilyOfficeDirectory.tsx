
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { FamilyOfficeFilters } from "@/components/familyoffice/FamilyOfficeFilters";
import { FamilyOfficeList } from "@/components/familyoffice/FamilyOfficeList";
import { useFamilyOffices } from "@/hooks/useFamilyOffices";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function FamilyOfficeDirectory() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState({
    location: "",
    serviceArea: "",
    wealthTier: "",
    rating: 0
  });
  
  const { familyOffices, isLoading } = useFamilyOffices();
  
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
        </div>
        
        <MarketplaceHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          customTitle="Nationwide Family Office Directory"
          customDescription="Connect with the right Family Office for your wealth management needs"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <FamilyOfficeFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
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
