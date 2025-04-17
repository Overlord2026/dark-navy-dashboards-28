
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
  paymentMethodId: z.string({
    required_error: "Please select a payment method",
  }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PayBillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bill: {
    id: number;
    name: string;
    amount: number;
    dueDate: string;
    category: string;
  } | null;
}

export function PayBillDialog({ isOpen, onClose, bill }: PayBillDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS);
  const [showPaymentMethodsDialog, setShowPaymentMethodsDialog] = useState(false);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethodId: paymentMethods.find(m => m.isDefault)?.id || "",
    },
  });

  // Reset form when dialog opens with a new bill
  React.useEffect(() => {
    if (isOpen && bill) {
      const defaultMethod = paymentMethods.find(m => m.isDefault);
      form.reset({
        paymentMethodId: defaultMethod?.id || "",
      });
      if (defaultMethod) {
        setSelectedPayment(defaultMethod);
      }
    }
  }, [isOpen, bill, form, paymentMethods]);

  function handleSubmit(data: PaymentFormValues) {
    const paymentMethod = paymentMethods.find(m => m.id === data.paymentMethodId);
    setSelectedPayment(paymentMethod || null);
    setShowConfirmation(true);
  }

  function processPayment() {
    if (!bill || !selectedPayment) return;
    
    setIsSubmitting(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(false);
      
      toast({
        title: "Payment successful",
        description: `Payment of $${bill.amount.toFixed(2)} to ${bill.name} was processed successfully.`,
      });
      
      onClose();
    }, 1500);
  }

  const getPaymentIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case "card": return <CreditCard className="h-5 w-5" />;
      case "bank": return <Building className="h-5 w-5" />;
      case "wallet": return <Wallet className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const handleAddPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods(prev => [...prev, method]);
    setShowPaymentMethodsDialog(false);
    
    // Auto-select the newly added payment method
    form.setValue("paymentMethodId", method.id);
    setSelectedPayment(method);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    
    // If the removed method was selected, reset the form
    if (form.getValues().paymentMethodId === id) {
      const defaultMethod = paymentMethods.find(m => m.isDefault && m.id !== id);
      if (defaultMethod) {
        form.setValue("paymentMethodId", defaultMethod.id);
        setSelectedPayment(defaultMethod);
      } else {
        form.setValue("paymentMethodId", "");
        setSelectedPayment(null);
      }
    }
  };

  const handleManagePaymentMethods = () => {
    setShowPaymentMethodsDialog(true);
  };

  if (!bill) return null;

  return (
    <>
      <Dialog open={isOpen && !showConfirmation} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pay Bill</DialogTitle>
            <DialogDescription>
              Select a payment method to pay this bill.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{bill.name}</h3>
                <p className="text-sm text-muted-foreground">{bill.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  Due {new Date(bill.dueDate).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="paymentMethodId"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel>Payment Method</FormLabel>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs"
                        onClick={handleManagePaymentMethods}
                        type="button"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Manage
                      </Button>
                    </div>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-3"
                      >
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`flex items-center space-x-3 rounded-md border p-3 ${
                              field.value === method.id ? "border-primary bg-primary/5" : ""
                            }`}
                          >
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div className="flex flex-1 items-center justify-between">
                              <label
                                htmlFor={method.id}
                                className="flex items-center cursor-pointer"
                              >
                                <div className="mr-3 text-muted-foreground">
                                  {getPaymentIcon(method.type)}
                                </div>
                                <div>
                                  <p className="font-medium">{method.name}</p>
                                  {method.lastFour && (
                                    <p className="text-xs text-muted-foreground">
                                      {method.type === "card" ? "•••• " : ""}
                                      {method.lastFour}
                                      {method.expiry && ` • Exp: ${method.expiry}`}
                                    </p>
                                  )}
                                </div>
                              </label>
                              {method.isDefault && (
                                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                variant="outline" 
                type="button" 
                className="w-full mt-4" 
                onClick={handleManagePaymentMethods}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Payment Method
              </Button>
              
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={!form.getValues().paymentMethodId}>Continue to Payment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to make a payment of <strong>${bill.amount.toFixed(2)}</strong> to <strong>{bill.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4 space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">${bill.amount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium flex items-center">
                {selectedPayment && (
                  <>
                    {getPaymentIcon(selectedPayment.type)}
                    <span className="ml-2">{selectedPayment.name}</span>
                  </>
                )}
              </span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            
            <Separator />
            
            <div className="flex items-start space-x-2 text-sm p-2 bg-amber-50 text-amber-800 rounded border border-amber-200">
              <Info className="h-4 w-4 mt-0.5" />
              <p>For demonstration purposes only. No actual payment will be processed.</p>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmation(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={processPayment}
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm Payment
                </span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PaymentMethodsDialog
        open={showPaymentMethodsDialog}
        onOpenChange={setShowPaymentMethodsDialog}
        paymentMethods={paymentMethods}
        onAddPaymentMethod={handleAddPaymentMethod}
        onSetDefault={handleSetDefault}
        onRemove={handleRemovePaymentMethod}
      />
    </>
  );
}
