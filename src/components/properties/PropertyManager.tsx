
import React, { useState, useEffect } from "react";
import { PropertyList } from "./PropertyList";
import { PropertyForm } from "./PropertyForm";
import { PropertySummary } from "./PropertySummary";
import { PropertyManagerHeader } from "./PropertyManagerHeader";
import { PropertyTypeHeader } from "./PropertyTypeHeader";
import { Property, PropertyValuation } from "@/types/property";
import { toast } from "sonner";
import { useNetWorth } from "@/context/NetWorthContext";
import { useSupabaseProperties } from "@/hooks/useSupabaseProperties";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PropertyManagerProps {
  initialFilter?: string | null;
}

export const PropertyManager: React.FC<PropertyManagerProps> = ({ initialFilter = null }) => {
  const { syncPropertiesToAssets } = useNetWorth();
  const { isAuthenticated } = useAuth();
  const { properties, loading, addProperty, updateProperty, deleteProperty } = useSupabaseProperties();
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(initialFilter);
  const [newPropertyData, setNewPropertyData] = useState<{address?: string, valuation?: PropertyValuation}>({});
  
  useEffect(() => {
    if (initialFilter) {
      setActiveFilter(initialFilter);
    }
  }, [initialFilter]);

  useEffect(() => {
    syncPropertiesToAssets(properties);
  }, [properties, syncPropertiesToAssets]);

  const getFilteredProperties = () => {
    if (!activeFilter) return properties;
    
    switch(activeFilter) {
      case 'buildings':
        return properties.filter(p => p.type === 'business');
      case 'rentals':
        return properties.filter(p => p.type === 'rental');
      case 'vacation':
        return properties.filter(p => p.type === 'vacation');
      case 'locations':
        return properties; // All properties have locations
      case 'investments':
        return properties.filter(p => p.type === 'business' || p.currentValue > p.originalCost * 1.1);
      default:
        return properties;
    }
  };

  const handleAddProperty = async (property: Omit<Property, "id">) => {
    try {
      await addProperty(property);
      setShowForm(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleUpdateProperty = async (updatedProperty: Property) => {
    try {
      await updateProperty(updatedProperty);
      setEditingProperty(null);
      setShowForm(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await deleteProperty(id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowForm(true);
  };
  
  const handlePropertyUpdate = async (updatedProperty: Property) => {
    try {
      await updateProperty(updatedProperty);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const filteredProperties = getFilteredProperties();
  
  const getFilterTitle = () => {
    if (!activeFilter) return "Your Property Portfolio";
    
    switch(activeFilter) {
      case 'buildings':
        return "Business Properties";
      case 'rentals':
        return "Rental Properties"; 
      case 'vacation':
        return "Vacation Properties";
      case 'locations':
        return "Property Locations";
      case 'investments':
        return "Investment Properties";
      default:
        return "Your Property Portfolio";
    }
  };

  const handleAddPropertyClick = () => {
    setEditingProperty(null);
    setNewPropertyData({});
    setShowForm(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to view your property portfolio.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full px-2 sm:px-4 md:px-6">
      <PropertyManagerHeader 
        filterTitle={getFilterTitle()} 
        onAddProperty={handleAddPropertyClick} 
      />

      <PropertySummary properties={filteredProperties} />

      <PropertyList 
        properties={filteredProperties}
        onEdit={handleEditProperty}
        onDelete={handleDeleteProperty}
        onPropertyUpdate={handlePropertyUpdate}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? "Edit Property" : "Add New Property"}
            </DialogTitle>
          </DialogHeader>
          <PropertyForm 
            onSubmit={editingProperty ? handleUpdateProperty : handleAddProperty} 
            property={editingProperty}
            initialData={newPropertyData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
