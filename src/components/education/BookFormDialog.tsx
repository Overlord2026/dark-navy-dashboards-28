
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EducationalResource } from '@/types/education';

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: EducationalResource;
  onSave: (book: Omit<EducationalResource, 'id'> & { id?: string }) => void;
}

const bookFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  author: z.string().min(2, 'Author must be at least 2 characters'),
  coverImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  ghlUrl: z.string().url('Must be a valid URL'),
  level: z.string(),
  isPaid: z.boolean()
});

type BookFormValues = z.infer<typeof bookFormSchema>;

export const BookFormDialog: React.FC<BookFormDialogProps> = ({
  open,
  onOpenChange,
  book,
  onSave
}) => {
  const isEditing = !!book;
  
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: book ? {
      ...book,
      coverImage: book.coverImage || ''
    } : {
      title: '',
      description: '',
      author: '',
      coverImage: '',
      ghlUrl: '',
      level: 'All Levels',
      isPaid: false
    }
  });
  
  function onSubmit(values: BookFormValues) {
    const bookData: Omit<EducationalResource, 'id'> & { id?: string } = {
      title: values.title,
      description: values.description,
      author: values.author,
      ghlUrl: values.ghlUrl,
      level: values.level,
      isPaid: values.isPaid,
      ...(book?.id && { id: book.id }),
      ...(values.coverImage && { coverImage: values.coverImage })
    };
    
    onSave(bookData);
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter book title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter book description" 
                      className="h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/book-cover.jpg" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ghlUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book URL (Amazon or other)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://www.amazon.com/book-title/dp/XXXX" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reading Level</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g., All Levels, Advanced, etc." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">{isEditing ? 'Update' : 'Add'} Book</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
