
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Home, DollarSign, Palmtree, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PropertyTypeHeaderProps {
  activeFilter: string | null;
}

export const PropertyTypeHeader: React.FC<PropertyTypeHeaderProps> = ({ activeFilter }) => {
  const navigate = useNavigate();

  const handleFilterChange = (value: string) => {
    if (value === "all") {
      navigate("/client-properties");
    } else {
      navigate(`/client-properties?filter=${value}`);
    }
  };

  return (
    <div className="mb-6 w-full overflow-x-auto">
      <Tabs
        value={activeFilter || "all"}
        onValueChange={handleFilterChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger 
            value="all"
            className="flex items-center gap-2 py-2 px-3 data-[state=active]:bg-primary/10"
          >
            <Home className="h-4 w-4" />
            <span>All Properties</span>
          </TabsTrigger>
          <TabsTrigger 
            value="rentals"
            className="flex items-center gap-2 py-2 px-3 data-[state=active]:bg-primary/10"
          >
            <DollarSign className="h-4 w-4" />
            <span>Rental</span>
          </TabsTrigger>
          <TabsTrigger 
            value="vacation"
            className="flex items-center gap-2 py-2 px-3 data-[state=active]:bg-primary/10"
          >
            <Palmtree className="h-4 w-4" />
            <span>Vacation</span>
          </TabsTrigger>
          <TabsTrigger 
            value="buildings"
            className="flex items-center gap-2 py-2 px-3 data-[state=active]:bg-primary/10"
          >
            <Building className="h-4 w-4" />
            <span>Business</span>
          </TabsTrigger>
          <TabsTrigger 
            value="investments"
            className="flex items-center gap-2 py-2 px-3 data-[state=active]:bg-primary/10"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Investments</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
