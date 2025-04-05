
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
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell, CalendarClock, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ReminderSetupDialogProps {
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

const reminderSchema = z.object({
  enabled: z.boolean().default(true),
  timing: z.string().default("day_before"),
  method: z.string().default("email"),
  recurring: z.boolean().default(false),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

const TIMING_OPTIONS = [
  { value: "same_day", label: "Same day (8am)" },
  { value: "day_before", label: "1 day before" },
  { value: "three_days", label: "3 days before" },
  { value: "week_before", label: "1 week before" },
];

const METHOD_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push notification" },
  { value: "all", label: "All methods" },
];

export function ReminderSetupDialog({ isOpen, onClose, bill }: ReminderSetupDialogProps) {
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      enabled: true,
      timing: "day_before",
      method: "email",
      recurring: false,
    }
  });

  const handleSetupReminders = (data: ReminderFormValues) => {
    // In a real app this would save to a database
    console.log("Setting up reminders:", data);
    
    setTimeout(() => {
      setSuccess(true);
      
      toast({
        title: "Reminders Set",
        description: `You'll receive a ${METHOD_OPTIONS.find(o => o.value === data.method)?.label} reminder ${TIMING_OPTIONS.find(o => o.value === data.timing)?.label.toLowerCase()}.`,
      });
    }, 500);
  };

  const handleClose = () => {
    setSuccess(false);
    form.reset();
    onClose();
  };

  if (!bill) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        {!success ? (
          <>
            <DialogHeader>
              <DialogTitle>Set Payment Reminder</DialogTitle>
              <DialogDescription>
                Set up notifications for upcoming bill payment.
              </DialogDescription>
            </DialogHeader>
            
            <div className="p-4 bg-muted rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{bill.name}</h3>
                  <p className="text-sm text-muted-foreground">{bill.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Due {new Date(bill.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSetupReminders)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Reminders</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Get notifications before this bill is due
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
                
                {form.watch("enabled") && (
                  <>
                    <FormField
                      control={form.control}
                      name="timing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remind Me</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timing" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIMING_OPTIONS.map(option => (
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
                    
                    <FormField
                      control={form.control}
                      name="method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notification Method</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {METHOD_OPTIONS.map(option => (
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
                    
                    <FormField
                      control={form.control}
                      name="recurring"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Recurring Reminder</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Set this reminder for future bills from {bill.name}
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
                    
                    <Separator />
                  </>
                )}
                
                <DialogFooter>
                  <Button variant="outline" onClick={handleClose} type="button">
                    Cancel
                  </Button>
                  <Button type="submit">
                    {form.watch("enabled") ? "Set Reminders" : "Save Preference"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <DialogTitle>Reminders Set</DialogTitle>
            </DialogHeader>
            
            <div className="py-4 text-center">
              <p>
                You'll receive a{" "}
                {METHOD_OPTIONS.find(o => o.value === form.getValues("method"))?.label.toLowerCase()}{" "}
                reminder{" "}
                {TIMING_OPTIONS.find(o => o.value === form.getValues("timing"))?.label.toLowerCase()}{" "}
                this bill is due.
              </p>
              
              <div className="flex flex-col gap-3 mt-6 text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>
                    {METHOD_OPTIONS.find(o => o.value === form.getValues("method"))?.label}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  <span>
                    {TIMING_OPTIONS.find(o => o.value === form.getValues("timing"))?.label}
                  </span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
