
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
  const isLightTheme = theme === "light";

  const [formData, setFormData] = useState({
    assetType: '',
    customAssetType: '',
    quantity: '',
    pricePerUnit: '',
  });

  const [calculatedValue, setCalculatedValue] = useState(0);

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

  const handleSubmit = () => {
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

    // Here you would typically save the digital asset
    const assetName = formData.assetType === 'Other' ? formData.customAssetType : formData.assetType;
    
    toast({
      title: "Digital Asset Added",
      description: `${assetName} has been added to your portfolio with a value of $${calculatedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    });

    // Reset form and close
    setFormData({
      assetType: '',
      customAssetType: '',
      quantity: '',
      pricePerUnit: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-md max-h-[90vh] overflow-y-auto",
        isMobile ? "mx-4 w-[calc(100vw-2rem)]" : "w-full"
      )}>
        <DialogHeader className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className={cn(
              "rounded-full p-3",
              isLightTheme 
                ? "bg-yellow-50 text-yellow-600" 
                : "bg-yellow-500/10 text-yellow-400"
            )}>
              <Coins className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
            </div>
          </div>
          <DialogTitle className={cn(
            "font-semibold",
            isMobile ? "text-xl" : "text-2xl",
            isLightTheme ? "text-[#222222]" : "text-white"
          )}>
            Add Digital Asset
          </DialogTitle>
          <p className={cn(
            "mt-2",
            isMobile ? "text-sm" : "text-base",
            isLightTheme ? "text-[#666666]" : "text-gray-400"
          )}>
            Enter details for your digital asset holdings
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Asset Type */}
          <div className="space-y-2">
            <Label className={cn(
              "text-sm font-medium",
              isLightTheme ? "text-[#222222]" : "text-white"
            )}>
              Asset Type
            </Label>
            <Select
              value={formData.assetType}
              onValueChange={(value) => handleInputChange('assetType', value)}
            >
              <SelectTrigger className={cn(
                "w-full",
                isLightTheme 
                  ? "bg-[#F9F7E8] border-[#DCD8C0] text-[#222222]" 
                  : "bg-[#1B1B32] border-[#2A2A40] text-white"
              )}>
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
            <div className="space-y-2">
              <Label className={cn(
                "text-sm font-medium",
                isLightTheme ? "text-[#222222]" : "text-white"
              )}>
                Specify Asset Type
              </Label>
              <Input
                type="text"
                placeholder="e.g., DOGE, ADA, etc."
                value={formData.customAssetType}
                onChange={(e) => handleInputChange('customAssetType', e.target.value)}
                className={cn(
                  isLightTheme 
                    ? "bg-[#F9F7E8] border-[#DCD8C0] text-[#222222]" 
                    : "bg-[#1B1B32] border-[#2A2A40] text-white"
                )}
              />
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <Label className={cn(
              "text-sm font-medium",
              isLightTheme ? "text-[#222222]" : "text-white"
            )}>
              Quantity
            </Label>
            <Input
              type="number"
              step="any"
              placeholder="0.00"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className={cn(
                isLightTheme 
                  ? "bg-[#F9F7E8] border-[#DCD8C0] text-[#222222]" 
                  : "bg-[#1B1B32] border-[#2A2A40] text-white"
              )}
            />
          </div>

          {/* Price per Unit */}
          <div className="space-y-2">
            <Label className={cn(
              "text-sm font-medium",
              isLightTheme ? "text-[#222222]" : "text-white"
            )}>
              Price per Unit (USD)
            </Label>
            <Input
              type="number"
              step="any"
              placeholder="0.00"
              value={formData.pricePerUnit}
              onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
              className={cn(
                isLightTheme 
                  ? "bg-[#F9F7E8] border-[#DCD8C0] text-[#222222]" 
                  : "bg-[#1B1B32] border-[#2A2A40] text-white"
              )}
            />
          </div>

          {/* Calculated Value */}
          <div className={cn(
            "rounded-lg p-4 border",
            isLightTheme 
              ? "bg-green-50 border-green-200" 
              : "bg-green-500/10 border-green-500/20"
          )}>
            <div className="flex justify-between items-center">
              <span className={cn(
                "text-sm font-medium",
                isLightTheme ? "text-green-800" : "text-green-400"
              )}>
                Total Value:
              </span>
              <span className={cn(
                "text-lg font-bold",
                isLightTheme ? "text-green-800" : "text-green-400"
              )}>
                ${calculatedValue.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={cn(
          "flex gap-3 pt-6 border-t border-border",
          isMobile ? "flex-col" : "flex-row justify-between"
        )}>
          <Button 
            variant="ghost" 
            onClick={onBack}
            className={cn(
              "group transition-all duration-200",
              isMobile ? "w-full text-sm" : "flex-1",
              isLightTheme 
                ? "text-[#666666] hover:text-[#222222] hover:bg-[#F2F0E1]" 
                : "text-gray-400 hover:text-white hover:bg-[#2A2A40]"
            )}
          >
            <ArrowLeft className={cn(
              "mr-2 transition-transform duration-200 group-hover:-translate-x-1",
              isMobile ? "h-3 w-3" : "h-4 w-4"
            )} />
            Back
          </Button>
          
          <Button 
            onClick={handleSubmit}
            className={cn(
              isMobile ? "w-full text-sm" : "flex-1",
              "bg-primary hover:bg-primary/90"
            )}
          >
            Add Digital Asset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
