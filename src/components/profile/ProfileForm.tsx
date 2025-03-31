
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

const formSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  middleName: z.string().optional(),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  suffix: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
});

export function ProfileForm({ onSave }: { onSave: () => void }) {
  const { userProfile, updateUserProfile } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: userProfile.title || "Mr",
      firstName: userProfile.firstName || "Tim",
      middleName: userProfile.middleName || "",
      lastName: userProfile.lastName || "Brady",
      suffix: userProfile.suffix || "none",
      gender: userProfile.gender || "Male",
      maritalStatus: userProfile.maritalStatus || "Single",
      dateOfBirth: userProfile.dateOfBirth || new Date("1985-05-03"),
    },
  });

  // Update form when user profile changes
  useEffect(() => {
    if (userProfile) {
      form.reset({
        title: userProfile.title || "Mr",
        firstName: userProfile.firstName || "Tim",
        middleName: userProfile.middleName || "",
        lastName: userProfile.lastName || "Brady",
        suffix: userProfile.suffix || "none",
        gender: userProfile.gender || "Male",
        maritalStatus: userProfile.maritalStatus || "Single",
        dateOfBirth: userProfile.dateOfBirth || new Date("1985-05-03"),
      });
    }
  }, [userProfile, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    setIsSubmitting(true);
    
    try {
      // Update global user profile state
      updateUserProfile({
        title: values.title,
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        suffix: values.suffix,
        gender: values.gender,
        maritalStatus: values.maritalStatus,
        dateOfBirth: values.dateOfBirth,
      });
      
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
              initialDate={userProfile.dateOfBirth}
            />
          </div>
          
          <ProfileFormActions isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
}
