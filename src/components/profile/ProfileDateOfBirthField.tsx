
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { isValid } from "date-fns";
import { cn } from "@/lib/utils";

interface ProfileDateOfBirthFieldProps {
  form: UseFormReturn<any>;
  initialDate?: Date | null;
}

export const ProfileDateOfBirthField = ({ 
  form, 
  initialDate 
}: ProfileDateOfBirthFieldProps) => {
  // Helper function to format date without timezone issues
  const formatDateSafely = (date: Date): string => {
    if (!date || !isValid(date)) return "";
    // Use local date parts to avoid timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  };

  // Helper function to create date from parts without timezone issues
  const createDateSafely = (month: number, day: number, year: number): Date => {
    // Create date in local timezone at noon to avoid DST issues
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  };

  // Initialize dateInput with safely formatted initial date
  const [dateInput, setDateInput] = useState(() => {
    if (!initialDate || !isValid(initialDate)) return "";
    return formatDateSafely(initialDate);
  });

  // Handle manual date input
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInput(value);
    
    try {
      // Validate MM/DD/YYYY format
      if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [month, day, year] = value.split('/').map(Number);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900 && year <= new Date().getFullYear()) {
          const newDate = createDateSafely(month, day, year);
          if (isValid(newDate)) {
            form.setValue("dateOfBirth", newDate);
          }
        }
      }
    } catch (error) {
      console.log("Invalid date format:", error);
    }
  };

  return (
    <FormField
      control={form.control}
      name="dateOfBirth"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Date of Birth</FormLabel>
          <div className="flex items-center space-x-2">
            <FormControl>
              <Input
                placeholder="MM/DD/YYYY"
                value={dateInput}
                onChange={handleDateInputChange}
                className="flex-1"
              />
            </FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  size="icon"
                  type="button"
                  className="h-10 w-10"
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    if (date) {
                      // Create a new date in local timezone at noon
                      const safeDate = createDateSafely(
                        date.getMonth() + 1,
                        date.getDate(),
                        date.getFullYear()
                      );
                      field.onChange(safeDate);
                      setDateInput(formatDateSafely(safeDate));
                    }
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
