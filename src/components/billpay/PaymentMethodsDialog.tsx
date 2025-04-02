
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CreditCard, Building, Wallet, Plus, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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

const paymentMethodSchema = z.object({
  cardNumber: z.string()
    .min(15, "Card number must be at least 15 digits")
    .max(19, "Card number cannot exceed 19 digits")
    .refine(value => /^[0-9]+$/.test(value), {
      message: "Card number must contain only digits"
    })
    .optional(),
  cardName: z.string().min(2, "Name must be at least 2 characters").optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  cvv: z.string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV cannot exceed 4 digits")
    .refine(value => /^[0-9]+$/.test(value), {
      message: "CVV must contain only digits"
    })
    .optional(),
  accountNumber: z.string().min(4, "Account number must be at least 4 digits").optional(),
  routingNumber: z.string().min(9, "Routing number must be 9 digits").max(9).optional(),
  accountType: z.string().min(1, "Account type is required").optional(),
  bankName: z.string().min(2, "Bank name is required").optional(),
  nickname: z.string().min(1, "Please provide a name for this payment method").optional(),
});

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
  
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      accountNumber: "",
      routingNumber: "",
      accountType: "",
      bankName: "",
      nickname: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof paymentMethodSchema>) => {
    const newMethod: PaymentMethod = {
      id: `${paymentType}${Date.now()}`,
      type: paymentType,
      name: paymentType === "card" 
        ? values.nickname || `${values.cardName}'s Card` 
        : values.nickname || `${values.bankName} Account`,
      lastFour: paymentType === "card" 
        ? values.cardNumber?.slice(-4) 
        : values.accountNumber?.slice(-4),
      expiry: paymentType === "card" 
        ? `${values.expiryMonth}/${values.expiryYear}` 
        : undefined,
      isDefault: paymentMethods.length === 0,
    };

    onAddPaymentMethod?.(newMethod);
    
    toast({
      title: "Payment method added",
      description: `Your new ${paymentType === "card" ? "card" : "bank account"} has been added successfully.`,
    });
    
    form.reset();
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

  const getPaymentIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case "card": return <CreditCard className="h-5 w-5" />;
      case "bank": return <Building className="h-5 w-5" />;
      case "wallet": return <Wallet className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
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
            {paymentMethods.length > 0 ? (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
                      selectedMethod === method.id ? "border-primary bg-primary/5" : ""
                    } ${selectionMode ? "cursor-pointer" : ""}`}
                    onClick={() => selectionMode && handleSelect(method.id)}
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
                        {!method.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetAsDefault(method.id);
                            }}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePaymentMethod(method.id);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(method.id);
                        }}
                      >
                        Select
                      </Button>
                    )}
                  </div>
                ))}

                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={() => setActiveTab("add")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No payment methods</h3>
                <p className="text-center text-muted-foreground">
                  You haven't added any payment methods yet. Add one to enable payments.
                </p>
                <Button onClick={() => setActiveTab("add")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="py-4">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                    paymentType === "card" ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setPaymentType("card")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5" />
                    <h3 className="font-medium">Credit/Debit Card</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add a credit or debit card for payments
                  </p>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                    paymentType === "bank" ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setPaymentType("bank")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5" />
                    <h3 className="font-medium">Bank Account</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Link a bank account for direct payments
                  </p>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                {paymentType === "card" ? (
                  <>
                    <FormField
                      control={form.control}
                      name="nickname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Nickname</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. My Personal Card" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="1234 5678 9012 3456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cardName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name on Card</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="expiryMonth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Month</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="MM" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({length: 12}, (_, i) => {
                                  const month = (i + 1).toString().padStart(2, '0');
                                  return (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expiryYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="YY" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({length: 10}, (_, i) => {
                                  const year = (new Date().getFullYear() + i).toString().slice(-2);
                                  return (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="nickname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Nickname</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. My Checking Account" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter bank name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="checking">Checking</SelectItem>
                              <SelectItem value="savings">Savings</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="routingNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Routing Number</FormLabel>
                          <FormControl>
                            <Input placeholder="123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter account number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <DialogFooter className="pt-4">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setActiveTab("manage")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Payment Method
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
