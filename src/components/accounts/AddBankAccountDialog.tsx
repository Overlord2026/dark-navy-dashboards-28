import React from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface BankAccountFormData {
  name: string;
  type: string;
  balance: string;
}

interface AddBankAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack?: () => void;
}

export function AddBankAccountDialog({
  open,
  onOpenChange,
  onBack
}: AddBankAccountDialogProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const form = useForm<BankAccountFormData>({
    defaultValues: {
      name: "",
      type: "",
      balance: ""
    }
  });

  const bankAccountTypes = [
    { value: "checking", label: "Checking" },
    { value: "savings", label: "Savings" },
    { value: "money-market", label: "Money Market" },
    { value: "cd", label: "CD" },
    { value: "hsa", label: "HSA" },
    { value: "other", label: "Other" }
  ];

  const onSubmit = (data: BankAccountFormData) => {
    const balance = parseFloat(data.balance);
    if (isNaN(balance)) {
      toast({
        title: "Invalid Balance",
        description: "Please enter a valid balance amount",
        variant: "destructive"
      });
      return;
    }

    // TODO: Here you would typically save to your backend/state management
    console.log("Bank account data:", { ...data, balance });
    
    toast({
      title: "Bank Account Added",
      description: `${data.name} has been added successfully`
    });
    
    form.reset();
    onOpenChange(false);
  };

  const handleBack = () => {
    form.reset();
    if (onBack) {
      onBack();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-md mx-auto",
        isMobile ? "w-[95vw] max-h-[90vh] overflow-y-auto" : "w-full"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            "text-center",
            isMobile ? "text-lg" : "text-xl"
          )}>
            Add Bank Account Manually
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Account name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Chase Checking Account"
                      {...field}
                      className={cn(isMobile ? "text-base" : "")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type Field */}
            <FormField
              control={form.control}
              name="type"
              rules={{ required: "Account type is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={cn(isMobile ? "text-base" : "")}>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bankAccountTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Balance Field */}
            <FormField
              control={form.control}
              name="balance"
              rules={{ 
                required: "Balance is required",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Please enter a valid amount (e.g., 1000.00)"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        placeholder="0.00"
                        {...field}
                        className={cn(
                          "pl-8",
                          isMobile ? "text-base" : ""
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className={cn(
              "flex gap-3 pt-4",
              isMobile ? "flex-col" : "flex-row justify-end"
            )}>
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className={cn(
                  "flex items-center gap-2",
                  isMobile ? "w-full" : ""
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                className={cn(isMobile ? "w-full" : "")}
              >
                Add Account
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}