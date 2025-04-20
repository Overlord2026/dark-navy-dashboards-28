
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Home, Building, MapPin, DollarSign, BarChart2, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

export interface RealEstateProperty {
  id: string;
  name: string;
  type: "residential" | "commercial" | "land";
  address: string;
  purchasePrice: number;
  currentValue: number;
  mortgageBalance?: number;
  monthlyIncome?: number;
}

export const RealEstateTracker = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const isLightTheme = theme === "light";
  
  const [properties, setProperties] = useState<RealEstateProperty[]>([
    {
      id: "prop-1",
      name: "Main Residence",
      type: "residential",
      address: "123 Main St, Boston, MA 02108",
      purchasePrice: 850000,
      currentValue: 975000,
      mortgageBalance: 620000,
    },
    {
      id: "prop-2",
      name: "Downtown Condo",
      type: "residential",
      address: "45 Harbor Way, Boston, MA 02210",
      purchasePrice: 650000,
      currentValue: 720000,
      mortgageBalance: 425000,
      monthlyIncome: 3200,
    },
    {
      id: "prop-3",
      name: "Office Building",
      type: "commercial",
      address: "789 Business Ave, Cambridge, MA 02142",
      purchasePrice: 1200000,
      currentValue: 1450000,
      mortgageBalance: 875000,
      monthlyIncome: 8500,
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<RealEstateProperty | null>(null);
  
  const [newProperty, setNewProperty] = useState<Partial<RealEstateProperty>>({
    name: "",
    type: "residential",
    address: "",
    purchasePrice: 0,
    currentValue: 0,
  });
  
  const handleAddProperty = () => {
    if (!newProperty.name || !newProperty.address) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const property: RealEstateProperty = {
      id: `prop-${Date.now()}`,
      name: newProperty.name || "",
      type: (newProperty.type as "residential" | "commercial" | "land") || "residential",
      address: newProperty.address || "",
      purchasePrice: newProperty.purchasePrice || 0,
      currentValue: newProperty.currentValue || 0,
      mortgageBalance: newProperty.mortgageBalance,
      monthlyIncome: newProperty.monthlyIncome,
    };
    
    setProperties([...properties, property]);
    setNewProperty({
      name: "",
      type: "residential",
      address: "",
      purchasePrice: 0,
      currentValue: 0,
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Property added",
      description: `${property.name} has been added to your portfolio.`,
    });
  };
  
  const handleEditProperty = () => {
    if (!editingProperty || !editingProperty.name || !editingProperty.address) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setProperties(properties.map(prop => 
      prop.id === editingProperty.id ? editingProperty : prop
    ));
    
    setIsEditDialogOpen(false);
    setEditingProperty(null);
    
    toast({
      title: "Property updated",
      description: `${editingProperty.name} has been updated.`,
    });
  };
  
  const handleDeleteProperty = (id: string) => {
    const propertyToDelete = properties.find(prop => prop.id === id);
    
    setProperties(properties.filter(prop => prop.id !== id));
    
    toast({
      title: "Property removed",
      description: `${propertyToDelete?.name} has been removed from your portfolio.`,
    });
  };
  
  const openEditDialog = (property: RealEstateProperty) => {
    setEditingProperty({...property});
    setIsEditDialogOpen(true);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getTotalValue = () => {
    return properties.reduce((total, property) => total + property.currentValue, 0);
  };
  
  const getTotalEquity = () => {
    return properties.reduce((total, property) => {
      const mortgageBalance = property.mortgageBalance || 0;
      return total + (property.currentValue - mortgageBalance);
    }, 0);
  };
  
  const getTotalMonthlyIncome = () => {
    return properties.reduce((total, property) => total + (property.monthlyIncome || 0), 0);
  };
  
  const getPropertyIcon = (type: string) => {
    switch(type) {
      case "residential":
        return <Home className="h-5 w-5 text-blue-400" />;
      case "commercial":
        return <Building className="h-5 w-5 text-green-400" />;
      case "land":
        return <MapPin className="h-5 w-5 text-amber-400" />;
      default:
        return <Home className="h-5 w-5 text-blue-400" />;
    }
  };
  
  return (
    <div className={`rounded-lg ${
      isLightTheme 
        ? "bg-[#F2F0E1] border border-[#DCD8C0]" 
        : "bg-[#121a2c] border border-gray-800"
    } p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Real Estate Portfolio</h2>
        <Button 
          className={isLightTheme ? "bg-[#E9E7D8] text-[#222222] hover:bg-[#DCD8C0]" : "bg-[#1c2e4a] hover:bg-[#253859]"}
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${
          isLightTheme ? "bg-[#E9E7D8] border border-[#DCD8C0]" : "bg-[#1a2236] border border-gray-800"
        }`}>
          <div className="flex items-center mb-2">
            <BarChart2 className="h-5 w-5 mr-2 text-blue-400" />
            <span className="text-sm text-gray-500">Portfolio Value</span>
          </div>
          <div className="text-2xl font-semibold">{formatCurrency(getTotalValue())}</div>
          <div className="text-xs text-green-400 mt-1">
            {formatCurrency(getTotalValue() - properties.reduce((total, prop) => total + prop.purchasePrice, 0))} gain
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${
          isLightTheme ? "bg-[#E9E7D8] border border-[#DCD8C0]" : "bg-[#1a2236] border border-gray-800"
        }`}>
          <div className="flex items-center mb-2">
            <DollarSign className="h-5 w-5 mr-2 text-green-400" />
            <span className="text-sm text-gray-500">Total Equity</span>
          </div>
          <div className="text-2xl font-semibold">{formatCurrency(getTotalEquity())}</div>
          <div className="text-xs text-blue-400 mt-1">
            {Math.round((getTotalEquity() / getTotalValue()) * 100)}% of total value
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${
          isLightTheme ? "bg-[#E9E7D8] border border-[#DCD8C0]" : "bg-[#1a2236] border border-gray-800"
        }`}>
          <div className="flex items-center mb-2">
            <Building className="h-5 w-5 mr-2 text-amber-400" />
            <span className="text-sm text-gray-500">Monthly Income</span>
          </div>
          <div className="text-2xl font-semibold">{formatCurrency(getTotalMonthlyIncome())}</div>
          <div className="text-xs text-green-400 mt-1">
            From {properties.filter(prop => prop.monthlyIncome && prop.monthlyIncome > 0).length} income properties
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {properties.map((property) => (
          <div 
            key={property.id}
            className={`p-4 rounded-lg ${
              isLightTheme 
                ? "bg-[#E9E7D8] border border-[#DCD8C0]" 
                : "bg-[#1c2e4a] border border-gray-700"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="mt-1 mr-3">
                  {getPropertyIcon(property.type)}
                </div>
                <div>
                  <h3 className="font-medium">{property.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{property.address}</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Current Value</p>
                      <p className="font-medium">{formatCurrency(property.currentValue)}</p>
                    </div>
                    {property.mortgageBalance !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500">Mortgage</p>
                        <p className="font-medium">{formatCurrency(property.mortgageBalance)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Equity</p>
                      <p className="font-medium">
                        {formatCurrency(property.currentValue - (property.mortgageBalance || 0))}
                      </p>
                    </div>
                    {property.monthlyIncome !== undefined && property.monthlyIncome > 0 && (
                      <div>
                        <p className="text-xs text-gray-500">Monthly Income</p>
                        <p className="font-medium text-green-400">{formatCurrency(property.monthlyIncome)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`h-8 w-8 ${
                    isLightTheme 
                      ? "border-[#DCD8C0] hover:bg-[#DCD8C0]" 
                      : "border-gray-700 hover:bg-[#253859]"
                  }`}
                  onClick={() => openEditDialog(property)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`h-8 w-8 ${
                    isLightTheme 
                      ? "border-[#DCD8C0] hover:bg-[#DCD8C0] hover:text-red-500" 
                      : "border-gray-700 hover:bg-[#253859] hover:text-red-500"
                  }`}
                  onClick={() => handleDeleteProperty(property.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {properties.length === 0 && (
          <div className={`p-8 text-center rounded-lg ${
            isLightTheme ? "bg-[#E9E7D8]" : "bg-[#1c2e4a]"
          }`}>
            <p className="text-gray-500 mb-4">No properties in your portfolio yet</p>
            <Button 
              className={isLightTheme ? "bg-[#DCD8C0] text-[#222222] hover:bg-[#C9C6B0]" : "bg-[#253859] hover:bg-[#304975]"}
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Property
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className={isLightTheme ? "bg-[#F9F7E8] border-[#DCD8C0]" : ""}>
          <DialogHeader>
            <DialogTitle>Add Real Estate Property</DialogTitle>
            <DialogDescription>
              Enter the details of your real estate property below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4">
                <Label htmlFor="name">Property Name</Label>
                <Input 
                  id="name" 
                  value={newProperty.name} 
                  onChange={(e) => setNewProperty({...newProperty, name: e.target.value})} 
                  className={isLightTheme ? "bg-white" : ""}
                />
              </div>
              
              <div className="col-span-4">
                <Label htmlFor="type">Property Type</Label>
                <select
                  id="type"
                  value={newProperty.type}
                  onChange={(e) => setNewProperty({...newProperty, type: e.target.value as any})}
                  className={`w-full p-2 rounded-md border ${
                    isLightTheme 
                      ? "bg-white border-[#DCD8C0]" 
                      : "bg-background border-input"
                  }`}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>
              
              <div className="col-span-4">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={newProperty.address} 
                  onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                  className={isLightTheme ? "bg-white" : ""}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <Input 
                    id="purchasePrice" 
                    type="number" 
                    value={newProperty.purchasePrice} 
                    onChange={(e) => setNewProperty({...newProperty, purchasePrice: Number(e.target.value)})}
                    className={`pl-7 ${isLightTheme ? "bg-white" : ""}`}
                  />
                </div>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="currentValue">Current Value</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <Input 
                    id="currentValue" 
                    type="number" 
                    value={newProperty.currentValue} 
                    onChange={(e) => setNewProperty({...newProperty, currentValue: Number(e.target.value)})}
                    className={`pl-7 ${isLightTheme ? "bg-white" : ""}`}
                  />
                </div>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="mortgageBalance">Mortgage Balance (optional)</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <Input 
                    id="mortgageBalance" 
                    type="number" 
                    value={newProperty.mortgageBalance || ""} 
                    onChange={(e) => setNewProperty({...newProperty, mortgageBalance: e.target.value ? Number(e.target.value) : undefined})}
                    className={`pl-7 ${isLightTheme ? "bg-white" : ""}`}
                  />
                </div>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="monthlyIncome">Monthly Income (optional)</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <Input 
                    id="monthlyIncome" 
                    type="number" 
                    value={newProperty.monthlyIncome || ""} 
                    onChange={(e) => setNewProperty({...newProperty, monthlyIncome: e.target.value ? Number(e.target.value) : undefined})}
                    className={`pl-7 ${isLightTheme ? "bg-white" : ""}`}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProperty}>Add Property</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className={isLightTheme ? "bg-[#F9F7E8] border-[#DCD8C0]" : ""}>
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription>
              Update the details of your real estate property.
            </DialogDescription>
          </DialogHeader>
          
          {editingProperty && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <Label htmlFor="edit-name">Property Name</Label>
                  <Input 
                    id="edit-name" 
                    value={editingProperty.name} 
                    onChange={(e) => setEditingProperty({...editingProperty, name: e.target.value})}
                    className={isLightTheme ? "bg-white" : ""}
                  />
                </div>
                
                <div className="col-span-4">
                  <Label htmlFor="edit-type">Property Type</Label>
                  <select
                    id="edit-type"
                    value={editingProperty.type}
                    onChange={(e) => setEditingProperty({...editingProperty, type: e.target.value as any})}
                    className={`w-full p-2 rounded-md border ${
                      isLightTheme 
                        ? "bg-white border-[#DCD8C0]" 
                        : "bg-background border-input"
                    }`}
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                
                <div className="col-span-4">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input 
                    id="edit-address" 
                    value={editingProperty.address} 
                    onChange={(e) => setEditingProperty({...editingProperty, address: e.target.value})}
                    className={isLightTheme ? "bg-white" : ""}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="edit-purchasePrice">Purchase Price</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input 
                      id="edit-purchasePrice" 
                      type="number" 
                      value={editingProperty.purchasePrice} 
                      onChange={(e) => setEditingProperty({...editingProperty, purchasePrice: Number(e.target.value)})}
                      className={`pl-7 ${isLightTheme ? "bg-white" : ""}`}
                    />
                  </div>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="edit-currentValue">Current Value</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input 
                      id="edit-currentValue" 
                      type="number" 
                      value={editingProperty.currentValue} 
                      onChange={(e) => setEditingProperty({...editingProperty, currentValue: Number(e.target.value)})}
                      className={`pl-7 ${isLightTheme ? "bg-white" : ""}`}
                    />
                  </div>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="edit-mortgageBalance">Mortgage Balance (optional)</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input 
                      id="edit-mortgageBalance" 
                      type="number" 
                      value={editingProperty.mortgageBalance || ""} 
                      onChange={(e) => setEditingProperty({...editingProperty, mortgageBalance: e.target.value ? Number(e.target.value) : undefined})}
                      className={`pl-7 ${isLightTheme ? "bg-white" : ""}`}
                    />
                  </div>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="edit-monthlyIncome">Monthly Income (optional)</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input 
                      id="edit-monthlyIncome" 
                      type="number" 
                      value={editingProperty.monthlyIncome || ""} 
                      onChange={(e) => setEditingProperty({...editingProperty, monthlyIncome: e.target.value ? Number(e.target.value) : undefined})}
                      className={`pl-7 ${isLightTheme ? "bg-white" : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProperty}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
