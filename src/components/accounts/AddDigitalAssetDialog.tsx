
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Coins } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useDigitalAssets } from "@/hooks/useDigitalAssets";

interface AddDigitalAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

const assetTypes = [
  { value: 'BTC', label: 'Bitcoin (BTC)' },
  { value: 'ETH', label: 'Ethereum (ETH)' },
  { value: 'SOL', label: 'Solana (SOL)' },
  { value: 'USDC', label: 'USD Coin (USDC)' },
  { value: 'Other', label: 'Other' },
];

export function AddDigitalAssetDialog({ 
  open, 
  onOpenChange, 
  onBack 
}: AddDigitalAssetDialogProps) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { addDigitalAsset } = useDigitalAssets();
  const isLightTheme = theme === "light";

  const [formData, setFormData] = useState({
    assetType: '',
    customAssetType: '',
    quantity: '',
    pricePerUnit: '',
  });

  const [calculatedValue, setCalculatedValue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculate value when quantity or price changes
  useEffect(() => {
    const quantity = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.pricePerUnit) || 0;
    setCalculatedValue(quantity * price);
  }, [formData.quantity, formData.pricePerUnit]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      assetType: '',
      customAssetType: '',
      quantity: '',
      pricePerUnit: '',
    });
    setCalculatedValue(0);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.assetType) {
      toast({
        title: "Error",
        description: "Please select an asset type",
        variant: "destructive"
      });
      return;
    }

    if (formData.assetType === 'Other' && !formData.customAssetType.trim()) {
      toast({
        title: "Error", 
        description: "Please specify the custom asset type",
        variant: "destructive"
      });
      return;
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive"
      });
      return;
    }

    if (!formData.pricePerUnit || parseFloat(formData.pricePerUnit) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price per unit",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const success = await addDigitalAsset({
      asset_type: formData.assetType,
      custom_asset_type: formData.assetType === 'Other' ? formData.customAssetType : null,
      quantity: parseFloat(formData.quantity),
      price_per_unit: parseFloat(formData.pricePerUnit),
      total_value: calculatedValue
    });

    if (success) {
      resetForm();
      onOpenChange(false);
    }

    setIsSubmitting(false);
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
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-primary/10 transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4 text-foreground" />
                  </Button>
                )}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Coins className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-semibold text-foreground tracking-tight">
                      Add Digital Asset
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter details for your digital asset holdings
                    </p>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form content */}
          <div className="p-7">
            <div className="space-y-5">
              {/* Asset Type */}
              <div className="space-y-3">
                <Label htmlFor="asset-type" className="text-base font-medium text-foreground">Asset Type</Label>
                <Select
                  value={formData.assetType}
                  onValueChange={(value) => handleInputChange('assetType', value)}
                >
                  <SelectTrigger className="h-12 border-border/50 bg-background hover:border-primary/30 transition-colors duration-200">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypes.map((asset) => (
                      <SelectItem key={asset.value} value={asset.value}>
                        {asset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Asset Type (if Other is selected) */}
              {formData.assetType === 'Other' && (
                <div className="space-y-3">
                  <Label htmlFor="custom-asset-type" className="text-base font-medium text-foreground">
                    Specify Asset Type
                  </Label>
                  <Input
                    id="custom-asset-type"
                    type="text"
                    placeholder="e.g., DOGE, ADA, etc."
                    value={formData.customAssetType}
                    onChange={(e) => handleInputChange('customAssetType', e.target.value)}
                    className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="quantity" className="text-base font-medium text-foreground">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="price-per-unit" className="text-base font-medium text-foreground">Price per Unit (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="price-per-unit"
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={formData.pricePerUnit}
                      onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                      className="h-12 pl-8 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Value */}
              <div className="rounded-lg p-4 border border-border/40 bg-primary/3">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-foreground">
                    Total Value:
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ${calculatedValue.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-5 border-t border-border/30">
                <div className={cn("flex gap-3", isMobile ? "flex-col" : "flex-row justify-end")}>
                  <Button 
                    variant="outline" 
                    onClick={onBack}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12 px-6 border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200",
                      isMobile && "w-full"
                    )}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200",
                      "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
                      isMobile && "w-full"
                    )}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Adding...
                      </div>
                    ) : (
                      'Add Digital Asset'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
