
import React, { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useUser } from "@/context/UserContext";
import { Goal } from "@/components/financial-plans/GoalsList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";

export interface GoalDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel?: () => void;
  goal?: Goal;
  onSave: (goalData: GoalFormData) => void;
  title?: string;
}

export interface GoalFormData {
  id?: string;
  owner: string;
  name: string; 
  dateOfBirth?: Date;
  targetRetirementAge?: number;
  planningHorizonAge?: number;
  type?: string;
  targetDate?: Date;
  targetAmount?: number;
  description?: string;
  // Asset Purchase fields
  purchasePrice?: number;
  financingMethod?: string;
  annualAppreciation?: string;
  // Education fields
  studentName?: string;
  startYear?: number;
  endYear?: number;
  tuitionEstimate?: number;
  // Vacation fields 
  destination?: string;
  estimatedCost?: number;
  // Generic fields that might be used by multiple goal types
  amountDesired?: number;
}

// Schema for validation
const goalFormSchema = z.object({
  id: z.string().optional(),
  owner: z.string().min(1, "Owner is required"),
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.date().optional(),
  targetRetirementAge: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int("Must be a whole number").positive("Must be positive").optional()
  ),
  planningHorizonAge: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int("Must be a whole number").positive("Must be positive").optional()
  ),
  type: z.string().optional(),
  targetDate: z.date().optional(),
  targetAmount: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive("Must be positive").optional()
  ),
  description: z.string().optional(),
  // Asset Purchase fields
  purchasePrice: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive("Must be positive").optional()
  ),
  financingMethod: z.string().optional(),
  annualAppreciation: z.string().optional(),
  // Education fields
  studentName: z.string().optional(),
  startYear: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int("Must be a whole number").positive("Must be positive").optional()
  ),
  endYear: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int("Must be a whole number").positive("Must be positive").optional()
  ),
  tuitionEstimate: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive("Must be positive").optional()
  ),
  // Vacation fields
  destination: z.string().optional(),
  estimatedCost: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive("Must be positive").optional()
  ),
  // Generic fields
  amountDesired: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive("Must be positive").optional()
  ),
});

