import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreditCards } from '@/context/CreditCardsContext';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, CreditCard, Plus, Link2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const creditCardSchema = z.object({
  name: z.string().min(1, 'Card name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  last_four: z.string().length(4, 'Last four digits must be exactly 4 characters'),
  credit_limit: z.number().min(0, 'Credit limit must be positive'),
  current_balance: z.number().min(0, 'Current balance must be positive'),
  statement_balance: z.number().min(0, 'Statement balance must be positive'),
  minimum_payment: z.number().min(0, 'Minimum payment must be positive'),
  due_date: z.string().optional(),
  apr: z.number().min(0, 'APR must be positive').max(100, 'APR must be less than 100%'),
  rewards_program: z.string().optional(),
  notes: z.string().optional(),
});

type CreditCardFormData = z.infer<typeof creditCardSchema>;

const creditCardIssuers = [
  'American Express',
  'Chase',
  'Citi',
  'Capital One',
  'Discover',
  'Bank of America',
  'Wells Fargo',
  'US Bank',
  'Barclays',
  'Synchrony',
  'Other'
];

interface AddCreditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export const AddCreditCardDialog: React.FC<AddCreditCardDialogProps> = ({
  open,
  onOpenChange,
  onComplete
}) => {
  const { addCreditCard } = useCreditCards();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPlaidOption, setShowPlaidOption] = useState(false);

  const form = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      name: '',
      issuer: '',
      last_four: '',
      credit_limit: 0,
      current_balance: 0,
      statement_balance: 0,
      minimum_payment: 0,
      due_date: '',
      apr: 0,
      rewards_program: '',
      notes: ''
    }
  });

  const handleSubmit = async (data: CreditCardFormData) => {
    try {
      setLoading(true);
      await addCreditCard({
        name: data.name,
        issuer: data.issuer,
        last_four: data.last_four,
        credit_limit: data.credit_limit,
        current_balance: data.current_balance,
        statement_balance: data.statement_balance,
        minimum_payment: data.minimum_payment,
        apr: data.apr,
        due_date: data.due_date || null,
        rewards_program: data.rewards_program || null,
        notes: data.notes || null
      });
      
      form.reset();
      onOpenChange(false);
      onComplete?.();
    } catch (error) {
      console.error('Error adding credit card:', error);
      toast({
        title: 'Error',
        description: 'Failed to add credit card. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidLink = () => {
    // TODO: Implement Plaid credit card linking
    toast({
      title: 'Coming Soon',
      description: 'Plaid credit card linking will be available soon.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Add Credit Card
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Link Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Manual Entry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Enter your credit card details manually
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPlaidOption(false)}
                >
                  Enter Manually
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Link with Plaid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Automatically sync balances and transactions
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handlePlaidLink}
                  disabled
                >
                  Link with Plaid
                </Button>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Manual Entry Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Chase Sapphire Preferred" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a name to identify this card
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issuer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select issuer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {creditCardIssuers.map((issuer) => (
                            <SelectItem key={issuer} value={issuer}>
                              {issuer}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="last_four"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last 4 Digits</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1234" 
                          maxLength={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Last 4 digits of your card number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>APR (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="19.99"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Annual Percentage Rate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="credit_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Limit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="5000.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Total credit limit for this card
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="current_balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Balance</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="1250.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Current outstanding balance
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="statement_balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statement Balance</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="1200.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Balance from your latest statement
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minimum_payment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Payment</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="25.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum payment due
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Next payment due date
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rewards_program"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rewards Program</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Cash Back, Travel Points"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Type of rewards program (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional notes about this card..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional notes about this credit card
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Credit Card'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};