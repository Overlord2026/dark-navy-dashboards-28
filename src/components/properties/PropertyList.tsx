
import React, { useState } from "react";
import { Property } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2, 
  Building, 
  Home, 
  Palmtree, 
  DollarSign,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
  const [expandedPropertyId, setExpandedPropertyId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  const handleExpand = (propertyId: string) => {
    setExpandedPropertyId(expandedPropertyId === propertyId ? null : propertyId);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPropertyIcon = (type: string) => {
    switch(type) {
      case 'primary':
        return <Home className="h-5 w-5 text-blue-500" />;
      case 'vacation':
        return <Palmtree className="h-5 w-5 text-green-500" />;
      case 'business':
        return <Building className="h-5 w-5 text-purple-500" />;
      case 'rental':
        return <DollarSign className="h-5 w-5 text-yellow-500" />;
      default:
        return <Home className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPropertyTypeLabel = (type: string): string => {
    switch(type) {
      case 'primary': return 'Primary Residence';
      case 'vacation': return 'Vacation Property';
      case 'rental': return 'Rental Property';
      case 'business': return 'Business Property';
      default: return 'Property';
    }
  };

  const confirmDelete = (property: Property) => {
    setPropertyToDelete(property);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (propertyToDelete) {
      onDelete(propertyToDelete.id);
      setIsDeleteConfirmOpen(false);
      setPropertyToDelete(null);
    }
  };

  const calculateAppreciation = (originalCost: number, currentValue: number): number => {
    return ((currentValue - originalCost) / originalCost) * 100;
  };

  return (
    <div className="space-y-4">
      {properties.length === 0 ? (
        <Card className="p-6 text-center bg-muted/30">
          <CardContent className="pt-6">
            <div className="mb-4">
              <Building className="mx-auto h-12 w-12 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-medium mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-4">
              You haven't added any properties to your portfolio yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden bg-card hover:bg-card/90 transition-colors">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {getPropertyIcon(property.type)}
                    <div>
                      <h3 className="font-medium text-lg">{property.name}</h3>
                      <p className="text-sm text-muted-foreground">{getPropertyTypeLabel(property.type)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sm:w-auto justify-center sm:justify-start"
                      onClick={() => handleExpand(property.id)}
                    >
                      {expandedPropertyId === property.id ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Collapse</span>
                          <span className="sm:hidden">Hide</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Details</span>
                          <span className="sm:hidden">View</span>
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(property)}
                      className="w-full sm:w-auto justify-center"
                    >
                      <Edit className="h-3.5 w-3.5 sm:mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => confirmDelete(property)}
                      className="w-full sm:w-auto justify-center text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:mr-1" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="border rounded-md p-3">
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="text-lg font-medium">{formatCurrency(property.currentValue)}</p>
                    <p className="text-xs text-green-500">
                      {calculateAppreciation(property.originalCost, property.currentValue).toFixed(1)}% appreciation
                    </p>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="text-sm text-muted-foreground">Original Cost</p>
                    <p className="text-lg font-medium">{formatCurrency(property.originalCost)}</p>
                    <p className="text-xs text-muted-foreground">Purchased {property.purchaseDate}</p>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="text-sm text-muted-foreground">Ownership</p>
                    <p className="text-lg font-medium capitalize">{property.ownership}</p>
                    <p className="text-xs text-muted-foreground truncate">{property.owner}</p>
                  </div>
                </div>

                {expandedPropertyId === property.id && (
                  <div className="mt-4 border-t pt-4">
                    <div className="mb-4">
                      <h4 className="text-md font-medium mb-2">Property Details</h4>
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                    </div>
                    
                    {property.rental && (
                      <div className="mb-4">
                        <h4 className="text-md font-medium mb-2">Rental Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="border rounded-md p-3">
                            <p className="text-sm text-muted-foreground">Monthly Income</p>
                            <p className="text-lg font-medium text-green-600">{formatCurrency(property.rental.monthlyIncome)}</p>
                          </div>
                          <div className="border rounded-md p-3">
                            <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                            <p className="text-lg font-medium text-red-500">{formatCurrency(property.rental.monthlyExpenses)}</p>
                          </div>
                          <div className="border rounded-md p-3">
                            <p className="text-sm text-muted-foreground">Net Monthly</p>
                            <p className="text-lg font-medium">{formatCurrency(property.rental.monthlyIncome - property.rental.monthlyExpenses)}</p>
                          </div>
                        </div>
                        {property.rental.tenantName && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Current tenant:</span> {property.rental.tenantName}
                          </div>
                        )}
                        {property.rental.leaseEnd && (
                          <div className="mt-1 text-sm">
                            <span className="text-muted-foreground">Lease ends:</span> {property.rental.leaseEnd}
                          </div>
                        )}
                      </div>
                    )}

                    {property.business && (
                      <div className="mb-4">
                        <h4 className="text-md font-medium mb-2">Business Property Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="border rounded-md p-3">
                            <p className="text-sm text-muted-foreground">Company Name</p>
                            <p className="text-lg font-medium">{property.business.companyName}</p>
                          </div>
                          <div className="border rounded-md p-3">
                            <p className="text-sm text-muted-foreground">Annual Expenses</p>
                            <p className="text-lg font-medium text-red-500">{formatCurrency(property.business.annualExpenses)}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Usage:</span> {property.business.usageType}
                        </div>
                      </div>
                    )}

                    {property.improvements && property.improvements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-md font-medium mb-2">Improvements</h4>
                        <div className="border rounded-md divide-y">
                          {property.improvements.map((improvement, index) => (
                            <div key={index} className="p-3 flex justify-between items-center">
                              <div>
                                <p className="font-medium">{improvement.description}</p>
                                <p className="text-sm text-muted-foreground">{improvement.date}</p>
                              </div>
                              <p className="font-medium">{formatCurrency(improvement.cost)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {propertyToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete Property</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
