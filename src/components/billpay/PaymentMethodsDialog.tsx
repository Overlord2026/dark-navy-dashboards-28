
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CreditCard, Building, Wallet, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { PaymentMethod } from "@/types/payment";

export { PaymentMethod };

// Default payment methods for testing
export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-1",
    name: "Chase Sapphire",
    type: "card",
    lastFour: "4567",
    expiry: "09/25",
    isDefault: true
  },
  {
    id: "pm-2",
    name: "Bank of America Checking",
    type: "bank",
    lastFour: "9876",
    isDefault: false
  },
  {
    id: "pm-3",
    name: "Digital Wallet",
    type: "wallet",
    isDefault: false
  }
];

interface PaymentMethodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: (method: PaymentMethod) => void;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
}

export function PaymentMethodsDialog({
  open,
  onOpenChange,
  paymentMethods,
  onAddPaymentMethod,
  onSetDefault,
  onRemove
}: PaymentMethodsDialogProps) {
  const [activeTab, setActiveTab] = useState("card");
  const [newMethodName, setNewMethodName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [walletProvider, setWalletProvider] = useState("apple-pay");

  const resetForm = () => {
    setNewMethodName("");
    setCardNumber("");
    setExpiryDate("");
    setCardholderName("");
    setBankName("");
    setAccountNumber("");
    setRoutingNumber("");
    setWalletProvider("apple-pay");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMethodName) {
      toast.error("Please provide a name for the payment method");
      return;
    }

    let newMethod: PaymentMethod;
    
    switch (activeTab) {
      case "card":
        if (!cardNumber || !expiryDate) {
          toast.error("Please fill out all required fields");
          return;
        }
        newMethod = {
          id: `pm-${Date.now()}`,
          name: newMethodName,
          type: "card",
          lastFour: cardNumber.slice(-4),
          expiry: expiryDate,
          cardholderName,
          isDefault: paymentMethods.length === 0
        };
        break;
        
      case "bank":
        if (!bankName || !accountNumber) {
          toast.error("Please fill out all required fields");
          return;
        }
        newMethod = {
          id: `pm-${Date.now()}`,
          name: newMethodName,
          type: "bank",
          bankName,
          accountNumber,
          routingNumber,
          lastFour: accountNumber.slice(-4),
          isDefault: paymentMethods.length === 0
        };
        break;
        
      case "wallet":
        newMethod = {
          id: `pm-${Date.now()}`,
          name: `${newMethodName || walletProvider.charAt(0).toUpperCase() + walletProvider.slice(1).replace("-", " ")}`,
          type: "wallet",
          isDefault: paymentMethods.length === 0
        };
        break;
        
      default:
        toast.error("Invalid payment method type");
        return;
    }
    
    onAddPaymentMethod(newMethod);
    resetForm();
    toast.success("Payment method added successfully");
  };

  const getPaymentIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case "card": return <CreditCard className="h-5 w-5" />;
      case "bank": return <Building className="h-5 w-5" />;
      case "wallet": return <Wallet className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment Methods</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div>
            <h3 className="text-lg font-medium">Your Payment Methods</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your saved payment methods
            </p>
            
            {paymentMethods.length > 0 ? (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 rounded-md border p-3 ${
                      method.isDefault ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex flex-1 items-center">
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
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onSetDefault(method.id);
                            toast.success(`${method.name} set as default payment method`);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Set as default</span>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onRemove(method.id);
                          toast.success(`${method.name} removed`);
                        }}
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <span className="sr-only">Remove</span>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No payment methods added yet
              </div>
            )}
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Add Payment Method</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="bank">Bank Account</TabsTrigger>
                  <TabsTrigger value="wallet">Digital Wallet</TabsTrigger>
                </TabsList>
                
                <div>
                  <Label htmlFor="methodName">Name</Label>
                  <Input
                    id="methodName"
                    value={newMethodName}
                    onChange={(e) => setNewMethodName(e.target.value)}
                    placeholder="e.g., Personal Card, Business Checking"
                    className="mb-4"
                  />
                </div>
                
                <TabsContent value="card" className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expiryDate">Expiration Date</Label>
                    <Input
                      id="expiryDate"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="bank" className="space-y-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g., Chase, Bank of America"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456789"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="987654321"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="wallet" className="space-y-4">
                  <div>
                    <Label htmlFor="walletProvider">Wallet Provider</Label>
                    <Select value={walletProvider} onValueChange={setWalletProvider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select wallet provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apple-pay">Apple Pay</SelectItem>
                        <SelectItem value="google-pay">Google Pay</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="venmo">Venmo</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
              
              <Button type="submit" className="w-full mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
