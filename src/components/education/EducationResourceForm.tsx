import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { zReq, zEnum } from '@/lib/zod-utils';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Upload, FileText, BookOpen, ExternalLink, Save } from 'lucide-react';
import { useEducationResources } from '@/hooks/useEducationResources';
import { EducationResource, EducationResourceFormData } from '@/types/education';
import { toast } from 'sonner';

const RESOURCE_TYPES = ['pdf', 'docx', 'flipbook', 'external_link'] as const;

const resourceFormSchema = z.object({
  title: zReq('Title is required'),
  description: z.string().optional(),
  resource_type: zEnum(RESOURCE_TYPES),
  file_url: z.string().optional(),
  category: zReq('Category is required'),
  is_featured: z.boolean().default(false),
});

type ResourceFormValues = z.infer<typeof resourceFormSchema>;

interface EducationResourceFormProps {
  resource?: EducationResource | null;
  onClose: () => void;
}

export function EducationResourceForm({ resource, onClose }: EducationResourceFormProps) {
  const { addResource, updateResource } = useEducationResources();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!resource;

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: resource?.title || '',
      description: resource?.description || '',
      resource_type: resource?.resource_type || 'pdf',
      file_url: resource?.file_url || '',
      category: resource?.category || 'general',
      is_featured: resource?.is_featured || false,
    },
  });

  const watchResourceType = form.watch('resource_type');
  const requiresFile = ['pdf', 'docx'].includes(watchResourceType);
  const requiresUrl = ['flipbook', 'external_link'].includes(watchResourceType);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill title if empty
      if (!form.getValues('title')) {
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        form.setValue('title', fileName);
      }
    }
  };

  const onSubmit = async (data: ResourceFormValues) => {
    try {
      setIsSubmitting(true);

      if (requiresFile && !selectedFile && !isEditing) {
        toast.error('Please select a file to upload');
        return;
      }

      if (requiresUrl && !data.file_url) {
        toast.error('Please enter a URL');
        return;
      }

      if (isEditing && resource) {
        await updateResource(resource.id, {
          title: data.title,
          description: data.description,
          category: data.category,
          is_featured: data.is_featured,
          file_url: data.file_url,
        });
      } else {
        await addResource(
          {
            title: data.title,
            description: data.description,
            resource_type: data.resource_type,
            file_url: requiresUrl ? data.file_url : undefined,
            category: data.category,
            is_featured: data.is_featured,
            is_active: true,
          },
          selectedFile || undefined
        );
      }

      onClose();
    } catch (error) {
      console.error('Error saving resource:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'docx':
        return FileText;
      case 'flipbook':
        return BookOpen;
      case 'external_link':
        return ExternalLink;
      default:
        return FileText;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'PDF Document';
      case 'docx':
        return 'Word Document';
      case 'flipbook':
        return 'Flipbook';
      case 'external_link':
        return 'External Link';
      default:
        return type;
    }
  };

  return (
    <ThreeColumnLayout title={isEditing ? 'Edit Resource' : 'Add New Resource'}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onClose} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Resource' : 'Add New Resource'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update the resource details' : 'Upload files or add links to educational content'}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resource Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Resource Type Selection */}
                <FormField
                  control={form.control}
                  name="resource_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isEditing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select resource type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pdf">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              PDF Document
                            </div>
                          </SelectItem>
                          <SelectItem value="docx">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Word Document
                            </div>
                          </SelectItem>
                          <SelectItem value="flipbook">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              Flipbook
                            </div>
                          </SelectItem>
                          <SelectItem value="external_link">
                            <div className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              External Link
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload for PDF/DOCX */}
                {requiresFile && (
                  <div className="space-y-2">
                    <Label htmlFor="file">File Upload</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Click to upload or drag and drop your file
                        </p>
                        <Input
                          id="file"
                          type="file"
                          accept={watchResourceType === 'pdf' ? '.pdf' : '.doc,.docx'}
                          onChange={handleFileChange}
                          className="w-full"
                        />
                        {selectedFile && (
                          <p className="text-sm text-green-600 mt-2">
                            Selected: {selectedFile.name}
                          </p>
                        )}
                        {isEditing && resource?.file_url && !selectedFile && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Current file: {resource.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* URL Input for Flipbook/External Link */}
                {requiresUrl && (
                  <FormField
                    control={form.control}
                    name="file_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {watchResourceType === 'flipbook' ? 'Flipbook URL' : 'External Link URL'}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Enter ${watchResourceType === 'flipbook' ? 'flipbook embed' : 'external'} URL...`}
                            {...field}
                            value={String(field.value ?? "")}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Resource title..."
                          {...field}
                          value={String(field.value ?? "")}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the resource..."
                          className="min-h-[100px]"
                          {...field}
                          value={String(field.value ?? "")}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Investment Guides, Tax Planning, Estate Planning..."
                          {...field}
                          value={String(field.value ?? "")}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Featured Toggle */}
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Resource</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Display this resource in the featured section
                        </div>
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

                {/* Submit Button */}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isEditing ? 'Update Resource' : 'Add Resource'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}