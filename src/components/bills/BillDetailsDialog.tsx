
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBills } from "@/hooks/useBills";
import { Bill, BillStatus } from "@/types/bill";
import { format } from "date-fns";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CreditCardIcon, ArrowRightIcon, CalendarDaysIcon, ToggleLeftIcon, FileTextIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BillDetailsDialogProps {
  bill: Bill;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BillDetailsDialog({ bill, isOpen, onOpenChange }: BillDetailsDialogProps) {
  const { updateBill } = useBills();
  const [status, setStatus] = useState<BillStatus>(bill.status);

  const handleStatusChange = (value: BillStatus) => {
    setStatus(value);
  };

  const handleUpdateStatus = () => {
    const updatedBill = { ...bill, status };
    updateBill(updatedBill);
    toast.success(`Bill status updated to ${status}`);
    onOpenChange(false);
  };

  const handlePayNow = () => {
    const updatedBill = { ...bill, status: "Paid" };
    updateBill(updatedBill);
    toast.success("Bill marked as paid");
    onOpenChange(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "Upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5" /> {bill.name}
          </DialogTitle>
          <Badge 
            variant="outline"
            className={`mt-2 ${getStatusColor(bill.status)}`}
          >
            {bill.status}
          </Badge>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <Label className="text-sm text-gray-500">Amount</Label>
              <p className="font-semibold text-xl">${bill.amount.toFixed(2)}</p>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Due Date</Label>
              <p className="font-medium flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" /> 
                {format(new Date(bill.dueDate), "MMMM d, yyyy")}
              </p>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Category</Label>
              <p className="font-medium">{bill.category}</p>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Payment Account</Label>
              <p className="font-medium">{bill.paymentAccount || "Not specified"}</p>
            </div>
            
            {bill.recurring && (
              <>
                <div>
                  <Label className="text-sm text-gray-500">Recurring</Label>
                  <p className="font-medium flex items-center gap-1">
                    <CalendarDaysIcon className="h-4 w-4" /> {bill.recurringPeriod}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm text-gray-500">Auto-Pay</Label>
                  <p className="font-medium flex items-center gap-1">
                    <ToggleLeftIcon className="h-4 w-4" /> {bill.autoPay ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </>
            )}
            
            {bill.provider && (
              <div className="col-span-2">
                <Label className="text-sm text-gray-500">Provider</Label>
                <p className="font-medium">{bill.provider}</p>
              </div>
            )}
          </div>
          
          {bill.notes && (
            <div>
              <Label className="text-sm text-gray-500 flex items-center gap-1">
                <FileTextIcon className="h-4 w-4" /> Notes
              </Label>
              <p className="mt-1 text-sm">{bill.notes}</p>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <Label htmlFor="status">Update Status</Label>
            <div className="flex items-center gap-2 mt-2">
              <Select 
                value={status} 
                onValueChange={(value) => handleStatusChange(value as BillStatus)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleUpdateStatus} size="sm">
                Update
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {bill.status !== "Paid" && (
            <Button onClick={handlePayNow} className="flex items-center gap-1">
              Pay Now <ArrowRightIcon className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
