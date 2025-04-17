
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { CollaboratorFormData, Collaborator } from '@/components/sharing/types';

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  collaboratorType: z.string().min(1, "Collaborator type is required"),
  accessLevel: z.enum(["full", "limited"]),
});

export const useCollaboratorForm = (
  onCollaboratorAdded: (collaborator: Collaborator) => void
) => {
  const { toast } = useToast();
  const [addStep, setAddStep] = useState<"info" | "access">("info");
  
  const form = useForm<CollaboratorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      collaboratorType: "",
      accessLevel: "limited",
    },
  });

  const handleAddCollaborator = (data: CollaboratorFormData) => {
    const newCollaborator: Collaborator = {
      id: `collab-${Math.random().toString(36).substring(2, 9)}`,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      role: data.collaboratorType,
      accessLevel: data.accessLevel,
      dateAdded: new Date(),
    };
    
    onCollaboratorAdded(newCollaborator);
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${data.email}`,
    });
    
    form.reset();
    setAddStep("info");
  };

  const onSubmit = (data: CollaboratorFormData) => {
    if (addStep === "info") {
      setAddStep("access");
      return;
    }
    handleAddCollaborator(data);
  };

  return {
    form,
    addStep,
    setAddStep,
    onSubmit,
  };
};

