
import React from "react";
import { Home, Building, Umbrella, Briefcase } from "lucide-react";
import { PropertyType } from "@/types/property";

interface PropertyTypeHeaderProps {
  type: PropertyType;
  count: number;
}

export const PropertyTypeHeader: React.FC<PropertyTypeHeaderProps> = ({ type, count }) => {
  const getPropertyTypeIcon = (type: PropertyType) => {
    switch (type) {
      case "primary":
        return <Home className="h-5 w-5 text-blue-500" />;
      case "vacation":
        return <Umbrella className="h-5 w-5 text-teal-500" />;
      case "rental":
        return <Building className="h-5 w-5 text-purple-500" />;
      case "business":
        return <Briefcase className="h-5 w-5 text-amber-500" />;
      default:
        return <Home className="h-5 w-5" />;
    }
  };
  
  const getPropertyTypeName = (type: PropertyType) => {
    switch (type) {
      case "primary":
        return "Primary Residence";
      case "vacation":
        return "Vacation Properties";
      case "rental":
        return "Rental Properties";
      case "business":
        return "Business Properties";
      default:
        return "Properties";
    }
  };

  return (
    <h2 className="text-xl font-semibold capitalize flex items-center">
      {getPropertyTypeIcon(type)}
      <span className="ml-2">{getPropertyTypeName(type)}</span>
      <span className="text-sm text-gray-400 ml-2">({count})</span>
    </h2>
  );
};
