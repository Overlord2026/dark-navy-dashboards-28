
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

export interface GoalDetailsProps {
  isOpen: boolean;
  onClose: () => void;
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
});

export function GoalDetailsSidePanel({ isOpen, onClose, goal, onSave, title }: GoalDetailsProps) {
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
      type: goal?.priority || goal?.type || "High"
    },
  });

  // Reset form when goal changes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: goal?.id,
        owner: goal?.owner || fullName,
        name: goal?.title || (goal?.name ? goal.name : `${fullName}'s Retirement Goal`),
        dateOfBirth: goal?.dateOfBirth,
        targetRetirementAge: goal?.targetRetirementAge || 70,
        planningHorizonAge: goal?.planningHorizonAge || 100,
        type: goal?.priority || goal?.type || "High"
      });
    }
  }, [goal, isOpen, form, fullName]);

  const handleSubmit = (data: GoalFormData) => {
    onSave(data);
    onClose();
  };

  const panelTitle = title || (goal?.title 
    ? `${goal.title} Goal` 
    : `${userProfile.firstName}'s Retirement Age`);

  // Mobile uses a full-screen Dialog, desktop uses a side Sheet
  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-[#0F0F2D] text-[#E2E2E2] border-none sm:max-w-[425px]">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">{panelTitle}</h3>
            <GoalForm form={form} onSubmit={handleSubmit} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={form.handleSubmit(handleSubmit)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-[40%] bg-[#0F0F2D] text-[#E2E2E2] border-border/30 p-6 animate-slide-in-right duration-300"
      >
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">{panelTitle}</h3>
          <GoalForm form={form} onSubmit={handleSubmit} />
        </div>
        <SheetFooter className="pt-6 mt-6 border-t border-white/10">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={form.handleSubmit(handleSubmit)}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

interface GoalFormProps {
  form: any;
  onSubmit: (data: GoalFormData) => void;
}

function GoalForm({ form, onSubmit }: GoalFormProps) {
  const { userProfile } = useUser();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormLabel>Name</FormLabel>
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
                    // Allow empty value or only integer values
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
                    // Allow empty value or only integer values
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
      </form>
    </Form>
  );
}
