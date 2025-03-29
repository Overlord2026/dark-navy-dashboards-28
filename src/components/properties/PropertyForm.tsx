
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Property, PropertyType, OwnershipType } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Building, Umbrella, Briefcase, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { useTheme } from "@/context/ThemeContext";

interface PropertyFormProps {
  property?: Property;
  onSubmit: (property: any) => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ property, onSubmit }) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const isEditing = !!property;
  
  const defaultValues = property || {
    name: "",
    type: "primary" as PropertyType,
    address: "",
    ownership: "single" as OwnershipType,
    owner: "",
    purchaseDate: new Date().toISOString().split('T')[0],
    originalCost: 0,
    currentValue: 0,
    improvements: [],
    notes: ""
  };
  
  const form = useForm({ defaultValues });
  const watchType = form.watch("type");
  
  const [improvements, setImprovements] = useState(defaultValues.improvements || []);
  const [newImprovement, setNewImprovement] = useState({ description: "", date: "", cost: 0 });
  
  const [rentalDetails, setRentalDetails] = useState(defaultValues.rental || {
    monthlyIncome: 0,
    monthlyExpenses: 0,
    occupiedSince: "",
    leaseEnd: "",
    tenantName: ""
  });
  
  const [businessDetails, setBusinessDetails] = useState(defaultValues.business || {
    companyName: "",
    usageType: "",
    annualExpenses: 0
  });
  
  const handleFormSubmit = (data: any) => {
    // Combine form data with improvements and rental/business details
    const formattedData = {
      ...data,
      improvements,
      ...(data.type === "rental" ? { rental: rentalDetails } : {}),
      ...(data.type === "business" ? { business: businessDetails } : {})
    };
    
    if (isEditing) {
      formattedData.id = property.id;
    }
    
    onSubmit(formattedData);
  };
  
  const handleAddImprovement = () => {
    if (newImprovement.description && newImprovement.date && newImprovement.cost > 0) {
      setImprovements([...improvements, { ...newImprovement }]);
      setNewImprovement({ description: "", date: "", cost: 0 });
    }
  };
  
  const handleRemoveImprovement = (index: number) => {
    setImprovements(improvements.filter((_, i) => i !== index));
  };
  
  return (
    <Card className={isLightTheme ? "bg-card/50" : ""}>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Main Residence" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'primary', label: 'Primary', icon: Home, color: 'bg-blue-100 border-blue-300 text-blue-700' },
                      { value: 'vacation', label: 'Vacation', icon: Umbrella, color: 'bg-teal-100 border-teal-300 text-teal-700' },
                      { value: 'rental', label: 'Rental', icon: Building, color: 'bg-purple-100 border-purple-300 text-purple-700' },
                      { value: 'business', label: 'Business', icon: Briefcase, color: 'bg-amber-100 border-amber-300 text-amber-700' },
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <div
                          key={type.value}
                          className={`
                            flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer transition-all
                            ${form.watch('type') === type.value ? `${type.color} border-2` : 'border-gray-200 hover:border-gray-300'}
                          `}
                          onClick={() => form.setValue('type', type.value as PropertyType)}
                        >
                          <Icon className="h-5 w-5 mb-1" />
                          <span className="text-xs font-medium">{type.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Full address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="purchaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <Label>Ownership Type</Label>
                    <select
                      className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
                      value={form.watch('ownership')}
                      onChange={(e) => form.setValue('ownership', e.target.value as OwnershipType)}
                    >
                      <option value="single">Single Owner</option>
                      <option value="joint">Joint Ownership</option>
                      <option value="trust">Trust</option>
                      <option value="llc">LLC</option>
                    </select>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name(s)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Full legal name(s)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="originalCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              type="number" 
                              className="pl-7" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Value</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              type="number" 
                              className="pl-7" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Improvements Section */}
                <div className="border p-4 rounded-md space-y-3">
                  <Label>Improvements & Renovations</Label>
                  
                  {improvements.length > 0 && (
                    <div className="space-y-2">
                      {improvements.map((improvement, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-background rounded-md">
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{improvement.description}</span>
                              <span className="text-green-600">${improvement.cost.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{improvement.date}</div>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive" 
                            onClick={() => handleRemoveImprovement(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-5">
                      <Input 
                        placeholder="Description" 
                        value={newImprovement.description} 
                        onChange={(e) => setNewImprovement({...newImprovement, description: e.target.value})}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input 
                        type="date" 
                        value={newImprovement.date} 
                        onChange={(e) => setNewImprovement({...newImprovement, date: e.target.value})}
                      />
                    </div>
                    <div className="col-span-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input 
                          type="number" 
                          className="pl-7" 
                          placeholder="Cost" 
                          value={newImprovement.cost || ''} 
                          onChange={(e) => setNewImprovement({...newImprovement, cost: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10" 
                        onClick={handleAddImprovement}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Rental Property Specific Fields */}
                {watchType === "rental" && (
                  <div className="border p-4 rounded-md space-y-3">
                    <Label>Rental Property Details</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Monthly Income</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            type="number" 
                            className="pl-7" 
                            value={rentalDetails.monthlyIncome} 
                            onChange={(e) => setRentalDetails({...rentalDetails, monthlyIncome: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Monthly Expenses</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            type="number" 
                            className="pl-7" 
                            value={rentalDetails.monthlyExpenses} 
                            onChange={(e) => setRentalDetails({...rentalDetails, monthlyExpenses: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Current Tenant</Label>
                      <Input 
                        placeholder="Tenant Name" 
                        value={rentalDetails.tenantName || ''} 
                        onChange={(e) => setRentalDetails({...rentalDetails, tenantName: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Occupied Since</Label>
                        <Input 
                          type="date" 
                          value={rentalDetails.occupiedSince || ''} 
                          onChange={(e) => setRentalDetails({...rentalDetails, occupiedSince: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label>Lease End Date</Label>
                        <Input 
                          type="date" 
                          value={rentalDetails.leaseEnd || ''} 
                          onChange={(e) => setRentalDetails({...rentalDetails, leaseEnd: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Business Property Specific Fields */}
                {watchType === "business" && (
                  <div className="border p-4 rounded-md space-y-3">
                    <Label>Business Property Details</Label>
                    
                    <div>
                      <Label>Company/Business Name</Label>
                      <Input 
                        placeholder="Business Name" 
                        value={businessDetails.companyName} 
                        onChange={(e) => setBusinessDetails({...businessDetails, companyName: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label>Usage Type</Label>
                      <Input 
                        placeholder="e.g. Office Space, Retail, etc." 
                        value={businessDetails.usageType} 
                        onChange={(e) => setBusinessDetails({...businessDetails, usageType: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label>Annual Expenses</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input 
                          type="number" 
                          className="pl-7" 
                          value={businessDetails.annualExpenses} 
                          onChange={(e) => setBusinessDetails({...businessDetails, annualExpenses: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <textarea 
                          {...field} 
                          className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                          placeholder="Any additional information about this property..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="submit" 
                className="min-w-[120px]"
              >
                {isEditing ? "Update Property" : "Add Property"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
