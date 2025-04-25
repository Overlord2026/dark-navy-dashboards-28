
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useProfessionals } from "@/hooks/useProfessionals";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PersonalInfoSection } from "./cpa-signup/PersonalInfoSection";
import { SpecialtiesSection } from "./cpa-signup/SpecialtiesSection";
import { CollaborationSection } from "./cpa-signup/CollaborationSection";
import { NotesSection } from "./cpa-signup/NotesSection";
import { cpaSignupSchema, defaultSpecialties, type CPAFormValues } from "./cpa-signup/FormSchema";

export function CPASignupForm() {
  const { addProfessional } = useProfessionals();
  const { toast } = useToast();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState("");

  const form = useForm<CPAFormValues>({
    resolver: zodResolver(cpaSignupSchema),
    defaultValues: {
      name: "",
      company: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      acceptReferrals: false,
      collaborateWithRIA: false,
      practiceSoftware: "",
      notes: "",
      specialties: [],
    },
  });

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties(prev => {
      if (prev.includes(specialty)) {
        return prev.filter(s => s !== specialty);
      } else {
        return [...prev, specialty];
      }
    });
  };

  const addCustomSpecialty = () => {
    if (newSpecialty && !selectedSpecialties.includes(newSpecialty)) {
      setSelectedSpecialties(prev => [...prev, newSpecialty]);
      setNewSpecialty("");
    }
  };

  const onSubmit = (data: CPAFormValues) => {
    data.specialties = selectedSpecialties;
    
    const newProfessional = {
      id: uuidv4(),
      name: data.name,
      type: "Tax Professional / Accountant" as const,
      company: data.company,
      phone: data.phone,
      email: data.email,
      website: data.website || undefined,
      address: data.address,
      notes: data.notes,
      specialties: data.specialties,
      certifications: ["CPA License"],
    };

    addProfessional(newProfessional);
    
    toast({
      title: "Profile Created",
      description: "Your CPA profile has been successfully created!",
    });
    
    console.log("CPA profile created:", newProfessional);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle>Certified Public Accountant Registration</CardTitle>
          <CardDescription>
            Create your professional profile to connect with clients and other professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PersonalInfoSection form={form} />
              
              <SpecialtiesSection
                selectedSpecialties={selectedSpecialties}
                onSpecialtyToggle={handleSpecialtyToggle}
                newSpecialty={newSpecialty}
                setNewSpecialty={setNewSpecialty}
                addCustomSpecialty={addCustomSpecialty}
                defaultSpecialties={defaultSpecialties}
              />
              
              <CollaborationSection form={form} />
              
              <NotesSection form={form} />

              <Button type="submit" className="w-full">Create Profile</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
