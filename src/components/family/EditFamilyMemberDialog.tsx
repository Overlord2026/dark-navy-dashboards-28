import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFamilyMembers, FamilyMember, AddFamilyMemberData } from '@/hooks/useFamilyMembers';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relationship: z.enum(['aunt', 'brother', 'daughter', 'domestic-partner', 'father', 'father-in-law', 'grandfather', 'grandmother', 'granddaughter', 'grandson', 'mother', 'mother-in-law', 'nephew', 'niece', 'other-individual']),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  access_level: z.enum(['full', 'limited']),
});

type FormData = z.infer<typeof formSchema>;

interface EditFamilyMemberDialogProps {
  member: FamilyMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditFamilyMemberDialog: React.FC<EditFamilyMemberDialogProps> = ({ 
  member, 
  open, 
  onOpenChange 
}) => {
  const { updateFamilyMember } = useFamilyMembers();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      relationship: 'aunt',
      email: '',
      access_level: 'full',
    },
  });

  useEffect(() => {
    if (member) {
      form.reset({
        name: member.name,
        relationship: member.relationship as any,
        email: member.email || '',
        access_level: member.access_level as any,
      });
    }
  }, [member, form]);

  const onSubmit = async (data: FormData) => {
    if (!member) return;

    const updateData: Partial<AddFamilyMemberData> = {
      name: data.name,
      relationship: data.relationship,
      email: data.email,
      access_level: data.access_level,
    };

    const success = await updateFamilyMember(member.id, updateData);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Family Member</DialogTitle>
          <DialogDescription>
            Update the information for this family member.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter family member's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="aunt">Aunt</SelectItem>
                      <SelectItem value="brother">Brother</SelectItem>
                      <SelectItem value="daughter">Daughter</SelectItem>
                      <SelectItem value="domestic-partner">Domestic Partner</SelectItem>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="father-in-law">Father-in-law</SelectItem>
                      <SelectItem value="grandfather">Grandfather</SelectItem>
                      <SelectItem value="grandmother">Grandmother</SelectItem>
                      <SelectItem value="granddaughter">Granddaughter</SelectItem>
                      <SelectItem value="grandson">Grandson</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="mother-in-law">Mother-in-law</SelectItem>
                      <SelectItem value="nephew">Nephew</SelectItem>
                      <SelectItem value="niece">Niece</SelectItem>
                      <SelectItem value="other-individual">Other Individual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter email address" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Required for account setup and access
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="access_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Level *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full">Full Access</SelectItem>
                      <SelectItem value="limited">Limited Access</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Full access allows viewing all financial information, limited access restricts sensitive data
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Family Member
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};