import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Users } from 'lucide-react';
import type { WindowFormData } from './schedulerApi';

interface WindowEditorProps {
  initialData?: Partial<WindowFormData>;
  onSubmit: (data: WindowFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  offeringTitle?: string;
  offeringCapacity?: number;
}

const timezones = [
  'America/New_York',
  'America/Chicago', 
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'Pacific/Honolulu'
];

export function WindowEditor({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading,
  offeringTitle,
  offeringCapacity 
}: WindowEditorProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<WindowFormData>({
    defaultValues: {
      timezone: 'America/New_York',
      is_available: true,
      max_bookings: offeringCapacity || 1,
      ...initialData
    }
  });

  const isAvailable = watch('is_available');

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {initialData ? 'Edit Time Window' : 'Add New Time Window'}
        </CardTitle>
        {offeringTitle && (
          <p className="text-sm text-muted-foreground">
            For: {offeringTitle}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Date & Time */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="start_time">Start Date & Time *</Label>
              <Input
                id="start_time"
                type="datetime-local"
                {...register('start_time', { required: 'Start time is required' })}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.start_time && (
                <p className="text-sm text-destructive mt-1">{errors.start_time.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="end_time">End Date & Time *</Label>
              <Input
                id="end_time"
                type="datetime-local"
                {...register('end_time', { required: 'End time is required' })}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.end_time && (
                <p className="text-sm text-destructive mt-1">{errors.end_time.message}</p>
              )}
            </div>

            <div>
              <Label>Timezone</Label>
              <Select 
                value={watch('timezone')} 
                onValueChange={(value) => setValue('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace('_', ' ').split('/')[1]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Capacity */}
          {offeringCapacity && offeringCapacity > 1 && (
            <div>
              <Label htmlFor="max_bookings" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Max Bookings for this Window
              </Label>
              <Input
                id="max_bookings"
                type="number"
                {...register('max_bookings', { 
                  min: { value: 1, message: 'Minimum 1 booking' },
                  max: { value: offeringCapacity, message: `Maximum ${offeringCapacity} bookings` }
                })}
                max={offeringCapacity}
              />
              {errors.max_bookings && (
                <p className="text-sm text-destructive mt-1">{errors.max_bookings.message}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Leave blank to use offering capacity ({offeringCapacity})
              </p>
            </div>
          )}

          {/* Availability */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Available for Booking</Label>
              <p className="text-sm text-muted-foreground">
                Uncheck to temporarily disable this window
              </p>
            </div>
            <Switch
              checked={isAvailable}
              onCheckedChange={(checked) => setValue('is_available', checked)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : (initialData ? 'Update Window' : 'Add Window')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}