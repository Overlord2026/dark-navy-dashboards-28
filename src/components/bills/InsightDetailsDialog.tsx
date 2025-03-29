
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BillOptimizationInsight } from "@/types/bill";
import { useBills } from "@/hooks/useBills";
import { ExternalLinkIcon, ArrowRightIcon, CheckIcon, InfoIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

interface InsightDetailsDialogProps {
  insight: BillOptimizationInsight;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InsightDetailsDialog({ insight, isOpen, onOpenChange }: InsightDetailsDialogProps) {
  const { applyInsight, bills } = useBills();
  
  const getBill = () => {
    return bills.find(b => b.id === insight.billId);
  };
  
  const bill = getBill();

  const handleApplyInsight = () => {
    applyInsight(insight.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{insight.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <p className="text-md">{insight.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-500">Bill</Label>
              <p className="font-medium">{bill?.name || "Unknown"}</p>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Current Amount</Label>
              <p className="font-medium">${bill?.amount.toFixed(2) || "0.00"}</p>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Action Type</Label>
              <p className="font-medium">{insight.actionType}</p>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Potential Savings</Label>
              <p className="font-medium text-green-500">${insight.potentialSavings.toFixed(2)}</p>
            </div>
          </div>
          
          {insight.relevantProviders && insight.relevantProviders.length > 0 && (
            <div>
              <Label className="text-sm text-gray-500">Recommended Providers</Label>
              <div className="mt-2 space-y-2">
                {insight.relevantProviders.map((provider, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>{provider}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      View <ExternalLinkIcon className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="p-3 rounded-md bg-blue-950 border border-blue-800 flex items-start gap-2">
            <InfoIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-200 font-medium">Why This Matters</p>
              <p className="text-sm text-blue-300 mt-1">
                Regularly reviewing your bills and services can save you hundreds or even thousands of dollars per year. Most people overpay for services because they don't regularly shop around for better rates.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleApplyInsight} className="flex items-center gap-1">
            Apply Insight <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
