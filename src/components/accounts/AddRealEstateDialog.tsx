import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRealEstate, RealEstatePropertyData } from "@/hooks/useRealEstate";
import { ArrowLeft, Home } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const isMobile = useIsMobile();
  
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
      <DialogContent className={cn("sm:max-w-[550px] p-0 overflow-hidden bg-card border border-border/50 shadow-2xl", isMobile && "mx-4")}>
        <div className="relative">
          {/* Header with gradient background */}
          <div className="relative px-8 py-5 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-b border-border/30">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="p-2 rounded-full hover:bg-primary/10 transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4 text-foreground" />
                  </Button>
                )}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Home className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-semibold text-foreground tracking-tight">
                      Add Real Estate Property
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add your real estate holdings and properties
                    </p>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form content */}
          <div className="p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium text-foreground">Property Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Residence, Downtown Condo"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="address" className="text-base font-medium text-foreground">Property Address</Label>
                <Input
                  id="address"
                  placeholder="e.g., 123 Main St, Boston, MA 02108"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="propertyType" className="text-base font-medium text-foreground">Property Type</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) => handleInputChange("property_type", value)}
                  >
                    <SelectTrigger className="h-12 border-border/50 bg-background hover:border-primary/30 transition-colors duration-200">
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

                <div className="space-y-3">
                  <Label htmlFor="marketValue" className="text-base font-medium text-foreground">Market Value</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="marketValue"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="500,000"
                      value={formData.current_market_value || ""}
                      onChange={(e) => handleInputChange("current_market_value", parseFloat(e.target.value) || 0)}
                      className="h-12 pl-8 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              {formData.current_market_value > 0 && (
                <div className="rounded-lg p-4 border border-border/40 bg-primary/3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-foreground">Total Property Value:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(formData.current_market_value)}
                    </span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-5 border-t border-border/30">
                <div className={cn("flex gap-3", isMobile ? "flex-col" : "flex-row justify-end")}>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      "h-12 px-6 border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200",
                      isMobile && "w-full"
                    )}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className={cn(
                      "h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200",
                      "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
                      isMobile && "w-full"
                    )}
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Adding...
                      </div>
                    ) : (
                      'Add Property'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}