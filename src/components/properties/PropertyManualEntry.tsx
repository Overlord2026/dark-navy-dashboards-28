import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Building, 
  DollarSign, 
  MapPin, 
  Edit,
  Trash2,
  Upload,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  value: number;
  purchasePrice: number;
  purchaseDate: string;
  notes?: string;
}

export const PropertyManualEntry: React.FC = () => {
  const { toast } = useToast();
  const { checkFeatureAccess } = useSubscriptionAccess();
  const hasPremiumAccess = checkFeatureAccess('premium');

  const [properties, setProperties] = useState<Property[]>([
    {
      id: "1",
      name: "Sunset Apartment",
      address: "123 Sunset Blvd, Los Angeles, CA",
      type: "rental",
      value: 850000,
      purchasePrice: 650000,
      purchaseDate: "2020-03-15",
      notes: "Prime location with ocean view"
    },
    {
      id: "2", 
      name: "Downtown Condo",
      address: "456 Main St, San Francisco, CA",
      type: "primary",
      value: 1200000,
      purchasePrice: 950000,
      purchaseDate: "2019-08-22"
    }
  ]);

  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "primary",
    value: "",
    purchasePrice: "",
    purchaseDate: "",
    notes: ""
  });

  const propertyTypes = [
    { value: "primary", label: "Primary Residence" },
    { value: "rental", label: "Rental Property" },
    { value: "vacation", label: "Vacation Home" },
    { value: "commercial", label: "Commercial Property" },
    { value: "land", label: "Land/Lot" }
  ];

  const propertyLimit = hasPremiumAccess ? null : 3;
  const canAddProperty = hasPremiumAccess || properties.length < 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.value || !formData.purchasePrice) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!canAddProperty && !editingProperty) {
      toast({
        title: "Property Limit Reached",
        description: "Upgrade to Premium to add unlimited properties.",
        variant: "destructive"
      });
      return;
    }

    const newProperty: Property = {
      id: editingProperty || Date.now().toString(),
      name: formData.name,
      address: formData.address,
      type: formData.type,
      value: parseFloat(formData.value),
      purchasePrice: parseFloat(formData.purchasePrice),
      purchaseDate: formData.purchaseDate,
      notes: formData.notes
    };

    if (editingProperty) {
      setProperties(properties.map(prop => prop.id === editingProperty ? newProperty : prop));
      toast({
        title: "Property Updated",
        description: `${newProperty.name} has been updated successfully.`
      });
    } else {
      setProperties([...properties, newProperty]);
      toast({
        title: "Property Added",
        description: `${newProperty.name} has been added to your portfolio.`
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      type: "primary",
      value: "",
      purchasePrice: "",
      purchaseDate: "",
      notes: ""
    });
    setIsAddingProperty(false);
    setEditingProperty(null);
  };

  const handleEdit = (property: Property) => {
    setFormData({
      name: property.name,
      address: property.address,
      type: property.type,
      value: property.value.toString(),
      purchasePrice: property.purchasePrice.toString(),
      purchaseDate: property.purchaseDate,
      notes: property.notes || ""
    });
    setEditingProperty(property.id);
    setIsAddingProperty(true);
  };

  const handleDelete = (propertyId: string) => {
    setProperties(properties.filter(prop => prop.id !== propertyId));
    toast({
      title: "Property Deleted",
      description: "The property has been removed from your portfolio."
    });
  };

  const getPropertyTypeLabel = (value: string) => {
    return propertyTypes.find(type => type.value === value)?.label || value;
  };

  const calculateEquity = (currentValue: number, purchasePrice: number) => {
    return currentValue - purchasePrice;
  };

  return (
    <div className="space-y-6">
      {/* Property Limit Warning */}
      {!hasPremiumAccess && properties.length >= 2 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You're approaching your property limit ({properties.length}/{propertyLimit}). 
            <Button variant="link" className="p-0 h-auto ml-1">Upgrade to Premium</Button> for unlimited properties.
          </AlertDescription>
        </Alert>
      )}

      {/* Add/Edit Property Form */}
      {isAddingProperty && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editingProperty ? "Edit Property" : "Add New Property"}
            </CardTitle>
            <CardDescription>
              {editingProperty ? "Update property information" : "Enter your property details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Name *</Label>
                  <Input
                    id="propertyName"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Sunset Apartment"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Full property address"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentValue">Current Value *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="currentValue"
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      placeholder="0"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="purchasePrice"
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                      placeholder="0"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documents">Upload Documents</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Drag files here or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">Deeds, contracts, inspection reports</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any additional notes about this property..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={!canAddProperty && !editingProperty}>
                  {editingProperty ? "Update Property" : "Add Property"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Properties List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Properties ({properties.length}{propertyLimit ? `/${propertyLimit}` : ""})</CardTitle>
            <CardDescription>Manage your real estate portfolio</CardDescription>
          </div>
          {!isAddingProperty && (
            <Button 
              onClick={() => setIsAddingProperty(true)}
              disabled={!canAddProperty}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Properties Added Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your real estate portfolio by adding your first property.
              </p>
              <Button 
                onClick={() => setIsAddingProperty(true)}
                disabled={!canAddProperty}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{property.name}</h3>
                        <Badge variant="secondary">{getPropertyTypeLabel(property.type)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Value: ${property.value.toLocaleString()}</span>
                        <span>Equity: ${calculateEquity(property.value, property.purchasePrice).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(property)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(property.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};