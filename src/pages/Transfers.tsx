
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

/*
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
*/

const Transfers = () => {
  /*
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [transferType, setTransferType] = useState("one-time");
  
  const handleAddTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!fromAccount || !toAccount || !amount || !transferDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // In a real app, you would send this data to your backend
    console.log("Transfer created:", { fromAccount, toAccount, amount, transferDate, transferType });
    
    // Show success message
    toast.success("Transfer scheduled successfully");
    
    // Close dialog and reset form
    setIsDialogOpen(false);
    resetForm();
  };
  
  const resetForm = () => {
    setFromAccount("");
    setToAccount("");
    setAmount("");
    setTransferDate("");
    setTransferType("one-time");
  };
  
  const handleCancel = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  */
  
  return (
    <ThreeColumnLayout title="Transfers">
      <div className="flex items-center justify-center min-h-[80vh] px-4 py-6">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center text-center py-12">
            <Clock className="h-16 w-16 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p className="text-muted-foreground">
              Transfers functionality is currently under development and will be available soon.
            </p>
          </CardContent>
        </Card>
      </div>

      {/*
      <div className="space-y-4 px-4 py-2 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Transfers</h1>
        <p className="text-muted-foreground">
          Manage and schedule your transfers from one centralized location.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Upcoming Transfers</h2>
            <p className="text-muted-foreground">
              No upcoming transfers scheduled. Add your first transfer to get started.
            </p>
          </div>
          
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Transfer History</h2>
            <p className="text-muted-foreground">
              Your transfer history will appear here once you've made your first transfer.
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <Button onClick={() => setIsDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center gap-2">
            <Plus size={16} />
            Add New Transfer
          </Button>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule a New Transfer</DialogTitle>
              <DialogDescription>
                Fill in the details below to schedule a new money transfer.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddTransfer} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fromAccount">From Account</Label>
                <Select value={fromAccount} onValueChange={setFromAccount}>
                  <SelectTrigger id="fromAccount">
                    <SelectValue placeholder="Select source account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Main Checking Account</SelectItem>
                    <SelectItem value="savings">High-Yield Savings</SelectItem>
                    <SelectItem value="investment">Investment Account</SelectItem>
                    <SelectItem value="trust">Family Trust</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="toAccount">To Account</Label>
                <Select value={toAccount} onValueChange={setToAccount}>
                  <SelectTrigger id="toAccount">
                    <SelectValue placeholder="Select destination account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Main Checking Account</SelectItem>
                    <SelectItem value="savings">High-Yield Savings</SelectItem>
                    <SelectItem value="investment">Investment Account</SelectItem>
                    <SelectItem value="trust">Family Trust</SelectItem>
                    <SelectItem value="external">External Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    id="amount"
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transferDate">Transfer Date</Label>
                <Input
                  id="transferDate"
                  type="date"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transferType">Transfer Type</Label>
                <Select value={transferType} onValueChange={setTransferType}>
                  <SelectTrigger id="transferType">
                    <SelectValue placeholder="Select transfer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time Transfer</SelectItem>
                    <SelectItem value="recurring-weekly">Weekly Recurring</SelectItem>
                    <SelectItem value="recurring-monthly">Monthly Recurring</SelectItem>
                    <SelectItem value="recurring-quarterly">Quarterly Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">Schedule Transfer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      */}
    </ThreeColumnLayout>
  );
};

export default Transfers;
