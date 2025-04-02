
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property, PropertyType } from "@/types/property";
import { Edit, Trash2, Home, Building, Umbrella, Briefcase, RefreshCw, ExternalLink } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { getPropertyValuation } from "@/services/propertyValuationService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

interface PropertyListProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onPropertyUpdate: (property: Property) => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  onEdit, 
  onDelete,
  onPropertyUpdate
}) => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const isLightTheme = theme === "light";
  
  const [loadingValuation, setLoadingValuation] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

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

  const handleLookupValue = async (property: Property) => {
    setLoadingValuation(property.id);
    try {
      const valuation = await getPropertyValuation(property.address);
      
      // Update the property with new valuation data
      const updatedProperty = {
        ...property,
        valuation,
        currentValue: valuation.estimatedValue  // Update the current value with the estimated value
      };
      
      onPropertyUpdate(updatedProperty);
      
      toast({
        title: "Property Valuation Updated",
        description: `Estimated value: ${formatCurrency(valuation.estimatedValue)} (Source: ${valuation.source})`,
      });
    } catch (error) {
      toast({
        title: "Valuation Failed",
        description: "Could not retrieve property valuation at this time.",
        variant: "destructive"
      });
      console.error("Valuation error:", error);
    } finally {
      setLoadingValuation(null);
    }
  };
  
  const openZillowLink = (address: string) => {
    // Format the address for a Zillow search URL
    const formattedAddress = encodeURIComponent(address);
    window.open(`https://www.zillow.com/homes/${formattedAddress}_rb/`, '_blank');
  };
  
  // Group properties by type
  const groupedProperties = properties.reduce((acc, property) => {
    if (!acc[property.type]) {
      acc[property.type] = [];
    }
    acc[property.type].push(property);
    return acc;
  }, {} as Record<PropertyType, Property[]>);
  
  // Order of property types to display
  const propertyTypeOrder: PropertyType[] = ["primary", "vacation", "rental", "business"];

  return (
    <div className="space-y-8">
      {properties.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">No properties added yet.</p>
          </CardContent>
        </Card>
      ) : (
        propertyTypeOrder.map(type => {
          const typeProperties = groupedProperties[type] || [];
          if (typeProperties.length === 0) return null;
          
          return (
            <div key={type} className="space-y-4">
              <h2 className="text-xl font-semibold capitalize flex items-center">
                {getPropertyTypeIcon(type)}
                <span className="ml-2">{getPropertyTypeName(type)}</span>
                <span className="text-sm text-gray-400 ml-2">({typeProperties.length})</span>
              </h2>
              
              {typeProperties.map((property) => (
                <Card 
                  key={property.id}
                  className="bg-gray-900 border-gray-800 hover:bg-gray-800/50 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{property.name}</h3>
                          </div>
                          <p className="text-muted-foreground text-sm mt-1">{property.address}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Original Purchase</p>
                              <p className="font-medium">{formatCurrency(property.originalCost)}</p>
                              <p className="text-xs text-muted-foreground mt-1">{property.purchaseDate}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">Current Value</p>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-5 w-5"
                                        onClick={() => handleLookupValue(property)}
                                        disabled={loadingValuation === property.id}
                                      >
                                        {loadingValuation === property.id ? (
                                          <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />
                                        ) : (
                                          <RefreshCw className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Update valuation</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-5 w-5 text-blue-500"
                                        onClick={() => openZillowLink(property.address)}
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View on Zillow</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <p className="font-medium">{formatCurrency(property.currentValue)}</p>
                              {property.valuation && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Updated: {property.valuation.lastUpdated} 
                                  <span className={`ml-2 ${
                                    property.valuation.confidence === 'high' 
                                      ? 'text-green-500' 
                                      : property.valuation.confidence === 'medium' 
                                      ? 'text-yellow-500' 
                                      : 'text-red-500'
                                  }`}>
                                    {property.valuation.confidence.charAt(0).toUpperCase() + property.valuation.confidence.slice(1)} confidence
                                  </span>
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Ownership</p>
                              <p className="font-medium capitalize">{property.ownership}</p>
                              <p className="text-xs text-muted-foreground mt-1">{property.owner}</p>
                            </div>
                          </div>
                          
                          {property.type === "rental" && property.rental && (
                            <div className="mt-4 p-3 rounded-md bg-purple-900/20 border border-purple-700/30">
                              <h4 className="text-sm font-medium text-purple-300">Rental Details</h4>
                              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
                                <div>
                                  <p className="text-xs text-muted-foreground">Monthly Income</p>
                                  <p className="font-medium text-green-400">{formatCurrency(property.rental.monthlyIncome)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Monthly Expenses</p>
                                  <p className="font-medium text-red-400">{formatCurrency(property.rental.monthlyExpenses)}</p>
                                </div>
                                {property.rental.tenantName && (
                                  <div className="col-span-2">
                                    <p className="text-xs text-muted-foreground">Current Tenant</p>
                                    <p className="font-medium">{property.rental.tenantName}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {property.rental.occupiedSince && `Since: ${property.rental.occupiedSince}`} 
                                      {property.rental.leaseEnd && ` • Lease ends: ${property.rental.leaseEnd}`}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {property.type === "business" && property.business && (
                            <div className="mt-4 p-3 rounded-md bg-amber-900/20 border border-amber-700/30">
                              <h4 className="text-sm font-medium text-amber-300">Business Details</h4>
                              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
                                <div>
                                  <p className="text-xs text-muted-foreground">Company Name</p>
                                  <p className="font-medium">{property.business.companyName}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Usage Type</p>
                                  <p className="font-medium">{property.business.usageType}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-xs text-muted-foreground">Annual Expenses</p>
                                  <p className="font-medium text-red-400">{formatCurrency(property.business.annualExpenses)}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 mt-4 md:mt-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 md:flex-auto"
                          onClick={() => onEdit(property)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 md:flex-auto text-red-500 hover:text-red-400"
                          onClick={() => setSelectedProperty(property)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    {property.improvements.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Improvements & Renovations</h4>
                        <div className="space-y-2">
                          {property.improvements.map((improvement, index) => (
                            <div 
                              key={index} 
                              className="text-sm p-2 rounded-md bg-gray-800 flex justify-between"
                            >
                              <div className="flex-1">
                                <span>{improvement.description}</span>
                                <span className="text-xs text-muted-foreground ml-2">({improvement.date})</span>
                              </div>
                              <span className="font-medium">{formatCurrency(improvement.cost)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        })
      )}
      
      <Dialog open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProperty?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProperty(null)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedProperty) {
                  onDelete(selectedProperty.id);
                  setSelectedProperty(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
