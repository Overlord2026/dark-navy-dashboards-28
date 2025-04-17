
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CardForm } from "./payment-methods/CardForm";
import { BankAccountForm } from "./payment-methods/BankAccountForm";
import { PaymentTypeSelector } from "./payment-methods/PaymentTypeSelector";
import { PaymentMethodsList } from "./payment-methods/PaymentMethodsList";
import { AlertCircle } from "lucide-react";

export interface PaymentMethod {
  id: string;
  name: string;
  type: "card" | "bank" | "wallet";
  lastFour: string;
  expiry?: string;
  isDefault: boolean;
}

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "card-1",
    name: "Personal Visa",
    type: "card",
    lastFour: "4242",
    expiry: "12/25",
    isDefault: true
  },
  {
    id: "bank-1",
    name: "Chase Checking",
    type: "bank",
    lastFour: "7890",
    isDefault: false
  }
];

interface PaymentMethodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPaymentMethod?: (id: string) => void;
  selectionMode?: boolean;
  selectedMethod?: string | null;
  // For compatibility with PayBillDialog
  isOpen?: boolean;
  onClose?: () => void;
  paymentMethods?: PaymentMethod[];
  onAddPaymentMethod?: (method: PaymentMethod) => void;
  onSetDefault?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export const PaymentMethodsDialog: React.FC<PaymentMethodsDialogProps> = ({
  open,
  onOpenChange,
  onSelectPaymentMethod,
  selectionMode = false,
  selectedMethod = null,
  // For compatibility with PayBillDialog
  isOpen,
  onClose,
  paymentMethods: externalPaymentMethods,
  onAddPaymentMethod: externalAddMethod,
  onSetDefault: externalSetDefault,
  onRemove: externalRemove
}) => {
  // Use props provided by either interface
  const isDialogOpen = open || isOpen || false;
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) onOpenChange(newOpen);
    if (!newOpen && onClose) onClose();
  };

  const [activeTab, setActiveTab] = useState<string>("view");
  const [paymentType, setPaymentType] = useState<"card" | "bank">("card");
  const [internalPaymentMethods, setInternalPaymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS);
  
  // Use either external or internal payment methods
  const methods = externalPaymentMethods || internalPaymentMethods;

  const handleSetDefault = (id: string) => {
    if (externalSetDefault) {
      externalSetDefault(id);
    } else {
      setInternalPaymentMethods(internalPaymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      })));
    }
  };

  const handleRemove = (id: string) => {
    if (externalRemove) {
      externalRemove(id);
    } else {
      setInternalPaymentMethods(internalPaymentMethods.filter(method => method.id !== id));
    }
  };

  const handleAddNew = () => {
    setActiveTab("add");
  };

  const handleSelectMethod = (id: string) => {
    if (onSelectPaymentMethod) {
      onSelectPaymentMethod(id);
      handleOpenChange(false);
    }
  };

  // Create a new payment method from form values
  const createPaymentMethod = (formValues: any, type: "card" | "bank"): Omit<PaymentMethod, "id" | "isDefault"> => {
    if (type === "card") {
      const { nickname, cardNumber, expiryMonth, expiryYear } = formValues;
      return {
        name: nickname || "Credit Card",
        type: "card",
        lastFour: cardNumber ? cardNumber.slice(-4) : "0000",
        expiry: `${expiryMonth || "MM"}/${expiryYear || "YY"}`,
      };
    } else {
      const { nickname, bankName, accountNumber } = formValues;
      return {
        name: nickname || bankName || "Bank Account",
        type: "bank",
        lastFour: accountNumber ? accountNumber.slice(-4) : "0000",
      };
    }
  };

  const handleAddPaymentMethod = (newMethod: Omit<PaymentMethod, "id" | "isDefault">) => {
    const isFirstMethod = methods.length === 0;
    const id = `${newMethod.type}-${Date.now()}`;
    
    const completeMethod: PaymentMethod = {
      ...newMethod,
      id,
      isDefault: isFirstMethod
    };
    
    if (externalAddMethod) {
      externalAddMethod(completeMethod);
    } else {
      setInternalPaymentMethods([
        ...internalPaymentMethods,
        completeMethod
      ]);
    }
    
    setActiveTab("view");
  };

  const handleCardFormSubmit = (values: any) => {
    const newMethod = createPaymentMethod(values, "card");
    handleAddPaymentMethod(newMethod);
  };

  const handleBankFormSubmit = (values: any) => {
    const newMethod = createPaymentMethod(values, "bank");
    handleAddPaymentMethod(newMethod);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{selectionMode ? "Select Payment Method" : "Payment Methods"}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="view">My Payment Methods</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4 mt-4">
            <PaymentMethodsList
              paymentMethods={methods}
              selectedMethod={selectedMethod}
              selectionMode={selectionMode}
              onSelect={handleSelectMethod}
              onSetDefault={handleSetDefault}
              onRemove={handleRemove}
              onAddNew={handleAddNew}
            />
            
            {selectionMode && (
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-4 mt-4">
            <PaymentTypeSelector
              paymentType={paymentType}
              onSelect={setPaymentType}
            />

            {paymentType === "card" ? (
              <CardForm onSubmit={handleCardFormSubmit} />
            ) : (
              <BankAccountForm onSubmit={handleBankFormSubmit} />
            )}

            <div className="rounded-md bg-blue-50 p-4 mt-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Secure payments</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      All payment information is encrypted and securely stored. 
                      We do not store your full card details on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
