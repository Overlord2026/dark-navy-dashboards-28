
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Building, Wallet } from "lucide-react";
import { PaymentMethod } from "@/components/billpay/PaymentMethodsDialog";

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected?: boolean;
  selectionMode?: boolean;
  onSelect?: (id: string) => void;
  onSetDefault?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  isSelected = false,
  selectionMode = false,
  onSelect,
  onSetDefault,
  onRemove
}) => {
  const getPaymentIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case "card": return <CreditCard className="h-5 w-5" />;
      case "bank": return <Building className="h-5 w-5" />;
      case "wallet": return <Wallet className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(method.id);
  };

  const handleSetDefault = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSetDefault?.(method.id);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(method.id);
  };

  return (
    <div
      className={`flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
        isSelected ? "border-primary bg-primary/5" : ""
      } ${selectionMode ? "cursor-pointer" : ""}`}
      onClick={selectionMode ? handleSelect : undefined}
    >
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">
          {getPaymentIcon(method.type)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{method.name}</p>
            {method.isDefault && !selectionMode && (
              <Badge variant="outline" className="text-xs">Default</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {method.type === "card" ? "•••• " : ""}
            {method.lastFour}
            {method.expiry && ` • Exp: ${method.expiry}`}
          </p>
        </div>
      </div>
      
      {!selectionMode ? (
        <div className="flex gap-2">
          {!method.isDefault && onSetDefault && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSetDefault}
            >
              Set Default
            </Button>
          )}
          {onRemove && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleRemove}
            >
              Remove
            </Button>
          )}
        </div>
      ) : (
        <Button 
          variant="secondary" 
          size="sm"
          onClick={handleSelect}
        >
          Select
        </Button>
      )}
    </div>
  );
};
