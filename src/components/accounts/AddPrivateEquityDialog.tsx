
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
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
    if (formData.ownershipPercentage) {
      const ownershipNum = parseFloat(formData.ownershipPercentage);
      if (isNaN(ownershipNum) || ownershipNum < 0 || ownershipNum > 100) {
        toast({
          title: "Error",
          description: "Ownership percentage must be between 0 and 100",
          variant: "destructive"
        });
        return;
      }
    }

    console.log("Private Equity Account Data:", formData);
    
    toast({
      title: "Private Equity Account Added",
      description: `${formData.entityName} has been added successfully`
    });

    // Reset form
    setFormData({
      entityName: "",
      valuation: "",
      ownershipPercentage: "",
      entityType: ""
    });
    
    onOpenChange(false);
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
            <DialogTitle>Add Private Equity Account</DialogTitle>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entityName">Entity Name *</Label>
            <Input
              id="entityName"
              placeholder="Enter entity name"
              value={formData.entityName}
              onChange={(e) => handleInputChange("entityName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valuation">Valuation *</Label>
            <Input
              id="valuation"
              type="text"
              placeholder="e.g., 1,000,000"
              value={formData.valuation}
              onChange={(e) => handleInputChange("valuation", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownershipPercentage">Ownership % (Optional)</Label>
            <Input
              id="ownershipPercentage"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g., 25.5"
              value={formData.ownershipPercentage}
              onChange={(e) => handleInputChange("ownershipPercentage", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entityType">Entity Type *</Label>
            <Select
              value={formData.entityType}
              onValueChange={(value) => handleInputChange("entityType", value)}
              required
            >
              <SelectTrigger>
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

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Private Equity Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
