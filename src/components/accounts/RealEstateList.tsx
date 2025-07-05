import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Home } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRealEstate } from "@/hooks/useRealEstate";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const RealEstateList = () => {
  const { properties, loading, deleteProperty } = useRealEstate();
  const isMobile = useIsMobile();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleDelete = (id: string, name: string) => {
    setPropertyToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (propertyToDelete) {
      await deleteProperty(propertyToDelete.id);
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels = {
      'residence': 'Residence',
      'rental': 'Rental',
      'vacation': 'Vacation',
      'business': 'Business',
      'other': 'Other'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-sm text-muted-foreground">Loading properties...</div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-4">
        <p className={cn(
          "text-muted-foreground",
          isMobile ? "text-sm" : "text-base"
        )}>
          No real estate properties added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {properties.map((property) => (
        <div
          key={property.id}
          className={cn(
            "flex items-center justify-between p-3 border rounded-lg",
            isMobile ? "flex-col gap-2" : "flex-row"
          )}
        >
          <div className={cn(
            "flex items-start gap-3 flex-1",
            isMobile ? "w-full" : ""
          )}>
            <div className="mt-1">
              <Home className={cn(
                "text-primary",
                isMobile ? "h-4 w-4" : "h-5 w-5"
              )} />
            </div>
            <div className={cn(
              "flex-1",
              isMobile ? "text-center" : "text-left"
            )}>
              <div className={cn(
                "font-medium",
                isMobile ? "text-sm" : "text-base"
              )}>
                {property.name}
              </div>
              <div className={cn(
                "text-muted-foreground",
                isMobile ? "text-xs" : "text-sm"
              )}>
                {property.address}
              </div>
              <div className={cn(
                "text-muted-foreground",
                isMobile ? "text-xs" : "text-sm"
              )}>
                Type: {getPropertyTypeLabel(property.property_type)}
              </div>
            </div>
          </div>
          
          <div className={cn(
            "flex items-center gap-2",
            isMobile ? "w-full justify-between" : "justify-end"
          )}>
            <span className={cn(
              "font-semibold",
              isMobile ? "text-sm" : "text-base"
            )}>
              {formatCurrency(property.current_market_value)}
            </span>
            
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              className={cn(
                "p-2",
                isMobile ? "h-8 w-8" : "h-9 w-9"
              )}
              onClick={() => handleDelete(property.id, property.name)}
            >
              <Trash2 className={cn(
                isMobile ? "h-3 w-3" : "h-4 w-4"
              )} />
            </Button>
          </div>
        </div>
      ))}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{propertyToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Property
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};