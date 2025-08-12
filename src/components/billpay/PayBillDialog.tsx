
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Building, 
  Wallet, 
  CheckCircle2, 
  Info,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PaymentMethodsDialog, PaymentMethod, DEFAULT_PAYMENT_METHODS } from "./PaymentMethodsDialog";

const paymentFormSchema = z.object({
  paymentMethodId: z.string().min(1, { message: "Please select a payment method" }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PayBillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  billId: string;
  onPayBill: (billId: string, paymentMethod: string) => Promise<void>;
}

export function PayBillDialog({ isOpen, onClose, billId, onPayBill }: PayBillDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  
  const paymentMethods = [
    { value: "checking", label: "Checking Account", icon: Building },
    { value: "savings", label: "Savings Account", icon: Building },
    { value: "credit_card", label: "Credit Card", icon: CreditCard },
    { value: "debit_card", label: "Debit Card", icon: CreditCard },
    { value: "mobile_payment", label: "Mobile Payment", icon: Wallet }
  ];

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onPayBill(billId, paymentMethod);
      onClose();
      setPaymentMethod("");
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pay Bill</DialogTitle>
          <DialogDescription>
            Select your payment method to process this bill payment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="payment-method" className="text-sm font-medium">Payment Method</label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Choose payment method</option>
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isSubmitting || !paymentMethod}>
            {isSubmitting ? "Processing..." : "Pay Bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
