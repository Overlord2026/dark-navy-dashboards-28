
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOtherAssets } from "@/hooks/useOtherAssets";
import { toast } from "sonner";
import { Package, ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AddOtherAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const otherAssetTypes = [
  { value: "annuities", label: "Annuities" },
  { value: "vehicle", label: "Vehicle" },
  { value: "collectible", label: "Collectible" },
  { value: "insurance_policy", label: "Insurance Policy" },
  { value: "other", label: "Other" },
];

export const AddOtherAssetDialog = ({ open, onOpenChange }: AddOtherAssetDialogProps) => {
  const { addAsset } = useOtherAssets();
  const isMobile = useIsMobile();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setType("");
    setValue("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !type || !value) {
      toast.error("Please fill in all fields");
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) {
      toast.error("Please enter a valid value");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addAsset({
        name: name.trim(),
        type: type,
        owner: "Self", // Default owner
        value: numericValue
      });

      if (result) {
        toast.success("Other asset added successfully");
        resetForm();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error adding other asset:', error);
      toast.error("Failed to add other asset");
    } finally {
      setIsSubmitting(false);
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
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-semibold text-foreground tracking-tight">
                    Add Other Asset
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add miscellaneous assets to your portfolio
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form content */}
          <div className="p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium text-foreground">Asset Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Life Insurance Policy, Vintage Car"
                  className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="type" className="text-base font-medium text-foreground">Asset Type</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger className="h-12 border-border/50 bg-background hover:border-primary/30 transition-colors duration-200">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherAssetTypes.map((assetType) => (
                      <SelectItem key={assetType.value} value={assetType.value}>
                        {assetType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="value" className="text-base font-medium text-foreground">Asset Value</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0.00"
                    className="h-12 pl-8 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="pt-5 border-t border-border/30">
                <div className={cn("flex gap-3", isMobile ? "flex-col" : "flex-row justify-end")}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12 px-6 border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200",
                      isMobile && "w-full"
                    )}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
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
                      'Add Other Asset'
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
};
