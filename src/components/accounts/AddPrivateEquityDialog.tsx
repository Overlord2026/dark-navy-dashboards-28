
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { usePrivateEquityAccounts } from "@/hooks/usePrivateEquityAccounts";
import { ArrowLeft, Briefcase } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AddPrivateEquityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack?: () => void;
}

export function AddPrivateEquityDialog({ 
  open, 
  onOpenChange, 
  onBack 
}: AddPrivateEquityDialogProps) {
  const { toast } = useToast();
  const { addAccount, saving } = usePrivateEquityAccounts();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    entityName: "",
    valuation: "",
    ownershipPercentage: "",
    entityType: ""
  });

  const entityTypes = [
    "LLC",
    "Corp",
    "Startup",
    "Partnership",
    "Trust",
    "Fund",
    "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.entityName.trim()) {
      toast({
        title: "Error", 
        description: "Entity name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.valuation.trim()) {
      toast({
        title: "Error",
        description: "Valuation is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.entityType) {
      toast({
        title: "Error",
        description: "Entity type is required",
        variant: "destructive"
      });
      return;
    }

    // Validate valuation is a number
    const valuationNum = parseFloat(formData.valuation.replace(/,/g, ''));
    if (isNaN(valuationNum)) {
      toast({
        title: "Error",
        description: "Please enter a valid valuation amount",
        variant: "destructive"
      });
      return;
    }

    // Validate ownership percentage if provided
    let ownershipNum: number | undefined;
    if (formData.ownershipPercentage) {
      ownershipNum = parseFloat(formData.ownershipPercentage);
      if (isNaN(ownershipNum) || ownershipNum < 0 || ownershipNum > 100) {
        toast({
          title: "Error",
          description: "Ownership percentage must be between 0 and 100",
          variant: "destructive"
        });
        return;
      }
    }

    const result = await addAccount({
      entity_name: formData.entityName,
      valuation: valuationNum,
      ownership_percentage: ownershipNum,
      entity_type: formData.entityType
    });

    if (result) {
      // Reset form
      setFormData({
        entityName: "",
        valuation: "",
        ownershipPercentage: "",
        entityType: ""
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
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-semibold text-foreground tracking-tight">
                      Add Private Equity Account
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Private equity investments and holdings
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
                <Label htmlFor="entityName" className="text-base font-medium text-foreground">Entity Name</Label>
                <Input
                  id="entityName"
                  placeholder="Enter entity name"
                  value={formData.entityName}
                  onChange={(e) => handleInputChange("entityName", e.target.value)}
                  className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="valuation" className="text-base font-medium text-foreground">Valuation</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="valuation"
                    type="text"
                    placeholder="1,000,000"
                    value={formData.valuation}
                    onChange={(e) => handleInputChange("valuation", e.target.value)}
                    className="h-12 pl-8 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="ownershipPercentage" className="text-base font-medium text-foreground">
                    Ownership % <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="ownershipPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="25.5"
                      value={formData.ownershipPercentage}
                      onChange={(e) => handleInputChange("ownershipPercentage", e.target.value)}
                      className="h-12 pr-8 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="entityType" className="text-base font-medium text-foreground">Entity Type</Label>
                  <Select
                    value={formData.entityType}
                    onValueChange={(value) => handleInputChange("entityType", value)}
                    required
                  >
                    <SelectTrigger className="h-12 border-border/50 bg-background hover:border-primary/30 transition-colors duration-200">
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {entityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

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
                      'Add Private Equity Account'
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
