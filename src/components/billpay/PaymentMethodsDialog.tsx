
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

interface PaymentMethodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPaymentMethod?: (id: string) => void;
  selectionMode?: boolean;
  selectedMethod?: string | null;
}

export const PaymentMethodsDialog: React.FC<PaymentMethodsDialogProps> = ({
  open,
  onOpenChange,
  onSelectPaymentMethod,
  selectionMode = false,
  selectedMethod = null
}) => {
  const [activeTab, setActiveTab] = useState<string>("view");
  const [paymentType, setPaymentType] = useState<"card" | "bank">("card");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
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
  ]);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const handleRemove = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleAddNew = () => {
    setActiveTab("add");
  };

  const handleSelectMethod = (id: string) => {
    if (onSelectPaymentMethod) {
      onSelectPaymentMethod(id);
      onOpenChange(false);
    }
  };

  const handleAddPaymentMethod = (newMethod: Omit<PaymentMethod, "id" | "isDefault">) => {
    const isFirstMethod = paymentMethods.length === 0;
    const id = `${newMethod.type}-${Date.now()}`;
    
    setPaymentMethods([
      ...paymentMethods,
      {
        ...newMethod,
        id,
        isDefault: isFirstMethod
      }
    ]);
    
    setActiveTab("view");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              paymentMethods={paymentMethods}
              selectedMethod={selectedMethod}
              selectionMode={selectionMode}
              onSelect={handleSelectMethod}
              onSetDefault={handleSetDefault}
              onRemove={handleRemove}
              onAddNew={handleAddNew}
            />
            
            {selectionMode && (
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
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
              <CardForm onSubmit={handleAddPaymentMethod} />
            ) : (
              <BankAccountForm onSubmit={handleAddPaymentMethod} />
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
