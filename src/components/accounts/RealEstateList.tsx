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
    <div className={cn(
      "grid gap-4",
      isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-1"
    )}>
      {properties.map((property) => (
        <div
          key={property.id}
          className="group relative overflow-hidden rounded-xl border border-border/50 bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/20"
        >
          {/* Property Header */}
          <div className="relative p-5 pb-4 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50" />
            <div className="relative flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-200">
                  <Home className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                    {property.name}
                  </h3>
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {getPropertyTypeLabel(property.property_type)}
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                onClick={() => handleDelete(property.id, property.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Property Details */}
          <div className="p-5 pt-4">
            <div className="space-y-3">
              {/* Address */}
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {property.address}
                </p>
              </div>

              {/* Market Value */}
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <span className="text-sm font-medium text-muted-foreground">
                  Market Value
                </span>
                <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                  {formatCurrency(property.current_market_value)}
                </span>
              </div>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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