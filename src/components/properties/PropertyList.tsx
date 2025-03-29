
import React from "react";
import { Property } from "@/types/property";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2, 
  Home, 
  Building, 
  Umbrella, 
  Briefcase,
  DollarSign,
  CalendarClock 
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface PropertyListProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  onEdit, 
  onDelete 
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  const getPropertyIcon = (type: Property["type"]) => {
    switch(type) {
      case "primary":
        return <Home className="h-5 w-5 text-blue-500" />;
      case "vacation":
        return <Umbrella className="h-5 w-5 text-teal-500" />;
      case "rental":
        return <Building className="h-5 w-5 text-purple-500" />;
      case "business":
        return <Briefcase className="h-5 w-5 text-amber-500" />;
      default:
        return <Home className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPropertyTypeName = (type: Property["type"]) => {
    switch(type) {
      case "primary": return "Primary Residence";
      case "vacation": return "Vacation Property";
      case "rental": return "Rental Property";
      case "business": return "Business/Office";
      default: return "Property";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (properties.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-card">
        <h3 className="text-lg font-medium mb-2">No properties in your portfolio</h3>
        <p className="text-muted-foreground mb-4">
          Add your first property to start tracking your real estate investments
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card key={property.id} className={`overflow-hidden ${
          isLightTheme ? "hover:shadow-md" : "hover:border-primary/50"
        } transition-all`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getPropertyIcon(property.type)}
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10">
                  {getPropertyTypeName(property.type)}
                </span>
              </div>
            </div>
            <CardTitle className="mt-2">{property.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{property.address}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Current Value</p>
                  <p className="text-lg font-medium">{formatCurrency(property.currentValue)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Purchase Price</p>
                  <p className="text-lg font-medium">{formatCurrency(property.originalCost)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Ownership</p>
                <p className="text-sm">{property.ownership === 'joint' ? 'Joint' : 'Single'} - {property.owner}</p>
              </div>
              
              {property.rental && (
                <div className="border-t pt-3">
                  <div className="flex items-center space-x-1 mb-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <p className="text-sm font-medium">Rental Income</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly Income</p>
                      <p className="text-sm font-medium text-green-600">{formatCurrency(property.rental.monthlyIncome)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly Expenses</p>
                      <p className="text-sm font-medium text-red-600">{formatCurrency(property.rental.monthlyExpenses)}</p>
                    </div>
                  </div>
                  {property.rental.tenantName && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Current Tenant</p>
                      <p className="text-sm">{property.rental.tenantName}</p>
                    </div>
                  )}
                </div>
              )}
              
              {property.business && (
                <div className="border-t pt-3">
                  <div className="flex items-center space-x-1 mb-2">
                    <Briefcase className="h-4 w-4 text-amber-500" />
                    <p className="text-sm font-medium">Business Property</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Company</p>
                    <p className="text-sm">{property.business.companyName}</p>
                  </div>
                  <div className="mt-1">
                    <p className="text-xs text-muted-foreground">Annual Expenses</p>
                    <p className="text-sm">{formatCurrency(property.business.annualExpenses)}</p>
                  </div>
                </div>
              )}
              
              {property.improvements.length > 0 && (
                <div className="border-t pt-3">
                  <div className="flex items-center space-x-1 mb-2">
                    <CalendarClock className="h-4 w-4 text-blue-500" />
                    <p className="text-sm font-medium">Improvements</p>
                  </div>
                  <div className="space-y-1">
                    {property.improvements.slice(0, 2).map((improvement, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{improvement.description}</span>
                        <span>{formatCurrency(improvement.cost)}</span>
                      </div>
                    ))}
                    {property.improvements.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{property.improvements.length - 2} more improvements
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex space-x-2 w-full">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onEdit(property)}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-destructive hover:bg-destructive/10" 
                onClick={() => onDelete(property.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
