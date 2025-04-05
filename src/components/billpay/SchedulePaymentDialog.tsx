
import React, { useState, useEffect } from "react";
import { format, addDays, isBefore, isToday } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { 
  CalendarIcon,
  CheckCircle,
  CreditCard,
  Building,
  Wallet,
  Bell,
  ArrowRight, 
  ArrowLeft,
  Info,
  Calendar as CalendarFull
} from "lucide-react";

interface SchedulePaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bill: {
    id: number;
    name: string;
    amount: number;
    dueDate: string;
    category: string;
    lateFee?: number;
  } | null;
}

type PaymentMethod = {
  id: string;
  type: "card" | "bank" | "wallet";
  name: string;
  lastFour?: string;
  expiry?: string;
  isDefault?: boolean;
}

// Mock payment methods - in a real app, these would come from an API or context
const PAYMENT_METHODS: PaymentMethod[] = [
  { 
    id: "pm_1", 
    type: "card", 
    name: "Visa ending in 4242", 
    lastFour: "4242",
    expiry: "05/25",
    isDefault: true 
  },
  { 
    id: "pm_2", 
    type: "bank", 
    name: "Chase Checking", 
    lastFour: "9876" 
  },
  { 
    id: "pm_3", 
    type: "wallet", 
    name: "PayPal" 
  }
];

const REMINDER_OPTIONS = [
  { value: "none", label: "No reminder" },
  { value: "same_day", label: "Same day (8am)" },
  { value: "day_before", label: "1 day before" },
  { value: "three_days", label: "3 days before" },
  { value: "week_before", label: "1 week before" },
];

