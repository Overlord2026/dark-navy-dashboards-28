
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFamilyMembers, AddFamilyMemberData } from '@/hooks/useFamilyMembers';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relationship: z.enum(['spouse', 'parent', 'child', 'sibling', 'other']),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  has_app_access: z.boolean().default(false),
  access_level: z.enum(['full', 'limited']).optional(),
}).refine(
  (data) => {
    if (data.has_app_access && !data.email) {
      return false;
    }
    if (data.has_app_access && !data.access_level) {
      return false;
    }
    return true;
  },
  {
    message: "Email and access level are required when granting app access",
    path: ["email"],
  }
);

type FormData = z.infer<typeof formSchema>;

interface AddFamilyMemberDialogProps {
  children: React.ReactNode;
}

export const AddFamilyMemberDialog: React.FC<AddFamilyMemberDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { addFamilyMember } = useFamilyMembers();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      relationship: 'spouse',
      email: '',
      has_app_access: false,
      access_level: undefined,
    },
  });

  const watchHasAppAccess = form.watch('has_app_access');

  const onSubmit = async (data: FormData) => {
    const memberData: AddFamilyMemberData = {
      name: data.name,
      relationship: data.relationship,
      email: data.email || undefined,
      has_app_access: data.has_app_access,
      access_level: data.has_app_access ? data.access_level : undefined,
    };

    const success = await addFamilyMember(memberData);
    if (success) {
      form.reset();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogDescription>
            Add a family member to your account. You can optionally grant them access to the app.
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                  <FormLabel>
                    Email {watchHasAppAccess && '*'}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter email address" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {watchHasAppAccess ? 'Required for app access' : 'Optional'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_app_access"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Allow login access to this family member
                    </FormLabel>
                    <FormDescription>
                      Grant this family member the ability to log in and access the app
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {watchHasAppAccess && (
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
                      Full Access: Can view and edit family data<br />
                      Limited Access: Can only view assigned tasks/events/records
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Family Member
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