export function GoalDetailsSidePanel({ isOpen, onClose, onCancel, goal, onSave, title }: GoalDetailsProps) {
  const { userProfile } = useUser();
  const isMobile = useIsMobile();
  const fullName = `${userProfile.firstName} ${userProfile.lastName}`;
  
  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      id: goal?.id,
      owner: goal?.owner || fullName,
      name: goal?.title || (goal?.name ? goal.name : `${fullName}'s Retirement Goal`),
      dateOfBirth: goal?.dateOfBirth,
      targetRetirementAge: goal?.targetRetirementAge || 70,
      planningHorizonAge: goal?.planningHorizonAge || 100,
      type: goal?.priority || goal?.type || "High",
      targetDate: goal?.targetDate,
      targetAmount: goal?.targetAmount,
      description: goal?.description,
      // Asset Purchase defaults
      purchasePrice: undefined,
      financingMethod: "Cash",
      annualAppreciation: "None",
      // Education defaults
      studentName: undefined,
      startYear: new Date().getFullYear() + 1,
      endYear: new Date().getFullYear() + 5,
      tuitionEstimate: undefined,
      // Vacation defaults
      destination: undefined,
      estimatedCost: undefined,
      // Generic defaults
      amountDesired: undefined,
    },
  });

  // Reset form when goal changes
  useEffect(() => {
    if (isOpen) {
      const isRetirement = 
        goal?.targetRetirementAge !== undefined || 
        goal?.type === "Retirement" || 
        goal?.priority === "Retirement";
      
      const defaultGoalName = getDefaultGoalName(goal?.type || "", fullName);
      
      form.reset({
        id: goal?.id,
        owner: goal?.owner || fullName,
        name: goal?.title || (goal?.name ? goal.name : defaultGoalName),
        dateOfBirth: goal?.dateOfBirth,
        targetRetirementAge: goal?.targetRetirementAge || (isRetirement ? 70 : undefined),
        planningHorizonAge: goal?.planningHorizonAge || (isRetirement ? 100 : undefined),
        type: goal?.priority || goal?.type || (isRetirement ? "Retirement" : ""),
        targetDate: goal?.targetDate,
        targetAmount: goal?.targetAmount,
        description: goal?.description,
        // Reset asset purchase fields
        purchasePrice: goal?.purchasePrice,
        financingMethod: goal?.financingMethod || "Cash",
        annualAppreciation: goal?.annualAppreciation || "None",
        // Reset education fields
        studentName: goal?.studentName,
        startYear: goal?.startYear || new Date().getFullYear() + 1,
        endYear: goal?.endYear || new Date().getFullYear() + 5,
        tuitionEstimate: goal?.tuitionEstimate,
        // Reset vacation fields
        destination: goal?.destination,
        estimatedCost: goal?.estimatedCost,
        // Reset generic fields
        amountDesired: goal?.amountDesired,
      });
    }
  }, [goal, isOpen, form, fullName]);

  // Helper function to generate default goal name based on type
  const getDefaultGoalName = (goalType: string, ownerName: string): string => {
    if (!goalType) return "";
    return `${ownerName}'s ${goalType}`;
  };

  const handleSubmit = (data: GoalFormData) => {
    onSave(data);
    onClose();
  };
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const panelTitle = title || (goal?.title 
    ? `${goal.title} Goal` 
    : `${userProfile.firstName}'s Retirement Age`);
  
  const isRetirementGoal = 
    goal?.targetRetirementAge !== undefined || 
    goal?.type === "Retirement" || 
    goal?.priority === "Retirement";

  const goalType = goal?.type || goal?.priority || "";

  // Mobile uses a full-screen Dialog, desktop uses a side Sheet
  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="bg-[#0F0F2D] text-[#E2E2E2] border-none sm:max-w-[425px]">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">{panelTitle}</h3>
            <GoalForm 
              form={form} 
              onSubmit={handleSubmit} 
              goalType={goalType}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={form.handleSubmit(handleSubmit)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <SheetContent 
        side="right" 
        className="w-[40%] bg-[#0F0F2D] text-[#E2E2E2] border-border/30 p-6 animate-slide-in-right duration-300"
      >
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">{panelTitle}</h3>
          <GoalForm 
            form={form} 
            onSubmit={handleSubmit} 
            goalType={goalType}
          />
        </div>
        <SheetFooter className="pt-6 mt-6 border-t border-white/10">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={form.handleSubmit(handleSubmit)}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

interface GoalFormProps {
  form: any;
  onSubmit: (data: GoalFormData) => void;
  goalType: string;
}

function GoalForm({ form, onSubmit, goalType }: GoalFormProps) {
  const { userProfile } = useUser();
  
  // Determine which fields to show based on goal type
  const isRetirementGoal = goalType === "Retirement";
  const isAssetPurchase = goalType === "Asset Purchase" || goalType === "Home Purchase";
  const isEducation = goalType === "Education";
  const isVacation = goalType === "Vacation";
  const isVehicle = goalType === "Vehicle";
  const isCashReserve = goalType === "Cash Reserve";
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Common fields for all goal types */}
        <FormField
          control={form.control}
          name="owner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-[#1A1A2E] border-border/30">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#1A1A2E] border-border/30">
                  <SelectItem value={`${userProfile.firstName} ${userProfile.lastName}`}>
                    {userProfile.firstName} {userProfile.lastName}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-[#FF4D4D]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Name</FormLabel>
              <FormControl>
                <Input 
                  className="bg-[#1A1A2E] border-border/30" 
                  placeholder="Goal name" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-[#FF4D4D]" />
            </FormItem>
          )}
        />

        {/* Retirement Goal Fields */}
        {isRetirementGoal && (
          <>
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-[#1A1A2E] border-border/30",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1A1A2E] border-border/30">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-[#FF4D4D]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetRetirementAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Retirement Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className={cn(
                        "bg-[#1A1A2E] border-border/30",
                        form.formState.errors.targetRetirementAge && "border-[#FF4D4D] focus-visible:ring-[#FF4D4D]"
                      )}
                      placeholder="70"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[0-9]+$/.test(value)) {
                          field.onChange(value === '' ? undefined : parseInt(value, 10));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-[#FF4D4D]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="planningHorizonAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planning Horizon (Age)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className={cn(
                        "bg-[#1A1A2E] border-border/30",
                        form.formState.errors.planningHorizonAge && "border-[#FF4D4D] focus-visible:ring-[#FF4D4D]"
                      )}
                      placeholder="100"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[0-9]+$/.test(value)) {
                          field.onChange(value === '' ? undefined : parseInt(value, 10));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-[#FF4D4D]" />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Asset Purchase / Home Purchase Fields */}
        {isAssetPurchase && (
          <>
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className={cn(
                        "bg-[#1A1A2E] border-border/30",
                        form.formState.errors.purchasePrice && "border-[#FF4D4D] focus-visible:ring-[#FF4D4D]"
                      )}
                      placeholder="$"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                          field.onChange(value === '' ? undefined : parseFloat(value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-[#FF4D4D]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="financingMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financing Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-[#1A1A2E] border-border/30">
                        <SelectValue placeholder="Select financing method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1A1A2E] border-border/30">
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Loan">Loan</SelectItem>
                      <SelectItem value="Mortgage">Mortgage</SelectItem>
                      <SelectItem value="Lease">Lease</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[#FF4D4D]" />
                </FormItem>
              )}
            />

            {goalType === "Home Purchase" || goalType === "Asset Purchase" ? (
              <FormField
                control={form.control}
                name="annualAppreciation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Appreciation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#1A1A2E] border-border/30">
                          <SelectValue placeholder="Select appreciation rate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#1A1A2E] border-border/30">
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="1%">1%</SelectItem>
                        <SelectItem value="2%">2%</SelectItem>
                        <SelectItem value="3%">3%</SelectItem>
                        <SelectItem value="4%">4%</SelectItem>
                        <SelectItem value="5%">5%</SelectItem>
                        <SelectItem value="6%">6%</SelectItem>
                        <SelectItem value="7%">7%</SelectItem>
                        <SelectItem value="8%">8%</SelectItem>
                        <SelectItem value="9%">9%</SelectItem>
                        <SelectItem value="10%">10%</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[#FF4D4D]" />
                  </FormItem>
                )}
              />
            ) : null}
          </>
        )}

        {/* Education Fields */}
        {isEducation && (
          <>
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-[#1A1A2E] border-border/30" 
                      placeholder="Student name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-[#FF4D4D]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tuitionEstimate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tuition Estimate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className={cn(
                        "bg-[#1A1A2E] border-border/30",
                        form.formState.errors.tuitionEstimate && "border-[#FF4D4D] focus-visible:ring-[#FF4D4D]"
                      )}
                      placeholder="$"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                          field.onChange(value === '' ? undefined : parseFloat(value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-[#FF4D4D]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className={cn(
                        "bg-[#1A1A2E] border-border/30",
                        form.formState.errors.startYear && "border-[#FF4D4D] focus-visible:ring-[#FF4D4D]"
                      )}
                      placeholder={new Date().getFullYear().toString()}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[0-9]+$/.test(value)) {
                          field.onChange(value === '' ? undefined : parseInt(value, 10));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-[#FF4D4D]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className={cn(
                        "bg-[#1A1A2E] border-border/30",
                        form.formState.errors.endYear && "border-[#FF4D4D] focus-visible:ring-[#FF4D4D]"
                      )}
                      placeholder={(new Date().getFullYear() + 4).toString()}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[0-9]+$/.test(value)) {
                          field.onChange(value === '' ? undefined : parseInt(value, 10));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-[#FF4D4D]" />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Vacation Fields */}
        {isVacation && (
          <>
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-[#1A1A2E] border-border/30" 
                      placeholder="Destination" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-[#FF4D4D]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className={cn(
                        "bg-[#1A1A2E] border-border/30",
                        form.formState.errors.estimatedCost && "border-[#FF4D4D] focus-visible:ring-[#FF4D4D]"
                      )}
                      placeholder="$"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                          field.onChange(value === '' ? undefined : parseFloat(value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-[#FF4D4D]" />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Vehicle Fields (similar to Asset Purchase but with fewer fields) */}
        {isVehicle && (
          <>
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className={cn(
                        "bg-[#1A1A2E] border-border/30",
                        form.formState.errors.purchasePrice && "border-[#FF4D4D] focus-visible:ring-[#FF4D4D]"
                      )}
                      placeholder="$"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                          field.onChange(value === '' ? undefined : parseFloat(value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-[#FF4D4D]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="financingMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financing Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-[#1A1A2E] border-border/30">
                        <SelectValue placeholder="Select financing method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1A1A2E] border-border/30">
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Loan">Loan</SelectItem>
                      <SelectItem value="Lease">Lease</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[#FF4D4D]" />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Cash Reserve Fields */}
        {isCashReserve && (
          <FormField
            control={form.control}
            name="amountDesired"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Desired</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className={cn(
                      "bg-[#1A1A2E] border-border/30",
                      form.formState.errors.amountDesired && "border-[#FF4D4D] focus-visible:ring-[#FF4D4D]"
                    )}
                    placeholder="$"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                        field.onChange(value === '' ? undefined : parseFloat(value));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage className="text-[#FF4D4D]" />
              </FormItem>
            )}
          />
        )}

        {/* Target Date field for most goal types */}
        {!isEducation && (
          <FormField
            control={form.control}
            name="targetDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-[#1A1A2E] border-border/30",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? 
                          (isAssetPurchase || isVehicle) ? 
                            format(field.value, "MM/yyyy") : 
                            format(field.value, "PPP") 
                          : <span>Pick a target date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1A1A2E] border-border/30">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-[#FF4D4D]" />
              </FormItem>
            )}
          />
        )}

        {/* Target Amount field for goal types that don't have a specific amount field */}
        {!isAssetPurchase && !isEducation && !isVacation && !isVehicle && !isCashReserve && !isRetirementGoal && (
          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className={cn(
                      "bg-[#1A1A2E] border-border/30",
                      form.formState.errors.targetAmount && "border-[#FF4D4D] focus-visible:ring-[#FF4D4D]"
                    )}
                    placeholder="$"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                        field.onChange(value === '' ? undefined : parseFloat(value));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage className="text-[#FF4D4D]" />
              </FormItem>
            )}
          />
        )}

        {/* Description field for all goal types */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  className="bg-[#1A1A2E] border-border/30 min-h-20" 
                  placeholder="Enter a short description of your goal" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-[#FF4D4D]" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