const RECURRENCE_OPTIONS = [
  { value: "none", label: "None (one-time)" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

const NOTIFICATION_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push notification" },
];

// Schema for the payment form
const paymentFormSchema = z.object({
  paymentMethodId: z.string({
    required_error: "Please select a payment method",
  }),
  paymentDate: z.date({
    required_error: "Please select a payment date",
  }),
  isRecurring: z.boolean().default(false),
  recurrenceType: z.string().optional(),
  reminderType: z.string().default("none"),
  reminderMethod: z.string().default("email"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

// Main steps of the payment flow
type PaymentStep = "details" | "confirm" | "success";

export function SchedulePaymentDialog({ isOpen, onClose, bill }: SchedulePaymentDialogProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<PaymentStep>("details");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState<string>("");
  
  // Initialize form with defaults
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethodId: PAYMENT_METHODS.find(m => m.isDefault)?.id || "",
      paymentDate: new Date(),
      isRecurring: false,
      recurrenceType: "none",
      reminderType: "none",
      reminderMethod: "email"
    }
  });

  // Reset form and step when the dialog opens with a new bill
  useEffect(() => {
    if (isOpen && bill) {
      setCurrentStep("details");
      setIsSubmitting(false);
      setTransactionId("");
      const defaultMethod = PAYMENT_METHODS.find(m => m.isDefault);
      
      form.reset({
        paymentMethodId: defaultMethod?.id || "",
        paymentDate: new Date(),
        isRecurring: false,
        recurrenceType: "none",
        reminderType: "none",
        reminderMethod: "email"
      });
      
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod);
      }
    }
  }, [isOpen, bill, form]);

  // Watch form values for recurring payment toggling
  const isRecurring = form.watch("isRecurring");

  // Handle form submission for the initial details step
  function handleNextStep(data: PaymentFormValues) {
    const method = PAYMENT_METHODS.find(m => m.id === data.paymentMethodId);
    setSelectedPaymentMethod(method || null);
    setCurrentStep("confirm");
  }

  // Process the payment
  function processPayment() {
    if (!bill) return;
    
    setIsSubmitting(true);
    
    // In a real app, this would call an API
    setTimeout(() => {
      setIsSubmitting(false);
      // Generate a random transaction ID
      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
      setTransactionId(`TXN-${randomId}`);
      setCurrentStep("success");
    }, 1500);
  }

  // Reset and close the dialog
  function handleClose() {
    form.reset();
    setCurrentStep("details");
    onClose();
  }

  // View receipt (in a real app, this might open a receipt in a new tab or download a PDF)
  function viewReceipt() {
    toast({
      title: "Receipt Access",
      description: `Opening receipt for transaction ${transactionId}`,
    });
    
    // In a real app, this would open a receipt view or PDF
    handleClose();
  }

  // Go back to payment details from confirmation screen
  function handleBackToDetails() {
    setCurrentStep("details");
  }

  // Return to home after successful payment
  function returnToDashboard() {
    handleClose();
  }

  // Get icon for payment method type
  const getPaymentIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case "card": return <CreditCard className="h-5 w-5" />;
      case "bank": return <Building className="h-5 w-5" />;
      case "wallet": return <Wallet className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  // Calculate if payment will be late (if paid after due date)
  const isLatePayment = (paymentDate: Date): boolean => {
    if (!bill) return false;
    return isBefore(new Date(bill.dueDate), paymentDate) && !isToday(new Date(bill.dueDate));
  };

  // Calculate final amount including any late fees
  const calculateFinalAmount = (paymentDate: Date): number => {
    if (!bill) return 0;
    
    const includeLateFee = isLatePayment(paymentDate) && bill.lateFee;
    return includeLateFee ? bill.amount + (bill.lateFee || 0) : bill.amount;
  };

  if (!bill) return null;

  // Main dialog content based on current step
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className={cn(
        "sm:max-w-[500px]",
        currentStep === "success" ? "sm:max-w-[450px]" : ""
      )}>
        {currentStep === "details" && (
          <>
            <DialogHeader>
              <DialogTitle>Schedule Payment</DialogTitle>
              <DialogDescription>
                Set up your bill payment details.
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
              
              {bill.lateFee && (
                <div className="mt-3 text-sm text-amber-600 flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>Late payment may incur a fee of ${bill.lateFee.toFixed(2)}</p>
                </div>
              )}
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleNextStep)} className="space-y-4">
                {/* Payment Method Selection */}
                <FormField
                  control={form.control}
                  name="paymentMethodId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-3"
                        >
                          {PAYMENT_METHODS.map((method) => (
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

                {/* Payment Date Selection */}
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Payment Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                isLatePayment(field.value) && "border-amber-500 text-amber-600"
                              )}
                            >
                              {isLatePayment(field.value) ? (
                                <Info className="mr-2 h-4 w-4 text-amber-500" />
                              ) : (
                                <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                              )}
                              {format(field.value, "PPP")}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => isBefore(date, new Date())}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      
                      {isLatePayment(field.value) && bill.lateFee && (
                        <p className="text-xs text-amber-600 mt-1">
                          This is after the due date. A late fee of ${bill.lateFee.toFixed(2)} may apply.
                        </p>
                      )}
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Recurring Payment Toggle */}
                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Recurring Payment</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Set up automatic recurring payments
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {/* Conditional recurrence type selection */}
                {isRecurring && (
                  <FormField
                    control={form.control}
                    name="recurrenceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recurrence Schedule</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                          defaultValue="monthly"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RECURRENCE_OPTIONS.slice(1).map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {/* Payment Reminder */}
                <FormField
                  control={form.control}
                  name="reminderType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Reminder</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reminder time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {REMINDER_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Reminder method if reminder is set */}
                {form.watch("reminderType") !== "none" && (
                  <FormField
                    control={form.control}
                    name="reminderMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reminder Method</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select notification method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {NOTIFICATION_OPTIONS.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <DialogFooter className="pt-4">
                  <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
                  <Button type="submit">Review Payment</Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {currentStep === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Payment</DialogTitle>
              <DialogDescription>
                Review and confirm your payment details.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Bill Summary */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{bill.name}</h3>
                  <Badge variant="outline">
                    {bill.category}
                  </Badge>
                </div>
              </div>
              
              {/* Payment Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium text-lg">
                      ${calculateFinalAmount(form.getValues("paymentDate")).toFixed(2)}
                    </p>
                    {isLatePayment(form.getValues("paymentDate")) && bill.lateFee && (
                      <p className="text-xs text-amber-600">
                        Includes ${bill.lateFee.toFixed(2)} late fee
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Date</p>
                    <p className="font-medium">
                      {format(form.getValues("paymentDate"), "PPP")}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                {/* Payment Method */}
                {selectedPaymentMethod && (
                  <div className="flex items-center gap-3 p-3 rounded-md border">
                    <div className="text-muted-foreground">
                      {getPaymentIcon(selectedPaymentMethod.type)}
                    </div>
                    <div>
                      <p className="font-medium">{selectedPaymentMethod.name}</p>
                      {selectedPaymentMethod.lastFour && (
                        <p className="text-xs text-muted-foreground">
                          {selectedPaymentMethod.type === "card" ? "•••• " : ""}
                          {selectedPaymentMethod.lastFour}
                          {selectedPaymentMethod.expiry && ` • Exp: ${selectedPaymentMethod.expiry}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Recurrence Information */}
                {form.getValues("isRecurring") && (
                  <>
                    <div className="flex items-center gap-2 p-3 rounded-md border">
                      <CalendarFull className="text-muted-foreground h-5 w-5" />
                      <div>
                        <p className="font-medium">Recurring Payment</p>
                        <p className="text-sm text-muted-foreground">
                          {RECURRENCE_OPTIONS.find(
                            o => o.value === form.getValues("recurrenceType")
                          )?.label || "Monthly"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Reminder Information */}
                {form.getValues("reminderType") !== "none" && (
                  <div className="flex items-center gap-2 p-3 rounded-md border">
                    <Bell className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="font-medium">Payment Reminder</p>
                      <p className="text-sm text-muted-foreground">
                        {REMINDER_OPTIONS.find(o => o.value === form.getValues("reminderType"))?.label} via {" "}
                        {NOTIFICATION_OPTIONS.find(o => o.value === form.getValues("reminderMethod"))?.label}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Legal disclaimer */}
                <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-md">
                  By confirming this payment, you authorize us to process the payment on the specified date using your selected payment method. 
                  {form.getValues("isRecurring") && 
                    " Recurring payments can be cancelled at any time from your payment settings."}
                </div>
              </div>
            </div>
            
            <DialogFooter className="pt-4 flex justify-between">
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleBackToDetails}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={processPayment} 
                disabled={isSubmitting}
                className="flex items-center"
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
                  <>
                    Confirm Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {currentStep === "success" && (
          <>
            <DialogHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500/20 text-green-500">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>
              <DialogTitle className="text-center">Payment Successful</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-6">
              <div className="text-center mb-6">
                <p className="text-muted-foreground">
                  Your payment for {bill.name} has been scheduled successfully.
                </p>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <dl className="divide-y">
                  <div className="px-4 py-3 grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Confirmation #</dt>
                    <dd className="text-sm font-medium text-right">{transactionId}</dd>
                  </div>
                  <div className="px-4 py-3 grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Amount</dt>
                    <dd className="text-sm font-medium text-right">${calculateFinalAmount(form.getValues("paymentDate")).toFixed(2)}</dd>
                  </div>
                  <div className="px-4 py-3 grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Payment Date</dt>
                    <dd className="text-sm font-medium text-right">{format(form.getValues("paymentDate"), "PPP")}</dd>
                  </div>
                  <div className="px-4 py-3 grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Payment Method</dt>
                    <dd className="text-sm font-medium text-right">{selectedPaymentMethod?.name}</dd>
                  </div>
                  {form.getValues("isRecurring") && (
                    <div className="px-4 py-3 grid grid-cols-2">
                      <dt className="text-sm text-muted-foreground">Recurrence</dt>
                      <dd className="text-sm font-medium text-right">
                        {RECURRENCE_OPTIONS.find(o => o.value === form.getValues("recurrenceType"))?.label}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={viewReceipt} 
                className="w-full sm:w-auto"
              >
                View Receipt
              </Button>
              <Button 
                onClick={returnToDashboard}
                className="w-full sm:w-auto"
              >
                Back to Dashboard
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
