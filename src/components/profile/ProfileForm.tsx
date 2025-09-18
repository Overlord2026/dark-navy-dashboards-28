
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProfileFormHeader } from "./ProfileFormHeader";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { DemographicInfoSection } from "./DemographicInfoSection";
import { ProfileDateOfBirthField } from "./ProfileDateOfBirthField";
import { ProfileFormActions } from "./ProfileFormActions";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  middleName: z.string().optional(),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  suffix: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  dateOfBirth: z.date(),
});

export function ProfileForm({ onSave }: { onSave: () => void }) {
  const { userProfile, updateUserProfile } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Helper function to create date safely from any input
  const createSafeDate = (input: string | Date | null): Date => {
    if (!input) {
      return new Date();
    }
    
    if (input instanceof Date) {
      // If it's already a Date, create a new one in local timezone at noon
      return new Date(input.getFullYear(), input.getMonth(), input.getDate(), 12, 0, 0, 0);
    }
    
    if (typeof input === 'string') {
      // Parse the date string and create in local timezone
      const date = new Date(input);
      if (!isNaN(date.getTime())) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
      }
    }
    
    return new Date();
  };
  
  // Get initial date safely
  const getInitialDate = (): Date => {
    if (!userProfile?.dateOfBirth) {
      return new Date();
    }
    return createSafeDate(userProfile.dateOfBirth);
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: userProfile?.title || "",
      firstName: userProfile?.firstName || "",
      middleName: userProfile?.middleName || "",
      lastName: userProfile?.lastName || "",
      suffix: userProfile?.suffix || "",
      gender: userProfile?.gender || "",
      maritalStatus: userProfile?.maritalStatus || "",
      dateOfBirth: getInitialDate(),
    },
  });

  // Update form when user profile changes
  useEffect(() => {
    if (userProfile) {
      form.reset({
        title: userProfile.title || "",
        firstName: userProfile.firstName || "",
        middleName: userProfile.middleName || "",
        lastName: userProfile.lastName || "",
        suffix: userProfile.suffix || "",
        gender: userProfile.gender || "",
        maritalStatus: userProfile.maritalStatus || "",
        dateOfBirth: getInitialDate(),
      });
    }
  }, [userProfile, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Format date safely for database storage using local date parts
      const formatDateForDB = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Create ISO string in a safe way
      const createSafeISOString = (date: Date): string => {
        // Create a date in UTC using the local date parts
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0));
        return utcDate.toISOString();
      };

      // Prepare update data for Supabase
      const updateData = {
        first_name: values.firstName,
        last_name: values.lastName,
        middle_name: values.middleName || null,
        title: values.title || null,
        suffix: values.suffix || null,
        gender: values.gender || null,
        marital_status: values.maritalStatus || null,
        date_of_birth: createSafeISOString(values.dateOfBirth),
        date_of_birth_date: formatDateForDB(values.dateOfBirth),
        updated_at: new Date().toISOString()
      };

      console.log("Updating profile with data:", updateData);

      // Update profile in Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) {
        console.error("Supabase update error:", updateError);
        throw updateError;
      }

      // Update local user profile state
      const profileUpdate = {
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName,
        title: values.title,
        suffix: values.suffix,
        gender: values.gender,
        maritalStatus: values.maritalStatus,
        dateOfBirth: values.dateOfBirth,
      };

      if (updateUserProfile) {
        updateUserProfile(profileUpdate);
      }
      
      // Show success message
      toast.success("Profile information updated successfully", {
        duration: 3000,
        position: "top-center"
      });
      
      // Call the onSave callback to update parent components
      if (onSave) {
        setTimeout(() => {
          onSave();
        }, 300);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <ProfileFormHeader 
        title="Edit Profile Information"
        description="Update your personal details below"
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PersonalInfoSection form={form} />
            <DemographicInfoSection form={form} />
            <ProfileDateOfBirthField 
              form={form} 
              initialDate={getInitialDate()}
            />
          </div>
          
          <ProfileFormActions isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
}
