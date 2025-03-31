
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";

interface ProfileDateOfBirthFieldProps {
  form: UseFormReturn<any>;
  initialDate?: Date | null;
}

export const ProfileDateOfBirthField = ({ 
  form, 
  initialDate 
}: ProfileDateOfBirthFieldProps) => {
  const [dateInput, setDateInput] = useState(
    initialDate ? format(initialDate, "MM/dd/yyyy") : ""
  );

  // Handle manual date input
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInput(value);
    
    try {
      // Validate MM/DD/YYYY format
      if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const parsedDate = parse(value, "MM/dd/yyyy", new Date());
        if (isValid(parsedDate)) {
          form.setValue("dateOfBirth", parsedDate);
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
                    field.onChange(date);
                    if (date) {
                      setDateInput(format(date, "MM/dd/yyyy"));
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
