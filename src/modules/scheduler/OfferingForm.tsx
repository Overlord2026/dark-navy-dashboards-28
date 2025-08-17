import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { OfferingFormData } from './schedulerApi';

interface OfferingFormProps {
  initialData?: Partial<OfferingFormData>;
  onSubmit: (data: OfferingFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  canPublish?: boolean;
  publishBlockReason?: string;
}

export function OfferingForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading, 
  canPublish = true,
  publishBlockReason 
}: OfferingFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<OfferingFormData>({
    defaultValues: {
      visibility: 'public',
      offering_type: 'one_on_one',
      location_type: 'virtual',
      is_published: false,
      ...initialData
    }
  });

  const isPublished = watch('is_published');
  const offeringType = watch('offering_type');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {initialData ? 'Edit Session Offering' : 'Create New Session Offering'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Session Title *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                placeholder="e.g., NIL Strategy Session"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe what participants will learn or achieve..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration_minutes">Duration (minutes) *</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  {...register('duration_minutes', { 
                    required: 'Duration is required',
                    min: { value: 15, message: 'Minimum 15 minutes' },
                    max: { value: 480, message: 'Maximum 8 hours' }
                  })}
                  placeholder="60"
                />
                {errors.duration_minutes && (
                  <p className="text-sm text-destructive mt-1">{errors.duration_minutes.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', { min: { value: 0, message: 'Price must be positive' } })}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Session Type */}
          <div className="space-y-4">
            <div>
              <Label>Session Type</Label>
              <Select value={offeringType} onValueChange={(value) => setValue('offering_type', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_on_one">1-on-1 Session</SelectItem>
                  <SelectItem value="group">Group Session</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {offeringType === 'group' && (
              <div>
                <Label htmlFor="capacity">Max Participants</Label>
                <Input
                  id="capacity"
                  type="number"
                  {...register('capacity', { 
                    min: { value: 2, message: 'Minimum 2 participants for group sessions' },
                    max: { value: 50, message: 'Maximum 50 participants' }
                  })}
                  placeholder="10"
                />
                {errors.capacity && (
                  <p className="text-sm text-destructive mt-1">{errors.capacity.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div>
              <Label>Location Type</Label>
              <Select 
                value={watch('location_type')} 
                onValueChange={(value) => setValue('location_type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virtual">Virtual (Video Call)</SelectItem>
                  <SelectItem value="in_person">In Person</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location_details">Location Details</Label>
              <Input
                id="location_details"
                {...register('location_details')}
                placeholder="Zoom link will be provided / Address / Flexible"
              />
            </div>
          </div>

          {/* Visibility */}
          <div>
            <Label>Visibility</Label>
            <Select 
              value={watch('visibility')} 
              onValueChange={(value) => setValue('visibility', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can book</SelectItem>
                <SelectItem value="link_only">Link Only - Only with direct link</SelectItem>
                <SelectItem value="private">Private - Invite only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Publish Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Publish Live</Label>
                <p className="text-sm text-muted-foreground">
                  Make this offering available for booking
                </p>
              </div>
              <Switch
                checked={isPublished}
                onCheckedChange={(checked) => setValue('is_published', checked)}
                disabled={!canPublish}
              />
            </div>

            {!canPublish && publishBlockReason && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {publishBlockReason}
                </AlertDescription>
              </Alert>
            )}

            {isPublished && (
              <Badge variant="secondary" className="w-fit">
                Live - Accepting Bookings
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : (initialData ? 'Update Offering' : 'Create Offering')}
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