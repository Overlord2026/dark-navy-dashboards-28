
import React, { useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentMethodsList } from "./payment-methods/PaymentMethodsList";
import { PaymentTypeSelector } from "./payment-methods/PaymentTypeSelector";
import { CardForm, CardFormValues } from "./payment-methods/CardForm";
import { BankAccountForm, BankAccountFormValues } from "./payment-methods/BankAccountForm";
import { useToast } from "@/hooks/use-toast";

// Sample payment methods - in a real app, fetch from API/database
export interface PaymentMethod {
  id: string;
  name: string;
  type: "card" | "bank" | "wallet";
  lastFour?: string;
  expiry?: string;
  isDefault?: boolean;
}

// Default payment methods
export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "card1", name: "Chase Sapphire", type: "card", lastFour: "4123", expiry: "05/27", isDefault: true },
  { id: "bank1", name: "Wells Fargo Checking", type: "bank", lastFour: "6789" },
  { id: "wallet1", name: "PayPal", type: "wallet" }
];

interface PaymentMethodsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethods?: PaymentMethod[];
  onAddPaymentMethod?: (method: PaymentMethod) => void;
  onSelectPaymentMethod?: (methodId: string) => void;
  selectionMode?: boolean;
  onSetDefault?: (methodId: string) => void;
  onRemove?: (methodId: string) => void;
}

export function PaymentMethodsDialog({ 
  isOpen, 
  onClose, 
  paymentMethods = DEFAULT_PAYMENT_METHODS,
  onAddPaymentMethod,
  onSelectPaymentMethod,
  selectionMode = false,
  onSetDefault,
  onRemove
}: PaymentMethodsDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("manage");
  const [paymentType, setPaymentType] = useState<"card" | "bank">("card");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleCardSubmit = (values: CardFormValues) => {
    const newMethod: PaymentMethod = {
      id: `card${Date.now()}`,
      type: "card",
      name: values.nickname || `${values.cardName}'s Card`,
      lastFour: values.cardNumber.slice(-4),
      expiry: `${values.expiryMonth}/${values.expiryYear}`,
      isDefault: paymentMethods.length === 0,
    };

    onAddPaymentMethod?.(newMethod);
    
    toast({
      title: "Payment method added",
      description: `Your new card has been added successfully.`,
    });
    
    setActiveTab("manage");
  };

  const handleBankSubmit = (values: BankAccountFormValues) => {
    const newMethod: PaymentMethod = {
      id: `bank${Date.now()}`,
      type: "bank",
      name: values.nickname || `${values.bankName} ${values.accountType}`,
      lastFour: values.accountNumber.slice(-4),
      isDefault: paymentMethods.length === 0,
    };

    onAddPaymentMethod?.(newMethod);
    
    toast({
      title: "Payment method added",
      description: `Your bank account has been added successfully.`,
    });
    
    setActiveTab("manage");
  };

  const handleSetAsDefault = (id: string) => {
    onSetDefault?.(id);
    toast({
      title: "Default payment method set",
      description: "Your default payment method has been updated.",
    });
  };

  const handleRemovePaymentMethod = (id: string) => {
    onRemove?.(id);
    toast({
      title: "Payment method removed",
      description: "Your payment method has been removed successfully.",
    });
  };

  const handleSelect = (id: string) => {
    setSelectedMethod(id);
    if (selectionMode) {
      onSelectPaymentMethod?.(id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectionMode ? "Select Payment Method" : "Manage Payment Methods"}</DialogTitle>
          <DialogDescription>
            {selectionMode ? 
              "Select a payment method for this transaction." : 
              "Add, edit, or remove payment methods for your account."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manage">Payment Methods</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="py-4">
            <PaymentMethodsList 
              paymentMethods={paymentMethods}
              selectedMethod={selectedMethod}
              selectionMode={selectionMode}
              onSelect={handleSelect}
              onSetDefault={onSetDefault ? handleSetAsDefault : undefined}
              onRemove={onRemove ? handleRemovePaymentMethod : undefined}
              onAddNew={() => setActiveTab("add")}
            />
          </TabsContent>

          <TabsContent value="add" className="py-4">
            <PaymentTypeSelector 
              paymentType={paymentType} 
              onSelect={setPaymentType} 
            />

            {paymentType === "card" ? (
              <CardForm onSubmit={handleCardSubmit} />
            ) : (
              <BankAccountForm onSubmit={handleBankSubmit} />
            )}

            <DialogFooter className="pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setActiveTab("manage")}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                onClick={() => {
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                }}
              >
                Save Payment Method
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
