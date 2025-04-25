
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, PlusCircle } from "lucide-react";
import { PaymentMethod } from "@/components/billpay/PaymentMethodsDialog";
import { PaymentMethodCard } from "./PaymentMethodCard";

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  selectedMethod: string | null;
  selectionMode: boolean;
  onSelect: (id: string) => void;
  onSetDefault?: (id: string) => void;
  onRemove?: (id: string) => void;
  onAddNew: () => void;
}

export const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({
  paymentMethods,
  selectedMethod,
  selectionMode,
  onSelect,
  onSetDefault,
  onRemove,
  onAddNew
}) => {
  if (paymentMethods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <AlertCircle className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium">No payment methods</h3>
        <p className="text-center text-muted-foreground">
          You haven't added any payment methods yet. Add one to enable payments.
        </p>
        <Button onClick={onAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <PaymentMethodCard
          key={method.id}
          method={method}
          isSelected={selectedMethod === method.id}
          selectionMode={selectionMode}
          onSelect={onSelect}
          onSetDefault={onSetDefault}
          onRemove={onRemove}
        />
      ))}

      <Button 
        variant="outline" 
        className="w-full mt-2" 
        onClick={onAddNew}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Payment Method
      </Button>
    </div>
  );
};
