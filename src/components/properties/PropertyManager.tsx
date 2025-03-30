
import React, { useState, useEffect } from "react";
import { PropertyList } from "./PropertyList";
import { PropertyForm } from "./PropertyForm";
import { PropertySummary } from "./PropertySummary";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Property } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { useNetWorth } from "@/context/NetWorthContext";

export const PropertyManager = () => {
  const { toast } = useToast();
  const { syncPropertiesToAssets } = useNetWorth();
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([
    {
      id: "prop1",
      name: "Main Residence",
      type: "primary",
      address: "123 Main St, Boston, MA 02108",
      ownership: "single",
      owner: "John Doe",
      purchaseDate: "2018-05-15",
      originalCost: 450000,
      currentValue: 520000,
      improvements: [
        { description: "Kitchen Renovation", date: "2020-07-10", cost: 35000 },
        { description: "Bathroom Update", date: "2021-03-22", cost: 15000 }
      ]
    },
    {
      id: "prop2",
      name: "Beach House",
      type: "vacation",
      address: "45 Ocean Dr, Cape Cod, MA 02635",
      ownership: "joint",
      owner: "John & Jane Doe",
      purchaseDate: "2019-08-20",
      originalCost: 380000,
      currentValue: 450000,
      improvements: [
        { description: "Deck Expansion", date: "2021-05-15", cost: 20000 }
      ]
    },
    {
      id: "prop3",
      name: "Downtown Apartment",
      type: "rental",
      address: "789 City Ave, Boston, MA 02116",
      ownership: "single",
      owner: "John Doe",
      purchaseDate: "2017-03-10",
      originalCost: 320000,
      currentValue: 385000,
      improvements: [
        { description: "New Flooring", date: "2020-02-15", cost: 12000 }
      ],
      rental: {
        monthlyIncome: 2800,
        monthlyExpenses: 950,
        occupiedSince: "2020-01-01",
        leaseEnd: "2023-12-31",
        tenantName: "Sarah Johnson"
      }
    },
    {
      id: "prop4",
      name: "Main Office",
      type: "business",
      address: "567 Commerce St, Cambridge, MA 02142",
      ownership: "joint",
      owner: "Doe Family LLC",
      purchaseDate: "2016-11-05",
      originalCost: 550000,
      currentValue: 680000,
      improvements: [
        { description: "HVAC Upgrade", date: "2019-08-10", cost: 45000 },
        { description: "Interior Renovation", date: "2020-11-15", cost: 60000 }
      ],
      business: {
        companyName: "Doe Consulting",
        usageType: "Office Space",
        annualExpenses: 24000
      }
    },
    {
      id: "prop5",
      name: "Vacation Condo",
      type: "vacation",
      address: "123 Beachfront Ave, Miami, FL 33139",
      ownership: "single",
      owner: "John Doe",
      purchaseDate: "2020-01-15",
      originalCost: 420000,
      currentValue: 490000,
      improvements: [
        { description: "New Appliances", date: "2021-06-20", cost: 15000 }
      ]
    },
    {
      id: "prop6",
      name: "Retail Space",
      type: "business",
      address: "789 Market St, San Francisco, CA 94103",
      ownership: "llc",
      owner: "Doe Ventures LLC",
      purchaseDate: "2019-05-10",
      originalCost: 750000,
      currentValue: 850000,
      improvements: [
        { description: "Storefront Renovation", date: "2021-02-15", cost: 65000 }
      ],
      business: {
        companyName: "Boutique Retail",
        usageType: "Retail Space",
        annualExpenses: 38000
      }
    }
  ]);

  // Sync properties with net worth context whenever they change
  useEffect(() => {
    syncPropertiesToAssets(properties);
  }, [properties, syncPropertiesToAssets]);

  const handleAddProperty = (property: Omit<Property, "id">) => {
    const newProperty = {
      ...property,
      id: `prop${Date.now()}`
    };
    
    setProperties([...properties, newProperty]);
    setShowForm(false);
    
    toast({
      title: "Property Added",
      description: `${property.name} has been added to your portfolio.`,
    });
  };

  const handleUpdateProperty = (updatedProperty: Property) => {
    setProperties(
      properties.map(prop => 
        prop.id === updatedProperty.id ? updatedProperty : prop
      )
    );
    setEditingProperty(null);
    setShowForm(false);
    
    toast({
      title: "Property Updated",
      description: `${updatedProperty.name} has been updated successfully.`,
    });
  };

  const handleDeleteProperty = (id: string) => {
    const propertyToDelete = properties.find(prop => prop.id === id);
    
    setProperties(properties.filter(prop => prop.id !== id));
    
    toast({
      title: "Property Removed",
      description: `${propertyToDelete?.name} has been removed from your portfolio.`,
    });
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowForm(true);
  };
  
  const handlePropertyUpdate = (updatedProperty: Property) => {
    setProperties(
      properties.map(prop => 
        prop.id === updatedProperty.id ? updatedProperty : prop
      )
    );
    
    // Manually sync with net worth context to ensure immediate update
    syncPropertiesToAssets(
      properties.map(prop => 
        prop.id === updatedProperty.id ? updatedProperty : prop
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Property Portfolio</h1>
        <Button onClick={() => {
          setEditingProperty(null);
          setShowForm(!showForm);
        }} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          {showForm ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> Add Property</>}
        </Button>
      </div>

      <PropertySummary properties={properties} />

      {showForm ? (
        <PropertyForm 
          onSubmit={editingProperty ? handleUpdateProperty : handleAddProperty} 
          property={editingProperty}
        />
      ) : (
        <PropertyList 
          properties={properties}
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
          onPropertyUpdate={handlePropertyUpdate}
        />
      )}
    </div>
  );
};
