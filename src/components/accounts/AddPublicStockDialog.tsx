import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePublicStocks } from "@/hooks/usePublicStocks";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const { addStock, saving } = usePublicStocks();
  const isMobile = useIsMobile();
  
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

    const result = await addStock({
      company_name: formData.companyName,
      ticker_symbol: formData.tickerSymbol.toUpperCase(),
      number_of_shares: shares,
      price_per_share: price
    });

    if (result) {
      // Reset form
      setFormData({
        companyName: "",
        tickerSymbol: "",
        numberOfShares: "",
        pricePerShare: ""
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
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-semibold text-foreground tracking-tight">
                      Add Public Stock
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Individual stocks and equity investments
                    </p>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form content */}
          <div className="p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="companyName" className="text-base font-medium text-foreground">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Apple Inc."
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tickerSymbol" className="text-base font-medium text-foreground">Ticker Symbol</Label>
                  <Input
                    id="tickerSymbol"
                    placeholder="e.g., AAPL"
                    value={formData.tickerSymbol}
                    onChange={(e) => handleInputChange("tickerSymbol", e.target.value.toUpperCase())}
                    className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="numberOfShares" className="text-base font-medium text-foreground">Number of Shares</Label>
                  <Input
                    id="numberOfShares"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="100"
                    value={formData.numberOfShares}
                    onChange={(e) => handleInputChange("numberOfShares", e.target.value)}
                    className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="pricePerShare" className="text-base font-medium text-foreground">Price per Share</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="pricePerShare"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="150.00"
                      value={formData.pricePerShare}
                      onChange={(e) => handleInputChange("pricePerShare", e.target.value)}
                      className="h-12 pl-8 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              {(formData.numberOfShares && formData.pricePerShare) && (
                <div className="rounded-lg p-4 border border-border/40 bg-primary/3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-foreground">Total Value:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(calculateTotalValue())}
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
                      'Add Public Stock'
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