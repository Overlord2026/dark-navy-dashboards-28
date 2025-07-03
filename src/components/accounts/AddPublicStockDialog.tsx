import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface AddPublicStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack?: () => void;
}

export function AddPublicStockDialog({ 
  open, 
  onOpenChange, 
  onBack 
}: AddPublicStockDialogProps) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    companyName: "",
    tickerSymbol: "",
    numberOfShares: "",
    pricePerShare: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotalValue = () => {
    const shares = parseFloat(formData.numberOfShares) || 0;
    const price = parseFloat(formData.pricePerShare) || 0;
    return shares * price;
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
    
    if (!formData.companyName.trim()) {
      toast({
        title: "Error", 
        description: "Company name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.tickerSymbol.trim()) {
      toast({
        title: "Error",
        description: "Ticker symbol is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.numberOfShares.trim()) {
      toast({
        title: "Error",
        description: "Number of shares is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.pricePerShare.trim()) {
      toast({
        title: "Error",
        description: "Price per share is required",
        variant: "destructive"
      });
      return;
    }

    // Validate numeric values
    const shares = parseFloat(formData.numberOfShares);
    const price = parseFloat(formData.pricePerShare);
    
    if (isNaN(shares) || shares <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of shares",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price per share",
        variant: "destructive"
      });
      return;
    }

    const totalValue = calculateTotalValue();
    
    toast({
      title: "Public Stock Added",
      description: `${formData.companyName} (${formData.tickerSymbol.toUpperCase()}) - ${formatCurrency(totalValue)}`
    });

    // Reset form
    setFormData({
      companyName: "",
      tickerSymbol: "",
      numberOfShares: "",
      pricePerShare: ""
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
            <DialogTitle>Add Public Stock</DialogTitle>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              placeholder="e.g., Apple Inc."
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tickerSymbol">Ticker Symbol *</Label>
            <Input
              id="tickerSymbol"
              placeholder="e.g., AAPL"
              value={formData.tickerSymbol}
              onChange={(e) => handleInputChange("tickerSymbol", e.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfShares">Number of Shares *</Label>
            <Input
              id="numberOfShares"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 100"
              value={formData.numberOfShares}
              onChange={(e) => handleInputChange("numberOfShares", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerShare">Price per Share *</Label>
            <Input
              id="pricePerShare"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 150.00"
              value={formData.pricePerShare}
              onChange={(e) => handleInputChange("pricePerShare", e.target.value)}
              required
            />
          </div>

          {(formData.numberOfShares && formData.pricePerShare) && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="text-lg font-semibold">
                {formatCurrency(calculateTotalValue())}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Public Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}