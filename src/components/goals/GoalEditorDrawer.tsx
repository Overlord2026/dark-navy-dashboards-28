// GoalEditorDrawer component with image upload, SMART fields, and account assignment

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Goal, GoalType, CreateGoalRequest, UpdateGoalRequest } from '@/types/goal';
import { useCreateGoal, useUpdateGoal, useAccounts, useAssignAccounts } from '@/hooks/useGoals';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload, 
  X, 
  Calendar, 
  DollarSign, 
  Target,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

const goalTypes: { value: GoalType; label: string; icon: string }[] = [
  { value: 'emergency', label: 'Emergency Fund', icon: '🛡️' },
  { value: 'bucket_list', label: 'Bucket List', icon: '🌍' },
  { value: 'retirement', label: 'Retirement', icon: '🏖️' },
  { value: 'savings', label: 'Savings', icon: '💰' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'wedding', label: 'Wedding', icon: '💍' },
  { value: 'down_payment', label: 'Down Payment', icon: '🏠' },
  { value: 'debt', label: 'Debt Payoff', icon: '💳' },
  { value: 'custom', label: 'Custom Goal', icon: '🎯' },
];

const formSchema = z.object({
  type: z.enum(['bucket_list', 'retirement', 'savings', 'education', 'wedding', 'emergency', 'down_payment', 'debt', 'custom']),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  targetAmount: z.number().min(1, 'Target amount must be greater than 0').optional(),
  targetDate: z.string().optional(),
  monthlyContribution: z.number().min(0, 'Monthly contribution cannot be negative').optional(),
  persona: z.enum(['aspiring', 'retiree']),
  imageUrl: z.string().optional(),
  specific: z.string().min(10, 'Specific goal must be at least 10 characters').optional(),
  measurable: z.string().min(5, 'Measurable criteria must be defined').optional(),
  achievable: z.string().min(10, 'Achievable plan must be detailed').optional(),
  relevant: z.string().min(5, 'Relevance must be explained').optional(),
  timeBound: z.string().min(5, 'Time-bound criteria must be specified').optional(),
  rewards: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface GoalEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: Goal;
  defaultPersona?: 'aspiring' | 'retiree';
}

export const GoalEditorDrawer: React.FC<GoalEditorDrawerProps> = ({
  isOpen,
  onClose,
  goal,
  defaultPersona = 'aspiring'
}) => {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const { data: accounts = [] } = useAccounts();
  const createGoalMutation = useCreateGoal();
  const updateGoalMutation = useUpdateGoal();
  const assignAccountsMutation = useAssignAccounts();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'savings',
      title: '',
      persona: defaultPersona,
      targetAmount: undefined,
      monthlyContribution: undefined,
      imageUrl: '',
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: '',
      rewards: '',
    }
  });

  // Reset form when goal changes
  useEffect(() => {
    if (goal) {
      // Type guard for persona - default to aspiring if not valid
      const validPersona = (goal.persona === 'aspiring' || goal.persona === 'retiree') ? goal.persona : 'aspiring';
      
      form.reset({
        type: goal.type,
        title: goal.title,
        persona: validPersona,
        targetAmount: goal.targetAmount,
        monthlyContribution: goal.monthlyContribution,
        targetDate: goal.targetDate,
        imageUrl: goal.imageUrl,
        specific: goal.smartr?.specific || '',
        measurable: goal.smartr?.measurable || '',
        achievable: goal.smartr?.achievable || '',
        relevant: goal.smartr?.relevant || '',
        timeBound: goal.smartr?.timeBound || '',
        rewards: goal.smartr?.rewards || '',
      });
      setSelectedAccounts(goal.assignedAccountIds);
      setImagePreview(goal.imageUrl || '');
    } else {
      form.reset({
        type: 'savings',
        title: '',
        persona: defaultPersona,
        targetAmount: undefined,
        monthlyContribution: undefined,
        imageUrl: '',
        specific: '',
        measurable: '',
        achievable: '',
        relevant: '',
        timeBound: '',
        rewards: '',
      });
      setSelectedAccounts([]);
      setImagePreview('');
    }
  }, [goal, defaultPersona, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      form.setValue('imageUrl', url);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    form.setValue('imageUrl', '');
  };

  const onSubmit = async (data: FormData) => {
    try {
      const smartr = (data.specific || data.measurable || data.achievable || data.relevant || data.timeBound) ? {
        specific: data.specific || '',
        measurable: data.measurable || '',
        achievable: data.achievable || '',
        relevant: data.relevant || '',
        timeBound: data.timeBound || '',
        rewards: data.rewards,
      } : undefined;

      const goalData = {
        type: data.type,
        title: data.title,
        targetAmount: data.targetAmount,
        targetDate: data.targetDate,
        monthlyContribution: data.monthlyContribution,
        persona: data.persona,
        imageUrl: data.imageUrl,
        smartr,
      };

      let savedGoal: Goal;

      if (goal) {
        // Update existing goal - ensure priority is correct type
        const updatePayload: any = { ...goalData, id: goal.id };
        savedGoal = await updateGoalMutation.mutateAsync(updatePayload);
      } else {
        // Create new goal - ensure priority is correct type
        const createPayload: any = goalData;
        savedGoal = await createGoalMutation.mutateAsync(createPayload);
      }

      // Update account assignments if changed
      if (JSON.stringify(selectedAccounts.sort()) !== JSON.stringify((goal?.assignedAccountIds || []).sort())) {
        await assignAccountsMutation.mutateAsync({
          goalId: savedGoal.id,
          accountIds: selectedAccounts,
        });
      }

      onClose();
    } catch (error) {
      console.error('Failed to save goal:', error);
    }
  };

  const isLoading = createGoalMutation.isPending || updateGoalMutation.isPending || assignAccountsMutation.isPending;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{goal ? 'Edit Goal' : 'Create New Goal'}</SheetTitle>
          <SheetDescription>
            {goal ? 'Update your goal details and SMART criteria' : 'Set up a new goal with SMART criteria for better success'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            {/* Basic Goal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Goal Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Goal Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {goalTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center space-x-2">
                                <span>{type.icon}</span>
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter goal title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Persona */}
                <FormField
                  control={form.control}
                  name="persona"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Persona</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select persona" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="aspiring">Aspiring Families</SelectItem>
                          <SelectItem value="retiree">Retirees</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                <div className="space-y-2">
                  <FormLabel>Goal Image (Optional)</FormLabel>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Goal preview"
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-muted/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload goal image</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>

                {/* Financial Details */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="targetAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="0"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monthlyContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Contribution</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="0"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Target Date */}
                <FormField
                  control={form.control}
                  name="targetDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Date (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="date"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* SMART Criteria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>SMART Goal Criteria</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Define your goal using SMART criteria for better success rates
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="specific"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specific - What exactly do you want to achieve?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Be specific about what you want to accomplish..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="measurable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Measurable - How will you measure progress?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="How will you track and measure your progress..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="achievable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Achievable - How will you accomplish this goal?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your plan to achieve this goal..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relevant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relevant - Why is this goal important to you?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain why this goal matters to you..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeBound"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time-bound - When will you achieve this goal?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Set a timeline and deadlines for your goal..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rewards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rewards - How will you celebrate achieving this goal? (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What reward will you give yourself when you achieve this goal..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Account Assignment */}
            <Card>
              <CardHeader>
                <CardTitle>Account Assignment</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select which accounts you'll use to fund this goal
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {accounts.map((account) => (
                    <div key={account.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={account.id}
                        checked={selectedAccounts.includes(account.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAccounts([...selectedAccounts, account.id]);
                          } else {
                            setSelectedAccounts(selectedAccounts.filter(id => id !== account.id));
                          }
                        }}
                      />
                      <label
                        htmlFor={account.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {account.institution} • {account.type}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${account.balance?.toLocaleString() || '0'}
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};