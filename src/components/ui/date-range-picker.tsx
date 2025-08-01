import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface DatePickerWithRangeProps {
  date?: DateRange;
  onDateChange?: (dateRange: DateRange) => void;
  className?: string;
}

export function DatePickerWithRange({
  date,
  onDateChange,
  className,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[250px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'MMM dd')} -{' '}
                  {format(date.to, 'MMM dd, yyyy')}
                </>
              ) : (
                format(date.from, 'MMM dd, yyyy')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">From</label>
                <input
                  type="date"
                  value={date?.from ? format(date.from, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : undefined;
                    onDateChange?.({ ...date, from: newDate });
                  }}
                  className="w-full mt-1 p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">To</label>
                <input
                  type="date"
                  value={date?.to ? format(date.to, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : undefined;
                    onDateChange?.({ ...date, to: newDate });
                  }}
                  className="w-full mt-1 p-2 border rounded text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDateChange?.({
                  from: new Date(new Date().setDate(new Date().getDate() - 7)),
                  to: new Date()
                })}
              >
                Last 7 days
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDateChange?.({
                  from: new Date(new Date().setDate(new Date().getDate() - 30)),
                  to: new Date()
                })}
              >
                Last 30 days
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}