import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRealEstate, RealEstatePropertyData } from "@/hooks/useRealEstate";
import { ArrowLeft } from "lucide-react";

interface AddRealEstateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack?: () => void;
}

export function AddRealEstateDialog({ 
  open, 
  onOpenChange, 
  onBack 
}: AddRealEstateDialogProps) {
  const { toast } = useToast();
  const { addProperty, saving } = useRealEstate();
  
  const [formData, setFormData] = useState<RealEstatePropertyData>({
    name: "",
    address: "",
    property_type: "residence",
    current_market_value: 0
  });

  const handleInputChange = (field: keyof RealEstatePropertyData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error", 
        description: "Property name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.address.trim()) {
      toast({
        title: "Error",
        description: "Address is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.current_market_value || formData.current_market_value <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid market value",
        variant: "destructive"
      });
      return;
    }

    const result = await addProperty(formData);

    if (result) {
      // Reset form
      setFormData({
        name: "",
        address: "",
        property_type: "residence",
        current_market_value: 0
      });
      
      onOpenChange(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center space-y-0 pb-4">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mr-2 p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <DialogTitle>Add Real Estate Property</DialogTitle>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Property Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Main Residence, Downtown Condo"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              placeholder="e.g., 123 Main St, Boston, MA 02108"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type *</Label>
            <Select
              value={formData.property_type}
              onValueChange={(value) => handleInputChange("property_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residence">Residence</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketValue">Current Market Value *</Label>
            <Input
              id="marketValue"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 500000"
              value={formData.current_market_value || ""}
              onChange={(e) => handleInputChange("current_market_value", parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          {formData.current_market_value > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Market Value</div>
              <div className="text-lg font-semibold">
                {formatCurrency(formData.current_market_value)}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Adding..." : "Add Property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}